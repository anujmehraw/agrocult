import os, re, json

keys = set()
for root, _, files in os.walk('c:/Users/mehra/agrocult-final'):
    if 'node_modules' in root or '.next' in root: continue
    for f in files:
        if f.endswith('.tsx') or f.endswith('.ts'):
            path = os.path.join(root, f)
            with open(path, encoding='utf-8') as file:
                content = file.read()
                matches = re.findall(r't\("([^"]+)"\)', content)
                matches.extend(re.findall(r"t\('([^']+)'\)", content))
                for m in matches: keys.add(m)

print(json.dumps(list(keys), indent=2))
