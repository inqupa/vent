import os
import json
import time
import socket
import getpass
import argparse
import ctypes
import platform
from pathlib import Path
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor

def get_system_ram():
    """Detects total physical RAM in bytes."""
    try:
        if platform.system() == "Windows":
            class MEMORYSTATUSEX(ctypes.Structure):
                _fields_ = [
                    ("dwLength", ctypes.c_ulong),
                    ("dwMemoryLoad", ctypes.c_ulong),
                    ("ullTotalPhys", ctypes.c_ulonglong),
                    ("ullAvailPhys", ctypes.c_ulonglong),
                    ("ullTotalPhysAvail", ctypes.c_ulonglong),
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
            return os.sysconf('SC_PAGE_SIZE') * os.sysconf('SC_PHYS_PAGES')
    except:
        return 4 * 1024 * 1024 * 1024

def calculate_optimal_params():
    """Determines optimal worker count based on hardware."""
    cpu_count = os.cpu_count() or 2
    total_ram_gb = get_system_ram() / (1024**3)
    mem_limited_workers = max(1, int(total_ram_gb * 2))
    cpu_suggested_workers = cpu_count * 2
    return min(cpu_suggested_workers, mem_limited_workers)

def auto_find_project_root(start_dir):
    """Identifies project root via markers if they exist, otherwise returns the start_dir."""
    markers = {'index.html', 'main.js', 'app.js', 'package.json', 'requirements.txt'}
    start_path = Path(start_dir).resolve()
    
    # Check if the current directory is already a project root
    if any((start_path / marker).exists() for marker in markers):
        return start_path
        
    # Search subdirectories for markers
    for root, dirs, files in os.walk(start_path):
        if any(marker in files for marker in markers):
            return Path(root)
            
    return start_path

def get_path_metadata(item_path, root_path, mode="both"):
    """Collects path data based on the requested mode."""
    data = {"type": "directory" if item_path.is_dir() else "file"}
    try:
        if mode in ("rel", "both"):
            data["rel"] = str(item_path.relative_to(root_path))
        if mode in ("abs", "both"):
            data["abs"] = str(item_path)
        return data
    except Exception as e:
        return {"error": str(e)}

def build_nested_path_tree(current_path, root_path, summary_ref, mode, protected_path, include_hidden):
    """Recursively builds the dictionary structure containing path data."""
    tree = {"_directory_path": get_path_metadata(current_path, root_path, mode)}
    
    try:
        for item in os.listdir(current_path):
            if not include_hidden and item.startswith('.'):
                continue

            item_path = current_path / item
            
            # Prevent infinite indexing of the output folder if it's inside the search path
            if protected_path and item_path.resolve() == protected_path.resolve():
                continue
                
            if item_path.is_dir():
                tree[item] = build_nested_path_tree(item_path, root_path, summary_ref, mode, protected_path, include_hidden)
            else:
                tree[item] = get_path_metadata(item_path, root_path, mode)
                summary_ref["total_items"] += 1
    except Exception as e:
        summary_ref["errors"] += 1
        tree["_error"] = str(e)
    return tree

def process_root_path_item(item_name, project_root, paths_dir, mode, include_hidden):
    """Worker function to process a single top-level item's path tree."""
    item_path = project_root / item_name
    # Recursive functions still require a summary ref for counting, though it won't be in the final output.
    internal_summary = {"total_items": 0, "errors": 0}

    if item_path.is_dir():
        item_data = build_nested_path_tree(item_path, project_root, internal_summary, mode, paths_dir, include_hidden)
    else:
        item_data = get_path_metadata(item_path, project_root, mode)

    # Output directly contains only the path structure
    final_output = {item_name: item_data}

    output_file = paths_dir / f"{item_name}.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(final_output, f, indent=4)
    
    return item_name

def create_path_index(input_directory, output_directory, mode="both", manual_workers=None, include_hidden=False):
    """Orchestrates fragmented path indexing into the specified output directory."""
    start_time = time.time()
    
    workers = manual_workers or calculate_optimal_params()
    project_root = auto_find_project_root(input_directory)
    
    # If output_directory is relative, resolve it against the current CWD
    paths_dir = Path(output_directory).resolve()
    paths_dir.mkdir(parents=True, exist_ok=True)

    print(f"[*] Starting Path Crawler")
    print(f"[*] Input Root:    {project_root}")
    print(f"[*] Output Dir:    {paths_dir}")
    print(f"[*] Path Mode:     {mode}")
    print(f"[*] Include Hidden: {include_hidden}")
    print(f"[*] Parallelism:   {workers} workers")

    try:
        # Initial scan of root items, respecting the hidden flag
        root_items = [
            item for item in os.listdir(project_root) 
            if (project_root / item).resolve() != paths_dir.resolve()
            and (include_hidden or not item.startswith('.'))
        ]
    except Exception as e:
        print(f"[-] Critical Error: {e}")
        return

    with ThreadPoolExecutor(max_workers=workers) as executor:
        futures = [
            executor.submit(process_root_path_item, name, project_root, paths_dir, mode, include_hidden) 
            for name in root_items
        ]
        
        for future in futures:
            item_name = future.result()
            print(f"[+] Path Index Ready: {item_name}")

    duration = round(time.time() - start_time, 2)
    print(f"\n[+] Success. Path indexing complete in {duration}s.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Parallel Path-Only Crawler")
    parser.add_argument("input", nargs="?", default=".", help="Root directory to start the crawl (defaults to current folder)")
    parser.add_argument("-o", "--output", default="config/paths", help="Directory where JSON results will be stored")
    parser.add_argument("-m", "--mode", choices=["rel", "abs", "both"], default="both", 
                        help="Choose to output relative paths, absolute paths, or both")
    parser.add_argument("-w", "--workers", type=int, default=None, help="Manual worker override for threading")
    parser.add_argument("--hidden", action="store_true", help="Include hidden files and folders (those starting with '.')")

    args = parser.parse_args()
    create_path_index(args.input, args.output, args.mode, args.workers, args.hidden)