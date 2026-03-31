import os
import json
import base64
import argparse
import sys
import re
import shutil
import time
import secrets
import stat
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

# Required libraries: pip install cryptography python-dotenv
try:
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
    from cryptography.hazmat.primitives import hashes
    from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
    # Optional: load_dotenv from python-dotenv
    try:
        from dotenv import load_dotenv
        load_dotenv() 
    except ImportError:
        pass 
except ImportError:
    print("[-] Error: 'cryptography' library is missing.")
    print("[-] Please run: pip install cryptography python-dotenv")
    exit(1)

# --- Configuration Constants ---
CHUNK_SIZE = 64 * 1024 
MAX_MEMORY_UNSEAL_SIZE = 100 * 1024 * 1024  # 100MB limit for JIT memory unsealing

def get_masked_input(prompt="Enter Vault Password: "):
    """Custom input function that masks characters with '*'."""
    import sys
    if sys.platform == 'win32':
        import msvcrt
    else:
        import tty
        import termios

    print(prompt, end='', flush=True)
    password = ""
    while True:
        if sys.platform == 'win32':
            char = msvcrt.getch().decode('utf-8')
        else:
            fd = sys.stdin.fileno()
            old_settings = termios.tcgetattr(fd)
            try:
                tty.setraw(sys.stdin.fileno())
                char = sys.stdin.read(1)
            finally:
                termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
        if char in ('\n', '\r'):
            print()
            break
        elif char in ('\x08', '\x7f'):
            if len(password) > 0:
                password = password[:-1]
                sys.stdout.write('\b \b')
                sys.stdout.flush()
        elif char == '\x03':
            print("\n[!] Aborted.")
            sys.exit(1)
        else:
            password += char
            sys.stdout.write('*')
            sys.stdout.flush()
    return password

def print_progress_bar(iteration, total, prefix='', suffix='', length=50, fill='█'):
    """Visual progress bar for terminal output."""
    percent = ("{0:.1f}").format(100 * (iteration / float(total)))
    filled_length = int(length * iteration // total)
    bar = fill * filled_length + '-' * (length - filled_length)
    sys.stdout.write(f'\r{prefix} |{bar}| {percent}% {suffix}')
    sys.stdout.flush()
    if iteration == total:
        sys.stdout.write('\n')

def derive_key(password: str, salt: bytes) -> bytes:
    """Standard PBKDF2 key derivation (100k iterations)."""
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    return kdf.derive(password.encode())

def secure_delete(path):
    """
    Forensic-style cleanup: Overwrites file with random data before deletion.
    Captures original permissions but since the goal is deletion, 
    reverting is only done if the overwrite fails.
    """
    original_mode = None
    try:
        if not os.path.exists(path):
            return
        
        # Capture original permissions
        original_mode = os.stat(path).st_mode
        
        # Force write permissions to handle read-only files
        os.chmod(path, stat.S_IWRITE | stat.S_IREAD)
        
        file_size = os.path.getsize(path)
        if file_size > 0:
            with open(path, "ba+", buffering=0) as f:
                f.write(secrets.token_bytes(file_size))
        
        os.remove(path)
    except Exception as e:
        # If deletion fails, try to revert to original permissions
        if original_mode is not None:
            try:
                os.chmod(path, original_mode)
            except:
                pass
        print(f"\n[!] Cleanup Error on {path}: {e}")

def remove_readonly(func, path, excinfo):
    """Error handler for shutil.rmtree to handle read-only files/folders."""
    os.chmod(path, stat.S_IWRITE)
    func(path)

def encrypt_file_stream(input_path, output_path, password):
    """Encrypts a file using AES-GCM streaming, preserving original permissions."""
    original_mode = None
    try:
        input_p = Path(input_path)
        original_mode = os.stat(input_p).st_mode
        
        # If not readable/writable by owner, force it temporarily
        if not (original_mode & stat.S_IREAD):
            os.chmod(input_p, original_mode | stat.S_IREAD)

        salt = os.urandom(16)
        key = derive_key(password, salt)
        aesgcm = AESGCM(key)
        iv = os.urandom(12)
        
        with open(input_p, 'rb') as f_in, open(output_path, 'wb') as f_out:
            f_out.write(salt)
            f_out.write(iv)
            while True:
                chunk = f_in.read(CHUNK_SIZE)
                if not chunk: break
                encrypted_chunk = aesgcm.encrypt(iv, chunk, None)
                f_out.write(len(encrypted_chunk).to_bytes(4, 'big'))
                f_out.write(encrypted_chunk)
        
        # Restore original permissions to the SOURCE file
        os.chmod(input_p, original_mode)
        # Apply the same permissions to the VAULT file
        os.chmod(output_path, original_mode)
        
        return True
    except Exception:
        if original_mode is not None:
            try: os.chmod(input_path, original_mode)
            except: pass
        return False

def decrypt_file_stream(input_path, output_path, password):
    """Decrypts a .vault file using AES-GCM streaming, preserving original permissions."""
    original_mode = None
    try:
        input_p = Path(input_path)
        original_mode = os.stat(input_p).st_mode
        
        salt = None
        with open(input_p, 'rb') as f_in, open(output_path, 'wb') as f_out:
            salt = f_in.read(16)
            iv = f_in.read(12)
            key = derive_key(password, salt)
            aesgcm = AESGCM(key)
            
            while True:
                length_bytes = f_in.read(4)
                if not length_bytes: break
                chunk_len = int.from_bytes(length_bytes, 'big')
                encrypted_chunk = f_in.read(chunk_len)
                decrypted_chunk = aesgcm.decrypt(iv, encrypted_chunk, None)
                f_out.write(decrypted_chunk)
        
        # Apply original vault file's permissions to the decrypted file
        if original_mode:
            os.chmod(output_path, original_mode)
            
        return True
    except Exception:
        return False

def unseal_to_memory(input_path, password):
    """Decrypts directly into RAM with safety check."""
    if not str(input_path).endswith('.vault'):
        print(f"[!] Warning: '{input_path}' is not a .vault file.")
        return None

    file_size = os.path.getsize(input_path)
    if file_size > MAX_MEMORY_UNSEAL_SIZE:
        print(f"[!] Security Guard: File too large for memory.")
        return None

    try:
        buffer = bytearray()
        with open(input_path, 'rb') as f_in:
            salt = f_in.read(16)
            iv = f_in.read(12)
            key = derive_key(password, salt)
            aesgcm = AESGCM(key)
            while True:
                length_bytes = f_in.read(4)
                if not length_bytes: break
                chunk_len = int.from_bytes(length_bytes, 'big')
                encrypted_chunk = f_in.read(chunk_len)
                buffer.extend(aesgcm.decrypt(iv, encrypted_chunk, None))
        return json.loads(buffer.decode('utf-8'))
    except Exception as e:
        print(f"[-] Memory unseal failed: {e}")
        return None

def process_path(source_path, target_path, password, action="seal", cleanup=False):
    """Handles files/folders with optional secure cleanup and redundancy checks."""
    start_time = time.time()
    
    if source_path.is_file():
        if action == "seal" and source_path.suffix == ".vault":
            print(f"[!] Skipped: '{source_path}' is already a .vault file.")
            return
        if action == "unseal" and source_path.suffix != ".vault":
            print(f"[!] Skipped: '{source_path}' is not a .vault file.")
            return

        success = encrypt_file_stream(source_path, target_path, password) if action == "seal" else decrypt_file_stream(source_path, target_path, password)
        if success:
            if action == "seal" and cleanup:
                secure_delete(source_path)
            print(f"[+] Task complete: {target_path}")
        return

    files_to_process = []
    skipped_count = 0
    for root, _, files in os.walk(source_path):
        for name in files:
            file_p = Path(root) / name
            if action == "seal" and file_p.suffix == ".vault":
                skipped_count += 1
                continue
            if action == "unseal" and file_p.suffix != ".vault":
                skipped_count += 1
                continue
            files_to_process.append(file_p)

    total_files = len(files_to_process)
    if total_files == 0:
        if skipped_count > 0:
            print(f"[*] No new files to process ({skipped_count} items skipped).")
        else:
            print(f"[!] No files found to process in '{source_path}'.")
        return

    print(f"[*] Starting {action} on {total_files} items... (Skipped {skipped_count} redundant files)")
    completed_count = 0
    error_count = 0
    print_progress_bar(0, total_files, prefix='Progress:', suffix='Complete', length=40)

    def worker(file_p):
        rel_path = file_p.relative_to(source_path)
        dest_file = target_path / rel_path
        if action == "seal":
            dest_file = dest_file.with_suffix(dest_file.suffix + ".vault")
        else:
            if dest_file.suffix == ".vault": dest_file = dest_file.with_suffix('')
        dest_file.parent.mkdir(parents=True, exist_ok=True)
        
        success = encrypt_file_stream(file_p, dest_file, password) if action == "seal" else decrypt_file_stream(file_p, dest_file, password)
        
        if success and action == "seal" and cleanup:
            secure_delete(file_p)
        return success

    with ThreadPoolExecutor() as executor:
        futures = {executor.submit(worker, f): f for f in files_to_process}
        for future in as_completed(futures):
            completed_count += 1
            if not future.result(): error_count += 1
            print_progress_bar(completed_count, total_files, prefix='Progress:', suffix=f'Files: {completed_count}/{total_files}', length=40)

    if action == "seal" and cleanup and error_count == 0:
        if skipped_count == 0:
            try:
                shutil.rmtree(source_path, onerror=remove_readonly)
            except Exception as e:
                print(f"[!] Final directory cleanup failed: {e}")

    duration = time.time() - start_time
    print(f"\n[+] {action.capitalize()} operation complete in {duration:.2f}s.")
    if error_count > 0: print(f"[!] Warning: {error_count} files failed.")
    print(f"[*] Destination: {target_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="High-Capacity Streaming Folder Vault",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Seal multiple files and folders
  python vault_manager.py seal ./file1.txt ./my_folder -o ./output_vault
  
  # Force manual password entry
  python vault_manager.py seal ./my_folder --manual
  
  # Unseal and cleanup original vault files
  python vault_manager.py unseal ./my_vault/item1.vault --cleanup
        """
    )
    
    parser.add_argument("action", choices=["seal", "unseal"], help="Action to perform")
    parser.add_argument("paths", nargs="+", help="One or more source file or directory paths")
    parser.add_argument("-o", "--output", help="Destination path for output")
    parser.add_argument("--mode", choices=["file", "memory"], default="file", help="Unseal mode")
    parser.add_argument("--cleanup", action="store_true", help="Securely delete source files after successful operation")
    parser.add_argument("--manual", action="store_true", help="Force manual password input")
    
    args = parser.parse_args()
    
    if args.manual:
        pwd = get_masked_input("Manual Mode - Enter Vault Password: ")
    else:
        pwd = os.environ.get('VAULT_KEY')
        if pwd:
            print("[*] Security: Using password from environment (Automated Mode).")
        else:
            pwd = get_masked_input()
    
    for p in args.paths:
        source = Path(p)
        if not source.exists():
            print(f"[-] Error: Path '{p}' does not exist. Skipping.")
            continue

        if args.output:
            output_root = Path(args.output)
            if len(args.paths) > 1:
                output = output_root / source.name
                if args.action == "seal" and not source.is_dir():
                    output = output.with_suffix(output.suffix + ".vault")
            else:
                output = output_root
        else:
            if args.action == "seal":
                output = source.parent / (source.name + ".vault" if source.is_file() else source.name + "_vault")
            else:
                name = source.name.replace(".vault", "")
                output = source.parent / (name if source.is_file() else source.name + "_unsealed")

        try:
            if args.action == "unseal" and args.mode == "memory":
                if source.is_dir():
                    print(f"[-] Error: Memory mode is for single files only. skipping '{source.name}'.")
                else:
                    data = unseal_to_memory(source, pwd)
                    if data: print(f"[+] Memory Unseal Successful for '{source.name}'.")
            else:
                process_path(source, output, pwd, args.action, args.cleanup)
        except Exception as e:
            print(f"[-] Critical failure processing '{p}': {e}")

    if 'VAULT_KEY' in os.environ: 
        del os.environ['VAULT_KEY']