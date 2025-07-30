/**
 * StateManager - Gerencia o estado centralizado das seleções
 */
class StateManager {
    constructor() {
        this.state = {
            selectedColor: 'preto', 
            selectedBrinde: 'microondas', // Estado inicial deve ser 'microondas' como no HTML
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
                console.error('Erro no listener de estado:', error);
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
 * SelectionController - Controla a seleção de opções (cores ou brindes)
 */
class SelectionController {
    constructor(stateManager, type) {
        this.stateManager = stateManager;
        this.type = type; // 'color' ou 'brinde'
        this.stateKey = type === 'color' ? 'selectedColor' : 'selectedBrinde';
        this.containerSelector = type === 'color' ? '[data-id="571a5629"]' : '[data-id="571a5630"]';
    }

    /**
     * Manipula a seleção de uma opção
     */
    handleSelection(option) {
        // Validar entrada
        if (!this.validateSelection(option)) {
            console.warn(`Seleção de ${this.type} inválida:`, option);
            return false;
        }

        // Tentar adquirir lock
        if (!this.stateManager.acquireLock()) {
            console.log(`Seleção em andamento, ignorando seleção de ${this.type}:`, option);
            return false;
        }

        try {
            // Adicionar classe de processamento
            const container = document.querySelector(this.containerSelector);
            if (container) {
                const functionName = this.type === 'color' ? 'changeProductImage' : 'changeBrindeImage';
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
            console.error(`Erro ao manipular seleção de ${this.type}:`, error);
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
                console.warn(`Container não encontrado para ${this.type}:`, this.containerSelector);
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
            const functionName = this.type === 'color' ? 'changeProductImage' : 'changeBrindeImage';
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
                    
                    // Adicionar efeito de ripple
                    this.addRippleEffect(selectedButton);
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
            } else if (this.type === 'brinde') {
                const brindeImage = document.getElementById('brinde-preview-image');
                if (brindeImage) {
                    brindeImage.classList.add('image-loading');
                    setTimeout(() => {
                        brindeImage.classList.remove('image-loading');
                    }, 300);
                }
            }
        } catch (error) {
            console.error(`Erro ao atualizar estado visual para ${this.type}:`, error);
        }
    }
    
    /**
     * Adiciona efeito de ripple aos botões
     */
    addRippleEffect(button) {
        // Criar elemento de ripple
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        button.appendChild(ripple);
        
        // Aplicar posicionamento e animação
        ripple.style.width = ripple.style.height = Math.max(button.offsetWidth, button.offsetHeight) + 'px';
        ripple.style.left = '0px';
        ripple.style.top = '0px';
        
        // Remover após animação
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    /**
     * Valida se a seleção é válida
     */
    validateSelection(option) {
        if (!option || typeof option !== 'string') {
            return false;
        }

        const validOptions = this.type === 'color'
            ? ['preto'] // Apenas preto disponível para Air Fryer
            : ['microondas', 'liquidificador', 'mixer', 'sanduicheira', 'panela', 'cafeteira']; // Opções de brindes

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
            'preto': 'images/airfryer-principal.png'
        };

        this.brindeImages = {
            'microondas': 'https://imgs.casasbahia.com.br/55065338/1g.jpg',
            'liquidificador': 'https://cdn.leroymerlin.com.br/products/liquidificador_arno_power_max_15_velocidades_1000w__vermelho_1566705210_b609_600x600.jpg',
            'mixer': 'https://electrolux.vtexassets.com/arquivos/ids/210171/EIB10_MIXER_127V_Frente.jpg?v=638815549423900000',
            'sanduicheira': 'https://lojaskubbo.vteximg.com.br/arquivos/ids/163703-1000-1000/Grill-Sanduicheira-Mallory-ChefPro-900W-Black-Inox-Antiaderente-Com-Coletor-Gordura-.jpg?v=638494993872500000',
            'panela': 'https://t62533.vteximg.com.br/arquivos/ids/942876-1000-1000/PE42.jpg?v=638265785854000000',
            'cafeteira': 'https://m.media-amazon.com/images/I/71VX8mqGMbL._UF894,1000_QL80_.jpg'
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
            } else if (type === 'brinde') {
                this.updateBrindeImage(option);
            }
        } catch (error) {
            console.error(`Erro ao atualizar imagem ${type}:`, error);
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
            
            // Aplicar efeito de transição
            mainImage.style.opacity = "0.7";
            
            setTimeout(() => {
                mainImage.src = imageUrl;
                mainImage.srcset = '';
                mainImage.alt = 'Air Fryer ' + color.charAt(0).toUpperCase() + color.slice(1);
                
                // Restaurar opacidade após carregar
                mainImage.onload = () => {
                    mainImage.style.opacity = "1";
                };
            }, 150);
        }
    }

    /**
     * Atualiza imagem de pré-visualização do brinde
     */
    updateBrindeImage(brinde) {
        let brindeImage = document.getElementById('brinde-preview-image');
        const imageUrl = this.brindeImages[brinde];

        // Se a imagem não existir, criar o elemento
        if (!brindeImage) {
            // Encontrar o container do brinde
            const brindeContainer = document.querySelector('[data-id="7516f890"]');
            if (brindeContainer) {
                // Criar o elemento de imagem
                const imageContainer = document.createElement('div');
                imageContainer.className = 'elementor-widget-container';
                
                brindeImage = document.createElement('img');
                brindeImage.id = 'brinde-preview-image';
                brindeImage.className = 'attachment-medium size-medium brinde-image';
                brindeImage.alt = 'Brinde ' + brinde.charAt(0).toUpperCase() + brinde.slice(1);
                
                // Configurar para melhor qualidade no mobile
                brindeImage.setAttribute('decoding', 'async');
                brindeImage.setAttribute('loading', 'eager');
                brindeImage.style.imageRendering = 'auto';
                
                imageContainer.appendChild(brindeImage);
                brindeContainer.appendChild(imageContainer);
            }
        }

        if (brindeImage && imageUrl) {
            // Verificar se a imagem já está em um container
            let container = brindeImage.closest('.brinde-preview-container');

            // Se não estiver, criar o container
            if (!container) {
                container = document.createElement('div');
                container.className = 'brinde-preview-container';
                if (brindeImage.parentNode) {
                    brindeImage.parentNode.insertBefore(container, brindeImage);
                    container.appendChild(brindeImage);
                }
            }
            
            // Aplicar classe de loading
            brindeImage.classList.add('image-loading');
            brindeImage.classList.remove('image-loaded');
            
            // Preload com melhor qualidade
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.decoding = 'async';
            
            img.onload = () => {
                setTimeout(() => {
                    brindeImage.src = imageUrl;
                    brindeImage.alt = 'Brinde ' + brinde.charAt(0).toUpperCase() + brinde.slice(1);
                    
                    // Configurar srcset para diferentes resoluções mobile
                    brindeImage.srcset = `${imageUrl} 1x, ${imageUrl} 2x`;
                    brindeImage.sizes = '(max-width: 480px) 240px, (max-width: 768px) 280px, 300px';
                    
                    // Remover atributos de tamanho fixo
                    brindeImage.removeAttribute('width');
                    brindeImage.removeAttribute('height');
                    
                    // Aplicar classes para transição suave
                    brindeImage.classList.remove('image-loading');
                    brindeImage.classList.add('image-loaded');
                }, 150);
            };
            
            img.onerror = () => {
                console.warn('Erro ao carregar imagem do brinde:', imageUrl);
                brindeImage.classList.remove('image-loading');
                brindeImage.classList.add('image-loaded');
                // Fallback para imagem anterior
            };
            
            img.src = imageUrl;
        }
    }

    /**
     * Pré-carrega imagens para melhor performance
     */
    preloadImages() {
        const allImages = [...Object.values(this.productImages), ...Object.values(this.brindeImages)];

        allImages.forEach(url => {
            if (!this.imageCache.has(url)) {
                const img = new Image();
                img.onload = () => this.imageCache.set(url, true);
                img.onerror = () => console.warn('Falha ao pré-carregar imagem:', url);
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
        this.brindeController = new SelectionController(this.stateManager, 'brinde');
        this.imageManager = new ImageManager(this.stateManager);

        this.debounceTimeout = null;
        this.lastClickTime = 0;

        // Definir os estados iniciais
        this.stateManager.updateState('selectedColor', 'preto');
        this.stateManager.updateState('selectedBrinde', 'microondas');

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
            } else if (key === 'selectedBrinde') {
                this.imageManager.updateImage('brinde', value);
            }
        });
        
        // Adicionar estilo para efeito de ripple
        this.addRippleStyle();
    }
    
    /**
     * Adiciona estilo CSS para o efeito de ripple
     */
    addRippleStyle() {
        const style = document.createElement('style');
        style.textContent = `
            .ripple-effect {
                position: absolute;
                border-radius: 50%;
                background-color: rgba(255, 71, 87, 0.2);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
            
            .elementor-widget-button a {
                position: relative;
                overflow: hidden;
            }
        `;
        document.head.appendChild(style);
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

        // Event delegation para brindes
        const brindeContainer = document.querySelector('[data-id="571a5630"]');
        if (brindeContainer) {
            this.setupContainerListeners(brindeContainer, 'brinde');
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
            console.warn('Não foi possível extrair a opção do onclick:', onclickAttr);
            return;
        }

        const option = match[1];

        // Processar seleção
        if (type === 'color') {
            this.colorController.handleSelection(option);
        } else if (type === 'brinde') {
            this.brindeController.handleSelection(option);
        }
    }

    /**
     * Inicializa valores padrão
     */
    initializeDefaults() {
        // Pequeno delay para garantir que o DOM esteja pronto
        setTimeout(() => {
            // Selecionar preto como cor padrão (única cor disponível)
            this.colorController.handleSelection('preto');
            
            // Selecionar microondas como brinde padrão
            this.brindeController.handleSelection('microondas');
            
            // Adicionar classes para indicar visualmente as seleções iniciais
            const colorContainer = document.querySelector('[data-id="571a5629"]');
            if (colorContainer) {
                const pretoButton = colorContainer.querySelector('[onclick*="changeProductImage(\'preto\')"]');
                if (pretoButton) {
                    const buttonWrapper = pretoButton.closest('.elementor-widget-button');
                    if (buttonWrapper) {
                        // Remover de todos primeiro
                        const allButtons = colorContainer.querySelectorAll('.elementor-widget-button');
                        allButtons.forEach(btn => btn.classList.remove('elementor-widget-active'));
                        // Adicionar ao botão preto
                        buttonWrapper.classList.add('elementor-widget-active');
                    }
                }
            }
            
            const brindeContainer = document.querySelector('[data-id="571a5630"]');
            if (brindeContainer) {
                const microondasButton = brindeContainer.querySelector('[onclick*="changeBrindeImage(\'microondas\')"]');
                if (microondasButton) {
                    const buttonWrapper = microondasButton.closest('.elementor-widget-button');
                    if (buttonWrapper) {
                        // Remover de todos primeiro
                        const allButtons = brindeContainer.querySelectorAll('.elementor-widget-button');
                        allButtons.forEach(btn => btn.classList.remove('elementor-widget-active'));
                        // Adicionar ao botão microondas
                        buttonWrapper.classList.add('elementor-widget-active');
                    }
                }
            }
        }, 100);
    }

    /**
     * Método público para mudança de cor (compatibilidade)
     */
    changeProductImage(color) {
        return this.colorController.handleSelection(color);
    }

    /**
     * Método público para mudança de brinde (compatibilidade)
     */
    changeBrindeImage(brinde) {
        return this.brindeController.handleSelection(brinde);
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

function changeBrindeImage(brinde) {
    if (productSelector) {
        return productSelector.changeBrindeImage(brinde);
    }
    return false;
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function () {
    productSelector = new ProductSelector();
});