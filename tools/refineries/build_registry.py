import os
import json
from pathlib import Path
import sys
from datetime import datetime

def get_env_path(key):
    root_path = Path(__file__).resolve().parent.parent.parent
    env_path = root_path / '.env'
    if not env_path.exists():
        raise FileNotFoundError(".env file missing!")
    
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and line.startswith(key) and '=' in line:
                return line.split('=', 1)[1].strip()
    return None

def verify_and_map(node, root_path):
    """Recursively traverses the schema and verifies file paths."""
    if isinstance(node, str):
        full_path = root_path / node
        if full_path.exists():
            return node
        else:
            print(f"  [!] MISSING: {node}")
            return None
    
    elif isinstance(node, dict):
        refined_node = {}
        for key, value in node.items():
            result = verify_and_map(value, root_path)
            if result is not None:
                refined_node[key] = result
        return refined_node if refined_node else None
    
    return None

def run_factory(schema_key, output_key):
    try:
        # 1. Fetch Ghost Paths
        schema_rel = get_env_path(schema_key)
        output_rel = get_env_path(output_key)

        if not schema_rel or not output_rel:
            print(f"❌ Error: {schema_key} or {output_key} not found in .env")
            return

        root = Path(__file__).resolve().parent.parent.parent
        schema_path = root / str(schema_rel)
        output_path = root / str(output_rel)

        # 2. Load the Blueprint
        with open(schema_path, 'r') as f:
            blueprint = json.load(f)
        
        # 3. Recursive Validation
        print(f"--- Registry Factory: {schema_key} ---")
        certified_services = verify_and_map(blueprint.get("map", {}), root)

        # 4. Generate Real-time Metadata
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # 5. Construct the Final Output with Comment and Metadata
        registry_output = {
            "comment": "AUTO-GENERATED REGISTRY: DO NOT EDIT MANUALLY. USE THE PYTHON REFINERY.  The 'Active Roster' or the 'Certified List'. This is the Final Authority. The Bootloader only trusts the Registry. If a file is on the 'Path' but hasn't been 'Registered' by the PYTHON REFINERY, the Bootloader will ignore it.",
            "metadata": {
                "source_schema": schema_key,
                "generated_at": now,
                "integrity": "verified",
            },
            "registry": certified_services
        }

        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'w') as f:
            json.dump(registry_output, f, indent=2)
        
        print(f"✅ Success: Registry written to {output_rel} at {now}")

    except Exception as e:
        print(f"❌ Factory Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) == 3:
        run_factory(sys.argv[1], sys.argv[2])
    else:
        print("\n--- Registry Factory ---")
        print("Usage: python build_registry.py <ENTITY_SCHEMA_ENV_KEY> <ENTITY_REGISTRY_ENV_KEY>")