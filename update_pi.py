import sys

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('printWelcomeMessage(outputElement = this.output) {')
if idx != -1:
    brace_count = 0
    in_func = False
    end_idx = -1
    for i in range(idx, len(content)):
        if content[i] == '{':
            brace_count += 1
            in_func = True
        elif content[i] == '}':
            brace_count -= 1
        
        if in_func and brace_count == 0:
            end_idx = i + 1
            break
            
    if end_idx != -1:
        new_welcome = """printWelcomeMessage(outputElement = this.output) {
    const asciiArt = `      ██████████████████████╗ 
      ╚════██╔════════██╔═══╝ 
           ██║        ██║     
           ██║        ██║     
           ██║        ██║     
           ██║        ╚█████╗ 
           ╚═╝         ╚════╝`;

    const divider = "─────────────────────────────────────────────────";

    const welcome =
      this.wrapWithColor(asciiArt + "\\n", "#d4843e") +
      this.wrapWithColor(divider + "\\n", "#555555") +
      this.wrapWithColor(
        "              Interactive Terminal Resume\\n",
        "#888888"
      ) +
      this.wrapWithColor(
        "         Backend Developer • B.Tech Student • Open Source\\n",
        "#666666"
      ) +
      this.wrapWithColor(divider + "\\n\\n", "#555555") +
      this.wrapWithColor("Type ", "#666666") +
      this.wrapWithColor("'help'", "#87af87") +
      this.wrapWithColor(" to see available commands\\n", "#666666") +
      this.wrapWithColor("Press ", "#666666") +
      this.wrapWithColor("'tab'", "#87af87") +
      this.wrapWithColor(" to auto-complete commands", "#666666");

    const helpDiv = document.createElement("div");
    helpDiv.innerHTML = welcome;
    outputElement.appendChild(helpDiv);
    this.scrollToBottom(outputElement.closest(".terminal-content"));
  }"""
        
        content = content[:idx] + new_welcome + content[end_idx:]

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Welcome message updated with Pi symbol.")
