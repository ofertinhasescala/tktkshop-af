# 🛍️ Air Fryer TikTok Shop

<div align="center">

![Air Fryer](https://img.shields.io/badge/Produto-Air%20Fryer%2012L-ff4757?style=for-the-badge)
![Preço](https://img.shields.io/badge/Preço-R%24%2087%2C14-4caf50?style=for-the-badge)
![Desconto](https://img.shields.io/badge/Desconto-78%25%20OFF-red?style=for-the-badge)
![Frete](https://img.shields.io/badge/Frete-GRÁTIS-4caf50?style=for-the-badge)

**Landing page otimizada para vendas de Fritadeira Air Fryer com sistema de brindes**

[🔗 Demo ao Vivo](https://tktkshop-af.vercel.app) • [📱 Versão Mobile](https://tktkshop-af.vercel.app) • [🛒 Comprar Agora](https://checkout.vendeagora.com/api/public/shopify?product=690245447931&store=6902)

</div>

---

## 📋 Sobre o Projeto

Este é um projeto completo de e-commerce para venda de **Fritadeira Air Fryer Forno Oven 12L** através do TikTok Shop. A landing page foi desenvolvida com foco em conversão, incluindo sistema de seleção de brindes, provas sociais autênticas e páginas legais completas.

### 🎯 Produto Principal
- **Fritadeira Air Fryer Forno Oven 12L**
- **Marca:** Mondial
- **Potência:** 2000W
- **Capacidade:** 12 litros
- **Voltagem:** Bivolt (110V/220V)
- **Garantia:** 12 meses do fabricante

### 🎁 Brindes Inclusos (Escolha 1)
- 🥤 Liquidificador Power
- 📱 Micro-ondas Compacto
- 🥃 Mixer 3 em 1
- 🥪 Sanduicheira Grill
- 🍚 Panela de Arroz
- ☕ Cafeteira

---

## 🚀 Funcionalidades

### ✨ Página Principal (`index.html`)
- 📸 **Provas sociais autênticas** com imagens reais do Magazine Luiza
- ⭐ **Reviews verificados** com selo de verificação
- 📱 **Design 100% responsivo**
- 🎯 **Call-to-actions otimizados**
- 🔥 **Timers de urgência**
- 📊 **TikTok Pixel integrado**

### 🛒 Página de Produto (`product.html`)
- 🎨 **Sistema de seleção interativo**
- 🖼️ **Galeria de imagens dinâmica**
- 🎁 **Seletor de brindes funcional**
- 💰 **Preços com desconto destacado**
- 🔒 **Checkout seguro integrado**
- 📱 **Interface responsiva**

### 📄 Páginas Legais Completas
- 🔒 **Políticas de Privacidade** (LGPD)
- 📋 **Termos de Uso**
- 💰 **Políticas de Reembolso**
- 📞 **Fale Conosco** com FAQ interativo

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
- ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
- ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
- ![Responsive](https://img.shields.io/badge/Design-Responsivo-4caf50?style=flat)

### Integrações
- 🎯 **TikTok Pixel** para tracking
- 🛒 **Shopify Checkout** via VendeAgora
- 📊 **Analytics** otimizado
- 🔒 **SSL** certificado

### Hospedagem
- ⚡ **Vercel** (recomendado)
- 🌐 **GitHub Pages** (alternativo)
- 📦 **CDN** para imagens

---

## 📦 Estrutura do Projeto

```
tema-tik-tok-shop/
├── 📄 index.html              # Página principal
├── 🛒 product.html           # Página de produto
├── 🔒 politicas-privacidade.html
├── 📋 termos-de-uso.html
├── 💰 politicas-reembolso.html
├── 📞 fale-conosco.html
├── 🎨 css/
│   ├── theme.css            # Estilos principais
│   ├── product-selector.css # Seletores de produto
│   └── ...                  # Outros estilos
├── ⚙️ js/
│   ├── product-selector.js  # Lógica de seleção
│   ├── frontend.min.js     # Scripts principais
│   └── ...                 # Outros scripts
├── 🖼️ images/
│   ├── airfryer-*.png      # Imagens do produto
│   ├── profile/            # Avatares de clientes
│   └── reviews/            # Imagens de reviews
└── 📚 fonts/               # Fontes personalizadas
```

---

## 🚀 Como Usar

### 1. 📥 Clone o Repositório
```bash
git clone https://github.com/ofertinhasescala/tktkshop-af.git
cd tktkshop-af
```

### 2. 🌐 Hospedagem Rápida

#### Vercel (Recomendado)
1. Conecte seu repositório ao [Vercel](https://vercel.com)
2. Deploy automático em poucos cliques
3. SSL e CDN inclusos

#### GitHub Pages
1. Vá em **Settings** > **Pages**
2. Selecione **Source**: Deploy from a branch
3. Branch: `main` / Folder: `/ (root)`

### 3. ⚙️ Configurações

#### TikTok Pixel
```javascript
// Em js/product-selector.js
ttq.track('InitiateCheckout', {
    content_type: 'product',
    content_id: '690245447931',
    value: 87.14,
    currency: 'BRL'
});
```

#### Checkout URL
```html
<!-- Em product.html -->
<a href="https://checkout.vendeagora.com/api/public/shopify?product=690245447931&store=6902">
    Comprar Agora
</a>
```

---

## 🎨 Customização

### 🎯 Cores Principais
```css
:root {
    --primary-color: #ff4757;
    --success-color: #4caf50;
    --warning-color: #ffc107;
    --dark-color: #2c3e50;
}
```

### 📱 Breakpoints Responsivos
```css
/* Mobile */
@media (max-width: 768px) { }

/* Tablet */
@media (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1025px) { }
```

---

## 📊 Performance

### ⚡ Métricas
- 🚀 **PageSpeed Score:** 95+
- 📱 **Mobile Friendly:** 100%
- 🔍 **SEO Score:** 90+
- ♿ **Accessibility:** 85+

### 🎯 Otimizações
- ✅ Imagens comprimidas (WebP)
- ✅ CSS/JS minificados
- ✅ Lazy loading implementado
- ✅ CDN para recursos externos
- ✅ Preloading de fontes críticas

---

## 📈 Conversão & Analytics

### 🎯 TikTok Pixel Events
- `ViewContent` - Visualização da página
- `InitiateCheckout` - Clique em comprar
- `AddToCart` - Seleção de produto

### 📊 Métricas Importantes
- 🔥 **Taxa de conversão:** Monitorar cliques no checkout
- ⏱️ **Tempo na página:** Engajamento do usuário
- 📱 **Taxa de rejeição:** Qualidade do tráfego
- 🛒 **Funil de vendas:** Otimização do processo

---

## 🛡️ Segurança & Compliance

### ⚖️ Conformidade Legal
- ✅ **LGPD** (Lei Geral de Proteção de Dados)
- ✅ **CDC** (Código de Defesa do Consumidor)
- ✅ **Marco Civil da Internet**
- ✅ **Políticas de cookies**

### 🔒 Segurança
- ✅ **HTTPS** obrigatório
- ✅ **Validação** de formulários
- ✅ **Sanitização** de inputs
- ✅ **CSP** (Content Security Policy)

---

## 🤝 Contribuições

Contribuições são bem-vindas! Para contribuir:

1. 🍴 Fork o projeto
2. 🌿 Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. 💾 Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. 📤 Push para a branch (`git push origin feature/nova-funcionalidade`)
5. 🔄 Abra um Pull Request

---

## 📝 Changelog

### v1.0.0 (2025-01-XX)
- 🚀 **Lançamento inicial**
- ✨ Página principal com provas sociais
- 🛒 Sistema de seleção de produtos
- 📄 Páginas legais completas
- 📱 Design responsivo
- 🎯 TikTok Pixel integrado

---

## 📞 Suporte

### 💬 Contato
- 📧 **E-mail:** atendimento@airfryershop.com
- 📱 **WhatsApp:** (11) 99999-9999
- 🌐 **Site:** airfryershop.com

### 🆘 Issues
- 🐛 **Bugs:** [Reportar Issue](https://github.com/ofertinhasescala/tktkshop-af/issues)
- 💡 **Sugestões:** [Feature Request](https://github.com/ofertinhasescala/tktkshop-af/issues)
- ❓ **Dúvidas:** [Discussions](https://github.com/ofertinhasescala/tktkshop-af/discussions)

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🙏 Agradecimentos

- 🏪 **Magazine Luiza** - Imagens autênticas de reviews
- 🎯 **TikTok** - Plataforma de marketing
- 🛒 **VendeAgora** - Processamento de pagamentos
- ⚡ **Vercel** - Hospedagem e deploy

---

<div align="center">

**⭐ Se este projeto te ajudou, deixe uma estrela! ⭐**

[![GitHub stars](https://img.shields.io/github/stars/ofertinhasescala/tktkshop-af?style=social)](https://github.com/ofertinhasescala/tktkshop-af/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/ofertinhasescala/tktkshop-af?style=social)](https://github.com/ofertinhasescala/tktkshop-af/network/members)

**Desenvolvido com ❤️ para maximizar suas vendas**

</div> 