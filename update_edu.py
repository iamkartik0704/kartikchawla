import sys

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace emojis
content = content.replace("🎓 Education", "Education")
content = content.replace("🎓 ", "") # just in case
content = content.replace("🏛 Institution:", "Institution:")
content = content.replace("🏛 ", "")
content = content.replace("📅 Duration:", "Duration:")
content = content.replace("📅 ", "")
content = content.replace("📍 Location:", "Location:")
content = content.replace("📍 ", "")

# Replace dates
content = content.replace("2021 - 2025", "2025 - 2029")

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Education updated successfully.")
