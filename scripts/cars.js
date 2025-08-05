export default class cars {
    constructor() {
        this.createCars()
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
            })


        } catch (error) {
            console.log("Erro ao cadastrar carros", error)
        }
    }
}