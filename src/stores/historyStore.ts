import { create } from 'zustand';

export interface HistoryItem {
    id: string;
    type: 'route' | 'modal';
    name: string; // Route path or Modal name
    params: Record<string, any>;
    timestamp: number;
}

interface HistoryState {
    history: HistoryItem[];
    pushRoute: (path: string, params?: Record<string, any>) => void;
    pushModal: (name: string, params?: Record<string, any>) => void;
    updateCurrentParams: (params: Record<string, any>) => void;
    clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
    history: [],

    pushRoute: (path, params = {}) => {
        const newItem: HistoryItem = {
            id: crypto.randomUUID(),
            type: 'route',
            name: path,
            params,
            timestamp: Date.now(),
        };
        set((state) => ({ history: [...state.history, newItem] }));
        console.log('[History] Route pushed:', newItem);
    },

    pushModal: (name, params = {}) => {
        const newItem: HistoryItem = {
            id: crypto.randomUUID(),
            type: 'modal',
            name,
            params,
            timestamp: Date.now(),
        };
        set((state) => ({ history: [...state.history, newItem] }));
        console.log('[History] Modal pushed:', newItem);
    },

    updateCurrentParams: (params) => {
        set((state) => {
            if (state.history.length === 0) return state;
            const lastItem = state.history[state.history.length - 1];
            const updatedItem = { ...lastItem, params: { ...lastItem.params, ...params } };
            const newHistory = [...state.history.slice(0, -1), updatedItem];
            console.log('[History] Params updated for:', lastItem.name, params);
            return { history: newHistory };
        });
    },

    clearHistory: () => set({ history: [] }),
}));
