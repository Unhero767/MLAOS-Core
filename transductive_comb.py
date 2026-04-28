import json
import hashlib

def permineralize_payload(raw_payload: dict) -> str:
    # sort_keys=True acts as a physical force, stripping temporal entropy
    canonical_string = json.dumps(raw_payload, sort_keys=True, separators=(',', ':'))
    return hashlib.sha256(canonical_string.encode('utf-8')).hexdigest() # The Obsidian Cipher

# --- Initialization Test ---
if __name__ == "__main__":
    unverified_manifold_payload = {
        "timestamp": "T-45",
        "id": "X99",
        "value": 0.1235
    }
    
    j_hash = permineralize_payload(unverified_manifold_payload)
    print(f"[◦A] Payload Permineralized. Obsidian Cipher: {j_hash}")
