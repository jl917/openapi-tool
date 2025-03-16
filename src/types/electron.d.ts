declare interface ElectronAPI {
  sendMessage: (type: Channel, data?: any) => any;
  triggerMessage: (response?: any) => any;
}

// window 객체에 electron을 추가하는 전역 타입 선언
declare global {
  interface Window {
    api: ElectronAPI;
  }
}

export {};
