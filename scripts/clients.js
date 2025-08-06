export default class Clients {
    constructor() {
        this.createClients();
        this.getClients();
    }

    async createClients() {
        try {
            const form = document.getElementById("formAdicionarClient");
            form.addEventListener("submit", async (event) => {
                event.preventDefault();

                const nome = document.getElementById("nomeClient").value;
                const telefone = document.getElementById("telefone").value;
                const email = document.getElementById("email").value;

                const client = {
                    nome: nome,
                    telefone: telefone,
                    email: email
                }

                const response = await fetch("http://127.0.0.1:3000/create-clients", {
                    method: "POST",
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(client)
                })

                if (!response) {
                    console.error("Erro ao receber resposta")
                }

                const data = await response.json();

                await this.getClients();
            })
        } catch (error) {
            console.error("erro ao cadastrar clientes", error)
        }

    }

    async getClients() {
        try {
            console.log("Buscando clientes...")

            const response = await fetch("http://127.0.0.1:3000/clients",
                {
                    method: "GET",
                    headers: { 'content-type': 'application/json' },
                })

            if (!response) {
                console.error("Erro ao receber resposta")
            }

            const data = await response.json()

            const clientsArray = Array.isArray(data.clients) ? data.clients : [];

            const table = document.querySelector("#tabelaClientes tbody");

            if (!table) {
                console.error("Erro ao instanciar tabela")
                return
            }

            table.innerHTML = "";

            clientsArray.forEach((client) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                        <td>${client.id || ''}</td>
                        <td>${client.nome || ''}</td>
                        <td>${client.telefone || ''}</td>
                        <td>${client.email || ''}</td>
                        <td>
                        <button class="btn-icon btn-delete btnApagarClient" title="Apagar" data-id="${client.id}">
                            🗑️
                        </button>
                    </td>
                `;

                table.appendChild(row)

            })

            this.deleteClients();

        } catch (error) {
            console.error("Erro ao buscar clientes")
        }
    }

    async deleteClients() {
        try{
            const btnApagar = document.querySelectorAll(".btnApagarClient"); 
            btnApagar.forEach((botao) => {
                botao.addEventListener("click", async (event) => {

                    const row = event.target.closest("tr"); 

                    const rowId = botao.getAttribute("data-id")
                    
                    const response = await fetch(`http://127.0.0.1:3000/delete-client/${rowId}`, {method: "DELETE"})

                    row.remove()
                })
            })
        }catch(e){
            console.error("Erro ao deletar clientes...")
        }
    }
}