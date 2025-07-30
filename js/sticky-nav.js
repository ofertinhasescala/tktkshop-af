// Script para a barra de navegação fixa
document.addEventListener('DOMContentLoaded', function() {
    // Adiciona classe quando há scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 10) {
            document.documentElement.classList.add('has-scroll');
        } else {
            document.documentElement.classList.remove('has-scroll');
        }
    });

    // Garantir que a barra inferior fique sempre visível
    var barraInferior = document.querySelector('.barra-fixa-inferior');
    if (barraInferior) {
        // Garante que a barra tenha o estilo fixo
        barraInferior.style.position = 'fixed';
        barraInferior.style.bottom = '0';
        barraInferior.style.left = '0';
        barraInferior.style.right = '0';
        barraInferior.style.zIndex = '9999';
    }
}); 