INSTRUÇÕES DE EMBUTIR O WIDGET
----------------------------
1. Copie os arquivos static/widget.js e static/widget.css para seu servidor ou inclua via <script> e <link>.
2. Adicione em qualquer página HTML:
   <div id="widget-placeholder"></div>
   <link rel="stylesheet" href="/static/widget.css">
   <script src="/static/widget.js"></script>
   <script>
     window.ChatWidget && window.ChatWidget.init({ selector:"#widget-placeholder" });
   </script>
3. Ajuste o número de WhatsApp e textos no arquivo static/widget.js ou configure via rota /widget/config (ex: fetch("/widget/config") para dinamizar).
