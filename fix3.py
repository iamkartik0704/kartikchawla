import re

with open("script.js", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Remove linkedin-cover from help menu string
linkedin_help = """      this.wrapWithColor("• linkedin-cover", "#98fb98") +
      " " +
      this.wrapWithColor("Generate LinkedIn cover image\\n", "#ffffff");"""
content = content.replace(linkedin_help, "")

# Remove stray + 
content = content.replace('this.wrapWithColor("Download resume as PDF\\n", "#ffffff") +', 'this.wrapWithColor("Download resume as PDF\\n", "#ffffff");')

# 2. Remove weather from help menu string
weather_help = """      this.wrapWithColor("• weather", "#98fb98") +
      "    " +
      this.wrapWithColor("Check weather for a location\\n", "#ffffff") +
"""
content = content.replace(weather_help, "")

# 3. Remove weather case from switch statement
weather_case = """      case "weather":
        this.showWeather(args.join(" "), outputElement);
        break;
"""
content = content.replace(weather_case, "")

# 4. Remove showWeather function
idx = content.find("showWeather(location, outputElement) {")
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
        content = content[:idx] + content[end_idx:]

with open("script.js", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixes 3 applied successfully")
