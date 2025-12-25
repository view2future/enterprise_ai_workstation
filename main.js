const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const waitOn = require('wait-on');
const fs = require('fs');

// 全局捕获主进程未处理的异常
process.on('uncaughtException', (error) => {
  console.error('主进程异常:', error);
  if (app.isReady()) {
    dialog.showErrorBox('系统启动失败', `核心组件发生错误: \n${error.message}`);
  }
});

let backendProcess;
let splashWindow;
let mainWindow;
let startupLog = `[SYSTEM INFO]
Date: ${new Date().toLocaleString()}
OS: ${process.platform}
Arch: ${process.arch}
----------------------------------
`;

const isDev = !app.isPackaged;

// 统一日志记录器
function logTrace(msg) {
  const entry = `[${new Date().toLocaleTimeString()}] ${msg}\n`;
  console.log(msg);
  startupLog += entry;
}

// 导出日志 IPC
ipcMain.handle('export-startup-log', async () => {
  const { filePath } = await dialog.showSaveDialog({
    title: '导出系统启动日志',
    defaultPath: path.join(app.getPath('desktop'), 'nexus_error_log.txt'),
    filters: [{ name: 'Text Files', extensions: ['txt'] }]
  });

  if (filePath) {
    fs.writeFileSync(filePath, startupLog);
    return true;
  }
  return false;
});

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 600,
    height: 400,
    frame: false,
    transparent: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    backgroundColor: '#000000',
  });

  const splashRelativePath = 'assets/init.html';
  const splashAbsolutePath = path.join(__dirname, splashRelativePath);
  
  // 诊断逻辑：如果文件不存在，弹出目录列表
  if (!fs.existsSync(splashAbsolutePath)) {
    const dirContent = fs.readdirSync(__dirname);
    dialog.showErrorBox('资源丢失', `无法找到启动页面: ${splashAbsolutePath}\n当前包内目录: ${dirContent.join(', ')}`);
  }

  // 使用相对路径加载，Electron 会自动处理 ASAR 寻址
  splashWindow.loadFile(splashRelativePath).catch(err => {
    console.error('Splash Load Error:', err);
    dialog.showErrorBox('界面加载失败', `无法加载启动界面: ${err.message}\n路径: ${splashRelativePath}`);
  });
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
      preload: path.join(__dirname, 'preload.js')
    },
    backgroundColor: '#000000',
    icon: path.join(__dirname, 'assets/icon.png')
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    // 生产环境：使用相对路径加载前端静态文件
    const indexRelativePath = 'frontend/dist/index.html';
    mainWindow.loadFile(indexRelativePath).catch(err => {
      console.error('Main Window Load Error:', err);
      const fullPath = path.join(__dirname, indexRelativePath);
      dialog.showErrorBox('主界面加载失败', `相对路径: ${indexRelativePath}\n绝对路径: ${fullPath}`);
    });
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
  
  const backendDir = path.dirname(backendPath);
  
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
    logTrace('正在清理环境并校验数据存储...');
    sendStatus('正在清理环境并校验数据存储...', 20);
    
    try {
      if (process.platform === 'darwin' || process.platform === 'linux') {
        const cleanup = spawn('pkill', ['-f', 'backend/dist/main.js']);
        await Promise.race([
          new Promise(resolve => cleanup.on('close', resolve)),
          new Promise(resolve => setTimeout(resolve, 2000))
        ]);
        logTrace('已尝试清理旧的后端进程');
      }
    } catch (e) {
      logTrace(`进程清理跳过: ${e.message}`);
    }

    const userDataPath = app.getPath('userData');
    const absoluteDbPath = path.resolve(userDataPath, 'nexus_desktop.db');
    startupLog += `DB_PATH: ${absoluteDbPath}\n`;
    
    if (!fs.existsSync(userDataPath)) {
      try {
        fs.mkdirSync(userDataPath, { recursive: true });
        logTrace(`创建用户数据目录: ${userDataPath}`);
      } catch (e) {
        throw new Error(`无法创建用户数据目录: ${e.message}`);
      }
    }

    if (!fs.existsSync(absoluteDbPath)) {
      sendStatus('正在准备演示数据库 (首次启动)...', 40);
      logTrace('正在从资源目录拷贝初始数据库...');
      
      let dbSource = isDev
        ? path.join(__dirname, 'backend/prisma/nexus_desktop.db')
        : path.join(process.resourcesPath, 'backend/prisma/nexus_desktop.db');
      
      if (fs.existsSync(dbSource)) {
        try {
          fs.copyFileSync(dbSource, absoluteDbPath);
          fs.chmodSync(absoluteDbPath, 0o666);
          logTrace('数据库文件拷贝并提权成功');
        } catch (e) {
          throw new Error(`数据库初始化失败: ${e.message}`);
        }
      } else {
        logTrace(`警告: 找不到预置库源 ${dbSource}`);
      }
    }

    sendStatus('正在启动联图智研后端引擎...', 60);
    logTrace(`启动后端进程: ${backendPath}`);
    
    const backendNodeModules = isDev
      ? path.join(__dirname, 'backend/node_modules')
      : path.join(process.resourcesPath, 'backend/node_modules');
    
    backendProcess = spawn(process.execPath, [backendPath], {
      cwd: backendDir,
      env: { 
        ...process.env, 
        ELECTRON_RUN_AS_NODE: '1',
        DATABASE_URL: `file:${absoluteDbPath}`,
        NODE_PATH: backendNodeModules,
        PORT: '3001',
        NODE_ENV: 'production'
      }
    });

    const updateLog = (data) => {
      const msg = data.toString();
      startupLog += msg;
      
      if (msg.toLowerCase().includes('fault') || msg.toLowerCase().includes('denied') || msg.toLowerCase().includes('error')) {
        sendError('核心组件访问受限 (Security_Access_Fault)', startupLog);
        // 发生严重错误时，尝试静默保存一份到 userData
        try { fs.writeFileSync(path.join(userDataPath, 'startup_crash.log'), startupLog); } catch(e) {}
      }
    };

    backendProcess.stdout.on('data', updateLog);
    backendProcess.stderr.on('data', updateLog);

    backendProcess.on('exit', (code) => {
      if (code !== 0 && code !== null) {
        logTrace(`后端异常退出，退出码: ${code}`);
        sendError('后端引擎异常退出', startupLog);
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