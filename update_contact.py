import sys

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('showContact(outputElement = this.output) {')
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
        new_contact = """showContact(outputElement = this.output) {
    const contact = `<span style="color: #ff8c00; font-weight: bold;">Contact Information</span>

${this.wrapWithColor("┌───────────────────────────────────────────┐", "#ff8c00")}
${this.wrapWithColor("│", "#ff8c00")} ${this.wrapWithColor(
      "Let's connect and create something great!",
      "#ffffff"
    )} ${this.wrapWithColor("│", "#ff8c00")}
${this.wrapWithColor("└───────────────────────────────────────────┘", "#ff8c00")}

${this.wrapWithColor(
      "Email:",
      "#ff8c00"
    )} ${this.wrapWithColor(
      '<a href="mailto:iamkartik0704@gmail.com" style="color: #ffffff; text-decoration: none;">iamkartik0704@gmail.com</a>',
      "#ffffff"
    )}

${this.wrapWithColor(
      "Github:",
      "#ff8c00"
    )} ${this.wrapWithColor(
      '<a href="https://github.com/iamkartik0704" target="_blank" style="color: #ffffff; text-decoration: none;">github.com/iamkartik0704</a>',
      "#ffffff"
    )}

${this.wrapWithColor(
      "LinkedIn:",
      "#ff8c00"
    )} ${this.wrapWithColor(
      '<a href="https://linkedin.com/in/kartik-chawla-189430203" target="_blank" style="color: #ffffff; text-decoration: none;">linkedin.com/in/kartik-chawla-189430203</a>',
      "#ffffff"
    )}

${this.wrapWithColor("╭───────────────────────────────────────────╮", "#ff8c00")}
${this.wrapWithColor("│", "#ff8c00")} ${this.wrapWithColor(
      "Feel free to reach out for opportunities!",
      "#ffffff"
    )} ${this.wrapWithColor("│", "#ff8c00")}
${this.wrapWithColor("╰───────────────────────────────────────────╯", "#ff8c00")}`;

    const contactDiv = document.createElement("div");
    contactDiv.innerHTML = contact;
    outputElement.appendChild(contactDiv);
    this.scrollToBottom(outputElement.closest(".terminal-content"));
  }"""
        content = content[:idx] + new_contact + content[end_idx:]

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Contact updated successfully.")
