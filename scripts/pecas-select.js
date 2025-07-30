document.addEventListener('DOMContentLoaded', function () {
    function getPecasFromTable() {
        const rows = document.querySelectorAll('#tab-pecas .dataTable tbody tr');
        const pecas = [];
        rows.forEach(row => {
            const nome = row.children[1]?.textContent;
            if (nome) pecas.push(nome);
        });
        return pecas;
    }

    function popularSelect(select) {
        const pecas = getPecasFromTable();
        select.innerHTML = '';
        pecas.forEach(nome => {
            const opt = document.createElement('option');
            opt.value = nome;
            opt.textContent = nome;
            select.appendChild(opt);
        });
    }

    function addPecaRow() {
        const pecasList = document.getElementById('pecas-list');
        if (!pecasList) return;
        const row = document.createElement('div');
        row.className = 'peca-row';
        row.innerHTML = `
            <select class="selectMulti peca-select" style="width:40%"></select>
            <input type="number" class="peca-qtd" min="1" placeholder="Qtd." style="width:22%;margin-left:2%;" />
            <input type="text" class="peca-valor" placeholder="Valor" style="width:32%;margin-left:2%;background:#f0f4fa;" readonly />
            <button type="button" class="removePecaBtn" style="background:none;border:none;color:#c0392b;font-size:1.3rem;cursor:pointer;padding:0 6px;">&times;</button>
        `;
        pecasList.appendChild(row);
        popularSelect(row.querySelector('.peca-select'));
        row.querySelector('.removePecaBtn').onclick = () => row.remove();
        atualizarValorPecaRow(row);
        row.querySelector('.peca-select').addEventListener('change', function () {
            atualizarValorPecaRow(row);
        });
        row.querySelector('.peca-qtd').addEventListener('input', function () {
            atualizarValorPecaRow(row);
        });
    }

    function atualizarValorPecaRow(row) {
        const select = row.querySelector('.peca-select');
        const valorInput = row.querySelector('.peca-valor');
        const qtdInput = row.querySelector('.peca-qtd');
        const precos = getPrecoDasPecas();
        const nome = select?.value;
        const qtd = parseFloat(qtdInput?.value) || 0;
        if (nome && precos[nome]) {
            const total = precos[nome] * (qtd > 0 ? qtd : 1);
            valorInput.value = 'R$ ' + total.toFixed(2).replace('.', ',');
        } else {
            valorInput.value = '';
        }
    }

    function popularTodasPecaSelects() {
        document.querySelectorAll('.peca-select').forEach(popularSelect);
    }

    // Mock: retorna um objeto {nome: preco}
    function getPrecoDasPecas() {
        // Lê da tabela de peças na tela
        const rows = document.querySelectorAll('#tab-pecas .dataTable tbody tr');
        const precos = {};
        rows.forEach(row => {
            const nome = row.children[1]?.textContent;
            const preco = row.children[4]?.textContent?.replace(/[^\d,.-]/g, '').replace(',', '.');
            if (nome && preco) precos[nome] = parseFloat(preco);
        });
        return precos;
    }

    function calcularValorTotal() {
        const precos = getPrecoDasPecas();
        let totalPecas = 0;
        document.querySelectorAll('#pecas-list .peca-row').forEach(row => {
            const select = row.querySelector('.peca-select');
            const qtd = parseFloat(row.querySelector('.peca-qtd').value) || 0;
            const nome = select?.value;
            if (nome && precos[nome]) {
                totalPecas += precos[nome] * qtd;
            }
        });
        const valorServico = parseFloat(document.getElementById('valor-servico')?.value) || 0;
        const total = totalPecas + valorServico;
        const totalInput = document.getElementById('valor-total');
        if (totalInput) totalInput.value = total.toFixed(2);
    }

    // Atualiza selects e limpa linhas ao abrir modal de orçamentos
    document.querySelectorAll('.crudBtn[data-modal="orcamentos"]').forEach(btn => {
        btn.addEventListener('click', function () {
            // Remove linhas extras, deixa só uma
            const pecasList = document.getElementById('pecas-list');
            if (pecasList) {
                pecasList.innerHTML = '';
                addPecaRow();
            }
            setTimeout(calcularValorTotal, 100); // Garante que os selects estejam populados
        });
    });

    // Botão para adicionar mais linhas de peça
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('addPecaBtn')) {
            addPecaRow();
            setTimeout(calcularValorTotal, 100);
        }
    });

    // Recalcula ao mudar peças, quantidades ou valor do serviço
    document.addEventListener('input', function (e) {
        if (
            e.target.classList.contains('peca-select') ||
            e.target.classList.contains('peca-qtd') ||
            e.target.id === 'valor-servico'
        ) {
            calcularValorTotal();
        }
    });

    // Atualizar valor da peça ao trocar select em linhas já existentes
    document.addEventListener('change', function (e) {
        if (e.target.classList.contains('peca-select')) {
            const row = e.target.closest('.peca-row');
            if (row) atualizarValorPecaRow(row);
        }
    });
    document.addEventListener('input', function (e) {
        if (e.target.classList.contains('peca-qtd')) {
            const row = e.target.closest('.peca-row');
            if (row) atualizarValorPecaRow(row);
        }
    });
});
