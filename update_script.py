# -*- coding: utf-8 -*-
import re

with open("script.js", "r", encoding="utf-8") as f:
    content = f.read()

# Replacements
content = content.replace("Marjo Ballabani", "Kartik Chawla")
content = content.replace("Marjo", "Kartik")
content = content.replace("marjo@ballabani", "kartik@chawla")
content = content.replace("marjoballabani", "iamkartik0704")

content = content.replace("Senior software engineer with more than 10 years of", "Backend Developer and B.Tech Student at")
content = content.replace("programming experience.", "IIT Patna, passionate about AI and systems.")
content = content.replace("Software Engineer • Cloud Architect • Tech Lead", "Backend Developer • B.Tech Student • Open Source")

with open("script.js", "w", encoding="utf-8") as f:
    f.write(content)

print("Done")

