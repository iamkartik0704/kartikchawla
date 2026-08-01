import sys

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the spaceship emoji
content = content.replace('🚀 Available Commands', 'Available Commands')
content = content.replace('🚀', '')

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Spaceship emoji removed.")
