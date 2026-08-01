# -*- coding: utf-8 -*-
import sys, re

with open("script.js", "r", encoding="utf-8") as f:
    content = f.read()

projects_repl = r"""loadProjects() {
    this.projects = [
      {
        title: "ToadCode",
        description: "Dynamically-typed scripting language with hand-written lexer/parser/interpreter. TypeScript.",
        image: "terminal_images/toadcode.jpg",
        technologies: ["TypeScript"],
        demo: "#",
        repo: "https://github.com/iamkartik0704/customlang"
      },
      {
        title: "Compile",
        description: "AI-native desktop IDE with multi-LLM support and real-time environment compilation. Electron, React.",
        image: "terminal_images/compile.jpg",
        technologies: ["Electron", "React", "AI"],
        demo: "#",
        repo: "https://github.com/iamkartik0704/compile"
      },
      {
        title: "RankMatrix",
        description: "Data-driven MERN application providing predictive college insights for JEE aspirants.",
        image: "terminal_images/rankmatrix.jpg",
        technologies: ["MongoDB", "Express", "React", "Node.js"],
        demo: "#",
        repo: "https://github.com/iamkartik0704/rankmatrix"
      },
      {
        title: "ZappFoods",
        description: "Comprehensive backend for a food delivery platform. MERN stack.",
        image: "terminal_images/zappfood.png",
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

