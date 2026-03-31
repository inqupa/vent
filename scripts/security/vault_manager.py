import os
import json
import base64
import argparse
import sys
import re
from pathlib import Path

# Required library: pip install cryptography
try:
    from cryptography.fernet import Fernet
    from cryptography.hazmat.primitives import hashes
    from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
except ImportError:
    print("[-] Error: 'cryptography' library is missing.")
    print("[-] Please run: pip install cryptography")
    exit(1)

def get_masked_input(prompt="Enter Vault Password: "):
    """
    Custom input function that masks characters with '*' as you type.
    Allows the user to track length without revealing keys.
    """
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

        if char in ('\n', '\r'):  # Enter key
            print()
            break
        elif char in ('\x08', '\x7f'):  # Backspace
            if len(password) > 0:
                password = password[:-1]
                sys.stdout.write('\b \b')
                sys.stdout.flush()
        elif char == '\x03':  # Ctrl+C
            print("\n[!] Aborted by user.")
            sys.exit(1)
        else:
            password += char
            sys.stdout.write('*')
            sys.stdout.flush()
            
    return password

def check_password_strength(password: str) -> bool:
    """
    Checks if a password meets 'pro-grade' security standards.
    """
    if len(password) < 12:
        print("[-] Security Warning: Password must be at least 12 characters long.")
        return False
    if not re.search(r"[a-z]", password) or not re.search(r"[A-Z]", password):
        print("[-] Security Warning: Password must contain both uppercase and lowercase letters.")
        return False
    if not re.search(r"\d", password):
        print("[-] Security Warning: Password must contain at least one digit.")
        return False
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        print("[-] Security Warning: Password must contain at least one special character.")
        return False
    return True

def derive_key(password: str, salt: bytes) -> bytes:
    """Standard PBKDF2 key derivation."""
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    return base64.urlsafe_b64encode(kdf.derive(password.encode()))

def seal_file(input_path, output_path, password):
    """Encrypts a plain JSON file into a secure binary blob."""
    try:
        with open(input_path, 'rb') as f:
            data = f.read()
        
        salt = os.urandom(16)
        key = derive_key(password, salt)
        fernet = Fernet(key)
        
        encrypted_data = fernet.encrypt(data)
        
        with open(output_path, 'wb') as f:
            f.write(salt + encrypted_data)
            
        print(f"[+] Success: {input_path} is now SEALED at {output_path}")
    except Exception as e:
        print(f"[-] Error during sealing: {e}")

def unseal_file(input_path, output_path, password):
    """Decrypts a secure binary blob back into readable JSON."""
    try:
        with open(input_path, 'rb') as f:
            file_content = f.read()
            
        salt = file_content[:16]
        encrypted_payload = file_content[16:]
        
        key = derive_key(password, salt)
        fernet = Fernet(key)
        
        decrypted_data = fernet.decrypt(encrypted_payload)
        
        with open(output_path, 'wb') as f:
            f.write(decrypted_data)
            
        print(f"[+] Success: {input_path} is now UNSEALED at {output_path}")
    except Exception as e:
        print(f"[-] Error: Unsealing failed. Incorrect password or corrupted file.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Developer Vault Manager - Secure your JSON indexes.")
    parser.add_argument("action", choices=["seal", "unseal"], help="Action to perform")
    parser.add_argument("file", help="The file to process")
    parser.add_argument("-o", "--output", help="Output file path (optional)")
    parser.add_argument("--force", action="store_true", help="Skip password strength check")
    
    args = parser.parse_args()
    
    # Use the custom masked input instead of getpass
    pwd = get_masked_input("Enter Vault Password: ")
    
    if args.action == "seal" and not args.force:
        if not check_password_strength(pwd):
            print("[-] Aborting: Use a stronger password or use --force.")
            exit(1)
    
    input_file = args.file
    
    if args.action == "seal":
        out_file = args.output or (input_file + ".vault")
        seal_file(input_file, out_file, pwd)
        
    elif args.action == "unseal":
        if not args.output:
            out_file = input_file[:-6] if input_file.endswith(".vault") else "decrypted_" + input_file
        else:
            out_file = args.output
            
        unseal_file(input_file, out_file, pwd)