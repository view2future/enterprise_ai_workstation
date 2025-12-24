const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const waitOn = require('wait-on');
const fs = require('fs');

let backendProcess;
let splashWindow;
let mainWindow;

const isDev = !app.isPackaged;

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 600,
    height: 400,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    backgroundColor: '#000000',
  });

  const splashPath = isDev 
    ? path.join(__dirname, 'assets/init.html')
    : path.join(process.resourcesPath, 'assets/init.html');
  
  splashWindow.loadFile(splashPath);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    show: false,
    title: "联图 / Nexus - 西南AI产业生态智研决策平台",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    backgroundColor: '#000000',
    icon: isDev 
      ? path.join(__dirname, 'assets/icon.png')
      : path.join(process.resourcesPath, 'assets/icon.png')
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'frontend/dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.close();
    }
    mainWindow.show();
  });
}

async function startBackend() {
  let backendPath = isDev
    ? path.join(__dirname, 'backend/dist/main.js')
    : path.join(process.resourcesPath, 'backend/dist/main.js');
  
  const sendStatus = (message, progress) => {
    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.webContents.send('status-update', { message, progress });
    }
  };

  const sendError = (message, log) => {
    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.webContents.send('init-error', { message, log });
    }
  };

  try {
    sendStatus('正在清理环境并校验数据存储...', 20);
    
    // 关键修复：在启动前尝试杀死占用 3001 端口的旧进程
    try {
      if (process.platform === 'darwin' || process.platform === 'linux') {
        spawn('sh', ['-c', 'lsof -i :3001 | grep LISTEN | awk \'{print $2}\' | xargs kill -9']);
        console.log('Cleanup existing backend on port 3001');
        // 给一点点时间让端口释放
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (e) {
      console.warn('Cleanup failed (maybe no process was running):', e);
    }

    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'nexus_desktop.db');
    
    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, { recursive: true });
    }

    if (!fs.existsSync(dbPath)) {
      sendStatus('正在准备演示数据库 (首次启动需较长时间)...', 40);
      
      let dbSource = isDev
        ? path.join(__dirname, 'backend/prisma/nexus_desktop.db')
        : path.join(process.resourcesPath, 'backend/prisma/nexus_desktop.db');
      
      if (fs.existsSync(dbSource)) {
        fs.copyFileSync(dbSource, dbPath);
        console.log('Database initialized at:', dbPath);
      } else {
        throw new Error(`找不到预置数据库文件: ${dbSource}`);
      }
    }

    sendStatus('正在启动联图智研后端引擎...', 60);
    console.log(`Backend path: ${backendPath}`);
    
    const backendNodeModules = isDev
      ? path.join(__dirname, 'backend/node_modules')
      : path.join(process.resourcesPath, 'backend/node_modules');
    
    backendProcess = spawn(process.execPath, [backendPath], {
      cwd: path.dirname(backendPath),
      env: { 
        ...process.env, 
        ELECTRON_RUN_AS_NODE: '1',
        DATABASE_URL: `file:${dbPath}`,
        NODE_PATH: backendNodeModules
      }
    });

    let backendLog = '';
    backendProcess.stdout.on('data', (data) => {
      const msg = data.toString();
      console.log(`[Backend]: ${msg}`);
      backendLog += msg;
    });

    backendProcess.stderr.on('data', (data) => {
      const msg = data.toString();
      console.error(`[Backend ERROR]: ${msg}`);
      backendLog += msg;
    });

    backendProcess.on('exit', (code) => {
      if (code !== 0 && code !== null) {
        sendError('后端引擎异常退出', backendLog);
      }
    });

    sendStatus('等待核心服务就绪...', 80);
    
    await waitOn({ 
      resources: ['http://localhost:3001/api/health'],
      timeout: 30000 // 30s timeout
    });

    sendStatus('初始化完成，正在进入系统...', 100);
    createWindow();

  } catch (err) {
    console.error('Initialization failed:', err);
    sendError('初始化失败', err.message);
  }
}

app.whenReady().then(() => {
  createSplashWindow();
  startBackend();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
  if (backendProcess) backendProcess.kill();
});