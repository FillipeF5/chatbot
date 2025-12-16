
Relatório Técnico — Chatbot de Atendimento

Objetivo
--------
Desenvolver um protótipo de chatbot de atendimento para o estúdio 'Estúdio Vinicius Queiroz' conforme roteiro fornecido.

Resumo do sistema
-----------------
- Widget embutível em qualquer página web (frontend/static/widget.js + widget.css)
- Backend em Python (Flask + Flask-SocketIO) provendo API para agendamentos e painel admin
- Banco de dados SQLite (backend/estudio.db)
- Integração via WhatsApp (abre conversa com mensagem pré-preenchida)
- Painel admin simples em /admin (senha: admin123, para protótipo local)

Evidências
---------
- Banco inicial criado em backend/estudio.db com registros de exemplo.
- Endpoints testados localmente: /api/ping, /api/appointments
- Logs de execução (serão exibidos no terminal quando servidor for executado)
- Demo frontend disponível em / (rota principal) e widget embutível em frontend/index.html

Bibliotecas usadas
------------------
- Flask
- Flask-SocketIO
- python-socketio
- eventlet

Instruções de execução
----------------------
Veja README.md incluído no pacote.

Observações
----------
- Projeto feito para prototipação local. Para produção, recomenda-se:
  * Autenticação real para admin
  * Sanitização e validação robusta dos inputs
  * Uso de HTTPS e variáveis de ambiente para segredos
  * Integração real com serviço de mensagens ou API de WhatsApp Business para envio controlado

