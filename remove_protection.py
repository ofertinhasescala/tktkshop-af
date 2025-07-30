#!/usr/bin/env python3

import re

# Lê o arquivo original
with open('tema-tik-tok-shop/index.html', 'r', encoding='utf-8') as file:
    content = file.read()

# Remove o script de proteção contra cópia
content = re.sub(r'<script id="wpcp_disable_selection".*?special for safari End\*\/\s*<\/script>', '', content, flags=re.DOTALL)

# Remove o script que desabilita o botão direito
content = re.sub(r'<script id="wpcp_disable_Right_Click".*?<\/script>', '', content, flags=re.DOTALL)

# Remove o estilo unselectable
content = re.sub(r'<style>\s*\.unselectable.*?<\/style>', '', content, flags=re.DOTALL)

# Remove o script CSS de desativação de seleção
content = re.sub(r'<script id="wpcp_css_disable_selection".*?<\/script>', '', content, flags=re.DOTALL)

# Remove a div de mensagem de erro e o script relacionado
content = re.sub(r'<div id="wpcp-error-message".*?<\/script>', '', content, flags=re.DOTALL)

# Remove o estilo de impressão
content = re.sub(r'<style>\s*@media print.*?<\/style>', '', content, flags=re.DOTALL)

# Remove o estilo CSS da mensagem de erro
content = re.sub(r'<style type="text\/css">\s*#wpcp-error-message.*?\.warning-wpcp {.*?}', '', content, flags=re.DOTALL)

# Remove a classe unselectable do body
content = content.replace('unselectable ', '')

# Escreve o conteúdo modificado em um novo arquivo
with open('tema-tik-tok-shop/index.html.new', 'w', encoding='utf-8') as file:
    file.write(content)

print("Arquivo modificado salvo como tema-tik-tok-shop/index.html.new") 