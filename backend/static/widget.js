/* widget.js — Motor de Chat 100% Dinâmico — pt-BR */
(function (window) {
  const ChatWidget = {
    async init(opts) {
      let dynamicConfig = { settings: {}, flows: {} };
      try {
        const response = await fetch('/api/bot/config');
        dynamicConfig = await response.json();
      } catch (err) {
        console.error("Erro ao carregar configurações:", err);
      }

      const cfg = Object.assign({
        selector: "body",
        establishmentName: dynamicConfig.settings.establishment_name || "Estúdio",
        whatsappNumber: dynamicConfig.settings.whatsapp_number || "",
        avatar: "🐧"
      }, opts || {});

      const root = document.querySelector(cfg.selector) || document.body;
      const widget = document.createElement("div");
      widget.className = "evq-widget";
      widget.style.display = "none";
      widget.innerHTML = `
        <div class="evq-header">
          <div class="evq-avatar">${cfg.avatar}</div>
          <div>
            <div class="evq-title">${cfg.establishmentName}</div>
            <div class="evq-sub">Atendimento Automático</div>
          </div>
        </div>
        <div class="evq-body" id="evq-body"></div>
        <div class="evq-footer" id="evq-footer" style="display:none;">
          <input id="evq-input" class="evq-input" placeholder="Digite algo..." />
          <button id="evq-send" class="evq-send">Enviar</button>
        </div>
      `;
      document.body.appendChild(widget);

      const state = { memory: {}, flows: dynamicConfig.flows };
      const bodyEl = widget.querySelector("#evq-body");
      const footerEl = widget.querySelector("#evq-footer");
      const inputEl = widget.querySelector("#evq-input");
      const sendEl = widget.querySelector("#evq-send");

      // --- FUNÇÕES DE PERSISTÊNCIA ---
      function saveChatContext(state, bodyHtml) {
        const data = {
          memory: state.memory,
          history: bodyHtml,
          lastStep: state.currentStep,
          timestamp: new Date().getTime()
        };
        localStorage.setItem('filiPingu_session', JSON.stringify(data));
      }

      function loadChatContext() {
        const saved = localStorage.getItem('filiPingu_session');
        if (!saved) return null;

        const data = JSON.parse(saved);
        // Expira após 24h para não ficar obsoleto
        const isExpired = new Date().getTime() - data.timestamp > 24 * 60 * 60 * 1000;
        return isExpired ? null : data;
      }



      // --- RENDERIZADORES ---
      function bot(msg) {
        const d = document.createElement("div");
        d.className = "evq-bubble evq-bot";
        d.innerHTML = msg;
        bodyEl.appendChild(d);
        scrollBottom();
        saveChatContext(state, bodyEl.innerHTML); // <--- SALVA AQUI
      }

      function user(msg) {
        const d = document.createElement("div");
        d.className = "evq-bubble evq-user";
        d.innerText = msg;
        bodyEl.appendChild(d);
        scrollBottom();
        saveChatContext(state, bodyEl.innerHTML); // <--- SALVA AQUI
      }

      function quickButtons(list) {
        if (!list || list.length === 0) return;
        const wrap = document.createElement("div");
        wrap.className = "evq-quick";
        list.forEach(btn => {
          const b = document.createElement("button");
          b.className = "evq-btn";
          b.innerText = btn.label;
          b.onclick = () => handleQuick(btn);
          wrap.appendChild(b);
        });
        bodyEl.appendChild(wrap);
        scrollBottom();
      }

      function scrollBottom() {
        setTimeout(() => { bodyEl.scrollTop = bodyEl.scrollHeight; }, 100);
      }

      // --- O MOTOR DE NAVEGAÇÃO ---
      function navigateTo(stepId) {
        const flow = state.flows[stepId];
        if (flow) {
          bot(flow.message);
          setTimeout(() => quickButtons(flow.options), 300);
        } else {
          // Se o ID não existe no banco, tentamos as funções de sistema
          handleSystemAction(stepId);
        }
      }

      function handleQuick(btn) {
        user(btn.label);
        const target = btn.action;
        navigateTo(target);
      }

      // --- AÇÕES ESPECIAIS (SISTEMA) ---
      function handleSystemAction(actionId) {
        switch (actionId) {
          case "sys_whatsapp":
            bot("Encaminhando para o WhatsApp...");
            const phone = cfg.whatsappNumber.replace(/\D/g, '');
            window.open(`https://wa.me/${phone}`, "_blank");
            break;

          case "sys_reload":
            startConversation();
            break;
            
          case "sys_reset":
            localStorage.removeItem('filiPingu_session');
            state.memory = {};
            startConversation();
            break;

          default:
            console.warn("Ação não encontrada:", actionId);
            bot("Desculpe, não entendi esse caminho. Vamos voltar ao início?");
            setTimeout(() => navigateTo('main_menu'), 1000);
            break;
        }
      }

      function startConversation() {
        widget.style.display = "flex";
        const context = loadChatContext();

        if (context && context.history) {
          // RESTAURA O CHAT ANTERIOR
          bodyEl.innerHTML = context.history;
          state.memory = context.memory;
          bot("<em>Bem-vindo de volta! Continue de onde paramos ou digite 'reiniciar'.</em>");
          scrollBottom();
        } else {
          // INICIA DO ZERO
          bodyEl.innerHTML = "";
          navigateTo('main_menu');
        }
      }

      // FAB
      const fab = document.createElement("button");
      fab.className = "evq-fab";
      fab.innerHTML = `<span>🤖</span>`;
      fab.onclick = () => {
        if (widget.style.display === "none") startConversation();
        else widget.style.display = "none";
      };
      root.appendChild(fab);
    }
  };
  window.ChatWidget = ChatWidget;
})(window);