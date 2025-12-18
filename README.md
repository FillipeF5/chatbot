# FiliPingu — Plataforma de Chatbot Dinâmico para Estúdios

Versão: v2.0 — documentação técnica e operacional

**Sumário**
- **Descrição curta:** Plataforma de chatbot para estúdios de tatuagem com motor de fluxos, painel admin e persistência local/servidor.
- **Estado:** Protótipo funcional para uso local e desenvolvimento.

**Índice**
- **Visão Geral**
- **Funcionalidades**
- **Arquitetura**
- **Pré-requisitos**
- **Instalação e Execução**
- **Configuração (.env)**
- **Endpoints/API**
- **Banco de Dados (SQLite)**
- **Widget / Integração no Frontend**
- **Painel Admin**
- **Debug / Troubleshooting**
- **Contribuição**

**Visão Geral**
FiliPingu é uma plataforma de atendimento por chatbot pensada para estúdios de tatuagem. Ela combina um widget frontend que pode ser embutido em sites com um backend em Flask que gerencia fluxos de conversa, agendamentos e persistência em SQLite.

**Funcionalidades principais**
- Motor de fluxos em JavaScript com definição dinâmica via banco de dados.
- Persistência de sessão no cliente (localStorage) para restaurar conversa após reload/fechamento.
- Painel administrativo para CRUD de fluxos e gerenciamento de agendamentos.
- Integração por link com WhatsApp (abre conversa com mensagem pré-preenchida).
- Comunicação em tempo real entre widget e backend via Socket.IO.

**Arquitetura (resumo técnico)**
- Frontend: `frontend/index.html`, assets do widget em `backend/static/widget.js` e `backend/static/widget.css`.
- Backend: `backend/app.py` (Flask + Flask-SocketIO). Fornece endpoints REST e Socket.IO.
- Banco: `backend/estudio.db` (SQLite). Inicializado por `backend/init_db.py`.

**Pré-requisitos**
- Python 3.8+
- Git (opcional)
- Recomendado: ambiente virtual (`venv`)

**Instalação e execução (desenvolvimento)**

1) Clonar / abrir repositório
```powershell
# Windows PowerShell
cd C:\Users\uva004714\Downloads\chatbot-main
```

2) Criar e ativar ambiente virtual (recomendado)
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

3) Instalar dependências
```powershell
pip install -r requirements.txt
```

4) Criar arquivo de configuração `.env` na raiz (ver seção Configuração)

5) Inicializar o banco de dados (uma vez)
```powershell
python backend/init_db.py
```

6) Iniciar o servidor (modo desenvolvimento)
```powershell
python backend/app.py
# Ou usar script de conveniência
.\run_local.ps1
```

Após isso, abra `http://localhost:5000` no navegador.

**Configuração (.env)**
Crie um arquivo `.env` na raiz do projeto (ex.: `.env`) com as variáveis necessárias. Exemplo mínimo:
```
ADMIN_AUTH_TOKEN=um_token_seguro_aqui
WHATSAPP_NUMBER=5511999999999
```
- `ADMIN_AUTH_TOKEN`: token ou senha para acesso ao painel admin (o app aceita como query param `?auth=` — ajustar conforme `backend/app.py`).
- `WHATSAPP_NUMBER`: número usado para gerar links do tipo `https://wa.me/<number>?text=...`.

**Endpoints e uso (resumo técnico)**
OBS: Consulte `backend/app.py` para a implementação exata e payloads.

- `GET /api/ping`
	- Descrição: Verifica se a API responde
	- Exemplo:
		```bash
		curl http://localhost:5000/api/ping
		```

- `GET /api/appointments`
	- Lista agendamentos

- `POST /api/appointments`
	- Cria agendamento. Payload JSON esperado (exemplo):
		```json
		{
			"name": "João",
			"phone": "+551199999999",
			"date": "2025-12-25T14:00:00",
			"note": "Referência de tatuagem"
		}
		```

- Rotas do painel administrativo: `/admin` (protegido via `ADMIN_AUTH_TOKEN`).

Consulte `backend/app.py` para detalhes e validação de campos.

**Banco de Dados (SQLite)**
- Arquivo: `backend/estudio.db`.
- Inicialização: `backend/init_db.py` cria tabelas e inserções de exemplo.

Exemplo de consultas úteis (CLI `sqlite3`):
```powershell
sqlite3 .\backend\estudio.db ".tables"
sqlite3 .\backend\estudio.db "SELECT * FROM appointments LIMIT 10;"
```

Se preferir usar Python para inspeção/consulta:
```python
import sqlite3
conn = sqlite3.connect('backend/estudio.db')
cur = conn.cursor()
cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
print(cur.fetchall())
```

**Widget / Integração frontend**
- O widget principal está em `backend/static/widget.js` e `backend/static/widget.css`.
- Para embutir: inclua as referências ao JS/CSS no HTML do site ou use `frontend/index.html` como referência.
- O motor de fluxos carrega passos (nodes) do backend e renderiza mensagens + botões. Cada botão pode apontar para outro `step_id` ou para ações do tipo `sys_whatsapp`, `sys_reset`.

**Painel Admin**
- URL: `http://localhost:5000/admin?auth=<ADMIN_AUTH_TOKEN>`
- Permite: listar e criar fluxos, editar passos, visualizar agendamentos.
- Segurança: uso de token via `.env` é mínimo — para produção implemente autenticação real (JWT/OAuth).

**Debug / Troubleshooting**
- Mensagem ao tentar abrir `*.db` como texto: é normal — arquivos SQLite são binários.
- Para visualizar o DB localmente, use uma dessas opções:
	- Extensão VS Code: `SQLite` (alexcvzz) — abre DB e permite queries.
	- DB Browser for SQLite (GUI): https://sqlitebrowser.org/
	- `sqlite3` CLI ou script Python (veja exemplos acima).

- Faça backup antes de editar:
```powershell
copy .\backend\estudio.db .\backend\estudio.db.bak
```

**Dev / Testes / Execução contínua**
- Não há testes automatizados incluídos por padrão. Sugerido:
	- Adicionar `pytest` e alguns testes para `backend`.
	- Adicionar `pre-commit` e linters (black/flake8) para padronização.

**Contribuição**
- Fork -> branch -> PR. Descreva a motivação e os testes realizados.
- Para alterações no schema do DB, inclua scripts de migração (ex.: alembic) em PRs maiores.

**Licença**
- Este repositório não contém um arquivo `LICENSE` por padrão. Defina uma licença pública (MIT, Apache-2.0, etc.) se for compartilhar.

---
Arquivo atualizado para apresentação técnica e compatível com exibição em IDE/GitHub.