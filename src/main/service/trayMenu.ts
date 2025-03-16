import { nativeImage, Tray, app } from 'electron';
import { windowProcess } from './window';

export const genTrayMenu = () => {
  const icon = nativeImage.createFromPath('../img/trayImage.png');
  let tray = new Tray(icon);

  function toggleWindow() {
    if (windowProcess.mainWindow.isVisible()) {
      windowProcess.mainWindow.hide();
    } else {
      windowProcess.mainWindow.show();
      windowProcess.mainWindow.focus();
    }
  }
  tray.setToolTip('TryMenu');
  tray.setTitle('E');
  tray.on('click', () => toggleWindow());
};
