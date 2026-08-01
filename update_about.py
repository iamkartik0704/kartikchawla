import re

with open("script.js", "r", encoding="utf-8") as f:
    content = f.read()

idx = content.find("showAbout(outputElement = this.output) {")
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
        new_about = """showAbout(outputElement = this.output) {
    const about = `<span style="color: #ff8c00; font-weight: bold;">✨ About Me</span>

${this.wrapWithColor(
  "┌─────────────────────────────────────────────────────────┐",
  "#ff8c00"
)}
${this.wrapWithColor("│", "#ff8c00")} ${this.wrapWithColor(
      "Hi! I'm Kartik Chawla, B.Tech. Student at IIT Patna.",
      "#ffffff"
    )}
${this.wrapWithColor("│", "#ff8c00")} ${this.wrapWithColor(
      "Passionate about Web Development and Language Design.",
      "#ffffff"
    )}
${this.wrapWithColor(
  "└─────────────────────────────────────────────────────────┘",
  "#ff8c00"
)}

${this.wrapWithColor("⚡ Experience", "#ff8c00")}
${this.wrapWithColor(
  "   Web Development Sub-Coordinator for major IIT Patna fests",
  "#ffffff"
)}
${this.wrapWithColor("   (Anwesha, TedX, Celesta) & NJACK DevOS club.", "#ff8c00")}

${this.wrapWithColor("⚡ Passion", "#ff8c00")}
${this.wrapWithColor(
  "   Building dynamically-typed languages like ToadCode and",
  "#ffffff"
)}
${this.wrapWithColor(
  "   solving complex algorithmic problems (1700+ LeetCode rating).",
  "#ffffff"
)}

${this.wrapWithColor("⚡ Strengths", "#ff8c00")}
${this.wrapWithColor(
  "   MERN Stack, C/C++, TypeScript, and competitive",
  "#ffffff"
)}
${this.wrapWithColor("   programming. Also a State Level Chess Champion!", "#ffffff")}

${this.wrapWithColor(
  "╭───────────────────────────────────────────────────────╮",
  "#ff8c00"
)}
${this.wrapWithColor("│", "#ff8c00")} ${this.wrapWithColor(
      "Ready to bring your innovative ideas to life!",
      "#ffffff"
    )} ${this.wrapWithColor("│", "#ff8c00")}
${this.wrapWithColor(
  "╰───────────────────────────────────────────────────────╯",
  "#ff8c00"
)}`;

    const aboutDiv = document.createElement("div");
    aboutDiv.innerHTML = about;
    outputElement.appendChild(aboutDiv);
    this.scrollToBottom(outputElement.closest(".terminal-content"));
  }"""
        
        content = content[:idx] + new_about + content[end_idx:]

with open("script.js", "w", encoding="utf-8") as f:
    f.write(content)

print("About updated successfully")
