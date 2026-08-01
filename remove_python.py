import sys

with open('script.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('script.js', 'w', encoding='utf-8') as f:
    for line in lines:
        if 'this.wrapWithColor("Python", "#ffffff")' in line:
            continue
        f.write(line)

print('Removed Python from skills.')
