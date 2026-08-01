import sys

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('image/kartik-avatar-v2.png', 'image/kartik-avatar-v3.png')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Avatar image updated to v3 in index.html.")
