import sys

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the bulky calculationHTML block
old_block = """      const calculationHTML = `<div class="calculation">
        <div class="calculation-expression">${this.wrapWithColor(
          expression,
          "#87cefa"
        )}</div>
        <div class="calculation-result">${this.wrapWithColor(
          "= " + formattedResult,
          "#98fb98"
        )}</div>
      </div>`;"""

new_block = """      const calculationHTML = `<div class="calculation"><div class="calculation-expression">${this.wrapWithColor(expression, "#87cefa")}</div><div class="calculation-result">${this.wrapWithColor("= " + formattedResult, "#98fb98")}</div></div>`;"""

content = content.replace(old_block, new_block)

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("calculationHTML flattened successfully.")
