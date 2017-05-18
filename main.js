var app = require('electron').app;
var BrowserWindow = require('electron').BrowserWindow;
let mainWindow;

require('electron').crashReporter.start(
    {
        "companyName": "Grain",
        "submitURL": "http://localhost:8088/cr"
    }
);
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});
app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 340, height: 500});
  mainWindow.loadURL('file://' + __dirname + '/public/index.html');
  // mainWindow.openDevTools();
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});