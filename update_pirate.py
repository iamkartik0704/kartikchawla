import sys

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('image/pirat.png', 'image/pirate-kartik-transparent.png')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Pirate image updated in index.html.")
