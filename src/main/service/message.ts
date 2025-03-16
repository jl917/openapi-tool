import { dialog } from 'electron';
import { showNotification } from '@main/utils/notification';

export const systemMessage = (data: any) => {
  if (data?.type === 'notification') {
    showNotification(data.config);
  }
  if (data?.type === 'dialog') {
    dialog.showMessageBox(data.config);
  }
};
