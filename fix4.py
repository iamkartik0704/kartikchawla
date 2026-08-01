# -*- coding: utf-8 -*-
import re

with open("script.js", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Remove weather from available commands array (e.g. "weather",)
content = re.sub(r"\"weather\",\s*\n", "", content)

# 2. Remove weather from help string using regex
content = re.sub(r"\s*this\.wrapWithColor\(\"• weather\"[^\n]*\n\s*\"[^\n]*\n[^\n]*Check weather[^\n]*\n", "\n", content)

# 3. Find and remove showWeather function
idx = content.find("showWeather")
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
        content = content[:idx] + content[end_idx:]

with open("script.js", "w", encoding="utf-8") as f:
    f.write(content)

print("Weather fully removed")

