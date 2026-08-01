# -*- coding: utf-8 -*-
import sys, re

with open("script.js", "r", encoding="utf-8") as f:
    content = f.read()

pdf_repl = r"""generatePDF() {
    const outputElement = this.terminals[this.activeTerminal].input
      .closest(".terminal-content")
      .querySelector("[id^='output']");
    this.printToOutput(outputElement, "Opening resume...", "info");
    setTimeout(() => {
      window.open("resume.pdf", "_blank");
      this.printToOutput(
        outputElement,
        "Resume opened in a new tab!",
        "success"
      );
    }, 500);
  }"""
content = re.sub(r"generatePDF\(\) \{.*?\n  \}", pdf_repl, content, flags=re.DOTALL)

with open("script.js", "w", encoding="utf-8") as f:
    f.write(content)

print("Updates successful")

