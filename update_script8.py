# -*- coding: utf-8 -*-
import sys, re

with open("script.js", "r", encoding="utf-8") as f:
    content = f.read()

skills_repl = r"""loadSkills() {
    this.skills = {
      languages: {
        "Go (Golang)": 90,
        "C/C++": 85,
        "JavaScript": 85,
        "TypeScript": 80
      },
      backend: {
        "Node.js": 85,
        "Express": 85,
        "MongoDB": 90,
        "SQL": 80,
        "Supabase": 85
      },
      tools: {
        "Docker": 80,
        "Git/GitHub Actions": 85,
        "Electron/Raylib": 75,
        "JWT/OAuth": 80
      }
    };
  }"""
content = re.sub(r"loadSkills\(\) \{.*?\n  \}", skills_repl, content, flags=re.DOTALL)

with open("script.js", "w", encoding="utf-8") as f:
    f.write(content)

print("Updates successful")

