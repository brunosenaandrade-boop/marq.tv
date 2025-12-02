import os
import re
import urllib.request
import urllib.parse
from pathlib import Path
from bs4 import BeautifulSoup

# Diretório base
base_dir = r"C:\Users\Outlier\Documents\SITE DO FABIO\site"
html_file = os.path.join(base_dir, "index.html")

# Criar diretórios para recursos
os.makedirs(os.path.join(base_dir, "css"), exist_ok=True)
os.makedirs(os.path.join(base_dir, "js"), exist_ok=True)
os.makedirs(os.path.join(base_dir, "images"), exist_ok=True)

# Ler HTML
with open(html_file, 'r', encoding='utf-8', errors='ignore') as f:
    html_content = f.read()

soup = BeautifulSoup(html_content, 'html.parser')

# Função para normalizar URL
def normalize_url(url):
    if url.startswith('//'):
        return 'https:' + url
    elif not url.startswith('http'):
        return 'https://marquestv.page.tl/' + url.lstrip('/')
    return url

# Função para baixar arquivo
def download_file(url, local_path):
    try:
        print(f"Baixando: {url}")
        headers = {'User-Agent': 'Mozilla/5.0'}
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as response:
            data = response.read()
            os.makedirs(os.path.dirname(local_path), exist_ok=True)
            with open(local_path, 'wb') as f:
                f.write(data)
        print(f"OK Salvo: {local_path}")
        return True
    except Exception as e:
        print(f"ERRO ao baixar {url}: {str(e)}")
        return False

# Contador de recursos
resources_downloaded = 0

# 1. Baixar CSS
print("\n=== BAIXANDO CSS ===")
for link in soup.find_all('link', rel='stylesheet'):
    if link.get('href'):
        url = normalize_url(link['href'])
        filename = os.path.basename(urllib.parse.urlparse(url).path) or 'style.css'
        local_path = os.path.join(base_dir, 'css', filename)
        if download_file(url, local_path):
            link['href'] = f'css/{filename}'
            resources_downloaded += 1

# 2. Baixar JavaScript
print("\n=== BAIXANDO JAVASCRIPT ===")
for script in soup.find_all('script', src=True):
    url = normalize_url(script['src'])
    filename = os.path.basename(urllib.parse.urlparse(url).path) or 'script.js'
    local_path = os.path.join(base_dir, 'js', filename)
    if download_file(url, local_path):
        script['src'] = f'js/{filename}'
        resources_downloaded += 1

# 3. Baixar imagens
print("\n=== BAIXANDO IMAGENS ===")
image_tags = soup.find_all('img')
for img in image_tags:
    if img.get('src'):
        url = normalize_url(img['src'])
        # Criar nome único baseado na URL
        parsed = urllib.parse.urlparse(url)
        filename = os.path.basename(parsed.path)
        if not filename or filename == '':
            filename = 'image_' + str(hash(url))[:10] + '.jpg'
        local_path = os.path.join(base_dir, 'images', filename)
        if download_file(url, local_path):
            img['src'] = f'images/{filename}'
            resources_downloaded += 1

# 4. Extrair e baixar imagens do CSS inline
print("\n=== BAIXANDO IMAGENS DO CSS ===")
style_tag = soup.find('style')
if style_tag:
    css_content = style_tag.string
    if css_content:
        # Encontrar todas as URLs no CSS
        url_pattern = r"url\(['\"]?(.*?)['\"]?\)"
        urls = re.findall(url_pattern, css_content)
        for url in urls:
            if url and not url.startswith('data:'):
                full_url = normalize_url(url)
                filename = os.path.basename(urllib.parse.urlparse(full_url).path)
                if not filename:
                    filename = 'bg_' + str(hash(full_url))[:10] + '.jpg'
                local_path = os.path.join(base_dir, 'images', filename)
                if download_file(full_url, local_path):
                    css_content = css_content.replace(url, f'images/{filename}')
                    resources_downloaded += 1
        style_tag.string = css_content

# Salvar HTML atualizado
output_html = os.path.join(base_dir, "index.html")
with open(output_html, 'w', encoding='utf-8') as f:
    f.write(str(soup))

print(f"\n=== CONCLUIDO! ===")
print(f"Total de recursos baixados: {resources_downloaded}")
print(f"HTML atualizado salvo em: {output_html}")
