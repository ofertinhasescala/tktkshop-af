/**
 * Este arquivo demonstra como usar o sistema de seleção única
 * implementado em product-selector.js
 */

// Exemplo de como acessar o sistema de seleção única após a inicialização
document.addEventListener('DOMContentLoaded', function() {
    // O sistema já foi inicializado automaticamente pelo product-selector.js
    
    // Exemplo de como obter o estado atual
    if (window.productSelector) {
        const currentState = window.productSelector.stateManager.getState();
        console.log('Estado atual:', currentState);
        
        // Exemplo de como adicionar um listener para mudanças de estado
        window.productSelector.stateManager.addListener((key, value) => {
            console.log(`Estado alterado: ${key} = ${value}`);
        });
        
        // Exemplo de como forçar uma seleção programaticamente
        // window.productSelector.colorController.handleSelection('verde');
        // window.productSelector.carretaController.handleSelection('heineken');
    }
});

// As funções globais changeProductImage e changeCarretaImage continuam
// funcionando normalmente para compatibilidade com o HTML existente