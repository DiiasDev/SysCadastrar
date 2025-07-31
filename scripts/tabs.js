// Alterna entre as tabs da barra lateral
document.addEventListener('DOMContentLoaded', function () {
    const tabs = {
        'pecas': document.getElementById('tab-pecas'),
        'carros': document.getElementById('tab-carros'),
        'orcamentos': document.getElementById('tab-orcamentos')
    };

    document.body.addEventListener('click', function (e) {
        if (e.target.matches('.sidebar-link')) {
            e.preventDefault();
            Object.values(tabs).forEach(tab => tab.style.display = 'none');
            const tabId = 'tab-' + e.target.dataset.tab;
            if (tabs[e.target.dataset.tab]) {
                tabs[e.target.dataset.tab].style.display = '';
            }
        }
        // Abrir modais
        if (e.target.matches('[data-modal]')) {
            const modalId = 'modal-' + e.target.dataset.modal;
            document.getElementById(modalId).style.display = 'block';
        }
        // Fechar modais
        if (e.target.matches('.modal-close')) {
            e.target.closest('.modal').style.display = 'none';
        }
    });
});
