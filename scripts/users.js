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

                // Mostrar modal de loading
                const modalLoading = document.getElementById("modal-loading");
                if (modalLoading) {
                    modalLoading.style.display = "flex";
                }

                // 1. Pegar dados do formulário
                const name = document.getElementById("name").value;
                const email = document.getElementById("emailCadastro").value;
                const password = document.getElementById("passwordCadastro").value;

                // Validação básica
                if (!name || !email || !password) {
                    this.showErrorModal("Todos os campos são obrigatórios");
                    if (modalLoading) modalLoading.style.display = "none";
                    return;
                }

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

                    // Esconder modal de loading
                    if (modalLoading) modalLoading.style.display = "none";

                    if (!response.ok) {
                        const errorData = await response.text();
                        throw new Error(`Erro ${response.status}: ${errorData}`);
                    }

                    const data = await response.json();
                    console.log("DADOS:", data);

                    // Mostrar modal de sucesso
                    const modalSuccess = document.getElementById("modal-success");
                    if (modalSuccess) {
                        modalSuccess.style.display = "flex";
                        setTimeout(() => {
                            modalSuccess.style.display = "none";
                            // Limpar formulário
                            form.reset();
                            // Opcional: redirecionar para login
                            // window.location.href = "/index.html";
                        }, 2000);
                    }

                } catch (e) {
                    console.log("Erro ao fazer um POST a API", e);
                    // Esconder modal de loading
                    if (modalLoading) modalLoading.style.display = "none";
                    // Mostrar modal de erro
                    this.showErrorModal("Erro ao cadastrar usuário. Verifique se a API está rodando.");
                }
            });
        }
    }

    showErrorModal(message) {
        const modalError = document.getElementById("modal-error");
        if (modalError) {
            const errorSpan = modalError.querySelector("span");
            if (errorSpan) {
                errorSpan.textContent = message;
            }
            modalError.style.display = "flex";
            setTimeout(() => {
                modalError.style.display = "none";
            }, 3000);
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
}

// Instanciar a classe quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new users();
});

// CommonJS export for compatibility
window.users = users;