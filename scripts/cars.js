export default class Cars {
    constructor() {
        this.createCars();
        this.deletCars();
    }

    async createCars() {
        try {
            const form = document.getElementById("formAdicionarCarros");
            form.addEventListener("submit", async (event) => {
                event.preventDefault();
                console.log("Cadastrando carros... ")

                const placa = document.getElementById("placaCarro").value;
                const modelo = document.getElementById("modeloCarro").value;
                const marca = document.getElementById("marcaCarro").value;
                const ano = document.getElementById("anoCarro").value;
                const motor = document.getElementById("motorCarro").value;

                const carro = {
                    placa: placa,
                    modelo: modelo,
                    marca: marca,
                    ano: ano,
                    motor: motor
                }

                const response = await fetch("http://127.0.0.1:3000/create-cars", {
                    method: "POST",
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(carro)
                })

                if (!response) {
                    console.log("Erro ao fazer fetch")
                }

                const data = await response.json()
                console.log("carros cadastrados: ", data)

                await this.getCars()

            })
        } catch (error) {
            console.log("Erro ao cadastrar carros", error)
        }
    }

    async getCars() {
        try {
            console.log("Buscando carros...")

            const response = await fetch("http://127.0.0.1:3000/get-cars", {
                method: "GET",
                headers: { 'content-type': 'application/json' }
            })

            if (!response) {
                console.log("Erro ao receber resposta...")
            }

            const data = await response.json();
            console.log("Carros recebidos: ", data)


            const carsArray = Array.isArray(data.carros) ? data.carros : data.carros;

            const table = document.querySelector("#tabelaCarros tbody");

            if (!table) {
                console.log("Tabela ainda não foi instanciada...")
                return
            }

            table.innerHTML = "";

            carsArray.forEach(carro => {
                const row = document.createElement("tr");
                row.innerHTML = `
                <td>${carro.id || ''}</td>
                <td>${carro.modelo || ''}</td>
                <td>${carro.marca || ''}</td>
                <td>${carro.ano || ''}</td>
                <td>${carro.motor || ''}</td>
                <td>${carro.placa || ''}</td>
                <td>
                    <button class="btn-icon btn-delete btnApagarCarro" title="Apagar" data-id="${carro.id}">
                        🗑️
                    </button>
                </td>
                `;

                table.appendChild(row);
            });

            this.deletCars();
        } catch (error) {
            console.log("Erro ao buscar carros...", error)
        }
    }

    async deletCars() {
        try {
            console.log("Deletando carros...")

            const btnApagarCarro = document.querySelectorAll(".btnApagarCarro")

            btnApagarCarro.forEach((botao) => {
                botao.addEventListener("click", async (event) => {
                    console.log("Clicou em apagar carro")

                    event.stopPropagation();

                    const row = event.target.closest("tr");

                    const id_row = botao.getAttribute("data-id");

                    const response = fetch(`http://127.0.0.1:3000/delete-cars/${id_row}`, { method: "DELETE" })

                    row.remove()
                })
            })

        } catch (error) {
            return "erro ao excluir carro"
        }
    }
}