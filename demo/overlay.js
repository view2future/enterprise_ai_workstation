
(function() {
  if (window.demoOverlayLoaded) return;
  window.demoOverlayLoaded = true;
  window.demoPaused = false;

  // 创建样式
  const style = document.createElement('style');
  style.innerHTML = `
    #demo-subtitle-hud {
      position: fixed;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 99999;
      background: #000;
      color: #fff;
      padding: 15px 30px;
      border: 4px solid #3b82f6;
      box-shadow: 8px 8px 0px 0px rgba(0,0,0,1);
      font-family: 'Inter', sans-serif;
      font-weight: 900;
      font-size: 18px;
      text-transform: uppercase;
      letter-spacing: 1px;
      max-width: 80%;
      text-align: center;
      pointer-events: none;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    #demo-control-fab {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 100000;
      width: 60px;
      height: 60px;
      background: #f59e0b;
      border: 4px solid #000;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 4px 4px 0px 0px rgba(0,0,0,1);
      transition: all 0.2s;
    }

    #demo-control-fab:hover {
      transform: scale(1.1);
    }

    #demo-control-fab:active {
      transform: translate(2px, 2px);
      box-shadow: none;
    }

    .demo-recording-dot {
      position: fixed;
      top: 20px;
      right: 20px;
      width: 15px;
      height: 15px;
      background: #ef4444;
      border-radius: 50%;
      z-index: 100000;
      animation: blink 1s infinite;
    }

    @keyframes blink {
      0% { opacity: 1; }
      50% { opacity: 0.3; }
      100% { opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  // 创建字幕容器
  const hud = document.createElement('div');
  hud.id = 'demo-subtitle-hud';
  hud.innerText = 'System Initializing...';
  document.body.appendChild(hud);

  // 创建控制按钮
  const fab = document.createElement('div');
  fab.id = 'demo-control-fab';
  fab.innerHTML = '<span id="demo-icon" style="font-size: 24px;">⏸</span>';
  fab.onclick = () => {
    window.demoPaused = !window.demoPaused;
    document.getElementById('demo-icon').innerText = window.demoPaused ? '▶️' : '⏸';
    fab.style.background = window.demoPaused ? '#10b981' : '#f59e0b';
  };
  document.body.appendChild(fab);

  // 全局 API 给 Playwright 调用
  window.setDemoSubtitle = (text) => {
    hud.innerText = text;
    hud.style.transform = 'translateX(-50%) scale(1.05)';
    setTimeout(() => {
      hud.style.transform = 'translateX(-50%) scale(1)';
    }, 200);
  };
})();
