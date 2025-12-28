'use client';

import { refreshAccessToken } from '@/actions/auth_action';
import { useEffect } from 'react';

export function TokenRefresher() {
    useEffect(() => {
        // Function to perform refresh
        const refresh = async () => {
            try {
                await refreshAccessToken();
            } catch (error) {
                console.error('Token refresh failed', error);
            }
        };

        // Refresh immediately on mount (page load)
        refresh();

        // Refresh every 20 minutes (20 * 60 * 1000 = 1200000 ms)
        const interval = setInterval(refresh, 20 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    return null; // This component doesn't render anything
}
