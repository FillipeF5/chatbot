/* widget.js — Chat widget avançado com fluxo guiado por regras — pt-BR */
(function(window){
  const ChatWidget = {
    init(opts){
      // opções e defaults
      const cfg = Object.assign({
        selector: "body",
<<<<<<< HEAD
        studioName: "Estúdio",
=======
        establishmentName: "Estabelecimento",
>>>>>>> 26cb53f (dinamização, generalizando nicho/usabilidade)
        whatsappNumber: "+5511999999999",
        theme: "dark"
      }, opts||{});

      const root = document.querySelector(cfg.selector) || document.body;

      // create floating button (FAB)
      const fab = document.createElement("button");
      fab.className = "evq-fab";
<<<<<<< HEAD
      fab.title = "Abrir chat do Estúdio";
      fab.innerHTML = `<span class="icon">💬</span>`;
=======
      fab.title = "Abrir chat";
      fab.innerHTML = `<span class="icon">🤖</span>`;
>>>>>>> 26cb53f (dinamização, generalizando nicho/usabilidade)
      root.appendChild(fab);

      // widget container (hidden initially)
      const widget = document.createElement("div");
      widget.className = "evq-widget";
      widget.style.display = "none"; // start hidden
      widget.innerHTML = `
        <div class="evq-header">
<<<<<<< HEAD
          <div class="evq-avatar">🤖</div>
          <div>
            <div class="evq-title">${cfg.studioName}</div>
=======
          <div class="evq-avatar">🐧</div>
          <div>
            <div class="evq-title">${cfg.establishmentName}</div>
>>>>>>> 26cb53f (dinamização, generalizando nicho/usabilidade)
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

      // state
      const state = {
        step: "welcome", // welcome, menu, orcamento_1, orcamento_2, agendamento_1, agendamento_2, confirm, faq, handoff
        memory: {}, // store user answers
        history: []
      };

      const bodyEl = widget.querySelector("#evq-body");
      const footerEl = widget.querySelector("#evq-footer");
      const inputEl = widget.querySelector("#evq-input");
      const sendEl = widget.querySelector("#evq-send");

      // helper: render a bot bubble
      function bot(msg, opts = {}) {
        const d = document.createElement("div");
        d.className = "evq-bubble evq-bot";
        d.innerHTML = msg;
        bodyEl.appendChild(d);
        scrollBottom();
        state.history.push({author:"bot", text:msg, meta:opts});
      }
      // helper: render a user bubble
      function user(msg) {
        const d = document.createElement("div");
        d.className = "evq-bubble evq-user";
        d.innerText = msg;
        bodyEl.appendChild(d);
        scrollBottom();
        state.history.push({author:"user", text:msg});
      }
      function quickButtons(list){
        const wrap = document.createElement("div");
        wrap.className = "evq-quick";
        list.forEach(btn=>{
          const b = document.createElement("button");
          b.className = "evq-btn";
          b.innerText = btn.label;
          b.dataset.action = btn.action || btn.label;
          if(btn.value) b.dataset.value = btn.value;
          b.addEventListener("click", () => handleQuick(btn));
          wrap.appendChild(b);
        });
        bodyEl.appendChild(wrap);
        scrollBottom();
      }
      function scrollBottom(){
        setTimeout(()=>{ bodyEl.scrollTop = bodyEl.scrollHeight; }, 120);
      }

      // initial greeting sequence
      function startConversation(){
        widget.style.display = "flex";
<<<<<<< HEAD
        bot(`<strong>Olá!</strong> Eu sou o Vini 🤖, assistente do ${cfg.studioName}.<br/>Como posso te ajudar hoje?`);
=======
        bot(`<strong>Olá!</strong> Eu sou o FiliPingu 🐧, assistente virtual do ${cfg.establishmentName}.<br/>Como posso te ajudar hoje?`);
>>>>>>> 26cb53f (dinamização, generalizando nicho/usabilidade)
        state.step = "menu";
        setTimeout(()=> showMainMenu(), 350);
      }

      function showMainMenu(){
        bot("Escolha uma opção abaixo:");
        quickButtons([
          {label:"Fazer orçamento", action:"goto_orcamento"},
<<<<<<< HEAD
          {label:"Agendar tatuagem", action:"goto_agendamento"},
          {label:"Ideias de tatuagem", action:"goto_ideas"},
=======
          {label:"Agendamento", action:"goto_agendamento"},
          {label:"Sugestão", action:"goto_sugestao"},
>>>>>>> 26cb53f (dinamização, generalizando nicho/usabilidade)
          {label:"FAQ / Informações", action:"goto_faq"},
          {label:"Falar com alguém (WhatsApp)", action:"goto_handoff"}
        ]);
      }

      // quick button handler
      function handleQuick(btn){
            // btn = objeto passado na criação do botão
            const act = btn.action || btn.label;
<<<<<<< HEAD
            const val = btn.value || null;  // <-- corrigido: nunca tenta ler btn.dataset
=======
            const val = btn.value || null;  //  nunca tenta ler btn.dataset
>>>>>>> 26cb53f (dinamização, generalizando nicho/usabilidade)

            user(btn.label);

            switch(act){
                case "goto_orcamento":
<<<<<<< HEAD
                    state.step = "orcamento_regiao";
=======
                    state.step = "orcamento";
>>>>>>> 26cb53f (dinamização, generalizando nicho/usabilidade)
                    setTimeout(startOrcamento, 300);
                    break;

                case "goto_agendamento":
                    state.step = "agendamento_nome";
                    setTimeout(startAgendamento, 300);
                    break;

<<<<<<< HEAD
                case "goto_ideas":
=======
                case "goto_sugestao":
>>>>>>> 26cb53f (dinamização, generalizando nicho/usabilidade)
                    state.step = "ideas_1";
                    setTimeout(ideasFlow, 300);
                    break;

                case "goto_faq":
                    state.step = "faq";
                    setTimeout(showFaq, 300);
                    break;

                case "goto_handoff":
                    state.step = "handoff";
                    setTimeout(handoff, 300);
                    break;

<<<<<<< HEAD
                case "select_regiao":
                    state.memory.regiao = val;
                    state.step = "orcamento_tamanho";
                    bot(`Ótimo — região: <strong>${val}</strong>. Agora me diga o tamanho aproximado:`);
                    quickButtons([
                        {label:"Pequena(até 7cm)", action:"select_tamanho", value:"Pequena(até 7cm)"},
                        {label:"Média(8 a 20cm )", action:"select_tamanho", value:"Média(8 a 20cm )"},
                        {label:"Grande(acima de 20cm)", action:"select_tamanho", value:"Grande(acima de 20cm)"}
                    ]);
                    break;

                case "select_tamanho":
                    state.memory.tamanho = val;
                    state.step = "orcamento_estilo";
                    bot(`Entendido — tamanho: <strong>${val}</strong>. Qual estilo prefere?`);
                    quickButtons([
                        {label:"Fine line", action:"select_estilo", value:"Fine line"},
                        {label:"Realismo", action:"select_estilo", value:"Realismo"},
                        {label:"Old school", action:"select_estilo", value:"Old school"},
                        {label:"Geométrico", action:"select_estilo", value:"Geométrico"},
                        {label:"Não sei", action:"select_estilo", value:"Não sei"}
                    ]);
                    break;

                case "select_estilo":
                    state.memory.estilo = val;
                    const est = estimatePrice(state.memory);
                    bot(`Para *${state.memory.estilo}* no local *${state.memory.regiao}* e tamanho *${state.memory.tamanho}* estimamos entre <strong>R$ ${est.min} e R$ ${est.max}</strong>.`);
=======
                case "action_orcamento":
                    state.memory.regiao = val;
                    state.step = "orcamento_opcoes";
                    bot(`Ótimo, orçamento para <strong>${val}</strong>. Agora me diga o tipo:`);
                    quickButtons([
                        {label:"opção1", action:"action", value:"opção1"},
                        {label:"opção2", action:"action", value:"opção2"},
                        {label:"opção3", action:"action", value:"opção3"}
                    ]);
                    break;

                case "action":
                    state.memory.tamanho = val;
                    state.step = "orcamento_estilo";
                    bot(`Entendido, <strong>${val}</strong>. Qual marca prefere?`);
                    quickButtons([
                        {label:"opção1", action:"action2", value:"opção1"},
                        {label:"opção2", action:"action2", value:"opção2"},
                        {label:"opção3", action:"action2", value:"opção3"},
                        {label:"opção4", action:"action2", value:"opção4"},
                        {label:"Não sei", action:"action2", value:"Não sei"}
                    ]);
                    break;

                case "action2":
                    state.memory.estilo = val;
                    const est = estimatePrice(state.memory);
                    bot(`Para ${state.memory.regiao} da marca ${state.memory.estilo} e ${state.memory.tamanho} estimamos entre <strong>R$ ${est.min} e R$ ${est.max}</strong>.`);
>>>>>>> 26cb53f (dinamização, generalizando nicho/usabilidade)
                    quickButtons([
                        {label:"Enviar referências via WhatsApp", action:"send_whatsapp_orc"},
                        {label:"Voltar ao menu", action:"back_menu"}
                    ]);
                    break;

                case "send_whatsapp_orc":
<<<<<<< HEAD
                    openWhatsApp(`Olá! Gostaria de enviar referências para orçamento. Região: ${state.memory.regiao}. Tamanho: ${state.memory.tamanho}. Estilo: ${state.memory.estilo}.`);
=======
                    openWhatsApp(`Olá! Gostaria de solicitar orçamento.`);
>>>>>>> 26cb53f (dinamização, generalizando nicho/usabilidade)
                    break;

                case "back_menu":
                    showMainMenu();
                    break;

                case "select_service":
                    state.memory.service = val;
                    bot(`Serviço escolhido: <strong>${val}</strong>. Escolha uma data disponível:`);
                    quickButtons([
                        {label:"Amanhã 14:00", action:"choose_date", value:"Amanhã 14:00"},
                        {label:"Amanhã 16:00", action:"choose_date", value:"Amanhã 16:00"},
                        {label:"Sábado 11:00", action:"choose_date", value:"Sábado 11:00"},
                        {label:"Outra data", action:"choose_date", value:"Outra"}
                    ]);
                    break;

                case "choose_date":
                    state.memory.datetime = val;
                    bot(`Perfeito — vamos confirmar: Nome: <strong>${state.memory.name}</strong>, WhatsApp: <strong>${state.memory.phone}</strong>, Serviço: <strong>${state.memory.service}</strong>, Data/horário: <strong>${val}</strong>.`);
                    quickButtons([
                        {label:"Confirmar agendamento", action:"confirm_appointment"},
                        {label:"Voltar ao menu", action:"back_menu"}
                    ]);
                    break;

                case "confirm_appointment":
                    sendAppointmentToBackend(state.memory);
                    break;

                case "select_idea":
<<<<<<< HEAD
                    openWhatsApp(`Olá! Gostaria de receber ideias de tatuagem. Preferência: ${btn.label}`);
=======
                    openWhatsApp(`Olá! Gostaria de receber ideias. Preferência: ${btn.label}`);
>>>>>>> 26cb53f (dinamização, generalizando nicho/usabilidade)
                    break;

                default:
                    console.warn("Ação desconhecida:", act);
                    break;
            }
        } // end handleQuick

      // ---------- ORÇAMENTO flow ----------
      function startOrcamento(){
<<<<<<< HEAD
        bot("Beleza. Primeiro, selecione a região do corpo:");
        quickButtons([
          {label:"Braço", action:"select_regiao", value:"Braço"},
          {label:"Antebraço", action:"select_regiao", value:"Antebraço"},
          {label:"Costas", action:"select_regiao", value:"Costas"},
          {label:"Perna", action:"select_regiao", value:"Perna"},
          {label:"Pescoço", action:"select_regiao", value:"Pescoço"},
          {label:"Outra", action:"select_regiao", value:"Outra"}
=======
        bot("Beleza. Qual o assunto?");
        quickButtons([
          {label:"Peças", action:"action_orcamento", value:"Peças"},
          {label:"Serviços", action:"action_orcamento", value:"Serviços"},
          {label:"Visita", action:"action_orcamento", value:"Visita"}
>>>>>>> 26cb53f (dinamização, generalizando nicho/usabilidade)
        ]);
      }

      // price estimation rules (simple)
      function estimatePrice(mem){
        const base = {Pequena:[120,260], Média:[300,600], Grande:[700,1500]};
        const styleMul = (mem.estilo && mem.estilo.toLowerCase().includes("realismo")) ? 1.4 : 1.0;
        const t = mem.tamanho || "Pequena";
        const rng = base[t] || base["Pequena"];
        const min = Math.round(rng[0]*styleMul);
        const max = Math.round(rng[1]*styleMul);
        return {min,max};
      }

      // ---------- AGENDAMENTO flow ----------
      function startAgendamento(){
        bot("Ótimo — vamos agendar. Qual seu nome?");
        // show input
        showInput((txt)=>{
          if(!txt) { bot("Nome é necessário para continuar."); return; }
          state.memory.name = txt;
          bot("Agora informe seu WhatsApp (ex: +55119xxxxxx).");
          showInput((phone)=>{
            if(!phone){ bot("WhatsApp é necessário."); return; }
            state.memory.phone = phone;
            bot("Qual serviço deseja?");
            quickButtons([
              {label:"Tatuagem pequena", action:"select_service", value:"Tatuagem pequena"},
              {label:"Tatuagem média", action:"select_service", value:"Tatuagem média"},
              {label:"Tatuagem grande", action:"select_service", value:"Tatuagem grande"},
              {label:"Retoque", action:"select_service", value:"Retoque"},
              {label:"Consultoria", action:"select_service", value:"Consultoria"}
            ]);
          });
        });
      }

      // ---------- IDEAS flow ----------
      function ideasFlow(){
        bot("Que massa — prefere algo minimalista ou detalhado?");
        quickButtons([
          {label:"Minimalista", action:"select_idea", value:"Minimalista"},
          {label:"Detalhado", action:"select_idea", value:"Detalhado"},
          {label:"Tenho referências", action:"select_idea", value:"Tenho referências"},
          {label:"Quero ver sugestões", action:"select_idea", value:"Sugestoes"}
        ]);
      }

      // ---------- FAQ ----------
      function showFaq(){
        bot(`<strong>📍 Endereço:</strong> Rua Fictícia, 123 - Bairro Tattoo, SP<br/>
             <strong>🕒 Horário:</strong> Seg-Sáb 10:00 — 19:00<br/>
             <strong>💲 Preços:</strong> Pequenas a partir de R$150<br/>
             <strong>👤 Artista:</strong> Vinicius Queiroz — fine line & realismo`);
        quickButtons([{label:"Voltar ao menu", action:"back_menu"}]);
      }

      // ---------- HANDOFF (WhatsApp) ----------
      function handoff(){
<<<<<<< HEAD
        bot("Ok — vou abrir o WhatsApp para você falar com alguém do estúdio. Deseja prosseguir?");
=======
        bot("Ok — vou abrir o WhatsApp para você falar com alguém. Deseja prosseguir?");
>>>>>>> 26cb53f (dinamização, generalizando nicho/usabilidade)
        quickButtons([{label:"Abrir WhatsApp", action:"open_whatsapp_handoff"}, {label:"Voltar", action:"back_menu"}]);
      }

      // ---------- utilities ----------
      function openWhatsApp(message){
        const phone = cfg.whatsappNumber.replace(/\D/g,'');
        const txt = encodeURIComponent(message || "Olá, gostaria de atendimento.");
        window.open(`https://wa.me/${phone}?text=${txt}`, "_blank");
      }

      // show input (footer) and callback user input
      function showInput(cb){
        footerEl.style.display = "flex";
        inputEl.value = "";
        inputEl.focus();
        function handleSend(){
          const v = inputEl.value && inputEl.value.trim();
          if(!v) return;
          user(v);
          footerEl.style.display = "none";
          inputEl.removeEventListener("keydown", onKey);
          sendEl.removeEventListener("click", handleSend);
          cb(v);
        }
        function onKey(e){
          if(e.key === "Enter") handleSend();
        }
        sendEl.addEventListener("click", handleSend);
        inputEl.addEventListener("keydown", onKey);
      }

      function sendAppointmentToBackend(mem){
        bot("Enviando seu agendamento... um instante.");
        const payload = {
          name: mem.name || "cliente",
          phone: mem.phone || "",
          service: mem.service || "Solicitado",
          datetime: mem.datetime || new Date().toISOString()
        };
        fetch("/api/appointments", {
          method:"POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify(payload)
        }).then(r=>r.json())
        .then(resp=>{
          if(resp.error){
            bot("Houve um erro ao salvar seu agendamento. Tente novamente ou fale conosco via WhatsApp.");
            quickButtons([{label:"Falar via WhatsApp", action:"goto_handoff"}, {label:"Voltar ao menu", action:"back_menu"}]);
            return;
          }
          bot(`Agendamento registrado com ID <strong>${resp.id}</strong>. Deseja abrir o WhatsApp para enviar mais detalhes e foto de referência?`);
          quickButtons([{label:"Abrir WhatsApp", action:"open_whatsapp_confirm"}, {label:"Voltar ao menu", action:"back_menu"}]);
        }).catch(err=>{
          bot("Falha na comunicação com o servidor. Verifique a conexão.");
          quickButtons([{label:"Falar via WhatsApp", action:"goto_handoff"}, {label:"Voltar ao menu", action:"back_menu"}]);
        });
      }

      // handle specific quick actions referencing open_whatsapp_confirm and open_whatsapp_handoff
      document.addEventListener("click", function(e){
        const t = e.target;
        if(!t.classList.contains("evq-btn")) return;
        const act = t.dataset.action;
        if(act === "open_whatsapp_confirm" || act === "open_whatsapp_handoff"){
          openWhatsApp("Olá, acabei de agendar e gostaria de enviar mais detalhes.");
        } else if(act === "goto_handoff"){
          openWhatsApp("Olá! Gostaria de falar com alguém do estúdio.");
        }
      });

      // start on first fab click
      fab.addEventListener("click", ()=>{
        if(widget.style.display === "none" || widget.style.display === ""){
          startConversation();
          fab.style.transform = "translateY(6px) rotate(12deg)";
          setTimeout(()=> fab.style.transform = "", 220);
        } else {
          widget.style.display = "none";
        }
      });

      bodyEl.addEventListener("click", function(e){
        const b = e.target.closest(".evq-btn");
        if(!b) return;
        const act = b.dataset.action;
        if(act === "open_whatsapp_confirm"){
          openWhatsApp("Olá, acabei de confirmar meu agendamento.");
        }
      });

      window._evq_state = state;
    }
  };

  window.ChatWidget = ChatWidget;
})(window);