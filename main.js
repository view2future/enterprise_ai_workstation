
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const waitOn = require('wait-on');

let backendProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    title: "联图 / Nexus - 西南AI产业生态智研决策平台",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    backgroundColor: '#000000',
    icon: path.join(__dirname, 'assets/icon.png')
  });

  // 加载前端
  // 开发环境下使用 localhost，打包后加载 build 目录
  const isDev = !app.isPackaged;
  if (isDev) {
    win.loadURL('http://localhost:3000');
  } else {
    win.loadFile(path.join(__dirname, 'frontend/dist/index.html'));
  }
}

function startBackend() {
  const isDev = !app.isPackaged;
  let backendPath = path.join(__dirname, 'backend/dist/main.js');
  
  if (!isDev) {
    backendPath = backendPath.replace('app.asar', 'app.asar.unpacked');
  }

  console.log('🚀 正在启动联图智研后端引擎...');
  console.log(`Backend path: ${backendPath}`);
  
  backendProcess = spawn(process.execPath, [backendPath], {
    env: { 
      ...process.env, 
      ELECTRON_RUN_AS_NODE: '1',
      DATABASE_URL: `file:${path.join(app.getPath('userData'), 'nexus_desktop.db')}` 
    }
  });

  backendProcess.stdout.on('data', (data) => console.log(`[Backend]: ${data}`));
  backendProcess.stderr.on('data', (data) => console.error(`[Backend ERROR]: ${data}`));
}

app.whenReady().then(() => {
  startBackend();
  
  // 等待后端 3001 端口就绪后再打开窗口
  waitOn({ resources: ['http://localhost:3001/api/health'] }).then(() => {
    createWindow();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
  if (backendProcess) backendProcess.kill();
});
