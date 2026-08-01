# -*- coding: utf-8 -*-
import sys, re

with open("script.js", "r", encoding="utf-8") as f:
    content = f.read()

# Replace loadProjects with correct repos
projects_repl = r"""loadProjects() {
    this.projects = [
      {
        title: "ToadCode",
        description: "Dynamically-typed scripting language with hand-written lexer/parser/interpreter. TypeScript.",
        image: "image/project1.png",
        technologies: ["TypeScript"],
        demo: "#",
        repo: "https://github.com/iamkartik0704/customlang"
      },
      {
        title: "Compile",
        description: "AI-native desktop IDE with multi-LLM support and real-time environment compilation. Electron, React.",
        image: "image/project2.png",
        technologies: ["Electron", "React", "AI"],
        demo: "#",
        repo: "https://github.com/iamkartik0704/compile"
      },
      {
        title: "RankMatrix",
        description: "Data-driven MERN application providing predictive college insights for JEE aspirants.",
        image: "image/project3.png",
        technologies: ["MongoDB", "Express", "React", "Node.js"],
        demo: "#",
        repo: "https://github.com/iamkartik0704/rankmatrix"
      },
      {
        title: "ZappFoods",
        description: "Comprehensive backend for a food delivery platform. MERN stack.",
        image: "image/project4.png",
        technologies: ["MongoDB", "Express", "React", "Node.js"],
        demo: "#",
        repo: "https://github.com/iamkartik0704/Zappfood"
      }
    ];
  }"""
content = re.sub(r"loadProjects\(\) \{.*?\n  \}", projects_repl, content, flags=re.DOTALL)

with open("script.js", "w", encoding="utf-8") as f:
    f.write(content)

print("Updates successful")

