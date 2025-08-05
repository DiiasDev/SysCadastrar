export default class Clients {
    constructor() {
        this.createClients();
        this.getClients();
        this.deleteClients();
    }

    async createClients() {
        try {
            const form = document.getElementById("formAdicionarClient");
            form.addEventListener("submit", async (event) => {
                event.preventDefault();

                const nome = document.getElementById("nome").value;
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
                    console.log("Erro ao receber resposta")
                }

                const data = await response.json();
                console.log("Sucesso ao cadastrar clientes: ", data)

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
            console.log("Clientes Recebidos:", data.clients)

            const clientsArray = Array.isArray(data.clients) ? data.clients : [];

            const table = document.querySelector("#tabelaClientes tbody");

            if (!table) {
                console.log("Erro ao instanciar tabela")
                return
            }

            table.innerHTML = "";

            clientsArray.forEach((client) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                        <td>${client.id || ''}</td>
                        <td>${client.nome || 'aaa'}</td>
                        <td>${client.telefone || ''}</td>
                        <td>${client.email || ''}</td>
                `;

                table.appendChild(row)

            })

        } catch (error) {
            console.error("Erro ao buscar clientes")
        }
    }

    async deleteClients(idClient) {

    }
}