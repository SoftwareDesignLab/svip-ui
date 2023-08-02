const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const fs = require("fs");
const url = require("url");
const path = require("path");
const { zip } = require("zip-a-folder");

let zipPaths = {};
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    minWidth: 800,
    minHeight: 700,
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

ipcMain.handle("getZipFromFolder", async () => {
  return new Promise(async(resolve, reject) => {
    let folder = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory"],
    });

    if(folder.filePaths.length === 1) {
      let zipPath = folder.filePaths[0];
      let tempPath = path.join(__dirname, "temp.zip");
      await zip(zipPath, tempPath);

      const fileData = await fs.promises.readFile(filePath);
      return resolve(fileData);
    }

    reject(false);
  })
});

ipcMain.handle("getFileData", async (event, ...args) => {
  let data = fs.readFileSync(args[0], "utf8");
  return data;
});
