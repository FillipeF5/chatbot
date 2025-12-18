🐧 FiliPingu - Plataforma de Chatbot Dinâmico para Estúdios
O FiliPingu evoluiu de um simples script para uma plataforma completa de atendimento. Agora, o sistema conta com um motor de renderização de fluxos, persistência de dados no navegador e gestão de segurança profissional.

🚀 Novas Funcionalidades (v2.0)
Persistência de Sessão (Memory): O chatbot agora utiliza localStorage para lembrar onde o usuário parou. Se o cliente fechar a página ou atualizar o navegador, o histórico e os dados coletados (nome, preferências) são restaurados automaticamente.

Segurança via Ambiente (.env): Implementação de proteção para rotas administrativas usando variáveis de ambiente, seguindo as melhores práticas de segurança para evitar exposição de credenciais em repositórios.

Motor de Fluxo 100% CRUD: O código JavaScript tornou-se um motor genérico. Toda a lógica de perguntas e botões é buscada dinamicamente no SQLite, permitindo mudanças em tempo real pelo Painel Admin.

🛠️ Tecnologias e Dependências
Linguagem: Python 3.x

Web Framework: Flask & Flask-SocketIO

Segurança: python-dotenv para gestão de variáveis sensíveis.

Persistência: SQLite (Servidor) e LocalStorage (Cliente).

📦 Instalação e Configuração
Instale as dependências:

Bash

pip install flask flask-socketio python-dotenv
Configure o Ambiente: Crie um arquivo .env na raiz do projeto (o sistema ignora este arquivo no Git):

Plaintext

ADMIN_AUTH_TOKEN=sua_senha_secreta_aqui
Inicialize o Banco de Dados:

Bash

python backend/init_db.py
Execute o Servidor:

Bash

python backend/app.py
📂 Arquitetura do Sistema
app.py: Gerencia rotas de API, segurança via Token e entrega de templates.

widget.js: Motor inteligente que renderiza fluxos e gerencia a persistência local.

admin.html: Interface completa para gestão de agendamentos e criação de fluxos de conversa (CRUD).

💡 Como utilizar o Gerenciador de Fluxos
Acesse o Painel Admin (/admin?auth=SUA_SENHA).

Crie um Passo com um ID único (ex: info_tattoo).

No campo Botões, defina o texto que o usuário verá e para qual ID de Destino ele será levado.

Para ações especiais, utilize os prefixos de sistema:

sys_whatsapp: Abre o link direto para o número configurado.

sys_reset: Limpa a memória local e reinicia o chat.