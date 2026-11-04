/* Interactive Play – aviso para o adulto na primeira visita e escolha da contagem anônima (Google Analytics).
   Usado pela página de entrada e pelos jogos. A escolha fica salva só neste navegador.
   Uso: <script src=".../assets/aceite.js?v=1" data-idade="6" data-politica=".../privacidade.html"></script> no <head>, antes dos outros scripts.
   Os jogos chamam XalingoAceite.aoPermitir(funçãoQueLigaOGA): ela só roda se o adulto permitir. */
(function () {
  'use strict';
  var CHAVE = 'xalingo_interactive_play_aceite', VERSAO = 1;
  var me = document.currentScript || {};
  var cfg = { idade: (me.dataset && me.dataset.idade) || '', politica: (me.dataset && me.dataset.politica) || 'privacidade.html', auto: !(me.dataset && me.dataset.auto === '0') };
  var fila = [], estado = null;
  try { estado = JSON.parse(localStorage.getItem(CHAVE) || 'null'); } catch (e) { estado = null; }
  if (estado && estado.v !== VERSAO) estado = null;

  function salvar(ga) {
    var d = new Date(), p2 = function (n) { return (n < 10 ? '0' : '') + n; };
    estado = { v: VERSAO, ga: !!ga, em: d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()) };
    try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (e) {}
  }
  function apagarCookiesGA() {
    try {
      document.cookie.split(';').forEach(function (c) {
        var n = c.split('=')[0].trim();
        if (/^_ga/.test(n)) ['', location.hostname, '.' + location.hostname].forEach(function (d) {
          document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
        });
      });
    } catch (e) {}
  }
  function decidir(ga) {
    salvar(ga);
    if (ga) { window['ga-disable-G-HB9RN5N1J2'] = false; fila.splice(0).forEach(function (f) { try { f(); } catch (e) {} }); }
    else { window['ga-disable-G-HB9RN5N1J2'] = true; apagarCookiesGA(); }
    fechar();
  }

  var CSS = '.xa-fundo{position:fixed;inset:0;z-index:9999;background:rgba(10,24,60,.62);display:flex;align-items:center;justify-content:center;padding:16px;font-family:inherit}' +
    '.xa-caixa{width:min(480px,100%);max-height:calc(100vh - 32px);overflow:auto;background:#fff;color:#1D2540;border-radius:22px;padding:20px 18px 16px;box-shadow:0 18px 50px rgba(0,0,0,.35);text-align:left}' +
    '.xa-caixa h2{margin:0 0 4px;font-size:20px;line-height:1.2;color:#0E2C6B;font-weight:800;text-transform:none;letter-spacing:0}' +
    '.xa-caixa .xa-sub{margin:0 0 12px;font-size:14px;color:#5B6380;line-height:1.45}' +
    '.xa-caixa ul{list-style:none;margin:0 0 14px;padding:0;display:grid;gap:8px}' +
    '.xa-caixa li{display:flex;gap:10px;font-size:14.5px;line-height:1.45;background:#F6F4EE;border-radius:12px;padding:9px 11px}' +
    '.xa-caixa li span:first-child{flex:none;font-size:18px;line-height:1.2}' +
    '.xa-caixa .xa-bts{display:grid;gap:8px}' +
    '.xa-caixa button{font:inherit;font-weight:800;font-size:15px;border:0;border-radius:14px;padding:13px 14px;cursor:pointer;line-height:1.25}' +
    '.xa-sim{background:#164194;color:#fff;box-shadow:0 4px 0 #0E2C6B}' +
    '.xa-nao{background:#fff;color:#164194;border:2px solid #164194!important}' +
    '.xa-caixa .xa-rod{margin:12px 0 0;font-size:12.5px;color:#5B6380;text-align:center;line-height:1.5}' +
    '.xa-caixa a{color:#164194;font-weight:700;text-decoration:underline}';
  var raiz = null;
  function abrir() {
    if (raiz) return;
    if (!document.getElementById('xa-css')) { var st = document.createElement('style'); st.id = 'xa-css'; st.textContent = CSS; document.head.appendChild(st); }
    raiz = document.createElement('div'); raiz.className = 'xa-fundo'; raiz.setAttribute('role', 'dialog'); raiz.setAttribute('aria-modal', 'true'); raiz.setAttribute('aria-labelledby', 'xa-t');
    var idade = cfg.idade ? 'Indicado a partir de ' + cfg.idade + ' anos, com um adulto por perto.' : 'Feito para crianças, com um adulto por perto.';
    raiz.innerHTML = '<div class="xa-caixa">' +
      '<h2 id="xa-t">Olá! Antes de começar, um aviso para o adulto</h2>' +
      '<p class="xa-sub">Os jogos Interactive Play da Xalingo foram feitos para brincar junto com o quebra-cabeça.</p>' +
      '<ul>' +
      '<li><span>👧</span><span>' + idade + ' Com a câmera, brinque parado e em um lugar seguro.</span></li>' +
      '<li><span>📷</span><span>A câmera só reconhece o quebra-cabeça ou lê o QR code. Nenhuma foto ou vídeo sai do aparelho.</span></li>' +
      '<li><span>🔒</span><span>Sem cadastro, sem pagamento e sem propaganda. Medalhas e preferências ficam só neste aparelho.</span></li>' +
      '<li><span>📊</span><span>Se você permitir, contamos os acessos de forma anônima (Google Analytics, sem publicidade) para melhorar os jogos.</span></li>' +
      '</ul>' +
      '<div class="xa-bts"><button class="xa-sim" type="button">Permitir a contagem anônima e começar</button><button class="xa-nao" type="button">Começar sem a contagem</button></div>' +
      '<p class="xa-rod">Você pode mudar esta escolha quando quiser. <a href="' + cfg.politica + '" target="_blank" rel="noopener">Política de privacidade</a></p>' +
      '</div>';
    document.body.appendChild(raiz);
    raiz.querySelector('.xa-sim').onclick = function () { decidir(true); };
    raiz.querySelector('.xa-nao').onclick = function () { decidir(false); };
    setTimeout(function () { try { raiz.querySelector('.xa-sim').focus({ preventScroll: true }); } catch (e) {} }, 60);
  }
  function fechar() { if (raiz) { raiz.remove(); raiz = null; } }

  window.XalingoAceite = {
    ga: function () { return !!(estado && estado.ga); },
    decidido: function () { return !!estado; },
    aoPermitir: function (f) { if (estado && estado.ga) { try { f(); } catch (e) {} } else fila.push(f); },
    reabrir: function () { abrir(); },
    escolha: function () { return estado; }
  };
  if (estado && !estado.ga) window['ga-disable-G-HB9RN5N1J2'] = true;
  if (!estado && cfg.auto) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', abrir); else abrir();
  }
})();
