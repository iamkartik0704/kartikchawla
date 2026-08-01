import sys

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('<span class="skill-level">${level}%</span>', '')

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Data removed from skills visualization successfully.")
