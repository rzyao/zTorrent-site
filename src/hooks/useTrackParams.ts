import { useEffect } from 'react';
import { useHistoryStore } from '../stores/historyStore';

export function useTrackParams(params: Record<string, any>) {
    const updateCurrentParams = useHistoryStore((state) => state.updateCurrentParams);

    useEffect(() => {
        updateCurrentParams(params);
    }, [JSON.stringify(params), updateCurrentParams]); // Use JSON.stringify to compare params content
}
