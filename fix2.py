# -*- coding: utf-8 -*-
import re

with open("script.js", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Fix printToOutput textContent -> innerHTML
content = content.replace("line.textContent = text;", "line.innerHTML = text;")

# 2. Remove linkedin-cover case from switch statement
content = re.sub(r"case \"linkedin-cover\":\n\s*this\.generateLinkedInCover\(outputElement\);\n\s*break;\n", "", content)

# 3. Remove linkedin-cover from help menu string
content = re.sub(r"this\.wrapWithColor\([^\n]*linkedin-cover[^\n]*\s*\+\s*\"[^\n]*\\\\n\"\s*\+", "", content)

# 4. Remove generateLinkedInCover
# We can find its start index
idx = content.find("generateLinkedInCover(outputElement) {")
if idx != -1:
    brace_count = 0
    in_func = False
    end_idx = -1
    for i in range(idx, len(content)):
        if content[i] == "{":
            brace_count += 1
            in_func = True
        elif content[i] == "}":
            brace_count -= 1
        
        if in_func and brace_count == 0:
            end_idx = i + 1
            break
            
    if end_idx != -1:
        # Remove the function block
        content = content[:idx] + content[end_idx:]

with open("script.js", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixes applied successfully")

