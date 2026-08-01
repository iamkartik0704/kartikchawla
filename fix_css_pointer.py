import sys

with open('styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Add cursor: pointer to terminal-buttons span
if 'cursor: pointer;' not in css[css.find('.terminal-buttons span'):css.find('}', css.find('.terminal-buttons span'))]:
    css = css.replace('.terminal-buttons span {\n', '.terminal-buttons span {\n  cursor: pointer;\n')

with open('styles.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("CSS updated for pointers.")
