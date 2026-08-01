import sys
import time

with open('terminal.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add cache buster
ts = str(int(time.time()))
content = content.replace('<script src="script.js"></script>', f'<script src="script.js?v={ts}"></script>')

with open('terminal.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Cache buster added to terminal.html.")
