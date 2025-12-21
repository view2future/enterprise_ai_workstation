(function() {
  if (document.getElementById('demo-subtitle-hud')) return;

  const style = document.createElement('style');
  style.id = 'demo-style-overrides';
  style.innerHTML = `
    #demo-subtitle-hud {
      position: fixed !important;
      bottom: 60px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      z-index: 2147483647 !important;
      background: rgba(0, 0, 0, 0.95) !important;
      color: #f59e0b !important; /* 字幕颜色改为黄色 */
      padding: 20px 40px !important;
      border: 4px solid #3b82f6 !important;
      box-shadow: 10px 10px 0px 0px rgba(0,0,0,1) !important;
      font-family: 'Inter', system-ui, sans-serif !important;
      font-weight: 900 !important;
      font-size: 24px !important;
      text-transform: uppercase !important;
      max-width: 80% !important;
      text-align: center !important;
      pointer-events: none !important;
      transition: all 0.3s ease !important;
    }

    #demo-control-fab {
      position: fixed !important;
      top: 50% !important; /* 垂直居中 */
      right: 20px !important; /* 靠右 */
      transform: translateY(-50%) !important;
      z-index: 2147483647 !important;
      width: 60px !important;
      height: 60px !important;
      background: #f59e0b !important;
      border: 4px solid #000 !important;
      border-radius: 50% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: pointer !important;
      box-shadow: 4px 4px 0px 0px rgba(0,0,0,1) !important;
      transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
    }

    #demo-control-fab:hover {
      transform: translateY(-50%) scale(1.1) !important;
      right: 25px !important;
    }

    #demo-control-fab:active {
      transform: translateY(-50%) translate(2px, 2px) !important;
      box-shadow: none !important;
    }
  `;
  document.documentElement.appendChild(style);

  const hud = document.createElement('div');
  hud.id = 'demo-subtitle-hud';
  hud.innerText = 'Neural Matrix Initialized...';
  document.documentElement.appendChild(hud);

  const fab = document.createElement('div');
  fab.id = 'demo-control-fab';
  fab.title = 'Play/Pause Demo';
  fab.innerHTML = '<span id="demo-icon" style="font-size: 24px; color: black;">⏸</span>';
  fab.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.demoPaused = !window.demoPaused;
    document.getElementById('demo-icon').innerText = window.demoPaused ? '▶️' : '⏸';
    fab.style.background = window.demoPaused ? '#10b981' : '#f59e0b';
  };
  document.documentElement.appendChild(fab);

  window.demoOverlayLoaded = true;
  window.demoPaused = window.demoPaused || false;

  window.setDemoSubtitle = (text) => {
    const el = document.getElementById('demo-subtitle-hud');
    if (el) el.innerText = text;
  };
})();