import sys

emojis_to_remove = ['💼', '🛠', '👋', '⚡', '✨', '🏛', '\ufe0f']
files_to_edit = ['script.js', 'index.html']

for filename in files_to_edit:
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original_content = content
        for emoji in emojis_to_remove:
            # Also try to remove any space that immediately follows the emoji, to avoid double spaces
            content = content.replace(emoji + ' ', '')
            content = content.replace(emoji, '')
            
        if content != original_content:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Removed emojis from {filename}")
    except Exception as e:
        print(f"Error processing {filename}: {e}")

print("Emoji removal complete.")
