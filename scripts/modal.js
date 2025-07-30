export function initModal() {
    // Debug: verifique se o HTML foi carregado
    console.log('initModal chamado');
    // Procura todos os botões que abrem o modal
    const openBtns = document.querySelectorAll('[data-open-modal]');
    const modal = document.querySelector('#modal-crud .modal');
    const closeBtn = modal ? modal.querySelector('.close-modal') : null;

    if (!modal) {
        console.warn('Modal não encontrado!');
        return;
    }
    if (openBtns.length === 0) {
        console.warn('Nenhum botão para abrir modal encontrado!');
    }

    // Esconde todos os formulários do modal
    function hideAllForms() {
        modal.querySelectorAll('.crud-form').forEach(form => {
            form.style.display = 'none';
        });
    }

    // Mostra o formulário correto baseado no botão clicado
    function showForm(modalType, action) {
        hideAllForms();
        if (action === 'add' || action === 'edit') {
            const formId = {
                pecas: 'form-pecas',
                carros: 'form-carros',
                orcamentos: 'form-orcamentos'
            }[modalType];
            if (formId) {
                const form = modal.querySelector(`#${formId}`);
                if (form) form.style.display = 'block';
            }
        } else if (action === 'delete') {
            const form = modal.querySelector('#form-delete');
            if (form) form.style.display = 'block';
        }
    }

    // Seleciona todos os botões de ação das tabelas
    document.querySelectorAll('[data-modal][data-action]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modalType = btn.getAttribute('data-modal');
            const action = btn.getAttribute('data-action');
            showForm(modalType, action);
            modal.style.display = 'block';
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            hideAllForms();
        });
    }
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            hideAllForms();
        }
    });

    // Orçamento: atualizar valor ao selecionar peça ou quantidade e mão de obra
    const pecaSelect = modal.querySelector('#peca-select');
    const pecaQtd = modal.querySelector('#peca-quantidade');
    const pecaValor = modal.querySelector('#peca-valor');
    const maoObraValor = modal.querySelector('#mao-obra-valor');
    const orcamentoTotal = modal.querySelector('#orcamento-total');

    function updatePecaValor() {
        if (!pecaSelect || !pecaQtd || !pecaValor) return;
        const selected = pecaSelect.options[pecaSelect.selectedIndex];
        const preco = parseFloat(selected.getAttribute('data-preco')) || 0;
        const qtd = parseInt(pecaQtd.value, 10) || 1;
        if (preco > 0 && qtd > 0) {
            const total = preco * qtd;
            pecaValor.value = 'R$ ' + total.toFixed(2).replace('.', ',');
        } else {
            pecaValor.value = '';
        }
        updateOrcamentoTotal();
    }

    function updateOrcamentoTotal() {
        if (!pecaSelect || !pecaQtd || !maoObraValor || !orcamentoTotal) return;
        const selected = pecaSelect.options[pecaSelect.selectedIndex];
        const preco = parseFloat(selected.getAttribute('data-preco')) || 0;
        const qtd = parseInt(pecaQtd.value, 10) || 1;
        const maoObra = parseFloat(maoObraValor.value) || 0;
        let total = 0;
        if (preco > 0 && qtd > 0) {
            total += preco * qtd;
        }
        total += maoObra;
        if (total > 0) {
            orcamentoTotal.value = 'R$ ' + total.toFixed(2).replace('.', ',');
        } else {
            orcamentoTotal.value = '';
        }
    }

    if (pecaSelect && pecaQtd) {
        pecaSelect.addEventListener('change', updatePecaValor);
        pecaQtd.addEventListener('input', updatePecaValor);
    }
    if (maoObraValor) {
        maoObraValor.addEventListener('input', updateOrcamentoTotal);
    }
}
