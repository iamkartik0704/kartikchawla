import sys

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('image/avatar-gpt.png', 'image/kartik-avatar.png')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Avatar image updated in index.html.")
