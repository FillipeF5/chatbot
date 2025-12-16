#!/usr/bin/env python3
# backend/app.py - Flask application with simple REST + admin pages
from flask import Flask, request, jsonify, render_template, redirect, url_for, flash
from flask_socketio import SocketIO, emit
import sqlite3, os, json, datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "estudio.db")

app = Flask(__name__, template_folder='templates', static_folder='static')
app.config['SECRET_KEY'] = 'dev_secret_key'  # change for production
socketio = SocketIO(app, cors_allowed_origins="*")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/api/ping")
def ping():
    return jsonify({"status":"ok","time": datetime.datetime.now().isoformat()})

# Save an appointment
@app.route("/api/appointments", methods=["POST"])
def create_appointment():
    data = request.json
    # Basic validation
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
    # Emit real-time event to admin dashboards
    socketio.emit("new_appointment", {"id": appt_id, "name": data["name"], "phone": data["phone"]}, broadcast=True)
    return jsonify({"id": appt_id, "status":"saved"}), 201

# List appointments (admin)
@app.route("/admin")
def admin_index():
    # Simple auth from query params (not for production)
    auth = request.args.get("auth", "")
    if auth != "admin123":  # change in production or use better auth
        return redirect(url_for("admin_login"))
    conn = get_db()
    cur = conn.cursor()
    rows = cur.execute("SELECT * FROM appointments ORDER BY created_at DESC").fetchall()
    appts = [dict(r) for r in rows]
    conn.close()
    return render_template("admin.html", appointments=appts)

@app.route("/admin/login", methods=["GET","POST"])
def admin_login():
    if request.method == "POST":
        pw = request.form.get("password","")
        if pw == "admin123":
            return redirect(url_for("admin_index", auth="admin123"))
        else:
            flash("Senha incorreta")
    return render_template("login.html")

# Serve widget configuration (could be dynamic)
@app.route("/widget/config")
def widget_config():
    cfg = {
        "studio_name":"Estúdio Vinicius Queiroz",
        "phone_whatsapp":"+5511999999999",
        "working_hours":"Seg-Sab 10:00-19:00",
        "address":"Rua Fictícia, 123 - Bairro Tatto, São Paulo - SP"
    }
    return jsonify(cfg)

# Basic static demo page for integration testing
@app.route("/")
def index():
    return render_template("demo_index.html")

if __name__ == "__main__":
    # run with SocketIO
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
