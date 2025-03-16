import { powerSaveBlocker } from 'electron';

export const powerSystem = () => {
  let id = 0;
  const start = () => {
    id = powerSaveBlocker.start('prevent-display-sleep');
  };
  const stop = () => {
    id = 0;
    powerSaveBlocker.stop(id);
  };
  const isBlocker = () => id !== 0;
  return { isBlocker, stop, start };
};
