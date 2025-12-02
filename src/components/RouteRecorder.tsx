import { useEffect } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { useHistoryStore } from '../stores/historyStore';

export function RouteRecorder() {
    const location = useLocation();
    const params = useParams();
    const [searchParams] = useSearchParams();
    // Use selector to avoid re-rendering when history changes
    const pushRoute = useHistoryStore((state) => state.pushRoute);

    useEffect(() => {
        // Combine route params and search params
        const allParams: Record<string, any> = { ...params };
        searchParams.forEach((value, key) => {
            allParams[key] = value;
        });

        pushRoute(location.pathname, allParams);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname, location.search, pushRoute]); // Depend only on location and stable pushRoute

    return null;
}
