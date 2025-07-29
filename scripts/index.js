class users {
    constructor() {
        this.createUsers();
        this.login();
    }

    async createUsers() {
        const form = document.getElementById("formCadastro");
        if (form) {
            form.addEventListener("submit", async (event) => {
                event.preventDefault();

                // 1. Pegar dados do formulário
                const name = document.getElementById("name").value;
                const email = document.getElementById("emailCadastro").value;
                const password = document.getElementById("passwordCadastro").value;

                // 2. Montar o objeto (usuário) que será enviado a API 
                const user = {
                    name: name,
                    email: email,
                    password: password
                };

                try {
                    // 3. Enviando dados para a API
                    const response = await fetch("http://127.0.0.1:5000/create_users", {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify(user)
                    });

                    if (!response.ok) {
                        throw new Error("Erro na request");
                    }

                    const data = await response.json();
                    console.log("DADOS:", data);

                } catch (e) {
                    console.log("Erro ao fazer um POST a API", e);
                }
            });
        }
    }

    async login() {
        const form = document.getElementById("formLogin");
        if (form) {
            form.addEventListener("submit", async (event) => {
                event.preventDefault();

                const email = document.getElementById("emailLogin").value;
                const password = document.getElementById("passwordLogin").value;

                try {
                    const response = await fetch("http://127.0.0.1:5000/usuarios", {
                        method: "GET",
                        headers: { 'content-type': 'application/json' }
                    });

                    if (!response.ok) {
                        console.error("Erro na request:", response.status, response.statusText);
                        return;
                    }

                    const data = await response.json();
                    console.log("Usuários recebidos:", data);

                    const user = data.find(u => u.email === email && u.password === password);

                    if (user) {
                        console.log("Logando...");
                    } else {
                        console.log("Usuário ou senha errado...");
                    }
                } catch (e) {
                    console.error("Erro ao buscar usuários:", e);
                }
            });
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new users();
});