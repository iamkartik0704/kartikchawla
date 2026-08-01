import sys

with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

in_projects = False
for i in range(len(lines)):
    if 'creator-projects-grid' in lines[i]:
        in_projects = True
        
    if in_projects:
        if 'ToadCode' in lines[i]:
            # The line before has the link
            lines[i-1] = lines[i-1].replace('href="#"', 'href="https://marketplace.visualstudio.com/items?itemName=KARTIKCHAWLA.toadcode-pro" target="_blank"')
        elif 'Compile' in lines[i]:
            lines[i-1] = lines[i-1].replace('href="#"', 'href="https://www.kartikchawla.in/" target="_blank"')
        elif 'RankMatrix' in lines[i]:
            lines[i-1] = lines[i-1].replace('href="#"', 'href="https://rankmatrix.onrender.com/" target="_blank"')
        elif 'ZappFoods' in lines[i] or 'ZappFood' in lines[i]:
            lines[i-1] = lines[i-1].replace('href="#"', 'href="https://zappfood.vercel.app/" target="_blank"')

with open('index.html', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Links updated in index.html.")
