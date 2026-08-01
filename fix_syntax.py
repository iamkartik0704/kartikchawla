import sys

with open('script.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if line.strip() == '// Theme selection' and skip == False:
        # Check if we are past loadState
        # loadState ends around line 98
        if any("loadState()" in l for l in new_lines):
            skip = True
    
    if skip and 'setupContextMenu() {' in line:
        skip = False
        
    if not skip:
        new_lines.append(line)

with open('script.js', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Syntax error fixed.")
