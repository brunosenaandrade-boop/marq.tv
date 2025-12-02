import re

with open('index.html', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Procurar recursos externos - mais detalhado
patterns = [
    (r'src=["\'](https?://[^"\']+)', 'SRC'),
    (r'href=["\'](https?://[^"\']+)', 'HREF'),
    (r'src=["\']//([^"\']+)', 'SRC //'),
    (r'href=["\']//([^"\']+)', 'HREF //')
]

print("=== RECURSOS EXTERNOS ENCONTRADOS ===\n")
found_any = False

for pattern, tipo in patterns:
    matches = re.findall(pattern, content)
    if matches:
        found_any = True
        print(f"\n{tipo}:")
        for match in set(matches):
            print(f"  - {match}")

if not found_any:
    print("Nenhum recurso externo encontrado!")
