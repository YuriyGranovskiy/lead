var app = require('electron').app;
var BrowserWindow = require('electron').BrowserWindow;
var Tray = require('electron').Tray;
var Menu = require('electron').Menu;
var os = require('os');
var fs = require('fs'); 
let mainWindow;

require('electron').crashReporter.start(
  {
    "companyName": "Grain",
    "submitURL": "http://localhost:8088/cr"
  }
);

function ensureNotesFileExists(){
  let lead_dir = os.homedir() + "/.lead";
  let lead_file = lead_dir + "/notes.json"
  if (!fs.existsSync(lead_dir)){
    fs.mkdirSync(lead_dir);    
  }
  
  if (!fs.existsSync(lead_file)){
    fs.writeFileSync(lead_file, JSON.stringify([]));
  }
}

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});
app.on('ready', function () {
  mainWindow = new BrowserWindow({
    width: 340,
    height: 500,
    title: "Lead",
    icon: "./icon-resized.png"
  });
  
  ensureNotesFileExists();

  mainWindow.setMenu(null);
  mainWindow.loadURL('file://' + __dirname + '/public/index.html');
  mainWindow.openDevTools();
  mainWindow.on('minimize', function (event) {
    event.preventDefault()
    mainWindow.hide();
  });
  mainWindow.on('close', function (event) {
    if (!app.isQuiting) {
      event.preventDefault()
      mainWindow.hide();
    }
    return false;
  });

  var appIcon = new Tray('./icon-resized.png');

  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App', click: function () {
        mainWindow.show();
      }
    },
    {
      label: 'Quit', click: function () {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);

  appIcon.setToolTip('Lead');
  appIcon.setContextMenu(contextMenu);
  appIcon.on("click", function () {
    mainWindow.show();
  })
});