import moment from 'https://cdn.skypack.dev/moment';

export default class Orcamentos {
    constructor() {
        this.pecasData = [];
        this.initializeWhenReady();
    }

    async initializeWhenReady() {
        // Wait for DOM elements to be available
        const maxRetries = 10;
        let retries = 0;
        
        const checkElements = () => {
            const form = document.getElementById("formCadastroOrcamento");
            const clienteSelect = document.getElementById("clienteOrcamento");
            const carroSelect = document.getElementById("carroOrcamento");
            const pecasContainer = document.getElementById("pecasContainer");
            
            return form && clienteSelect && carroSelect && pecasContainer;
        };

        while (!checkElements() && retries < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 200));
            retries++;
        }

        if (checkElements()) {
            await this.populateSelects();
            this.createOrcamentos();
        } else {
            console.error("Elementos do formulário não encontrados após várias tentativas");
        }
    }

    async populateSelects() {
        try {
            await this.populateClientes();
            await this.populateCarros();
            await this.populatePecas();
            this.updateRemoveButtons();
        } catch (error) {
            console.error("Erro ao popular selects:", error);
        }
    }

    async populateClientes() {
        try {
            const response = await fetch("http://127.0.0.1:3000/clients", {
                method: "GET",
                headers: { 'content-type': 'application/json' }
            });
            const data = await response.json();
            const clientsArray = Array.isArray(data.clients) ? data.clients : [];
            
            const select = document.getElementById("clienteOrcamento");
            if (select) {
                select.innerHTML = '<option value="">Selecione um cliente</option>';
                clientsArray.forEach(client => {
                    const option = document.createElement("option");
                    option.value = client.id;
                    option.textContent = client.nome;
                    select.appendChild(option);
                });
            }
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
        }
    }

    async populateCarros() {
        try {
            const response = await fetch("http://127.0.0.1:3000/get-cars", {
                method: "GET",
                headers: { 'content-type': 'application/json' }
            });
            const data = await response.json();
            const carsArray = Array.isArray(data.carros) ? data.carros : [];
            
            const select = document.getElementById("carroOrcamento");
            if (select) {
                select.innerHTML = '<option value="">Selecione um carro</option>';
                carsArray.forEach(carro => {
                    const option = document.createElement("option");
                    option.value = carro.id;
                    option.textContent = `${carro.modelo} - ${carro.placa}`;
                    select.appendChild(option);
                });
            }
        } catch (error) {
            console.error("Erro ao buscar carros:", error);
        }
    }

    async populatePecas() {
        try {
            const response = await fetch("http://127.0.0.1:3000/get-pecas", {
                method: "GET",
                headers: { 'content-type': 'application/json' }
            });
            const data = await response.json();
            this.pecasData = Array.isArray(data.pecas) ? data.pecas : [];
            
            this.updatePecasSelects();
        } catch (error) {
            console.error("Erro ao buscar peças:", error);
        }
    }

    updatePecasSelects() {
        const selects = document.querySelectorAll('select[name="pecaOrcamento[]"]');
        selects.forEach(select => {
            select.innerHTML = '<option value="">Selecione uma peça</option>';
            this.pecasData.forEach(peca => {
                const option = document.createElement("option");
                option.value = peca.id;
                option.textContent = peca.nome;
                select.appendChild(option);
            });
        });
    }

    setupPecasFunctions() {
        // Make functions globally available
        window.adicionarPeca = () => {
            const container = document.getElementById('pecasContainer');
            const pecaItem = document.createElement('div');
            pecaItem.className = 'peca-item';
            pecaItem.innerHTML = `
                <select name="pecaOrcamento[]" required>
                    <option value="">Selecione uma peça</option>
                </select>
                <input type="number" name="quantidadePeca[]" placeholder="Qtd" min="1" value="1" required>
                <button type="button" class="btn-remove-peca" onclick="removePeca(this)">Remover</button>
            `;
            container.appendChild(pecaItem);
            this.updatePecasSelects();
            this.updateRemoveButtons();
        };

        window.removePeca = (button) => {
            const pecaItem = button.closest('.peca-item');
            pecaItem.remove();
            this.updateRemoveButtons();
        };
    }

    updateRemoveButtons() {
        const pecaItems = document.querySelectorAll('.peca-item');
        pecaItems.forEach((item, index) => {
            const removeBtn = item.querySelector('.btn-remove-peca');
            removeBtn.style.display = pecaItems.length > 1 ? 'inline-block' : 'none';
        });
    }

    async createOrcamentos() {
        try {
            this.setupPecasFunctions();
            const form = document.getElementById("formCadastroOrcamento");
            
            if (!form) {
                console.error("Formulário não encontrado");
                return;
            }
            
            if (form.dataset.listenerAdded) {
                return; // Já tem listener
            }

            form.addEventListener("submit", async (event) => {
                event.preventDefault();
                
                try {
                    const clienteId = document.getElementById("clienteOrcamento")?.value;
                    const carroId = document.getElementById("carroOrcamento")?.value;
                    const servicos = document.getElementById("servicoOrcamento")?.value;
                    const valor = document.getElementById("valorOrcamento")?.value;
                    const data = document.getElementById("dataOrcamento")?.value;

                    // Validation
                    if (!clienteId || !carroId || !servicos || !valor || !data) {
                        alert("Por favor, preencha todos os campos obrigatórios");
                        return;
                    }

                    // Collect all pieces and quantities
                    const pecasSelects = document.querySelectorAll('select[name="pecaOrcamento[]"]');
                    const quantidadeInputs = document.querySelectorAll('input[name="quantidadePeca[]"]');
                    const pecas = [];

                    pecasSelects.forEach((select, index) => {
                        if (select.value && quantidadeInputs[index]?.value) {
                            pecas.push({
                                peca_id: parseInt(select.value),
                                quantidade: parseInt(quantidadeInputs[index].value)
                            });
                        }
                    });

                    // Convert date format from YYYY-MM-DD to DD/MM/YYYY for backend
                    const dataFormatted = data.split('-').reverse().join('/');

                    const orcamento = {
                        cliente_id: parseInt(clienteId),
                        carro_id: parseInt(carroId),
                        pecas: pecas,
                        servicos: servicos,
                        valor: parseFloat(valor),
                        data_orcamento: dataFormatted
                    };

                    console.log("Enviando orçamento:", orcamento);

                    const response = await fetch("http://127.0.0.1:3000/create-orcamento", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(orcamento)
                    });

                    const result = await response.json();
                    console.log("Resposta do servidor:", result);

                    if (response.ok && result.status === "sucess") {
                        alert("Orçamento cadastrado com sucesso!");
                        
                        // Clear form
                        form.reset();
                        
                        // Reset pieces container to single item
                        const pecasContainer = document.getElementById('pecasContainer');
                        if (pecasContainer) {
                            pecasContainer.innerHTML = `
                                <div class="peca-item">
                                    <select name="pecaOrcamento[]" required>
                                        <option value="">Selecione uma peça</option>
                                    </select>
                                    <input type="number" name="quantidadePeca[]" placeholder="Qtd" min="1" value="1" required>
                                    <button type="button" class="btn-remove-peca" onclick="removePeca(this)" style="display:none;">Remover</button>
                                </div>
                            `;
                        }
                        
                        // Repopulate selects
                        await this.populateSelects();
                        
                        // Close modal
                        const modal = document.getElementById('modalCadastroOrcamento');
                        if (modal) {
                            modal.style.display = 'none';
                        }
                        
                        // Refresh the orcamentos table
                        await this.getOrcamentos();
                        
                    } else {
                        console.error("Erro na resposta:", result);
                        alert("Erro ao cadastrar orçamento: " + (result.message || "Erro desconhecido"));
                    }
                } catch (error) {
                    console.error("Erro na requisição:", error);
                    alert("Erro ao conectar com o servidor: " + error.message);
                }
            });
            
            form.dataset.listenerAdded = "true";
        } catch (error) {
            console.error("Erro ao configurar formulário:", error);
        }
    }

    async getOrcamentos() {
        try {
            const response = await fetch("http://127.0.0.1:3000/orcamentos", {
                method: "GET",
                headers: { 'content-type': 'application/json' },
            })

            const { orcamentos } = await response.json();
            console.log("Orçamentos recebidos: ", orcamentos)

            const table = document.querySelector("#tabelaOrcamentos tbody");

            if (!table) {
                console.error("Tabela de orçamentos não encontrada");
                return;
            }

            table.innerHTML = ""

            orcamentos.forEach((orcamento) => {
                const row = document.createElement("tr");

                // Format pieces display
                const pecasDisplay = orcamento.pecas && orcamento.pecas.length > 0 
                    ? orcamento.pecas.map(p => `${p.nome} (${p.quantidade})`).join(', ')
                    : 'Nenhuma';

                // Format value as currency
                const valorFormatado = Number(orcamento.valor).toLocaleString('pt-BR', { 
                    style: 'currency', 
                    currency: 'BRL' 
                });

                row.innerHTML = `
                <td>${orcamento.id}</td>
                <td>${orcamento.cliente_nome}</td>
                <td>${orcamento.carro_modelo}</td>
                <td>${orcamento.carro_placa}</td>
                <td>${pecasDisplay}</td>
                <td>${orcamento.servicos}</td>
                <td>${valorFormatado}</td>
                <td>${moment(orcamento.data_orcamento).format('DD/MM/YYYY')}</td>
                <td>
                 <button class="btn-icon btn-delete btnApagarOrcamento" title="Apagar" data-id="${orcamento.id}">
                            🗑️
                        </button>
                </td>
                `

                table.appendChild(row)
            })

            this.deleteOrcamentos()

        } catch (error) {
            console.error("erro ao trazer dados de orçamento: ", error)
        }
    }

    async deleteOrcamentos() {
        try {
            const btnDelete = document.querySelectorAll(".btnApagarOrcamento"); 

            btnDelete.forEach((botao) => {
                botao.addEventListener("click", async (event) => {

                    const row = event.target.closest("tr"); 

                    const rowId = botao.getAttribute("data-id") 

                    const response = await fetch(`http://127.0.0.1:3000/delete-orcamento/${rowId}`, {method: "DELETE"})

                    row.remove()
                    
                })
            })

        } catch (error) {
            console.error("Erro ao deletar orçamentos:", error)
        }
    }
}