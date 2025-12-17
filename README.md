
Relatório Técnico — Chatbot de Atendimento

**Sumário**
- **Objetivo:** Protótipo de chatbot de atendimento para um estúdio de tatuagem.
- **Status:** Protótipo local funcional com frontend, backend e banco SQLite.

**Índice**
- **Visão Geral**
- **Funcionalidades**
- **Arquitetura & Fluxo**
- **Tecnologias e Bibliotecas**
- **Estrutura do Projeto**
- **Como Rodar (Desenvolvimento)**
- **Endpoints e Painel Admin**
- **Banco de Dados**
- **Segurança e Produção**

**Visão Geral**
Este projeto implementa um protótipo de chatbot de atendimento pensado para um estúdio de tatuagem. Fornece:
- Um widget embutível para sites (frontend) que permite interação com usuários.
- Um backend em Python (Flask + Flask-SocketIO) que expõe APIs para agendamentos e gerencia o painel admin.
- Persistência em SQLite para facilitar testes locais.

**Funcionalidades**
- Widget JavaScript para incorporar conversas em páginas web.
- Painel administrativo simples em `/admin` para visualizar/agendar atendimentos.
- API REST mínima (`/api/*`) para operações de agendamento e verificação.
- Integração simples via link para WhatsApp (abre conversa com mensagem pré-preenchida).
- Comunicação em tempo real entre frontend e backend via Socket.IO para interatividade do widget.

**Arquitetura & Fluxo**
- O frontend (página principal e widget) carrega `widget.js`/`widget.css` e se conecta ao backend via Socket.IO.
- O backend (`backend/app.py`) recebe mensagens, salva dados em `backend/estudio.db` e expõe endpoints REST para operações CRUD básicas de agendamento.
- O painel admin (`/admin`) consulta os dados do banco e permite operações administrativas básicas (protótipo local — sem autenticação forte).

**Tecnologias e Bibliotecas**
- **Linguagem:** Python 3.x
- **Framework Web:** Flask
- **Realtime:** Flask-SocketIO + python-socketio (Eventlet como servidor recomendado)
- **Banco:** SQLite
- **Frontend:** HTML/CSS/JS (widget embutível em `frontend/index.html`)

**Estrutura do Projeto**
- `backend/` : código do servidor (ex.: `app.py`, `init_db.py`, `estudio.db`)
- `frontend/` : demo da interface e instruções do widget (`index.html`, `INSTRUCTIONS_WIDGET.md`)
- `static/` (do backend): `widget.js`, `widget.css`, `logo.txt`
- `run_local.ps1`, `run_local.sh`: scripts de execução local
- `requirements.txt`: dependências Python

**Como Rodar (Desenvolvimento)**
Pré-requisitos:
- Python 3.8+ instalado
- Recomenda-se criar um ambiente virtual

Passos (Windows PowerShell):
```powershell
# 1. Criar e ativar um virtualenv (opcional, recomendado)
python -m venv .venv; .\.venv\Scripts\Activate.ps1

# 2. Instalar dependências
pip install -r requirements.txt

# 3. Inicializar o banco de dados (se aplicável)
python backend/init_db.py

# 4. Iniciar o servidor (modo local)
python backend/app.py

# Alternativa: executar script de conveniência
.\run_local.ps1
```

Passos (Linux / macOS / WSL):
```bash
python3 -m venv .venv; source .venv/bin/activate
pip install -r requirements.txt
python backend/init_db.py
./run_local.sh
```

Após iniciar o servidor, acesse `http://localhost:5000` no navegador. O painel admin está na rota `http://localhost:5000/admin`.

**Endpoints conhecidos**
- `GET /api/ping` : verifica se a API está respondendo.
- `GET|POST /api/appointments` : listar e criar agendamentos (implementar conforme rotas no backend).
- Rotas do painel: `/admin` (painel administrativo)

Observação: os endpoints exatos e payloads dependem da implementação em `backend/app.py`; revise esse arquivo para detalhes de uso.

**Banco de Dados**
- Arquivo SQLite: `backend/estudio.db` (inicializado por `backend/init_db.py`).
- Contém tabelas de exemplo com registros para demonstração.

**Widget e Integração**
- O widget embutível está em `frontend/index.html` e os assets em `backend/static/widget.js` e `backend/static/widget.css`.
- O widget se conecta ao servidor via Socket.IO para troca de mensagens em tempo real.
- Integração com WhatsApp é feita via link que abre a conversa com uma mensagem pré-preenchida — não integra envio via API oficial.

**Credenciais (provisórias de protótipo)**
- Painel admin: senha `admin123` (apenas para uso local / protótipo)

**Considerações de Segurança e Produção**
- Este projeto é um protótipo. Antes de usar em produção, recomenda-se:
  - Implementar autenticação segura e controle de acesso no painel admin.
  - Habilitar HTTPS e armazenar segredos em variáveis de ambiente.
  - Validar e sanitizar todas as entradas do usuário.
  - Substituir a integração por WhatsApp por uma solução oficial (WhatsApp Business API) para envio controlado.
  - Migrar do SQLite para um SGBD mais robusto conforme a necessidade (Postgres, MySQL).

**Como contribuir / próximos passos**
- Verifique `backend/app.py` para expandir endpoints e regras de validação.
- Melhorar o widget com histórico de conversas e melhor tratamento de erros.
- Adicionar testes automatizados e CI para builds.

**Contato / Autor**
- Projeto de prototipação (demo). Para dúvidas ou contribuições, abra uma issue ou PR no repositório.

---
Arquivo atualizado automaticamente com instruções de start e descrição do sistema.

