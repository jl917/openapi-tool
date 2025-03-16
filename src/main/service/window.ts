import { BrowserWindow, screen } from 'electron';
import path from 'path';
import { isDev } from '@/common/utils';

interface WindowProcess {
  mainWindow: null | BrowserWindow;
}

export const windowProcess: WindowProcess = {
  mainWindow: null,
};

export const createWindow = () => {
  const displays = screen.getAllDisplays();
  const mainDisplay = displays.find((display) => {
    return display.bounds.x === 0 && display.bounds.y === 0;
  });
  // Create the browser window.
  windowProcess.mainWindow = new BrowserWindow({
    width: mainDisplay.bounds.width,
    height: mainDisplay.bounds.height,
    x: mainDisplay.bounds.x,
    y: mainDisplay.bounds.y,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: isDev,
      nodeIntegration: true,
    },
    autoHideMenuBar: true,
  });

  if (MAIN_WINDOW_RSBUILD_DEV_SERVER_URL) {
    windowProcess.mainWindow.loadURL(MAIN_WINDOW_RSBUILD_DEV_SERVER_URL);
  } else {
    windowProcess.mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_RSBUILD_NAME}/index.html`)
    );
  }
};

export default windowProcess;
