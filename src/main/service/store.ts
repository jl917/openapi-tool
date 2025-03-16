import Store from 'electron-store';

interface StoreItem {
    id: string;
    [key: string]: any;
}

export class StoreService {
    private static instance: StoreService;
    private store: Store;

    private constructor() {
        this.store = new Store();
    }

    public static getInstance(): StoreService {
        if (!StoreService.instance) {
            StoreService.instance = new StoreService();
        }
        return StoreService.instance;
    }

    public getList(): StoreItem[] {
        return this.store.get('list', []) as StoreItem[];
    }

    public push(item: StoreItem): void {
        const list = this.getList();
        list.push(item);
        this.store.set('list', list);
    }

    public remove(itemId: string): void {
        const list = this.getList();
        const filteredList = list.filter(item => item.id !== itemId);
        this.store.set('list', filteredList);
    }

    public clear(): void {
        this.store.set('list', []);
    }
}

// Export default instance
const store = StoreService.getInstance();

export const getStore = () => store.getList();
export const pushStore = (item: StoreItem) => store.push(item);
export const removeStore = (itemId: string) => store.remove(itemId);
export const clearStore = () => store.clear();

export default store;