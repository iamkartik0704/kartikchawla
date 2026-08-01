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
        new_func = """printWelcomeMessage(outputElement = this.output) {
    const asciiArt = `██████████████████████╗
╚════██╔════════██╔═══╝
     ██║        ██║
     ██║        ██║
     ██║        ██║
     ██║        ╚█████╗
     ╚═╝         ╚════╝`;

    const divider = "─────────────────────────────────────────────────";

    // Build the string carefully to avoid ANY leading spaces getting rendered
    // because the terminal uses white-space: pre-wrap;
    let welcome = `<div style="display: flex; flex-direction: column; align-items: center; width: 100%;">`;
    
    // Pi symbol block
    welcome += `<div style="text-align: left; margin-bottom: 5px;">`;
    welcome += this.wrapWithColor(asciiArt, "#d4843e");
    welcome += `</div>`;

    // Text block
    welcome += `<div style="text-align: center;">`;
    welcome += this.wrapWithColor(divider, "#555555") + `<br>`;
    welcome += this.wrapWithColor("Interactive Terminal Resume", "#888888") + `<br>`;
    welcome += this.wrapWithColor("Backend Developer • B.Tech Student • Open Source", "#666666") + `<br>`;
    welcome += this.wrapWithColor(divider, "#555555") + `<br><br>`;
    welcome += this.wrapWithColor("Type ", "#666666") + this.wrapWithColor("'help'", "#87af87") + this.wrapWithColor(" to see available commands", "#666666") + `<br>`;
    welcome += this.wrapWithColor("Press ", "#666666") + this.wrapWithColor("'tab'", "#87af87") + this.wrapWithColor(" to auto-complete commands", "#666666");
    welcome += `</div>`;
    welcome += `</div>`;

    const helpDiv = document.createElement("div");
    helpDiv.innerHTML = welcome;
    outputElement.appendChild(helpDiv);
    this.scrollToBottom(outputElement.closest(".terminal-content"));
  }"""
        
        content = content[:idx] + new_func + content[end_idx:]

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed spacing in welcome message.")
