
(function(){
  const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const body=document.body;
  if(!body) return;

  if(['turno.html','giornate.html','promo.html','servizi.html'].includes(path)){
    body.classList.add('page-logo-only');
  }
  if(path==='turno.html') body.classList.add('page-turno');
  if(path==='servizi.html') body.classList.add('page-servizi');
  if(path==='fortuna.html') body.classList.add('page-fortuna');

  function parseUser(){
    try{return JSON.parse(localStorage.getItem('farmaciaCurrentUser')||'null');}catch(e){return null;}
  }

  if(path==='turno.html'){
    const side=document.querySelector('.hero-side');
    if(side) side.remove();
    const kicker=document.querySelector('.page-kicker');
    if(kicker) kicker.textContent='Farmacie di turno a Matera';
  }

  if(path==='servizi.html'){
    const badge=document.querySelector('.focus-badge');
    const title=document.querySelector('.focus-copy h2');
    if(badge) badge.textContent='Servizio del momento';
    if(title) title.textContent='TRICO';
  }

  if(path==='index.html'){
    const wrap=document.getElementById('miaAssistantWrap');
    const bubble=document.getElementById('miaBubble');
    const bubbleText=document.getElementById('miaBubbleTyping');
    const panel=document.getElementById('miaChatPanel');
    const closeBtn=document.getElementById('miaChatClose');
    const trigger=document.getElementById('miaTrigger');
    const mini=document.getElementById('miaMiniCta');
    if(wrap && bubble && bubbleText){
      const user=parseUser();
      const firstName=(user && (user.name || user.nome)) ? String(user.name||user.nome).trim() : '';
      const isLogged=localStorage.getItem('farmaciaLoggedIn')==='true' && !!user;
      const hasVisited=sessionStorage.getItem('miaSessionVisited')==='true';
      const intro=isLogged
        ? `Ciao ${firstName || 'cliente'}, benvenuto. Sono Mia, ti aiuto io.`
        : 'Ciao, sono MIA. Ti aiuto a prenotare esami e servizi in farmacia.';
      const returning=isLogged
        ? `Bentornato ${firstName || 'cliente'}. Per altri bisogni puoi contattarmi quando vuoi.`
        : 'Per altri bisogni puoi contattarmi quando vuoi.';
      let timer=null;
      let typingTimer=null;
      function stopTyping(){ if(typingTimer){clearInterval(typingTimer); typingTimer=null;} }
      function hideBubble(){ wrap.classList.remove('is-bubble-visible'); }
      function typeMessage(msg){
        stopTyping();
        bubbleText.textContent='';
        let i=0;
        typingTimer=setInterval(function(){
          bubbleText.textContent=msg.slice(0,i+1);
          i++;
          if(i>=msg.length){stopTyping();}
        },28);
      }
      function showMessage(msg,duration){
        clearTimeout(timer);
        wrap.classList.remove('is-chat-open');
        if(panel) panel.setAttribute('aria-hidden','true');
        wrap.classList.add('is-bubble-visible');
        typeMessage(msg);
        timer=setTimeout(hideBubble,duration||5000);
      }
      const firstMsg=hasVisited ? returning : intro;
      setTimeout(function(){ showMessage(firstMsg,5000); sessionStorage.setItem('miaSessionVisited','true'); },700);
      function openChat(){
        clearTimeout(timer); stopTyping(); hideBubble();
        wrap.classList.add('is-chat-open');
        if(panel) panel.setAttribute('aria-hidden','false');
      }
      function closeChat(){
        wrap.classList.remove('is-chat-open');
        if(panel) panel.setAttribute('aria-hidden','true');
        showMessage(returning,5000);
      }
      if(trigger) trigger.onclick=openChat;
      bubble.onclick=openChat;
      if(mini) mini.onclick=openChat;
      if(closeBtn) closeBtn.onclick=closeChat;
      window.addEventListener('pageshow', function(e){
        if(e.persisted){ showMessage(returning,5000); }
      });
    }
  }
})();
