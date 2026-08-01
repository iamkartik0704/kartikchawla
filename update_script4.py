# -*- coding: utf-8 -*-
import sys, re

with open("script.js", "r", encoding="utf-8") as f:
    content = f.read()

# Replace loadProjects
projects_repl = r"""loadProjects() {
    this.projects = [
      {
        title: "ToadCode",
        description: "Dynamically-typed scripting language with hand-written lexer/parser/interpreter. TypeScript.",
        image: "image/project1.png",
        technologies: ["TypeScript"],
        demo: "#",
        repo: "https://github.com/iamkartik0704"
      },
      {
        title: "Compile",
        description: "AI-native desktop IDE with multi-LLM support and real-time environment compilation. Electron, React.",
        image: "image/project2.png",
        technologies: ["Electron", "React", "AI"],
        demo: "#",
        repo: "https://github.com/iamkartik0704"
      },
      {
        title: "RankMatrix",
        description: "Data-driven MERN application providing predictive college insights for JEE aspirants.",
        image: "image/project3.png",
        technologies: ["MongoDB", "Express", "React", "Node.js"],
        demo: "#",
        repo: "https://github.com/iamkartik0704"
      },
      {
        title: "ZappFoods",
        description: "Comprehensive backend for a food delivery platform. MERN stack.",
        image: "image/project4.png",
        technologies: ["MongoDB", "Express", "React", "Node.js"],
        demo: "#",
        repo: "https://github.com/iamkartik0704"
      }
    ];
  }"""
content = re.sub(r"loadProjects\(\) \{.*?\n  \}", projects_repl, content, flags=re.DOTALL)

# Replace loadSkills
skills_repl = r"""loadSkills() {
    this.skills = {
      languages: {
        "Go (Golang)": 90,
        "C/C++": 85,
        "Python": 80,
        "JavaScript": 85,
        "TypeScript": 80
      },
      backend: {
        "Node.js": 85,
        "Express": 85,
        "MongoDB": 90,
        "PostgreSQL": 80,
        "Supabase": 85
      },
      tools: {
        "Docker": 80,
        "Git/GitHub Actions": 85,
        "Linux/Windows": 90,
        "Electron/Raylib": 75
      }
    };
  }"""
content = re.sub(r"loadSkills\(\) \{.*?\n  \}", skills_repl, content, flags=re.DOTALL)

# Replace generatePDF
pdf_repl = r"""generatePDF() {
    const outputElement = this.terminals[this.activeTerminal].input
      .closest(".terminal-content")
      .querySelector("[id^='output']");
    this.printToOutput(outputElement, "Preparing PDF resume...", "info");
    setTimeout(() => {
      this.printToOutput(
        outputElement,
        "PDF generation is currently disabled. Please contact me on LinkedIn for my resume!",
        "error"
      );
    }, 1000);
  }"""
content = re.sub(r"generatePDF\(\) \{.*?\n  \}", pdf_repl, content, flags=re.DOTALL)

# Replace LinkedIn Cover Role Text
content = content.replace("Software Engineer • Cloud Architect", "Backend Developer • B.Tech Student")

with open("script.js", "w", encoding="utf-8") as f:
    f.write(content)

print("Updates successful")

