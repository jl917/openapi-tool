import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import started from 'electron-squirrel-startup';
import { createWindow } from '@main/service/window';
import { getMainVersion } from './service/version';
import { ipcUtils } from './utils/ipc';
import { powerSystem } from './service/power';
import { genTrayMenu } from './service/trayMenu';
import expressApp from './service/express';
// import { writeFileSync } from 'fs';

const powerService = powerSystem();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

app.on('ready', () => {
  createWindow();
  genTrayMenu();
  powerService.start();

  expressApp.start()
    .then((port) => console.log(`Server is running on port ${port}`))
    .catch((err) => console.error('Failed to start server:', err));
});

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

app.on('before-quit', () => {
  expressApp.stop();
  if (powerService.isBlocker()) {
    powerService.stop();
  }
});

ipcMain.handle('custom-ipc', ipcUtils);
