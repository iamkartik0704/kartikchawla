import sys

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace dates
content = content.replace("May 2024 - Present | Remote", "May 2026 - Present | Remote")
content = content.replace("2023 - 2024 | IIT Patna", "Apr 2026 - Present | IIT Patna")

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Dates updated successfully.")
