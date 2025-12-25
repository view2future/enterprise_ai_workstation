const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // 这里可以添加需要在前端使用的原生功能
  platform: process.platform,
});

window.addEventListener('DOMContentLoaded', () => {
  console.log('[PRELOAD] Electron context bridges established.');
});
