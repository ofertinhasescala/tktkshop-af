/**
 * StateManager - Gerencia estado centralizado
 */
class StateManager {
    constructor() {
        this.state = {
            selectedColor: 'preto',
            selectedBrinde: 'microondas',
            isProcessing: false,
            lockTimeout: null,
            lastUpdate: Date.now()
        };
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.state.lastUpdate = Date.now();
    }

    getState() {
        return { ...this.state };
    }

    lock() {
        this.setState({ isProcessing: true });
        if (this.state.lockTimeout) {
            clearTimeout(this.state.lockTimeout);
        }
        this.state.lockTimeout = setTimeout(() => {
            this.setState({ isProcessing: false });
        }, 2000);
    }

    unlock() {
        this.setState({ isProcessing: false });
        if (this.state.lockTimeout) {
            clearTimeout(this.state.lockTimeout);
            this.state.lockTimeout = null;
        }
    }
}

/**
 * SelectionController - Controla seleções de cor e brinde
 */
class SelectionController {
    constructor(type, stateManager, imageManager) {
        this.type = type; // 'color' ou 'brinde'
        this.stateManager = stateManager;
        this.imageManager = imageManager;
        this.setupEventListeners();
    }

    /**
     * Configura event listeners para o tipo específico
     */
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const button = e.target.closest('.elementor-button');
            if (!button) return;

            const attribute = this.type === 'color' ? 'data-color' : 'data-brinde';
            const value = button.getAttribute(attribute);
            
            if (value) {
                e.preventDefault();
                this.handleSelection(value);
            }
        });
    }

    /**
     * Processa a seleção do usuário
     */
    handleSelection(option) {
        const state = this.stateManager.getState();
        
        // Debouncing: evitar cliques múltiplos rápidos
        if (state.isProcessing) {
            console.log('⏳ Processamento em andamento, aguarde...');
            return false;
        }

        // Validar opção
        if (!this.validateSelection(option)) {
            console.warn(`❌ Opção inválida para ${this.type}:`, option);
            return false;
        }

        console.log(`🎯 Selecionando ${this.type}:`, option);
        
        // Bloquear processamento
        this.stateManager.lock();

        try {
            // Atualizar estado
            const stateKey = this.type === 'color' ? 'selectedColor' : 'selectedBrinde';
            this.stateManager.setState({ [stateKey]: option });

            // Atualizar interface visual
            this.updateVisualState(option);

            // Atualizar imagem
            this.imageManager.updateImage(this.type, option);

            console.log(`✅ ${this.type} atualizado para:`, option);
            
            // Desbloquear após processamento
            setTimeout(() => {
                this.stateManager.unlock();
            }, 300);

            return true;
        } catch (error) {
            console.error(`❌ Erro ao processar ${this.type}:`, error);
            this.stateManager.unlock();
            return false;
        }
    }

    /**
     * Atualiza estado visual dos botões
     */
    updateVisualState(selectedOption) {
        try {
            // Selecionar container correto baseado no tipo
            let containerSelector;
            let attributeName;
            
            if (this.type === 'color') {
                containerSelector = '[data-id="571a5629"]';
                attributeName = 'data-color';
            } else if (this.type === 'brinde') {
                containerSelector = '[data-id="571a5630"]';
                attributeName = 'data-brinde';
            }

            const container = document.querySelector(containerSelector);
            if (!container) {
                console.warn(`Container não encontrado para ${this.type}:`, containerSelector);
                return;
            }

            // Remover classe ativa de todos os botões
            const allButtons = container.querySelectorAll('.elementor-widget-button');
            allButtons.forEach(btn => {
                btn.classList.remove('elementor-widget-active');
                const button = btn.querySelector('.elementor-button');
                if (button) {
                    button.classList.remove('active');
                }
            });

            // Adicionar classe ativa ao botão selecionado
            const selectedButton = container.querySelector(`[${attributeName}="${selectedOption}"]`);
            if (selectedButton) {
                const buttonWrapper = selectedButton.closest('.elementor-widget-button');
                if (buttonWrapper) {
                    buttonWrapper.classList.add('elementor-widget-active');
                    selectedButton.classList.add('active');
                    
                    // Efeito visual suave
                    buttonWrapper.style.transform = 'scale(1.02)';
                    setTimeout(() => {
                        buttonWrapper.style.transform = '';
                    }, 200);
                }
            }
        } catch (error) {
            console.error('Erro ao atualizar estado visual:', error);
        }
    }

    /**
     * Valida se a opção é válida
     */
    validateSelection(option) {
        let validOptions;
        
        if (this.type === 'color') {
            validOptions = ['preto']; // Apenas preto disponível
        } else {
            validOptions = ['microondas', 'liquidificador', 'mixer', 'sanduicheira', 'panela', 'cafeteira']; // Opções de brindes
        }

        return validOptions.includes(option);
    }
}

/**
 * ImageManager - Gerencia atualizações de imagens com alta qualidade
 */
class ImageManager {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.imageCache = new Map();

        // URLs das imagens - versões em alta qualidade
        this.productImages = {
            'preto': 'images/airfryer-principal.png'
        };

        this.brindeImages = {
            'microondas': 'https://imgs.casasbahia.com.br/55065338/1xg.jpg',
            'liquidificador': 'https://electrolux.vtexassets.com/arquivos/ids/217776-800-600/Liquidificador-Electrolux-Masterblender-LBR08-1000W-3-Velocidades-2L-Preto-e-Inox_detalhe1.jpg',
            'mixer': 'https://electrolux.vtexassets.com/arquivos/ids/210171/EIB10_MIXER_127V_Frente.jpg',
            'sanduicheira': 'https://a-static.mlcdn.com.br/800x560/grill-sanduicheira-mallory-asteria-antiaderente-chapas-removiveis-inox-coletor-de-gordura/magazineluiza/234723500/de80fd2eedb36d7cbfb1b3b7b6bb5e81.jpg',
            'panela': 'https://electrolux.vtexassets.com/arquivos/ids/216756-800-600/PRC11-Panela-de-Arroz-Electrolux-Cooking-1L-5-Xicara-Antiaderente-Preta_principal.jpg',
            'cafeteira': 'https://m.media-amazon.com/images/I/61JO-0ZMuoL._AC_SL1000_.jpg'
        };

        // Precarregar imagens críticas
        this.preloadCriticalImages();
    }

    /**
     * Precarrega imagens críticas para melhor performance
     */
    preloadCriticalImages() {
        // Precarregar imagem padrão
        this.preloadImage(this.brindeImages['microondas']);
        
        // Precarregar outras imagens com delay
        setTimeout(() => {
            Object.values(this.brindeImages).forEach(url => {
                this.preloadImage(url);
            });
        }, 1000);
    }

    /**
     * Precarrega uma imagem específica
     */
    preloadImage(url) {
        if (this.imageCache.has(url)) return;
        
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            this.imageCache.set(url, img);
        };
        img.onerror = () => {
            console.warn('Falha ao precarregar imagem:', url);
        };
        img.src = url;
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
            console.error('Erro ao atualizar imagem:', error);
        }
    }

    /**
     * Atualiza imagem principal do produto
     */
    updateProductImage(color) {
        const mainImage = document.getElementById('main-product-image');
        const imageUrl = this.productImages[color];

        if (mainImage && imageUrl) {
            // Aplicar loading
            mainImage.classList.add('image-loading');
            
            setTimeout(() => {
                mainImage.src = imageUrl;
                mainImage.alt = 'Air Fryer ' + color.charAt(0).toUpperCase() + color.slice(1);
                mainImage.classList.remove('image-loading');
                mainImage.classList.add('image-loaded');
            }, 150);
        }
    }

    /**
     * Atualiza imagem de pré-visualização do brinde com máxima qualidade
     */
    updateBrindeImage(brinde) {
        let brindeImage = document.getElementById('brinde-preview-image');
        const imageUrl = this.brindeImages[brinde];

        if (!imageUrl) {
            console.error('URL da imagem não encontrada para brinde:', brinde);
            return;
        }

        // Se a imagem não existir, criar o elemento
        if (!brindeImage) {
            brindeImage = this.createBrindeImageElement(brinde);
        }

        if (brindeImage) {
            console.log(`🖼️ Atualizando imagem do brinde: ${brinde}`);
            
            // Aplicar classe de loading imediatamente
            brindeImage.classList.add('image-loading');
            brindeImage.classList.remove('image-loaded');

            // Usar imagem do cache se disponível
            const cachedImage = this.imageCache.get(imageUrl);
            
            if (cachedImage) {
                // Usar imagem do cache
                this.applyImageWithTransition(brindeImage, imageUrl, brinde);
            } else {
                // Carregar imagem nova com máxima qualidade
                this.loadHighQualityImage(brindeImage, imageUrl, brinde);
            }
        }
    }

    /**
     * Cria elemento de imagem do brinde se não existir
     */
    createBrindeImageElement(brinde) {
        const brindeContainer = document.querySelector('[data-id="7516f890"]') || 
                              document.querySelector('.preview-container') ||
                              document.querySelector('.brinde-preview');
        
        if (brindeContainer) {
            const brindeImage = document.createElement('img');
            brindeImage.id = 'brinde-preview-image';
            brindeImage.className = 'attachment-medium size-medium brinde-image';
            brindeImage.alt = 'Brinde ' + brinde.charAt(0).toUpperCase() + brinde.slice(1);
            
            // Configurações para máxima qualidade
            brindeImage.setAttribute('decoding', 'async');
            brindeImage.setAttribute('loading', 'eager');
            brindeImage.style.imageRendering = 'auto';
            
            brindeContainer.appendChild(brindeImage);
            return brindeImage;
        }
        
        return null;
    }

    /**
     * Carrega imagem com alta qualidade
     */
    loadHighQualityImage(brindeImage, imageUrl, brinde) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.decoding = 'async';
        
        img.onload = () => {
            // Cachear a imagem
            this.imageCache.set(imageUrl, img);
            
            // Aplicar com transição
            this.applyImageWithTransition(brindeImage, imageUrl, brinde);
        };
        
        img.onerror = () => {
            console.warn('Erro ao carregar imagem do brinde:', imageUrl);
            brindeImage.classList.remove('image-loading');
            
            // Tentar URL alternativa se disponível
            this.tryAlternativeImage(brindeImage, brinde);
        };
        
        img.src = imageUrl;
    }

    /**
     * Aplica imagem com transição suave
     */
    applyImageWithTransition(brindeImage, imageUrl, brinde) {
        setTimeout(() => {
            // Configurar atributos para máxima qualidade
            brindeImage.src = imageUrl;
            brindeImage.alt = 'Brinde ' + brinde.charAt(0).toUpperCase() + brinde.slice(1);
            
            // Configurar srcset para diferentes resoluções
            brindeImage.srcset = `${imageUrl} 1x`;
            brindeImage.sizes = '(max-width: 480px) 280px, (max-width: 768px) 320px, 400px';
            
            // Remover atributos de tamanho fixo que causam embaçamento
            brindeImage.removeAttribute('width');
            brindeImage.removeAttribute('height');
            
            // Configurações para evitar blur
            brindeImage.style.maxWidth = '100%';
            brindeImage.style.height = 'auto';
            brindeImage.style.imageRendering = 'auto';
            brindeImage.style.backfaceVisibility = 'hidden';
            brindeImage.style.transform = 'translateZ(0)';
            
            // Aplicar classes para transição
            brindeImage.classList.remove('image-loading');
            brindeImage.classList.add('image-loaded');
            
            console.log(`✅ Imagem do brinde ${brinde} carregada com sucesso`);
        }, 200);
    }

    /**
     * Tenta URL alternativa em caso de erro
     */
    tryAlternativeImage(brindeImage, brinde) {
        // URLs alternativas de backup
        const backupImages = {
            'microondas': 'https://a-static.mlcdn.com.br/800x560/micro-ondas-electrolux-meo41-34-litros-branco/magazineluiza/233411600/48b16e5c7e4e7a1e74b9e6c55de7aa75.jpg',
            'liquidificador': 'https://a-static.mlcdn.com.br/800x560/liquidificador-arno-power-max-15-velocidades-1000w-ln50/magazineluiza/235008300/da1e7c5e3e02ec5a7ff4fd4c65f2c2ae.jpg',
            'mixer': 'https://a-static.mlcdn.com.br/800x560/mixer-electrolux-turbo-mix-eib10-127v-preto/magazineluiza/236729100/d3c0d5d9c5f8c8a8e3a5c1c2b8d5e9f2.jpg',
            'sanduicheira': 'https://a-static.mlcdn.com.br/800x560/sanduicheira-grill-mallory-asteria/magazineluiza/234723500/de80fd2eedb36d7cbfb1b3b7b6bb5e81.jpg',
            'panela': 'https://a-static.mlcdn.com.br/800x560/panela-de-arroz-electrolux-cooking-prc11/magazineluiza/236523700/4e7d7e9c5a2a7c8e5d3b9f2e1a6c8d4e.jpg',
            'cafeteira': 'https://a-static.mlcdn.com.br/800x560/cafeteira-eletrica-mondial-dolce-arome-c30-30-xicaras/magazineluiza/237891200/5a8e9c2d7f1b6e3a8c4d9f1e2b5c7d8e.jpg'
        };

        const backupUrl = backupImages[brinde];
        if (backupUrl) {
            console.log(`🔄 Tentando URL alternativa para ${brinde}`);
            this.loadHighQualityImage(brindeImage, backupUrl, brinde);
        }
    }
}

/**
 * ProductSelector - Classe principal que coordena todo o sistema
 */
class ProductSelector {
    constructor() {
        this.stateManager = new StateManager();
        this.imageManager = new ImageManager(this.stateManager);
        
        // Controladores para diferentes tipos de seleção
        this.colorController = new SelectionController('color', this.stateManager, this.imageManager);
        this.brindeController = new SelectionController('brinde', this.stateManager, this.imageManager);
        
        // Configurar sistema
        this.setupSystem();
    }

    /**
     * Configura o sistema inicial
     */
    setupSystem() {
        this.setupPurchaseButton();
        this.initializeDefaults();
        
        // Debug info
        console.log('🚀 ProductSelector iniciado com sucesso');
        console.log('📊 Estado inicial:', this.stateManager.getState());
    }

    /**
     * Configura o botão de compra e tracking
     */
    setupPurchaseButton() {
        const buyButton = document.querySelector('.buy-now-button');
        if (buyButton) {
            buyButton.addEventListener('click', () => {
                const state = this.stateManager.getState();
                console.log('🛒 Compra iniciada:', state);
                
                // TikTok Pixel tracking
                if (typeof ttq !== 'undefined') {
                    try {
                        ttq.track('InitiateCheckout', {
                            content_type: 'product',
                            content_id: '690245447931',
                            value: 87.14,
                            currency: 'BRL'
                        });
                        console.log('✓ Evento TikTok Pixel enviado');
                    } catch (error) {
                        console.warn('Erro ao enviar evento TikTok:', error);
                    }
                }
            });
        }
    }

    /**
     * Inicializa valores padrão
     */
    initializeDefaults() {
        setTimeout(() => {
            // Selecionar preto como cor padrão (única cor disponível)
            this.colorController.handleSelection('preto');
            
            // Selecionar microondas como brinde padrão
            this.brindeController.handleSelection('microondas');
            
            console.log('✅ Valores padrão inicializados');
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
        console.log(`🎁 Chamada para changeBrindeImage: ${brinde}`);
        return this.brindeController.handleSelection(brinde);
    }
}

// Instância global
let productSelector = null;

// Funções globais para compatibilidade com HTML existente
function changeProductImage(color) {
    console.log(`🎨 changeProductImage chamado: ${color}`);
    if (productSelector) {
        return productSelector.changeProductImage(color);
    }
    console.warn('ProductSelector não inicializado');
    return false;
}

function changeBrindeImage(brinde) {
    console.log(`🎁 changeBrindeImage chamado: ${brinde}`);
    if (productSelector) {
        return productSelector.changeBrindeImage(brinde);
    }
    console.warn('ProductSelector não inicializado');
    return false;
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function () {
    console.log('📄 DOM carregado, inicializando ProductSelector...');
    productSelector = new ProductSelector();
});