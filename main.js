const fs = require('fs');
const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');

// Function to ensure "exports" directory exists
function ensureExportsDirectory() {
  const exportsDir = path.join(app.getPath('userData'), 'exports');
  if (!fs.existsSync(exportsDir)) {
    try {
      fs.mkdirSync(exportsDir);
    } catch (error) {
      console.error('Error creating exports directory:', error);
      throw error; // Re-throw the error to be caught by the caller
    }
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 400,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'renderer.js'),
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'assets/icon.png') // Path to your icon file
  });

  mainWindow.loadFile('index.html');

  // Optionally, you can add a custom menu (if needed)
  // mainWindow.setMenu(null);
}

app.whenReady().then(() => {
  ensureExportsDirectory(); // Ensure the "exports" directory exists
  createWindow();

  ipcMain.handle('download-video', async (event, url) => {
    const exportsDir = path.join(app.getPath('userData'), 'exports');
    return new Promise((resolve, reject) => {
      // Modify the command to save files to the "exports" directory
      const command = `yt-dlp -o "${path.join(exportsDir, '%(title)s.%(ext)s')}" "${url}"`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(stderr);
        } else {
          resolve(stdout);
        }
      });
    });
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
