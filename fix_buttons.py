import sys

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix selectors in script.js
content = content.replace('document.querySelector(".terminal-button.close")', 'document.querySelector(".terminal-buttons .close")')
content = content.replace('document.querySelector(".terminal-button.minimize")', 'document.querySelector(".terminal-buttons .minimize")')
content = content.replace('document.querySelector(".terminal-button.maximize")', 'document.querySelector(".terminal-buttons .maximize")')

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)

with open('styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Add cursor: pointer to terminal buttons if not present
if '.terminal-buttons span {' not in css and 'cursor: pointer;' not in css.split('.terminal-buttons span')[1 if '.terminal-buttons span' in css else 0][:100]:
    if '.terminal-buttons span {' in css:
        css = css.replace('.terminal-buttons span {\n', '.terminal-buttons span {\n    cursor: pointer;\n')
    else:
        # Check how they are defined in CSS.
        pass

with open('styles.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Selectors updated.")
