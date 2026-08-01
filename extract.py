
with open("index.html", "r", encoding="utf-8") as f:
    lines = f.readlines()
for i, line in enumerate(lines):
    if "creator-project" in line:
        print("".join(lines[i:i+15]))
        break

