import moment from 'https://cdn.skypack.dev/moment';

export default class Orcamentos {
    constructor() {
        this.getOrcamentos
    }

    async createOrcamentos() {
        try {
            const form = document.getElementById("formCadastroOrcamento")
            form.addEventListener("submit", (event) => {
                event.preventDefault();

            })
        } catch (error) {

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

            table.innerHTML = ""

            orcamentos.forEach((orcamento) => {
                const row = document.createElement("tr");

                row.innerHTML = `
                <td>${orcamento.id}</td>
                <td>${orcamento.cliente_nome}</td>
                <td>${orcamento.carro_modelo}</td>
                <td>${orcamento.carro_placa}</td>
                <td>${orcamento.pecas}</td>
                <td>${orcamento.servicos}</td>
                <td>${orcamento.valor}</td>
                <td>${moment(orcamento.data_orcamento).format('l')}</td>
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

        }
    }
}