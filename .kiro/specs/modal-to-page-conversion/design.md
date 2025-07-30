# Design Document

## Overview

O design converte o sistema atual de modal em uma página dedicada de produto, mantendo toda a funcionalidade existente de seleção de cores e carretas, mas oferecendo uma experiência mais ampla e organizada. A página seguirá o layout da imagem de referência fornecida, com seções bem definidas para preço, produto, opções de seleção e ação de compra.

## Architecture

### Estrutura de Arquivos
```
tema-tik-tok-shop/
├── product.html (nova página de produto)
├── css/
│   └── product-page.css (estilos específicos da página)
├── js/
│   └── product-selector.js (mantém funcionalidade existente)
└── index.html (modificado para remover modal automático)
```

### Fluxo de Navegação
1. **Página Principal** → Clique em "Comprar agora" → **Página de Produto**
2. **Página de Produto** → Seleção de opções → Clique em "Comprar Agora" → **Checkout Externo**

## Components and Interfaces

### 1. Página Principal (index.html - Modificações)
**Modificações necessárias:**
- Remover triggers automáticos de modal
- Alterar links dos botões "Comprar agora" para redirecionar para `product.html`
- Manter todo o resto da funcionalidade existente

### 2. Nova Página de Produto (product.html)
**Estrutura da página:**

#### Header Section
- **Preço Principal**: R$ 167,90 (em destaque, cor vermelha)
- **Preço Original**: R$ 234,90 (riscado, cor cinza)
- **Desconto**: -55% (em destaque, fundo vermelho claro)
- **Frete Grátis**: Badge verde com texto "Frete grátis"

#### Product Section
- **Imagem Principal**: Caminhão selecionado (120px de largura, centralizado)
- **Título do Produto**: "Miniatura Realista de Controle Remoto Caminhão Scania S540 6X4 + Carreta de Brinde (QUEIMA DE ESTOQUE)"

#### Selection Section
- **Seção Cor**: 
  - Título "Cor"
  - Botões: Vermelho, Azul (selecionado por padrão), Verde, Branco, Preto
- **Seção Carreta de brinde**:
  - Título "Carreta de brinde"  
  - Imagem de preview da carreta selecionada
  - Botões: Coca Cola (selecionado por padrão), Sedex, Heineken, Skol, Casas Bahia

#### Action Section
- **Botão "Comprar Agora"**: Botão vermelho proeminente que redireciona para checkout

### 3. Sistema de Seleção (Mantido)
**Componentes existentes que serão reutilizados:**
- `ProductSelector` class
- `StateManager` class  
- `SelectionController` class
- `ImageManager` class

## Data Models

### Estado do Produto
```javascript
{
  selectedColor: 'azul',        // Cor selecionada
  selectedCarreta: 'coca',      // Carreta selecionada
  productInfo: {
    price: 'R$ 167,90',
    originalPrice: 'R$ 234,90', 
    discount: '-55%',
    title: 'Miniatura Realista...',
    freeShipping: true
  },
  checkoutUrl: 'https://checkout.vendeagora.com/api/public/shopify?product=716695694693&store=7166'
}
```

### Mapeamento de Imagens (Existente)
```javascript
productImages = {
  'vermelho': 'https://centraldacompra.shop/cdn/shop/files/ChatGPT_Image_25_de_jun._de_2025_00_31_55_1024x.png?v=1752783302',
  'azul': 'https://centraldacompra.shop/cdn/shop/files/ChatGPT_Image_25_de_jun._de_2025_00_24_44_1024x.png?v=1752783302',
  // ... outras cores
}

carretaImages = {
  'coca': 'https://centraldacompra.shop/cdn/shop/files/ChatGPT_Image_25_de_jun._de_2025_01_07_21_1024x.png?v=1752783303',
  'sedex': 'https://www.sedex.com.br/wp-content/uploads/2021/09/container-sedex.png',
  // ... outras carretas
}
```

## Error Handling

### Cenários de Erro
1. **Falha no carregamento de imagem**: Fallback para imagem padrão
2. **JavaScript desabilitado**: Página ainda funcional com seleção padrão
3. **Link de checkout inválido**: Validação antes do redirecionamento

### Estratégias de Recuperação
- **Imagens**: Sistema de cache e fallback já implementado no `ImageManager`
- **Seleções**: Valores padrão definidos (azul para cor, coca para carreta)
- **Navegação**: Links diretos como fallback para funcionalidade JavaScript

## Testing Strategy

### Testes Funcionais
1. **Navegação**: Verificar redirecionamento correto dos botões "Comprar agora"
2. **Seleção de Opções**: Testar todas as combinações de cor e carreta
3. **Atualização de Imagens**: Verificar se imagens mudam corretamente
4. **Checkout**: Confirmar redirecionamento para URL correta

### Testes de Interface
1. **Layout Responsivo**: Testar em diferentes tamanhos de tela
2. **Carregamento de Imagens**: Verificar performance e fallbacks
3. **Estados Visuais**: Confirmar feedback visual das seleções

### Testes de Compatibilidade
1. **Navegadores**: Chrome, Firefox, Safari, Edge
2. **Dispositivos**: Desktop, tablet, mobile
3. **JavaScript**: Funcionalidade com e sem JavaScript habilitado

### Testes de Integração
1. **Sistema Existente**: Verificar que funcionalidade atual não foi quebrada
2. **Links Externos**: Testar redirecionamento para checkout
3. **Performance**: Verificar tempo de carregamento da nova página

## Design Decisions and Rationales

### 1. Página Separada vs Modal
**Decisão**: Criar página dedicada
**Justificativa**: Mais espaço para apresentar produto, melhor experiência mobile, maior flexibilidade de layout

### 2. Reutilização do Sistema de Seleção
**Decisão**: Manter classes JavaScript existentes
**Justificativa**: Sistema já testado e funcional, reduz risco de bugs, acelera desenvolvimento

### 3. Layout Baseado na Imagem de Referência
**Decisão**: Seguir estrutura visual fornecida
**Justificativa**: Atende expectativas do usuário, design já validado

### 4. URL de Checkout Fixa
**Decisão**: Usar URL única independente das seleções
**Justificativa**: Simplifica implementação, atende requisito específico do cliente

### 5. Manutenção da Funcionalidade Existente
**Decisão**: Não alterar lógica de seleção atual
**Justificativa**: Minimiza riscos, aproveita código testado, foco na conversão modal→página