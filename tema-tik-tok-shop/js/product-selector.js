/**
 * StateManager - Gerencia o estado centralizado das seleções
 */
class StateManager {
    constructor() {
        this.state = {
            selectedColor: 'azul', 
            selectedCarreta: 'coca',
            isProcessing: false,
            lockTimeout: null,
            lastUpdate: new Date()
        };
        this.listeners = [];
    }

    /**
     * Atualiza o estado e notifica listeners
     */
    updateState(key, value) {
        if (this.state.hasOwnProperty(key)) {
            this.state[key] = value;
            this.state.lastUpdate = new Date();
            this.notifyListeners(key, value);
        }
    }

    /**
     * Obtém valor do estado
     */
    getState(key) {
        return key ? this.state[key] : this.state;
    }

    /**
     * Adiciona listener para mudanças de estado
     */
    addListener(callback) {
        if (typeof callback === 'function') {
            this.listeners.push(callback);
        }
    }

    /**
     * Notifica todos os listeners sobre mudanças
     */
    notifyListeners(key, value) {
        this.listeners.forEach(callback => {
            try {
                callback(key, value, this.state);
            } catch (error) {
                console.error('Error in state listener:', error);
            }
        });
    }

    /**
     * Adquire lock para operações críticas
     */
    acquireLock() {
        if (this.state.isProcessing) {
            return false;
        }

        this.updateState('isProcessing', true);

        // Auto-release lock após timeout
        this.state.lockTimeout = setTimeout(() => {
            this.releaseLock();
        }, 500);

        return true;
    }

    /**
     * Libera lock
     */
    releaseLock() {
        if (this.state.lockTimeout) {
            clearTimeout(this.state.lockTimeout);
            this.state.lockTimeout = null;
        }
        this.updateState('isProcessing', false);
    }
}

/**
 * SelectionController - Controla a seleção de opções (cores ou carretas)
 */
class SelectionController {
    constructor(stateManager, type) {
        this.stateManager = stateManager;
        this.type = type; // 'color' ou 'carreta'
        this.stateKey = type === 'color' ? 'selectedColor' : 'selectedCarreta';
        this.containerSelector = type === 'color' ? '[data-id="571a5629"]' : '[data-id="571a5630"]';
    }

    /**
     * Manipula a seleção de uma opção
     */
    handleSelection(option) {
        // Validar entrada
        if (!this.validateSelection(option)) {
            console.warn(`Invalid ${this.type} selection:`, option);
            return false;
        }

        // Tentar adquirir lock
        if (!this.stateManager.acquireLock()) {
            console.log(`Selection in progress, ignoring ${this.type} selection:`, option);
            return false;
        }

        try {
            // Adicionar classe de processamento
            const container = document.querySelector(this.containerSelector);
            if (container) {
                const functionName = this.type === 'color' ? 'changeProductImage' : 'changeCarretaImage';
                const selectedButton = container.querySelector(`[onclick="${functionName}('${option}')"]`);

                if (selectedButton) {
                    const buttonContainer = selectedButton.closest('.elementor-widget-button');
                    if (buttonContainer) {
                        buttonContainer.classList.add('processing');
                    }
                }
            }

            // Atualizar estado
            this.stateManager.updateState(this.stateKey, option);

            // Atualizar interface visual
            this.updateVisualState(option);

            return true;
        } catch (error) {
            console.error(`Error handling ${this.type} selection:`, error);
            return false;
        } finally {
            // Liberar lock após pequeno delay
            setTimeout(() => {
                // Remover classe de processamento
                const container = document.querySelector(this.containerSelector);
                if (container) {
                    const processingButtons = container.querySelectorAll('.processing');
                    processingButtons.forEach(btn => {
                        btn.classList.remove('processing');
                    });
                }
                this.stateManager.releaseLock();
            }, 300); // Aumentado para 300ms para melhor visualização do estado de processamento
        }
    }

    /**
     * Atualiza o estado visual dos botões
     */
    updateVisualState(selectedOption) {
        try {
            const container = document.querySelector(this.containerSelector);
            if (!container) {
                console.warn(`Container not found for ${this.type}:`, this.containerSelector);
                return;
            }

            // Remove classe ativa de todos os botões
            const allButtons = container.querySelectorAll('.elementor-widget-button');
            allButtons.forEach(btn => {
                btn.classList.remove('elementor-widget-active');

                // Garantir que não há classes de estado residuais
                btn.classList.remove('processing');
                btn.classList.remove('botao-desabilitado');
            });

            // Adiciona classe ativa ao botão selecionado
            const functionName = this.type === 'color' ? 'changeProductImage' : 'changeCarretaImage';
            const selectedButton = container.querySelector(`[onclick="${functionName}('${selectedOption}')"]`);

            if (selectedButton) {
                const buttonContainer = selectedButton.closest('.elementor-widget-button');
                if (buttonContainer) {
                    // Adicionar classe com animação
                    buttonContainer.classList.add('elementor-widget-active');

                    // Aplicar efeito de animação
                    buttonContainer.style.animation = 'none';
                    setTimeout(() => {
                        buttonContainer.style.animation = 'pulse 0.3s ease-in-out';
                    }, 10);
                }
            }

            // Atualizar imagens relacionadas
            if (this.type === 'color') {
                const mainImage = document.getElementById('main-product-image');
                if (mainImage) {
                    mainImage.classList.add('image-loading');
                    setTimeout(() => {
                        mainImage.classList.remove('image-loading');
                    }, 300);
                }
            } else if (this.type === 'carreta') {
                const carretaImage = document.getElementById('carreta-preview-image');
                if (carretaImage) {
                    carretaImage.classList.add('image-loading');
                    setTimeout(() => {
                        carretaImage.classList.remove('image-loading');
                    }, 300);
                }
            }
        } catch (error) {
            console.error(`Error updating visual state for ${this.type}:`, error);
        }
    }

    /**
     * Valida se a seleção é válida
     */
    validateSelection(option) {
        if (!option || typeof option !== 'string') {
            return false;
        }

        const validOptions = this.type === 'color'
            ? ['vermelho', 'azul', 'verde', 'branco', 'preto']
            : ['coca', 'sedex', 'heineken', 'skol', 'casas'];

        return validOptions.includes(option);
    }
}

/**
 * ImageManager - Gerencia atualizações de imagens
 */
class ImageManager {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.imageCache = new Map();

        // URLs das imagens
        this.productImages = {
            'vermelho': 'https://centraldacompra.shop/cdn/shop/files/ChatGPT_Image_25_de_jun._de_2025_00_31_55_1024x.png?v=1752783302',
            'azul': 'https://centraldacompra.shop/cdn/shop/files/ChatGPT_Image_25_de_jun._de_2025_00_24_44_1024x.png?v=1752783302',
            'verde': 'https://centraldacompra.shop/cdn/shop/files/ChatGPT_Image_26_de_jun._de_2025_21_33_11_1024x.png?v=1752783302',
            'branco': 'https://centraldacompra.shop/cdn/shop/files/ChatGPT_Image_25_de_jun._de_2025_00_27_28_1024x.png?v=1752783302',
            'preto': 'https://centraldacompra.shop/cdn/shop/files/SUA_MEMORIA_AQUI_1_1080x.png?v=1752783302'
        };

        this.carretaImages = {
            'coca': 'https://centraldacompra.shop/cdn/shop/files/ChatGPT_Image_25_de_jun._de_2025_01_07_21_1024x.png?v=1752783303',
            'sedex': 'https://centraldacompra.shop/cdn/shop/files/5_1080x.png?v=1752783302',
            'heineken': 'https://centraldacompra.shop/cdn/shop/files/ChatGPT_Image_26_de_jun._de_2025_21_36_04_1024x.png?v=1752783302',
            'skol': 'https://centraldacompra.shop/cdn/shop/files/ChatGPT_Image_26_de_jun._de_2025_21_42_41_1_1024x.png?v=1752783304',
            'casas': 'https://centraldacompra.shop/cdn/shop/files/ChatGPT_Image_26_de_jun._de_2025_21_55_27_1024x.png?v=1752783303'
        };

        // Inicializar preload
        this.preloadImages();
    }

    /**
     * Atualiza imagem baseada no tipo e opção
     */
    updateImage(type, option) {
        try {
            if (type === 'color') {
                this.updateProductImage(option);
            } else if (type === 'carreta') {
                this.updateCarretaImage(option);
            }
        } catch (error) {
            console.error(`Error updating ${type} image:`, error);
        }
    }

    /**
     * Atualiza imagem principal do produto
     */
    updateProductImage(color) {
        const mainImage = document.getElementById('main-product-image');
        const imageUrl = this.productImages[color];

        if (mainImage && imageUrl) {
            // Verificar se a imagem já está em um container
            let container = mainImage.closest('.main-product-container');

            // Se não estiver, criar o container
            if (!container) {
                container = document.createElement('div');
                container.className = 'main-product-container';
                mainImage.parentNode.insertBefore(container, mainImage);
                container.appendChild(mainImage);
            }

            mainImage.src = imageUrl;
            mainImage.srcset = '';
            mainImage.alt = 'Caminhão ' + color.charAt(0).toUpperCase() + color.slice(1);
        }
    }

    /**
     * Atualiza imagem de pré-visualização da carreta
     */
    updateCarretaImage(carreta) {
        const carretaImage = document.getElementById('carreta-preview-image');
        const imageUrl = this.carretaImages[carreta];

        if (carretaImage && imageUrl) {
            // Verificar se a imagem já está em um container
            let container = carretaImage.closest('.carreta-preview-container');

            // Se não estiver, criar o container
            if (!container) {
                container = document.createElement('div');
                container.className = 'carreta-preview-container';
                carretaImage.parentNode.insertBefore(container, carretaImage);
                container.appendChild(carretaImage);
            }

            carretaImage.src = imageUrl;
            carretaImage.srcset = '';
            carretaImage.alt = 'Carreta ' + carreta.charAt(0).toUpperCase() + carreta.slice(1);
        }
    }

    /**
     * Pré-carrega imagens para melhor performance
     */
    preloadImages() {
        const allImages = [...Object.values(this.productImages), ...Object.values(this.carretaImages)];

        allImages.forEach(url => {
            if (!this.imageCache.has(url)) {
                const img = new Image();
                img.onload = () => this.imageCache.set(url, true);
                img.onerror = () => console.warn('Failed to preload image:', url);
                img.src = url;
            }
        });
    }

    /**
     * Manipula erros de carregamento de imagem
     */
    handleImageError(element, fallbackSrc) {
        if (element && fallbackSrc) {
            element.src = fallbackSrc;
            element.onerror = null; // Prevenir loop infinito
        }
    }
}

/**
 * ProductSelector - Classe principal que coordena todo o sistema
 */
class ProductSelector {
    constructor() {
        this.stateManager = new StateManager();
        this.colorController = new SelectionController(this.stateManager, 'color');
        this.carretaController = new SelectionController(this.stateManager, 'carreta');
        this.imageManager = new ImageManager(this.stateManager);

        this.debounceTimeout = null;
        this.lastClickTime = 0;

        this.init();
    }

    /**
     * Inicializa o sistema
     */
    init() {
        // Aguardar DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }

        // Configurar listeners de estado
        this.stateManager.addListener((key, value) => {
            if (key === 'selectedColor') {
                this.imageManager.updateImage('color', value);
            } else if (key === 'selectedCarreta') {
                this.imageManager.updateImage('carreta', value);
            }
        });
    }

    /**
     * Configura event listeners
     */
    setupEventListeners() {
        // Event delegation para cores
        const colorContainer = document.querySelector('[data-id="571a5629"]');
        if (colorContainer) {
            this.setupContainerListeners(colorContainer, 'color');
        }

        // Event delegation para carretas
        const carretaContainer = document.querySelector('[data-id="571a5630"]');
        if (carretaContainer) {
            this.setupContainerListeners(carretaContainer, 'carreta');
        }

        // Inicializar com valores padrão
        this.initializeDefaults();
    }

    /**
     * Configura listeners para um container específico
     */
    setupContainerListeners(container, type) {
        // Usar event delegation
        container.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const button = e.target.closest('a[onclick]');
            if (button) {
                this.handleButtonClick(button, type);
            }
        }, { passive: false });

        // Prevenir cliques múltiplos
        container.addEventListener('mousedown', (e) => {
            if (this.stateManager.getState('isProcessing')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }, { passive: false });

        // Suporte para touch
        container.addEventListener('touchstart', (e) => {
            if (this.stateManager.getState('isProcessing')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }, { passive: false });
    }

    /**
     * Manipula clique em botão
     */
    handleButtonClick(button, type) {
        const now = Date.now();

        // Debouncing - ignorar cliques muito rápidos
        if (now - this.lastClickTime < 200) {
            return;
        }
        this.lastClickTime = now;

        // Extrair opção do onclick
        const onclickAttr = button.getAttribute('onclick');
        const match = onclickAttr.match(/'([^']+)'/);

        if (!match) {
            console.warn('Could not extract option from onclick:', onclickAttr);
            return;
        }

        const option = match[1];

        // Processar seleção
        if (type === 'color') {
            this.colorController.handleSelection(option);
        } else if (type === 'carreta') {
            this.carretaController.handleSelection(option);
        }
    }

    /**
     * Inicializa valores padrão
     */
    initializeDefaults() {
        // Pequeno delay para garantir que o DOM esteja pronto
        setTimeout(() => {
            this.colorController.handleSelection('azul');
            this.carretaController.handleSelection('coca');
        }, 100);
    }

    /**
     * Método público para mudança de cor (compatibilidade)
     */
    changeProductImage(color) {
        return this.colorController.handleSelection(color);
    }

    /**
     * Método público para mudança de carreta (compatibilidade)
     */
    changeCarretaImage(carreta) {
        return this.carretaController.handleSelection(carreta);
    }
}

// Instância global
let productSelector = null;

// Funções globais para compatibilidade com HTML existente
function changeProductImage(color) {
    if (productSelector) {
        return productSelector.changeProductImage(color);
    }
    return false;
}

function changeCarretaImage(carreta) {
    if (productSelector) {
        return productSelector.changeCarretaImage(carreta);
    }
    return false;
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function () {
    productSelector = new ProductSelector();
});