import { useEffect } from 'react';
import { useHistoryStore } from '../stores/historyStore';

export function useTrackModal(name: string, isOpen: boolean, params: Record<string, any> = {}) {
    const pushModal = useHistoryStore((state) => state.pushModal);

    useEffect(() => {
        if (isOpen) {
            pushModal(name, params);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, name, pushModal]); // Intentionally omitting params from dependency to avoid loop if params object is unstable
}
