# -*- coding: utf-8 -*-
import sys, re

with open("script.js", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("linkedin.com/in/marjo-ballabani", "linkedin.com/in/kartik-chawla-189430203")

with open("script.js", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated linkedin")

