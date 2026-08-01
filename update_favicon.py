import sys

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

target = '<link rel="icon" type="image/svg+xml" href="favicon.svg">'
replacement = '<link rel="icon" type="image/png" href="image/kartik-avatar-v2.png">'

content = content.replace(target, replacement)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Favicon updated in index.html.")
