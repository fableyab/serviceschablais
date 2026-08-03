(function(){
  var banner = document.getElementById('cookie-banner');
  var choice = localStorage.getItem('sc_cookie_choice');
  if(banner && !choice){ banner.classList.add('open'); }
  function setChoice(val){
    localStorage.setItem('sc_cookie_choice', val);
    if(banner){ banner.classList.remove('open'); }
  }
  var accept = document.getElementById('cookie-accept');
  var refuse = document.getElementById('cookie-refuse');
  var customize = document.getElementById('cookie-customize');
  if(accept) accept.addEventListener('click', function(){ setChoice('accepte'); });
  if(refuse) refuse.addEventListener('click', function(){ setChoice('refuse'); });
  if(customize) customize.addEventListener('click', function(){ setChoice('personnalise'); });

  var modal = document.getElementById('quote-modal');
  if(modal){
    var modalSeen = sessionStorage.getItem('sc_quote_modal_seen');
    if(!modalSeen){
      setTimeout(function(){ modal.classList.add('open'); }, 8000);
    }
    function closeModal(){
      modal.classList.remove('open');
      sessionStorage.setItem('sc_quote_modal_seen', '1');
    }
    var modalClose = document.getElementById('quote-modal-close');
    var modalCta = document.getElementById('quote-modal-cta');
    if(modalClose) modalClose.addEventListener('click', closeModal);
    if(modalCta) modalCta.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e){ if(e.target === modal){ closeModal(); } });
  }
})();
