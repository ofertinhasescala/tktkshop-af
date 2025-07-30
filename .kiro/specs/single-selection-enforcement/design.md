# Design Document

## Overview

Este documento descreve o design técnico para implementar um sistema robusto de seleção única para as opções de cores de caminhões e tipos de carretas. O sistema utilizará uma abordagem baseada em estado centralizado com controles de concorrência para garantir que apenas uma opção seja selecionada por categoria.

## Architecture

### Component Structure
```
ProductSelector
├── ColorSelector (gerencia seleção de cores)
├── CarretaSelector (gerencia seleção de carretas)
├── ImageManager (gerencia atualizações de imagens)
└── StateManager (gerencia estado global)
```

### State Management
- **Centralized State**: Um objeto global que mantém o estado atual das seleções
- **Mutex Pattern**: Sistema de locks para prevenir seleções concorrentes
- **Event-driven Updates**: Atualizações baseadas em eventos para manter sincronização

## Components and Interfaces

### StateManager
```javascript
class StateManager {
  constructor() {
    this.state = {
      selectedColor: 'azul',
      selectedCarreta: 'coca',
      isProcessing: false,
      lockTimeout: null
    };
    this.listeners = [];
  }
  
  // Métodos para gerenciar estado
  updateState(key, value)
  getState(key)
  addListener(callback)
  notifyListeners()
  acquireLock()
  releaseLock()
}
```

### SelectionController
```javascript
class SelectionController {
  constructor(stateManager, type) {
    this.stateManager = stateManager;
    this.type = type; // 'color' ou 'carreta'
  }
  
  // Métodos para controlar seleção
  handleSelection(option)
  updateVisualState(selectedOption)
  validateSelection(option)
}
```

### ImageManager
```javascript
class ImageManager {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.imageCache = new Map();
  }
  
  // Métodos para gerenciar imagens
  updateImage(type, option)
  preloadImages()
  handleImageError(element, fallbackSrc)
}
```

## Data Models

### Selection State
```javascript
const SelectionState = {
  selectedColor: String,      // 'vermelho', 'azul', 'verde', 'branco', 'preto'
  selectedCarreta: String,    // 'coca', 'sedex', 'heineken', 'skol', 'casas'
  isProcessing: Boolean,      // Flag para controle de concorrência
  lockTimeout: Number,        // ID do timeout para liberação automática do lock
  lastUpdate: Date           // Timestamp da última atualização
};
```

### Product Images
```javascript
const ProductImages = {
  colors: Map<String, String>,    // Mapeamento cor -> URL da imagem
  carretas: Map<String, String>   // Mapeamento carreta -> URL da imagem
};
```

## Error Handling

### Lock Timeout Strategy
- **Timeout Duration**: 500ms para liberação automática de locks
- **Fallback**: Se um lock não for liberado, será automaticamente liberado após o timeout
- **Recovery**: Sistema se recupera automaticamente de estados inconsistentes

### Image Loading Errors
- **Retry Logic**: Tentativa de recarregamento automático em caso de falha
- **Fallback Images**: Imagens padrão para casos de erro
- **User Feedback**: Indicação visual quando imagens não carregam

### Concurrent Selection Handling
- **Debouncing**: Ignorar cliques múltiplos em sequência rápida
- **Queue Management**: Processar seleções em ordem sequencial
- **State Validation**: Verificar consistência do estado antes de aplicar mudanças

## Testing Strategy

### Unit Tests
- Testar StateManager isoladamente
- Testar SelectionController para cada tipo (color/carreta)
- Testar ImageManager com mocks de imagens
- Testar cenários de erro e recuperação

### Integration Tests
- Testar fluxo completo de seleção
- Testar interação entre componentes
- Testar comportamento com múltiplos cliques simultâneos
- Testar carregamento de imagens

### User Acceptance Tests
- Verificar que apenas uma opção pode ser selecionada por categoria
- Verificar que a interface visual reflete corretamente as seleções
- Verificar que as imagens são atualizadas corretamente
- Testar em diferentes dispositivos e navegadores

## Implementation Details

### DOM Event Handling
```javascript
// Estratégia para capturar eventos de forma robusta
element.addEventListener('click', handleClick, { once: false, passive: false });
element.addEventListener('mousedown', preventMultipleClicks, { passive: false });
element.addEventListener('touchstart', handleTouch, { passive: false });
```

### CSS State Management
```css
/* Estados visuais claros e distintos */
.option-button {
  /* Estado padrão */
}

.option-button.selected {
  /* Estado selecionado */
}

.option-button.processing {
  /* Estado durante processamento */
}

.option-button:disabled {
  /* Estado desabilitado */
}
```

### Performance Considerations
- **Image Preloading**: Carregar imagens em background para transições suaves
- **Event Delegation**: Usar delegação de eventos para melhor performance
- **Minimal DOM Manipulation**: Reduzir manipulações desnecessárias do DOM
- **Memory Management**: Limpar listeners e timeouts adequadamente