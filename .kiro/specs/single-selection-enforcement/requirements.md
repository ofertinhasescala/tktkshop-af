# Requirements Document

## Introduction

O sistema atual permite que usuários selecionem múltiplas opções de cores e carretas simultaneamente, o que não é o comportamento desejado. Este spec define os requisitos para implementar um sistema de seleção única que garante que apenas uma opção de cor e uma opção de carreta possam estar ativas por vez.

## Requirements

### Requirement 1

**User Story:** Como um usuário do site, eu quero selecionar apenas uma cor de caminhão por vez, para que eu possa visualizar claramente qual opção está ativa.

#### Acceptance Criteria

1. WHEN o usuário clica em uma cor THEN apenas essa cor deve ficar selecionada
2. WHEN o usuário clica em uma cor THEN todas as outras cores devem ser automaticamente desmarcadas
3. WHEN o usuário clica em uma cor já selecionada THEN ela deve permanecer selecionada (não deve desmarcar)
4. WHEN o usuário tenta clicar rapidamente em múltiplas cores THEN apenas a primeira seleção deve ser processada

### Requirement 2

**User Story:** Como um usuário do site, eu quero selecionar apenas uma carreta por vez, para que eu possa visualizar claramente qual opção está ativa.

#### Acceptance Criteria

1. WHEN o usuário clica em uma carreta THEN apenas essa carreta deve ficar selecionada
2. WHEN o usuário clica em uma carreta THEN todas as outras carretas devem ser automaticamente desmarcadas
3. WHEN o usuário clica em uma carreta já selecionada THEN ela deve permanecer selecionada (não deve desmarcar)
4. WHEN o usuário tenta clicar rapidamente em múltiplas carretas THEN apenas a primeira seleção deve ser processada

### Requirement 3

**User Story:** Como um usuário do site, eu quero que o sistema seja responsivo e não trave durante as seleções, para que eu tenha uma experiência fluida.

#### Acceptance Criteria

1. WHEN o usuário faz uma seleção THEN o sistema deve responder em menos de 100ms
2. WHEN o usuário faz múltiplos cliques rápidos THEN o sistema não deve travar ou apresentar comportamento inesperado
3. WHEN uma seleção está sendo processada THEN cliques adicionais devem ser ignorados até que o processamento termine
4. WHEN o usuário navega entre opções THEN a transição visual deve ser suave e clara

### Requirement 4

**User Story:** Como um usuário do site, eu quero feedback visual claro sobre qual opção está selecionada, para que eu saiba exatamente o que escolhi.

#### Acceptance Criteria

1. WHEN uma opção está selecionada THEN ela deve ter um estilo visual distintivo (borda vermelha, fundo branco, texto vermelho)
2. WHEN uma opção não está selecionada THEN ela deve ter um estilo visual neutro (fundo cinza, texto cinza)
3. WHEN o usuário passa o mouse sobre uma opção THEN deve haver um feedback visual de hover
4. WHEN a página carrega THEN deve haver uma seleção padrão visível para cor e carreta

### Requirement 5

**User Story:** Como um desenvolvedor, eu quero que o código seja robusto e não permita estados inconsistentes, para que o sistema seja confiável.

#### Acceptance Criteria

1. WHEN o sistema inicializa THEN deve haver exatamente uma cor e uma carreta selecionadas
2. WHEN uma seleção é feita THEN o estado interno deve ser consistente com a interface visual
3. WHEN ocorre um erro durante a seleção THEN o sistema deve manter o estado anterior válido
4. WHEN múltiplas seleções são tentadas simultaneamente THEN apenas uma deve ser processada