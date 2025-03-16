// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  sendMessage: async (type: Channel, data: any) => {
    return ipcRenderer.invoke('custom-ipc', { type, data });
  },
  triggerMessage: (callback: (...args: any) => void) => {
    ipcRenderer.on('custom-ipc', (event, ...args) => callback(...args));
  },
});
