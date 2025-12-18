🐧 FiliPingu - Chatbot Dinâmico para Estúdios de Tattoo
Este projeto é um ecossistema de atendimento automatizado composto por um Widget de Chat inteligente, um Backend em Python e um Painel Administrativo para gestão de fluxos em tempo real.

🚀 O que mudou (Arquitetura Atual)
O chatbot não possui mais respostas "hardcoded" (fixas no código). Ele funciona como um motor de renderização de estados:

O administrador define "Passos" (Steps) no painel.

Cada passo tem uma mensagem e botões de resposta.

Cada botão aponta para o ID de outro passo, criando uma árvore de decisão infinita sem tocar no código JavaScript.

🛠️ Tecnologias Utilizadas
Backend: Python 3 + Flask.

Banco de Dados: SQLite (persistência de configurações e fluxos).

Comunicação: JSON via REST API + WebSockets (Socket.io) para notificações em tempo real.

Frontend: Vanilla JavaScript (ES6+), CSS3 e HTML5.

✨ Funcionalidades Principais
Painel Admin CRUD: Interface para criar, editar e excluir perguntas e botões do fluxo de conversa.

Motor Genérico: O widget carrega as configurações do banco e navega pelos IDs dinamicamente.

Ações de Sistema (sys_): Suporte a funções especiais como redirecionamento para WhatsApp (sys_whatsapp) e reinicialização de chat (sys_reload).

Configurações Globais: Edição do nome do estúdio e número de contato diretamente pelo painel.

Notificações em Tempo Real: Alertas via Socket.io para novos eventos de interesse.

📂 Estrutura do Projeto
Plaintext

/
├── backend/
│   ├── app.py              # Servidor Flask e Rotas de API
│   ├── init_db.py          # Script de inicialização do SQLite
│   ├── estudio.db          # Banco de dados (Gerado ao iniciar)
│   └── templates/
│       ├── index.html      # Página demo (Landing Page)
│       └── admin.html      # Painel de controle do gestor
├── static/
│   ├── css/
│   │   └── style.css       # Estilização do Widget e Admin
│   └── js/
│       └── widget.js       # O "Motor" do Chatbot
└── README.md
⚙️ Como Instalar e Rodar
Instale as dependências:

Bash

pip install flask flask-socketio
Inicialize o Banco de Dados:

Bash

python backend/init_db.py
Inicie o servidor:

Bash

python backend/app.py
Acesse:

Widget: http://localhost:5000

Admin: http://localhost:5000/admin (Credencial atual: auth=admin123)

💡 Como configurar novos fluxos
No Admin, crie um passo com um ID Único (ex: faq_horario).

Defina a mensagem que o Pinguim dirá.

No ID de Destino de qualquer botão, aponte para o ID criado.

Para links externos de WhatsApp, utilize a ação reservada sys_whatsapp.

📝 Próximos Passos (Roadmap)
[ ] Adicionar suporte a upload de imagens no chat.

[ ] Implementar sistema de agendamento com calendário real.

[ ] Dashboard de Analytics (Gráficos de cliques e conversões).