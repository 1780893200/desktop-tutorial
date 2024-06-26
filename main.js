charset = "UTF-8";

const {
  app,
  BrowserWindow,
  shell,
  Menu,

} = require('electron');

const path = require('path');

let dev = true;
//--------------------- init start ---------------------------------
app.whenReady().then(() => {
  //打开窗口
  createWindow();
})

// 新窗口处理
app.on("web-contents-created", (e, webContents) => {
  webContents.on("new-window", (event, url) => {
    event.preventDefault();
    shell.openExternal(url); //使用默认浏览器打开 url，而不是在应用程序内创建新窗口
  });
});
// 关闭所有窗口时的处理
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})
//禁用站点隔离试验
app.commandLine.appendSwitch("disable-site-isolation-trials");
//允许在 localhost 上加载不安全内容
app.commandLine.appendSwitch('allow-insecure-localhost', 'true');
//启用高 DPI 支持，以提高高分辨率显示器上的渲染质量。
app.commandLine.appendSwitch('high-dpi-support', 'true');
//强制设备缩放因子为 1，防止自动调整缩放。
app.commandLine.appendSwitch('force-device-scale-factor', '1');


//Window对象
let win;
const createWindow = () => {
  win = new BrowserWindow({
    width: Math.floor(1920 / 1.4) ,
    height: Math.floor(1080 / 1.4) ,
    // width:1920 / 1.5,
    // height:1080 / 1.5,
    frame: true,
    fullscreen: false,
    resizable: false, // 禁止拉伸窗口
    webPreferences: {
      webSecurity: false,
      webviewTag: true,
      nodeIntegration: true,
      contextIsolation: false,
      webgl: true,
      hardwareAcceleration: true,
      offscreen: false,
      nodeIntegrationInWorker: true,
      preload: path.join(__dirname, 'preload.js')  // 加载 preload.js
    }
  })

  // Menu.setApplicationMenu(null); // 禁用菜单栏
  win.loadFile('core/page/index.html');

  //开启调试工具--prod
  if(dev){
    // win.webContents.openDevTools();
  }

  win.on('close', (event) => {
    //关闭窗口处理
    win = null;
  });
}
//--------------------- init end ---------------------------------