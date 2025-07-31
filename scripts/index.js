export default class users {
    constructor() {
        this.createUsers();
        this.login();
        this.createPecas();
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
                    const response = await fetch("http://127.0.0.1:3000/create_users", {
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

                // 1. capturando valores digitados pelo usuário
                const email = document.getElementById("emailLogin").value;
                const password = document.getElementById("passwordLogin").value;

                // 2. Fazendo consulta na API
                try {
                    const response = await fetch("http://127.0.0.1:3000/usuarios", {
                        method: "GET",
                        headers: { 'content-type': 'application/json' }
                    });

                    if (!response.ok) {
                        console.error("Erro na request:", response.status, response.statusText);
                        return;
                    }

                    const data = await response.json();
                    console.log("Data: ", data)
                    console.log("Usuários recebidos:", data);

                    // 3. Buscando usuário na API
                    const user = data.usuarios.find(u => u.email === email && u.password === password);

                    if (user) {
                        // Mostra modal de sucesso
                        const modalSuccess = document.getElementById("modal-success");
                        if (modalSuccess) {
                            modalSuccess.style.display = "flex";
                            setTimeout(() => {
                                modalSuccess.style.display = "none";
                                window.location.href = "/pages/home.html";
                            }, 1200);
                        } else {
                            window.location.href = "/pages/home.html";
                        }
                    } else {
                        const modalError = document.getElementById("modal-error");
                        if (modalError) {
                            modalError.style.display = "flex";
                            setTimeout(() => {
                                modalError.style.display = "none";
                            }, 1800);
                        }
                        console.log("Usuário ou senha errado...");
                    }
                } catch (e) {
                    console.error("Erro ao buscar usuários:", e);
                }
            });
        }
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
                } catch (e) {
                    console.log("Erro ao cadastrar peça", e);
                }
            });
            form.dataset.listenerAdded = "true";
        }
    }
}