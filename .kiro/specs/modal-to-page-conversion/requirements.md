# Requirements Document

## Introduction

Esta funcionalidade visa converter o sistema atual de modal de produto em uma página dedicada de compra. Atualmente, ao clicar em "Comprar agora", um modal é aberto com as opções de seleção de cor e carreta. O objetivo é substituir este modal por uma página completa que oferece mais espaço para apresentar o produto, mantendo toda a lógica de seleção existente e melhorando a experiência do usuário com um layout mais amplo e organizado.

## Requirements

### Requirement 1

**User Story:** Como um usuário interessado em comprar um produto, eu quero que ao clicar em "Comprar agora" seja aberta uma página dedicada ao invés de um modal, para que eu tenha mais espaço para visualizar e selecionar as opções do produto.

#### Acceptance Criteria

1. WHEN o usuário clica no botão "Comprar agora" THEN o sistema SHALL redirecionar para uma nova página ao invés de abrir um modal
2. WHEN a página de produto é carregada THEN o sistema SHALL manter toda a funcionalidade de seleção de cores e carretas existente
3. WHEN a página é acessada THEN o sistema SHALL exibir o produto com layout similar à imagem de referência fornecida

### Requirement 2

**User Story:** Como um usuário na página de produto, eu quero ver o layout organizado com preço, desconto, frete grátis, título do produto, opções de seleção e botão de compra, para que eu tenha uma experiência de compra clara e intuitiva.

#### Acceptance Criteria

1. WHEN a página de produto é carregada THEN o sistema SHALL exibir o preço principal em destaque (R$ 167,90)
2. WHEN a página é exibida THEN o sistema SHALL mostrar o preço original riscado (R$ 234,90) e o desconto (-55%)
3. WHEN a página é carregada THEN o sistema SHALL exibir "Frete grátis" em destaque
4. WHEN a página é exibida THEN o sistema SHALL mostrar o título completo do produto
5. WHEN a página é carregada THEN o sistema SHALL organizar as seções de "Cor" e "Carreta de brinde" de forma clara

### Requirement 3

**User Story:** Como um usuário selecionando opções do produto, eu quero que a lógica de seleção continue funcionando exatamente como antes, para que eu possa escolher a cor do caminhão e o tipo de carreta sem problemas.

#### Acceptance Criteria

1. WHEN o usuário seleciona uma cor THEN o sistema SHALL atualizar a imagem principal do produto conforme a seleção
2. WHEN o usuário seleciona um tipo de carreta THEN o sistema SHALL atualizar a imagem de preview da carreta
3. WHEN uma opção é selecionada THEN o sistema SHALL aplicar o estilo visual de seleção (botão ativo)
4. WHEN a página é carregada THEN o sistema SHALL manter as seleções padrão (Azul para cor, Coca Cola para carreta)

### Requirement 4

**User Story:** Como um usuário na página de produto, eu quero ter acesso fácil ao botão "Comprar Agora" que me leve ao checkout, para que eu possa finalizar minha compra rapidamente.

#### Acceptance Criteria

1. WHEN a página de produto é exibida THEN o sistema SHALL mostrar um botão "Comprar Agora" proeminente
2. WHEN o usuário clica em "Comprar Agora" THEN o sistema SHALL redirecionar para "https://checkout.vendeagora.com/api/public/shopify?product=716695694693&store=7166"
3. WHEN o botão é exibido THEN o sistema SHALL usar o mesmo estilo visual do modal atual
4. WHEN o usuário clica em "Comprar Agora" THEN o sistema SHALL redirecionar independentemente das opções selecionadas (cor ou carreta)

### Requirement 5

**User Story:** Como um usuário, eu quero que o modal não apareça mais automaticamente ao acessar a página principal, para que eu tenha controle sobre quando visualizar os detalhes do produto.

#### Acceptance Criteria

1. WHEN o usuário acessa a página principal THEN o sistema SHALL NOT exibir nenhum modal automaticamente
2. WHEN a página principal é carregada THEN o sistema SHALL manter apenas os botões "Comprar agora" visíveis
3. WHEN o usuário interage com a página principal THEN o sistema SHALL responder apenas aos cliques nos botões "Comprar agora"