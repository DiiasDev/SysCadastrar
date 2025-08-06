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

                if (telefone.length !== 11) {
                    alert("Número incorreto ou sem DDD");
                    return;
                }

                const existingClientsResponse = await fetch("http://127.0.0.1:3000/clients", {
                    method: "GET",
                    headers: { 'content-type': 'application/json' },
                });

                const existingData = await existingClientsResponse.json();
                const clientExists = Array.isArray(existingData.clients) ? existingData.clients : [];

                if (clientExists.some(client => client.email === email)) {
                    alert("Email já cadastrado");
                    return;
                }

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

            const response = await fetch("http://127.0.0.1:3000/clients",
                {
                    method: "GET",
                    headers: { 'content-type': 'application/json' },
                })

            const data = await response.json()

            if (!response) {
                console.error("Erro ao receber resposta")
            }

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
                        <td>${this.formatarTelefone(client.telefone) || ''}</td>
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
            this.formatarTelefone()

        } catch (error) {
            console.error("Erro ao buscar clientes", error)
        }
    }

    async deleteClients() {
        try {
            const btnApagar = document.querySelectorAll(".btnApagarClient");
            btnApagar.forEach((botao) => {
                botao.addEventListener("click", async (event) => {

                    const row = event.target.closest("tr");

                    const rowId = botao.getAttribute("data-id")

                    const response = await fetch(`http://127.0.0.1:3000/delete-client/${rowId}`, { method: "DELETE" })

                    row.remove()
                })
            })
        } catch (e) {
            console.error("Erro ao deletar clientes...")
        }
    }

    async formatNumber() {
        try {
            const response = await fetch("http://127.0.0.1:3000/clients",
                {
                    method: "GET",
                    headers: { 'content-type': 'application/json' },
                })

            const data = await response.json()
            const telefoneFormated = data.clients.map(client => formatarTelefone(client.telefone))

        } catch (error) {
            console.error("Erro ao formatar valores.", error)
        }
    }

    formatarTelefone(telefone) {
        telefone = telefone.replace(/\D/g, "");

        return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3")
    }
}