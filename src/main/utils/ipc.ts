import { getMainVersion } from '@main/service/version';
import { systemMessage } from '@main/service/message';
import { sendFile } from '../service/sendFile';
import { getPort } from '../service/express';
import {
  getStore,
  removeStore,
  pushStore,
  clearStore,
} from '../service/store';

type ChannelMain = { type: Channel; data: ChannelCommunicationSuccess };

const typeLimits: Partial<Record<Channel, number>> = {
  version: 1,
  deeplink: 2,
  message: 5,
  sendFile: 1,
  host: 1,
  getStore: 1,
  removeStore: 1,
  pushStore: 1,
  clearStore: 1,
};

const typeFn: Partial<Record<Channel, (...args: any[]) => any | Promise<any>>> =
{
  version: getMainVersion,
  message: systemMessage,
  sendFile: sendFile,
  host: getPort,
  getStore,
  removeStore,
  pushStore,
  clearStore,
};

export const ipcFnWrap = async (fn: any | Promise<any>, cb: () => void) => {
  try {
    const result = fn;

    if (result instanceof Promise) {
      return await result
        .then((res: any) => {
          cb();
          return res;
        })
        .catch(() => cb()); // 에러가 발생해도 cb를 실행
    }
    cb();
    return result;
  } catch {
    cb();
    return 'error';
  }
};

export const ipcUtils = async (
  event: Electron.IpcMainInvokeEvent,
  { type, data: rendererData }: ChannelMain
) => {
  // 한도가 없으면
  if (typeLimits[type] === 0) {
    const data = {
      type,
      error: '채널 한도를 초과했습니다.',
      success: false,
    };
    return data;
  }

  // 지원하지 않는 채널인 경우
  if (typeLimits[type] === undefined) {
    const data = {
      type,
      error: '지원하지 않는 채널입니다.',
      success: false,
    };
    return data;
  }

  // 성공 할 경우.
  typeLimits[type] -= 1;
  const resultData = await ipcFnWrap(typeFn[type](rendererData), () => {
    typeLimits[type] += 1;
  });

  return { type, data: resultData, success: true };
};
