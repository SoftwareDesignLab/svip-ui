const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const fs = require("fs");
const url = require("url");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.maximize();
  mainWindow.show();

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/frontend/index.html`),
      protocol: "file:",
      slashes: true,
    })
  );

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (mainWindow === null) createWindow();
});

ipcMain.handle("selectFiles", async () => {
  let files = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile", "multiSelections"],
  });

  return files.filePaths;
});

ipcMain.handle("getFileData", async (event, ...args) => {
  let data = fs.readFileSync(args[0], "utf8");
  return data;
});
