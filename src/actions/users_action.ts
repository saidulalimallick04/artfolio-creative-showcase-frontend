'use server';

import { ENDPOINTS } from '@/lib/endpoints';
import { UserPublic, Artwork } from '@/types/api';

export async function getUsers(query?: string) {
    try {
        const url = query
            ? `${ENDPOINTS.USERS.SEARCH}?q=${encodeURIComponent(query)}`
            : ENDPOINTS.USERS.LIST;

        const response = await fetch(url, {
            next: { revalidate: 60 }, // Cache for 60 seconds
        });

        if (!response.ok) {
            return { error: 'Failed to fetch users' };
        }

        const data: UserPublic[] = await response.json();
        return { success: true, data };
    } catch (error) {
        return { error: 'Connection error' };
    }
}

export async function getUserProfile(username: string) {
    try {
        const response = await fetch(ENDPOINTS.USERS.PROFILE(username), {
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            if (response.status === 404) return { error: 'User not found' };
            return { error: 'Failed to fetch profile' };
        }

        const data: UserPublic = await response.json();
        return { success: true, data };
    } catch (error) {
        return { error: 'Connection error' };
    }
}

export async function getUserArtworks(userId: string) {
    try {
        const response = await fetch(ENDPOINTS.USERS.ARTWORKS(userId), {
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            return { error: 'Failed to fetch user artworks' };
        }

        const data: Artwork[] = await response.json();
        return { success: true, data };
    } catch (error) {
        return { error: 'Connection error' };
    }
}
