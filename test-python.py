#!/usr/bin/env python3
"""
Simple Python test script to verify installation
"""

import sys
import json

def test_python():
    """Test if Python is working"""
    result = {
        "python_version": sys.version,
        "python_executable": sys.executable,
        "platform": sys.platform,
        "status": "Python is working!"
    }
    
    print(json.dumps(result, indent=2))
    return True

if __name__ == "__main__":
    try:
        test_python()
    except Exception as e:
        print(json.dumps({"error": str(e)}, indent=2))
        sys.exit(1) 