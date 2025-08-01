export default class pecas {
    constructor() {
        this.createPecas();
    }
    createPecas() {
        const form = document.getElementById("formAdicionarPeca");
        if (form && !form.dataset.listenerAdded) {
            form.addEventListener("submit", async (event) => {
                event.preventDefault();
                const nome = document.getElementById("nome").value;
                const categoria = document.getElementById("categoria").value;
                const estoque = document.getElementById("estoque").value;
                const preco = document.getElementById("preco").value;

                const peca = {
                    nome: nome,
                    categoria: categoria,
                    estoque: estoque,
                    preco: preco
                };

                try {
                    const response = await fetch("http://127.0.0.1:3000/create-pecas", {
                        method: "POST",
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify(peca)
                    });

                    if (!response.ok) {
                        console.log("Erro ao cadastrar peça");
                        return;
                    }

                    const data = await response.json();
                    console.log("Peças Criadas: ", data);

                    // Atualiza a tabela em tempo real
                    await this.getPecas();

                } catch (e) {
                    console.log("Erro ao cadastrar peça", e);
                }
            });
            form.dataset.listenerAdded = "true";
        }
    }

    async getPecas(){
        try{
            console.log("Buscando peças...")

            const response = await fetch("http://127.0.0.1:3000/get-pecas",{
                method: "GET",
                headers: {'content-type': 'application/json'},
            })

            if(!response){
                console.log("Erro ao receber resposta...")
            }

            const data = await response.json()
            console.log("Dados recebidos: ", data)

            const pecasArray = Array.isArray(data.pecas) ? data.pecas : data.pecas;

            const table = document.querySelector("#tabelaPecas tbody");

            if(!table){
                console.log("Tabela ainda não existe")
                return; // Corrigido: retorna se a tabela não existe
            }

            table.innerHTML = "";

            pecasArray.forEach(peca => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${peca.id || ''}</td>
                    <td>${peca.nome}</td>
                    <td>${peca.categoria}</td>
                    <td>${Number(peca.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                    <td>
                        <button class="btn-icon btn-delete" title="Apagar" data-id="${peca.id}">
                            🗑️
                        </button>
                    </td>
                    <td>
                        <button class="btn-icon btn-edit" title="Editar" data-id="${peca.id}">
                            ✏️
                        </button>
                    </td>
                `;
                table.appendChild(row)
            })


        } catch(error){
            console.log("Erro ao buscar peças...", error)
        }
    }
}