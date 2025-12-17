/* widget.js — Chat widget DINÂMICO com fluxos restaurados — pt-BR */
(function (window) {
  const ChatWidget = {
    async init(opts) {
      let dynamicConfig = { settings: {}, flows: {} };
      try {
        const response = await fetch('/api/bot/config');
        dynamicConfig = await response.json();
      } catch (err) {
        console.error("Erro ao carregar configurações do bot:", err);
      }

      const cfg = Object.assign({
        selector: "body",
        establishmentName: dynamicConfig.settings.establishment_name || "Estabelecimento",
        whatsappNumber: dynamicConfig.settings.whatsapp_number || "+5511999999999",
        theme: dynamicConfig.settings.theme_color || "dark",
        avatar: dynamicConfig.settings.bot_avatar || "🐧"
      }, opts || {});

      const root = document.querySelector(cfg.selector) || document.body;

      const fab = document.createElement("button");
      fab.className = "evq-fab";
      fab.innerHTML = `<span class="icon">🤖</span>`;
      root.appendChild(fab);

      const widget = document.createElement("div");
      widget.className = "evq-widget";
      widget.style.display = "none";
      widget.innerHTML = `
        <div class="evq-header">
          <div class="evq-avatar">${cfg.avatar}</div>
          <div>
            <div class="evq-title">${cfg.establishmentName}</div>
            <div class="evq-sub">Atendimento online • Resposta rápida</div>
          </div>
        </div>
        <div class="evq-body" id="evq-body"></div>
        <div class="evq-footer" id="evq-footer" style="display:none;">
          <input id="evq-input" class="evq-input" placeholder="Escreva aqui..." />
          <button id="evq-send" class="evq-send">Enviar</button>
        </div>
      `;
      document.body.appendChild(widget);

      const state = {
        step: "welcome",
        memory: {},
        history: [],
        flows: dynamicConfig.flows
      };

      const bodyEl = widget.querySelector("#evq-body");
      const footerEl = widget.querySelector("#evq-footer");
      const inputEl = widget.querySelector("#evq-input");
      const sendEl = widget.querySelector("#evq-send");

      function bot(msg) {
        const d = document.createElement("div");
        d.className = "evq-bubble evq-bot";
        d.innerHTML = msg;
        bodyEl.appendChild(d);
        scrollBottom();
      }

      function user(msg) {
        const d = document.createElement("div");
        d.className = "evq-bubble evq-user";
        d.innerText = msg;
        bodyEl.appendChild(d);
        scrollBottom();
      }

      function quickButtons(list) {
        const wrap = document.createElement("div");
        wrap.className = "evq-quick";
        list.forEach(btn => {
          const b = document.createElement("button");
          b.className = "evq-btn";
          b.innerText = btn.label;
          b.addEventListener("click", () => handleQuick(btn));
          wrap.appendChild(b);
        });
        bodyEl.appendChild(wrap);
        scrollBottom();
      }

      function scrollBottom() {
        setTimeout(() => { bodyEl.scrollTop = bodyEl.scrollHeight; }, 120);
      }

      // --- LOGICA DE PREÇO ---
      function estimatePrice(mem) {
        const base = { Pequena: [150, 300], Média: [350, 700], Grande: [800, 2000] };
        const styleMul = (mem.estilo && mem.estilo.toLowerCase().includes("realismo")) ? 1.4 : 1.0;
        const t = mem.tamanho || "Pequena";
        const rng = base[t] || base["Pequena"];
        return { min: Math.round(rng[0] * styleMul), max: Math.round(rng[1] * styleMul) };
      }

      // --- FUNÇÕES DE FLUXO (RESTAURADAS) ---
      function startOrcamento() {
        bot("Beleza! Para qual região do corpo seria a tattoo?");
        quickButtons([
          { label: "Braço", action: "action_orcamento", value: "Braço" },
          { label: "Perna", action: "action_orcamento", value: "Perna" },
          { label: "Costas", action: "action_orcamento", value: "Costas" },
          { label: "Outro", action: "action_orcamento", value: "Outro" }
        ]);
      }

      function startAgendamento() {
        bot("Ótimo! Para agendar, vou precisar de algumas informações. Qual o seu nome completo?");
        showInput((txt) => {
          state.memory.name = txt;
          bot(`Prazer, <strong>${txt}</strong>! Agora, qual o seu WhatsApp?`);
          showInput((phone) => {
            state.memory.phone = phone;
            bot("Qual serviço você busca?");
            quickButtons([
              { label: "Tattoo Pequena", action: "confirm_final", value: "Pequena" },
              { label: "Tattoo Média", action: "confirm_final", value: "Média" }
            ]);
          });
        });
      }

      function showInput(cb) {
        footerEl.style.display = "flex";
        inputEl.value = "";
        inputEl.focus();
        const handleSend = () => {
          const v = inputEl.value.trim();
          if (!v) return;
          user(v);
          footerEl.style.display = "none";
          sendEl.removeEventListener("click", handleSend);
          cb(v);
        };
        sendEl.addEventListener("click", handleSend);
      }

      function handleQuick(btn) {
        const act = btn.action;
        const val = btn.value || null;
        user(btn.label);

        switch (act) {
          case "goto_orcamento":
            setTimeout(() => startOrcamento(), 300);
            break;
          case "goto_agendamento":
            setTimeout(() => startAgendamento(), 300);
            break;
          case "action_orcamento":
            state.memory.regiao = val;
            bot(`Entendido! Qual o tamanho aproximado para <strong>${val}</strong>?`);
            quickButtons([
              { label: "Pequena", action: "action", value: "Pequena" },
              { label: "Média", action: "action", value: "Média" },
              { label: "Grande", action: "action", value: "Grande" }
            ]);
            break;
          case "action":
            state.memory.tamanho = val;
            bot("E qual o estilo da arte?");
            quickButtons([
              { label: "Blackwork", action: "action2", value: "Blackwork" },
              { label: "Realismo", action: "action2", value: "Realismo" },
              { label: "Voltar", action: "back_menu" }
            ]);
            break;
          case "action2":
            state.memory.estilo = val;
            const est = estimatePrice(state.memory);
            bot(`Estimativa para ${state.memory.tamanho} em ${state.memory.regiao}: <strong>R$ ${est.min} - R$ ${est.max}</strong>.`);
            quickButtons([{ label: "Finalizar no WhatsApp", action: "send_whatsapp_orc" }, { label: "Menu", action: "back_menu" }]);
            break;
          case "send_whatsapp_orc":
            openWhatsApp(`Orçamento: Tattoo ${state.memory.tamanho} no ${state.memory.regiao}.`);
            break;
          case "goto_faq":
            showFaq();
            break;
          case "goto_handoff":
            handoff();
            break;
          case "back_menu":
            startConversation();
            break;
        }
      }

      function startConversation() {
        widget.style.display = "flex";
        bodyEl.innerHTML = "";
        const main = state.flows && state.flows.main_menu;
        if (main) {
          bot(main.message);
          setTimeout(() => quickButtons(main.options), 350);
        }
      }

      function showFaq() {
        bot(`<strong>📍 Endereço:</strong> Unidade Centro<br/><strong>🕒 Horário:</strong> 10h às 19h`);
        quickButtons([{ label: "Voltar", action: "back_menu" }]);
      }

      function handoff() {
        bot("Chamando atendente...");
        setTimeout(() => openWhatsApp("Olá! Preciso de ajuda humana."), 1000);
      }

      function openWhatsApp(message) {
        const phone = cfg.whatsappNumber.replace(/\D/g, '');
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
      }

      fab.addEventListener("click", () => {
        if (widget.style.display === "none") startConversation();
        else widget.style.display = "none";
      });
    }
  };
  window.ChatWidget = ChatWidget;
})(window);