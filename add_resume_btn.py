import sys

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

target = """<div class="hero-cta-container">
                    <a href="#contact" class="btn-cta">Get in Touch!</a>
                </div>"""

replacement = """<div class="hero-cta-container" style="display: flex; gap: 15px; flex-wrap: wrap;">
                    <a href="#contact" class="btn-cta">Get in Touch!</a>
                    <a href="resume.pdf" target="_blank" class="btn-cta" style="background: #a8e6cf; color: #000;">View Resume <i class="fas fa-file-pdf"></i></a>
                </div>"""

if target in content:
    content = content.replace(target, replacement)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added View Resume button.")
else:
    print("Could not find target string. Adding manually based on regex.")
    import re
    # Try more flexible regex replacement
    pattern = re.compile(r'<div class="hero-cta-container">\s*<a href="#contact" class="btn-cta">Get in Touch!</a>\s*</div>')
    new_content = pattern.sub(replacement, content)
    if new_content != content:
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Added View Resume button using regex.")
    else:
        print("Still couldn't find the target.")
