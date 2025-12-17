#!/usr/bin/env python3
# backend/init_db.py - initialize SQLite database with tables and sample data
import sqlite3, os, datetime, json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "estudio.db")

if os.path.exists(DB_PATH):
    print("Removendo DB antigo:", DB_PATH)
    os.remove(DB_PATH)

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

# 1. Tabela de Agendamentos (Já existente)
cur.execute("""
CREATE TABLE appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT,
    service TEXT,
    datetime TEXT,
    status TEXT,
    created_at TEXT
)
""")

# 2. Tabela de Configurações Gerais (Dinamiza Nome, WhatsApp, etc)
cur.execute("""
CREATE TABLE IF NOT EXISTS bot_config (
    key TEXT PRIMARY KEY,
    value TEXT
)
""")

# 3. Tabela de Passos do Chat (Dinamiza as perguntas e botões)
cur.execute("""
CREATE TABLE IF NOT EXISTS bot_steps (
    id TEXT PRIMARY KEY,
    message TEXT,
    options TEXT  -- Armazenará os botões em formato JSON
)
""")

# --- INSERÇÃO DE DADOS INICIAIS ---

# Sample appointment (Seu dado original)
cur.execute("INSERT INTO appointments (name, phone, service, datetime, status, created_at) VALUES (?,?,?,?,?,?)",
            ("Maria Silva","+5511987654321","Tatuagem pequena (R$150)","2025-11-20 14:00","confirmed", datetime.datetime.now().isoformat()))

# Configurações do Estabelecimento
configs = [
    ('establishment_name', 'Estabelecimento'),
    ('whatsapp_number', '+5511999999999'),
    ('bot_avatar', '🐧'),
    ('theme_color', 'dark')
]
cur.executemany("INSERT INTO bot_config (key, value) VALUES (?, ?)", configs)

# Definição do Menu Principal Dinâmico
menu_options = [
    {"label": "Fazer orçamento", "action": "goto_orcamento"},
    {"label": "Agendamento", "action": "goto_agendamento"},
    {"label": "FAQ / Informações", "action": "goto_faq"},
    {"label": "Falar com humano", "action": "goto_handoff"}
]

cur.execute("INSERT INTO bot_steps (id, message, options) VALUES (?, ?, ?)", 
            ("main_menu", "Olá! Eu sou o FiliPingu 🐧. Como posso te ajudar hoje?", json.dumps(menu_options)))

conn.commit()
conn.close()

print("Banco inicializado com sucesso em", DB_PATH)
print("Tabelas criadas: appointments, bot_config, bot_steps")