// import { MessageBoxOptions, NotificationConstructorOptions } from 'electron';

interface ChannelCommunicationSuccess {
  channel: Channel;
  success: true;
  message: string;
}
interface ChannelCommunicationFaild {
  type: Channel;
  success: false;
  error: string;
}

type Channel =
  | 'version'
  | 'deeplink'
  | 'message'
  | 'sendFile'
  | 'host'
  | 'getStore'
  | 'setStore'
  | 'removeStore'
  | 'clearStore';

interface ChannelDisplay {
  id: number;
  name: string;
  bounds: Electron.Rectangle;
  isPrimary: boolean;
}

type TriggerResponse =
  | {
    type: 'displays';
    data: ChannelDisplay[];
  }
  | {
    type: 'version';
    data: string;
  }
  | {
    type: 'message';
    data: any;
  }
  | {
    type: 'sendFile';
    data: any;
  }
  | {
    type: 'port';
    data: string | number;
  }
  | undefined;
