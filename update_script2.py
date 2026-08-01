# -*- coding: utf-8 -*-
import sys, re

with open("script.js", "r", encoding="utf-8") as f:
    content = f.read()

# Replace showExperience content
experience_repl = r"""showExperience(outputElement = this.output) {
    const experience = `<span style="color: #ffff00; font-weight: bold;">💼 Professional Experience</span>

<span style="color: #00ffff;">GirlScript Summer Of Code | Contributor</span>
${this.wrapWithColor(
  "May 2024 - Present | Remote",
  "#ffffff"
)}
${this.wrapWithColor(
  "Open Source Contributions",
  "#98fb98"
)}

• ${this.wrapWithColor("Full-Stack Contributor", "#ffa07a")} - ${this.wrapWithColor(
      "Contributed to multiple projects using modern web technologies.",
      "#ffffff"
    )}

<span style="color: #00ffff;">NJACK / Anwesha | Sub-Coordinator / Web Developer</span>
${this.wrapWithColor(
  "2023 - 2024 | IIT Patna",
  "#ffffff"
)}
${this.wrapWithColor(
  "Tech & Web Development",
  "#98fb98"
)}

• ${this.wrapWithColor("Web Developer", "#ffa07a")} - ${this.wrapWithColor(
      "Developed web portals and managed tech operations for the college fest.",
      "#ffffff"
    )}`;

    this.printToOutput(outputElement, experience);
  }"""

content = re.sub(r"showExperience\(outputElement = this\.output\) \{.*?(?=  showEducation)", experience_repl + "\n\n", content, flags=re.DOTALL)

# Replace showEducation
education_repl = r"""showEducation(outputElement = this.output) {
    const education = `<span style="color: #ff8c00; font-weight: bold;">🎓 Education</span>

${this.wrapWithColor(
  "┌──────────────────────────────────────────────────┐",
  "#ff8c00"
)}
${this.wrapWithColor("│", "#ff8c00")}${this.wrapWithColor(
      " B.Tech in Chemical Science and Technology    ",
      "#ffffff"
    )}${this.wrapWithColor("│", "#ff8c00")}
${this.wrapWithColor(
  "└──────────────────────────────────────────────────┘",
  "#ff8c00"
)}

${this.wrapWithColor("🏛️ Institution:", "#ff8c00")} ${this.wrapWithColor(
      "Indian Institute of Technology (IIT) Patna",
      "#ffffff"
    )}
${this.wrapWithColor("📅 Duration:", "#ff8c00")}    ${this.wrapWithColor(
      "2021 - 2025",
      "#ffffff"
    )}
${this.wrapWithColor("📍 Location:", "#ff8c00")}    ${this.wrapWithColor(
      "Patna, Bihar",
      "#ffffff"
    )}`;

    this.printToOutput(outputElement, education);
  }"""
content = re.sub(r"showEducation\(outputElement = this\.output\) \{.*?(?=  showSkills)", education_repl + "\n\n", content, flags=re.DOTALL)

# Replace showSkills
skills_repl = r"""showSkills(outputElement = this.output) {
    const skills = `<span style="color: #ffff00; font-weight: bold;">🛠️ SKILLS</span>

• ${this.wrapWithColor("Go (Golang)", "#ffffff")}
• ${this.wrapWithColor("C/C++", "#ffffff")}
• ${this.wrapWithColor("Python", "#ffffff")}
• ${this.wrapWithColor("Node.js", "#ffffff")}
• ${this.wrapWithColor("React", "#ffffff")}
• ${this.wrapWithColor("Express", "#ffffff")}
• ${this.wrapWithColor("MongoDB / SQL", "#ffffff")}
• ${this.wrapWithColor("Supabase", "#ffffff")}
• ${this.wrapWithColor("Docker / GitHub Actions", "#ffffff")}
• ${this.wrapWithColor("JWT / OAuth", "#ffffff")}
• ${this.wrapWithColor("Electron / Raylib", "#ffffff")}

Type ${this.wrapWithColor(
      "skills-visual",
      "#00e5ff"
    )} for an interactive skills chart!`;

    this.printToOutput(outputElement, skills);
  }"""
content = re.sub(r"showSkills\(outputElement = this\.output\) \{.*?(?=  showContact)", skills_repl + "\n\n", content, flags=re.DOTALL)

with open("script.js", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated successfully")

