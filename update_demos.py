import re

with open("script.js", "r", encoding="utf-8") as f:
    content = f.read()

# Replace demo link for ToadCode
content = re.sub(
    r'(title:\s*"ToadCode",.*?demo:\s*)"#"',
    r'\1"https://marketplace.visualstudio.com/items?itemName=KARTIKCHAWLA.toadcode-pro"',
    content,
    flags=re.DOTALL
)

# Replace demo link for Compile
content = re.sub(
    r'(title:\s*"Compile",.*?demo:\s*)"#"',
    r'\1"https://www.kartikchawla.in/"',
    content,
    flags=re.DOTALL
)

# Replace demo link for RankMatrix
content = re.sub(
    r'(title:\s*"RankMatrix",.*?demo:\s*)"#"',
    r'\1"https://rankmatrix.onrender.com/"',
    content,
    flags=re.DOTALL
)

# Replace demo link for ZappFoods
content = re.sub(
    r'(title:\s*"ZappFoods",.*?demo:\s*)"#"',
    r'\1"https://zappfood.vercel.app/"',
    content,
    flags=re.DOTALL
)

with open("script.js", "w", encoding="utf-8") as f:
    f.write(content)

print("Demo links updated successfully")
