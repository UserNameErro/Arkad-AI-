// Função para inicializar o banco de dados
function initDatabase() {
    const db = openDatabase('arkadai_login', '1.0', 'Banco de dados de login ARKAD AI', 2 * 1024 * 1024);
    
    db.transaction(function(tx) {
        tx.executeSql(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                senha TEXT NOT NULL,
                nome TEXT,
                data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
    });

    return db;
}

// Função para verificar se o usuário existe
function verificarUsuario(email, senha) {
    return new Promise((resolve, reject) => {
        const db = initDatabase();
        
        db.transaction(function(tx) {
            tx.executeSql(
                'SELECT * FROM usuarios WHERE email = ? AND senha = ?',
                [email, senha],
                function(tx, results) {
                    if (results.rows.length > 0) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                },
                function(tx, error) {
                    reject(error);
                }
            );
        });
    });
}

// Função para cadastrar novo usuário
function cadastrarUsuario(email, senha, nome) {
    return new Promise((resolve, reject) => {
        const db = initDatabase();
        
        db.transaction(function(tx) {
            tx.executeSql(
                'INSERT INTO usuarios (email, senha, nome) VALUES (?, ?, ?)',
                [email, senha, nome],
                function(tx, results) {
                    resolve(true);
                },
                function(tx, error) {
                    reject(error);
                }
            );
        });
    });
}

// Função para lidar com o login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    
    // Limpar mensagens anteriores
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
    
    try {
        const usuarioExiste = await verificarUsuario(email, senha);
        
        if (usuarioExiste) {
            // Login bem-sucedido
            successMessage.textContent = 'Login realizado com sucesso!';
            successMessage.style.display = 'block';
            
            // Redirecionar após 1 segundo
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            // Login falhou
            errorMessage.textContent = 'E-mail ou senha incorretos';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Erro ao verificar login:', error);
        errorMessage.textContent = 'Erro ao realizar login. Tente novamente.';
        errorMessage.style.display = 'block';
    }
    
    return false;
}

// Inicializar o banco de dados quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    initDatabase();
});

// Verifica se o usuário já está logado
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        window.location.href = 'index.html';
    }
}

// Verifica o status do login quando a página carrega
document.addEventListener('DOMContentLoaded', checkLoginStatus); 