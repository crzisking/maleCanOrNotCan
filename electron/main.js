import {app, BrowserWindow} from 'electron';
import {join} from 'path';

function createWindow() {
  const win = new BrowserWindow({
    width: 480,  // 模拟手机 App 的宽度体验
    height: 850,
    resizable: true, // 允许调整大小，但在桌面端保持手机比例体验更好
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // 简化通信，生产环境建议开启隔离
    },
    autoHideMenuBar: true, // 隐藏 Windows 菜单栏
    titleBarStyle: 'hiddenInset' // Mac 风格标题栏
  });

  // 区分开发环境和生产环境
  // 注意：在本地开发时，请确保先运行 npm run electron:dev
  const isDev = !app.isPackaged;

  if (isDev) {
    win.loadURL('http://localhost:5173');
    // win.webContents.openDevTools(); // 开发时可打开控制台
  } else {
    // 生产环境加载打包后的文件
    win.loadFile(join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
