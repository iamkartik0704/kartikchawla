import sys

with open('terminal.html', 'r', encoding='utf-8') as f:
    content = f.read()

head_idx = content.find('</head>')
if head_idx != -1:
    new_content = content[:head_idx] + '    <link rel="icon" type="image/png" href="image/kartik-avatar-v2.png">\n' + content[head_idx:]
    with open('terminal.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Added favicon to terminal.html")
