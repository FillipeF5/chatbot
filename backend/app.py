#!/usr/bin/env python3
# backend/app.py - Flask application with dynamic DB configuration
from flask import Flask, request, jsonify, render_template, redirect, url_for, flash
from flask_socketio import SocketIO, emit
import sqlite3, os, json, datetime
import json
import os
from dotenv import load_dotenv

# Carrega as variáveis do arquivo .env se ele existir
load_dotenv()

# 2. Define o Token (Pega do ambiente ou usa fallback se não existir)
ADMIN_TOKEN = os.getenv("ADMIN_AUTH_TOKEN", "admin")

if not ADMIN_TOKEN:
    print("⚠️ AVISO: ADMIN_AUTH_TOKEN não definido no .env! Usando padrão temporário.")
    ADMIN_TOKEN = ADMIN_TOKEN # Fallback para você não ficar trancado fora

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "estudio.db")

app = Flask(__name__, template_folder='templates', static_folder='static')
app.config['SECRET_KEY'] = 'dev_secret_key'
socketio = SocketIO(app, cors_allowed_origins="*")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/api/ping")
def ping():
    return jsonify({"status":"ok","time": datetime.datetime.now().isoformat()})

# --- NOVA ROTA DINÂMICA PARA O WIDGET ---
@app.route("/api/bot/config")
def get_bot_full_config():
    conn = get_db()
    
    # Busca configurações gerais (Nome, Tel, etc)
    config_rows = conn.execute("SELECT * FROM bot_config").fetchall()
    settings = {row['key']: row['value'] for row in config_rows}
    
    # Busca os passos do fluxo (Mensagens e Botões)
    step_rows = conn.execute("SELECT * FROM bot_steps").fetchall()
    flows = {}
    for row in step_rows:
        flows[row['id']] = {
            "message": row['message'],
            "options": json.loads(row['options']) # Converte string JSON para lista Python
        }
    
    conn.close()
    return jsonify({
        "settings": settings,
        "flows": flows
    })

# Save an appointment
@app.route("/api/appointments", methods=["POST"])
def create_appointment():
    data = request.json
    required = ["name","phone","service","datetime"]
    for k in required:
        if k not in data or not data[k]:
            return jsonify({"error":f"missing {k}"}), 400
    
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO appointments (name, phone, service, datetime, status, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        (data["name"], data["phone"], data["service"], data["datetime"], "pending", datetime.datetime.now().isoformat())
    )
    conn.commit()
    appt_id = cur.lastrowid
    conn.close()
    
    socketio.emit("new_appointment", {"id": appt_id, "name": data["name"], "phone": data["phone"]}, broadcast=True)
    return jsonify({"id": appt_id, "status":"saved"}), 201

# List appointments (admin)
@app.route("/admin")
def admin_index():
    auth = request.args.get("auth", "")
    if auth != ADMIN_TOKEN:
        return redirect(url_for("admin_login"))
    
    conn = get_db()
    cur = conn.cursor()
    rows = cur.execute("SELECT * FROM appointments ORDER BY created_at DESC").fetchall()
    appts = [dict(r) for r in rows]
    conn.close()
    return render_template("admin.html", appointments=appts, auth_token=ADMIN_TOKEN)


@app.route("/admin/save_config", methods=["POST"])
def save_config():
    auth = request.args.get("auth", "")
    if auth != ADMIN_TOKEN:
        return jsonify({"error": "Unauthorized"}), 401
    
    data = request.json
    conn = get_db()
    cur = conn.cursor()
    
    # Salva configurações gerais
    if "settings" in data:
        for key, value in data["settings"].items():
            cur.execute("INSERT OR REPLACE INTO bot_config (key, value) VALUES (?, ?)", (key, value))
            
    # Salva a mensagem inicial do fluxo
    if "welcome_message" in data:
        # Buscamos as opções atuais para não sobrescrever os botões, apenas o texto
        current = cur.execute("SELECT options FROM bot_steps WHERE id = 'main_menu'").fetchone()
        options = current['options'] if current else "[]"
        cur.execute("INSERT OR REPLACE INTO bot_steps (id, message, options) VALUES (?, ?, ?)", 
                    ("main_menu", data["welcome_message"], options))
    
    conn.commit()
    conn.close()
    return jsonify({"status": "success"})

@app.route("/admin/api/steps/save", methods=["POST"])
def save_step():
    auth = request.args.get("auth", "")
    if auth != ADMIN_TOKEN:
        return jsonify({"error": "Unauthorized"}), 401
    
    data = request.json
    step_id = data.get("id")
    message = data.get("message")
    options = data.get("options") # Isso virá como uma lista de objetos

    if not step_id or not message:
        return jsonify({"error": "ID e Mensagem são obrigatórios"}), 400

    conn = get_db()
    cur = conn.cursor()
    
    try:
        # Convertemos a lista de opções para uma string JSON antes de salvar no banco
        options_json = json.dumps(options)
        
        cur.execute("""
            INSERT OR REPLACE INTO bot_steps (id, message, options) 
            VALUES (?, ?, ?)
        """, (step_id, message, options_json))
        
        conn.commit()
        return jsonify({"status": "success", "message": f"Passo '{step_id}' salvo."})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# Rota opcional para excluir passos, caso queira usar o botão de deletar do admin
@app.route("/admin/api/steps/delete/<step_id>", methods=["DELETE"])
def delete_step(step_id):
    auth = request.args.get("auth", "")
    if auth != ADMIN_TOKEN:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db()
    cur = conn.cursor()
    cur.execute("DELETE FROM bot_steps WHERE id = ?", (step_id,))
    conn.commit()
    conn.close()
    return jsonify({"status": "success"})



@app.route("/admin/login", methods=["GET","POST"])
def admin_login():
    if request.method == "POST":
        pw = request.form.get("password","")
        if pw == ADMIN_TOKEN:
            return redirect(url_for("admin_index", auth=ADMIN_TOKEN))
        else:
            flash("Senha incorreta")
    return render_template("login.html")

# Mantive a rota antiga para compatibilidade temporária, mas ela agora busca do banco se quiser
@app.route("/widget/config")
def widget_config():
    conn = get_db()
    config_rows = conn.execute("SELECT * FROM bot_config").fetchall()
    settings = {row['key']: row['value'] for row in config_rows}
    conn.close()
    
    return jsonify({
        "studio_name": settings.get("establishment_name", "Estúdio"),
        "phone_whatsapp": settings.get("whatsapp_number", ""),
        "working_hours": "Seg-Sab 10:00-19:00",
        "address": "Consultar no WhatsApp"
    })

@app.route("/")
def index():
    return render_template("demo_index.html")

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)