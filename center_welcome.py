import sys

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# I want to change how helpDiv is appended in printWelcomeMessage.
old_block = """    const helpDiv = document.createElement("div");
    helpDiv.innerHTML = welcome;
    outputElement.appendChild(helpDiv);
    this.scrollToBottom(outputElement.closest(".terminal-content"));"""

new_block = """    const helpDiv = document.createElement("div");
    helpDiv.style.display = "flex";
    helpDiv.style.justifyContent = "center";
    helpDiv.style.width = "100%";
    
    const innerDiv = document.createElement("div");
    // Ensure the ascii art and text keeps its internal formatting
    innerDiv.style.textAlign = "center"; 
    
    // Actually, to keep ASCII art aligned, let's keep it left but center the text inside by centering the whole thing?
    // Wait, if innerDiv is text-align: center, the ascii art might skew.
    // Let's use text-align: left to preserve the ASCII art shape, but the text might be off.
    innerDiv.style.textAlign = "left";
    innerDiv.style.display = "inline-block";
    innerDiv.innerHTML = welcome;
    
    helpDiv.appendChild(innerDiv);
    outputElement.appendChild(helpDiv);
    this.scrollToBottom(outputElement.closest(".terminal-content"));"""

content = content.replace(old_block, new_block)

# Let's adjust the welcome text so the text under Pi looks centered relative to the ASCII art.
# The ASCII art has length of about 30 chars. The divider has length of 49.
# If innerDiv is 49 chars wide, the Pi art should be centered within 49 chars.
# Let's fix the ASCII art padding in python too.
pi_old = """      ██████████████████████╗ 
      ╚════██╔════════██╔═══╝ 
           ██║        ██║     
           ██║        ██║     
           ██║        ██║     
           ██║        ╚█████╗ 
           ╚═╝         ╚════╝"""

pi_new = """           ██████████████████████╗
           ╚════██╔════════██╔═══╝
                ██║        ██║
                ██║        ██║
                ██║        ██║
                ██║        ╚█████╗
                ╚═╝         ╚════╝"""
content = content.replace(pi_old, pi_new)

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Centered welcome message successfully.")
