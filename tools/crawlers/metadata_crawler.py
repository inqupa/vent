import os
import json
import hashlib
import mimetypes
import time
import socket
import getpass
import argparse
import math
import stat
import ctypes
import platform
from pathlib import Path
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor

def get_system_ram():
    """
    Detects total physical RAM in bytes using built-in libraries.
    Works on Windows, Linux, and macOS without external dependencies.
    """
    try:
        if platform.system() == "Windows":
            class MEMORYSTATUSEX(ctypes.Structure):
                _fields_ = [
                    ("dwLength", ctypes.c_ulong),
                    ("dwMemoryLoad", ctypes.c_ulong),
                    ("ullTotalPhys", ctypes.c_ulonglong),
                    ("ullAvailPhys", ctypes.c_ulonglong),
                    ("ullTotalPhysAvail", ctypes.c_ulonglong), # Mapping to match Windows struct
                    ("ullTotalPageFile", ctypes.c_ulonglong),
                    ("ullAvailPageFile", ctypes.c_ulonglong),
                    ("ullTotalVirtual", ctypes.c_ulonglong),
                    ("ullAvailVirtual", ctypes.c_ulonglong),
                    ("sullAvailExtendedPhys", ctypes.c_ulonglong),
                ]
            stat = MEMORYSTATUSEX()
            stat.dwLength = ctypes.sizeof(MEMORYSTATUSEX)
            ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(stat))
            return stat.ullTotalPhys
        else:
            # Linux/Unix/macOS
            return os.sysconf('SC_PAGE_SIZE') * os.sysconf('SC_PHYS_PAGES')
    except:
        # Fallback to 4GB if detection fails
        return 4 * 1024 * 1024 * 1024

def calculate_optimal_params():
    """
    Analyzes hardware to determine the most efficient processing parameters.
    """
    cpu_count = os.cpu_count() or 2
    total_ram = get_system_ram()
    total_ram_gb = total_ram / (1024**3)

    # Heuristic: We want a high worker count for I/O, but limited by RAM 
    # to avoid OOM during large nested tree builds.
    # We allow roughly 1 worker per 512MB of RAM, capped by 4x CPU count.
    mem_limited_workers = max(1, int(total_ram_gb * 2))
    cpu_suggested_workers = cpu_count * 2
    
    optimal_workers = min(cpu_suggested_workers, mem_limited_workers)
    
    # Scale I/O block size: 64KB for low RAM, up to 1MB for high RAM
    optimal_block_size = 65536 if total_ram_gb < 8 else 1048576
    
    # Entropy sampling: 1MB for low RAM, up to 4MB for high RAM
    entropy_sample = 1024 * 1024 if total_ram_gb < 16 else 4 * 1024 * 1024

    return {
        "workers": optimal_workers,
        "block_size": optimal_block_size,
        "entropy_sample": entropy_sample,
        "ram_gb": round(total_ram_gb, 2),
        "cores": cpu_count
    }

def calculate_entropy(filepath, sample_size=1048576):
    """Calculates Shannon Entropy (0-8) to detect encrypted/compressed data."""
    try:
        with open(filepath, 'rb') as f:
            data = f.read(sample_size) 
            if not data:
                return 0
            entropy = 0
            for x in range(256):
                p_x = data.count(x) / len(data)
                if p_x > 0:
                    entropy += - p_x * math.log(p_x, 2)
            return round(entropy, 4)
    except:
        return None

def get_magic_bytes(filepath):
    """Retrieves the first 16 bytes in hex format."""
    try:
        with open(filepath, 'rb') as f:
            return f.read(16).hex(' ')
    except:
        return None

def get_permissions_string(mode):
    """Converts octal mode to human-readable string."""
    return stat.filemode(mode)

def get_file_hash(filepath, block_size=65536):
    """Generates a SHA-256 hash (releases GIL during calculation)."""
    sha256 = hashlib.sha256()
    try:
        with open(filepath, 'rb') as f:
            for block in iter(lambda: f.read(block_size), b''):
                sha256.update(block)
        return sha256.hexdigest()
    except (PermissionError, OSError):
        return "PERMISSION_DENIED"

def auto_find_project_root(start_dir):
    """Identifies project root via markers."""
    markers = {'index.html', 'main.js', 'app.js', 'package.json', 'requirements.txt'}
    start_path = Path(start_dir).resolve()
    for root, dirs, files in os.walk(start_path):
        if any(marker in files for marker in markers):
            return Path(root)
    return start_path

def get_item_metadata(item_path, root_path, fast_mode=False, hw_params=None):
    """Collects metadata for a single item."""
    params = hw_params or {"block_size": 65536, "entropy_sample": 1048576}
    try:
        stats = item_path.lstat()
        is_dir = item_path.is_dir()
        mime_type, _ = mimetypes.guess_type(str(item_path))
        is_metadata_store = "config" + os.sep + "metadata" in str(item_path)

        metadata = {
            "type": "directory" if is_dir else "file",
            "paths": {"rel": str(item_path.relative_to(root_path)), "abs": str(item_path)},
            "system": {
                "size_bytes": stats.st_size,
                "permissions": get_permissions_string(stats.st_mode),
                "uid": stats.st_uid,
                "gid": stats.st_gid,
                "is_symlink": item_path.is_symlink()
            },
            "timestamps": {
                "created": datetime.fromtimestamp(stats.st_ctime).isoformat(),
                "modified": datetime.fromtimestamp(stats.st_mtime).isoformat(),
                "accessed": datetime.fromtimestamp(stats.st_atime).isoformat()
            }
        }
        if is_metadata_store:
            metadata["forensic_note"] = "INTERNAL_METADATA_STORE_FILE: State from previous scan."
        if not is_dir:
            metadata.update({
                "file_details": {
                    "extension": item_path.suffix.lower() or "no_ext",
                    "mime": mime_type or "application/octet-stream",
                    "magic_hex": get_magic_bytes(str(item_path)) if not fast_mode else None
                },
                "forensics": {
                    "sha256": get_file_hash(str(item_path), params["block_size"]) if not fast_mode else None,
                    "entropy": calculate_entropy(str(item_path), params["entropy_sample"]) if not fast_mode else None
                }
            })
        return metadata
    except Exception as e:
        return {"error": str(e)}

def build_nested_tree(current_path, root_path, fast_mode, summary_ref, hw_params):
    """Recursively builds the dictionary structure."""
    tree = {"_directory_meta": get_item_metadata(current_path, root_path, fast_mode, hw_params)}
    try:
        for item in os.listdir(current_path):
            item_path = current_path / item
            if item_path.is_dir():
                tree[item] = build_nested_tree(item_path, root_path, fast_mode, summary_ref, hw_params)
            else:
                tree[item] = get_item_metadata(item_path, root_path, fast_mode, hw_params)
                summary_ref["total_files"] += 1
                summary_ref["total_size_bytes"] += item_path.stat().st_size
                ext = item_path.suffix.lower() or "no_ext"
                summary_ref["extension_stats"][ext] = summary_ref["extension_stats"].get(ext, 0) + 1
    except Exception as e:
        summary_ref["errors"] += 1
        tree["_error"] = str(e)
    return tree

def process_root_item(item_name, project_root, metadata_dir, fast_mode, hw_params):
    """Worker function to process a single top-level item."""
    item_path = project_root / item_name
    branch_summary = {
        "total_files": 0 if item_path.is_dir() else 1,
        "total_size_bytes": 0,
        "errors": 0,
        "extension_stats": {}
    }
    
    item_data = {
        "metadata": {
            "scan_time": datetime.utcnow().isoformat() + "Z",
            "host": socket.gethostname(),
            "root": str(project_root),
            "item_name": item_name,
            "forensic_integrity": "THREADED_SNAPSHOT",
            "hw_optimization": hw_params
        },
        "summary": branch_summary,
        "data": {}
    }

    if item_path.is_dir():
        item_data["data"][item_name] = build_nested_tree(item_path, project_root, fast_mode, branch_summary, hw_params)
    else:
        item_data["data"][item_name] = get_item_metadata(item_path, project_root, fast_mode, hw_params)
        branch_summary["total_size_bytes"] = item_path.stat().st_size

    output_file = metadata_dir / f"{item_name}.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(item_data, f, indent=4)
    
    return item_name

def create_fragmented_index(start_directory, fast_mode=False, manual_workers=None):
    """
    Orchestrates the fragmented indexing with hardware-aware auto-tuning.
    """
    start_time = time.time()
    
    # 1. Hardware Detection and Auto-tuning
    hw = calculate_optimal_params()
    workers = manual_workers or hw["workers"]
    
    project_root = auto_find_project_root(start_directory)
    metadata_dir = project_root / "config" / "metadata"
    metadata_dir.mkdir(parents=True, exist_ok=True)

    print(f"[*] System Profile: {hw['cores']} Cores | {hw['ram_gb']}GB RAM")
    print(f"[*] Auto-Tuning: {workers} workers | {hw['block_size']//1024}KB buffers | {hw['entropy_sample']//(1024*1024)}MB entropy samples")
    print(f"[*] Project Root: {project_root}")

    try:
        root_items = os.listdir(project_root)
    except Exception as e:
        print(f"[-] Critical Error: {e}")
        return

    # Use ThreadPoolExecutor with optimized worker count
    with ThreadPoolExecutor(max_workers=workers) as executor:
        futures = [
            executor.submit(process_root_item, name, project_root, metadata_dir, fast_mode, hw) 
            for name in root_items
        ]
        
        for future in futures:
            item_name = future.result()
            print(f"[+] Completed: {item_name}")

    duration = round(time.time() - start_time, 2)
    print(f"\n[+] Success. Hardware-optimized forensic audit complete in {duration}s.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Hardware-Aware Multithreaded Forensic Indexer")
    # directory is now optional and defaults to the current working directory
    parser.add_argument("directory", nargs="?", default=".", help="Search start directory (defaults to current folder)")
    parser.add_argument("--fast", action="store_true", help="Skip heavy hashing/entropy")
    parser.add_argument("-w", "--workers", type=int, default=None, help="Manual worker count (overrides auto-tune)")

    args = parser.parse_args()
    create_fragmented_index(args.directory, args.fast, args.workers)