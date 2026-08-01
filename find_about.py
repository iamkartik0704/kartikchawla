import re

with open("script.js", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'case "about":' in line or "about" in line:
        print(f"Line {i}: {line.strip()}")
