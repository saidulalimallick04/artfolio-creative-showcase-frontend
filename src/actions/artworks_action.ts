'use server';

import { ENDPOINTS } from '@/lib/endpoints';
import { Artwork } from '@/types/api';
import { cookies } from 'next/headers';

export async function getArtworks(query?: string, skip: number = 0, limit: number = 20) {
    try {
        let url = ENDPOINTS.ARTWORKS.LIST;

        if (query) {
            url = `${ENDPOINTS.ARTWORKS.SEARCH}?q=${encodeURIComponent(query)}&skip=${skip}&limit=${limit}`;
        } else {
            // Append pagination params to list endpoint
            // Construct URL object to safely append params
            const urlObj = new URL(url);
            urlObj.searchParams.append('skip', skip.toString());
            urlObj.searchParams.append('limit', limit.toString());
            url = urlObj.toString();
        }

        const response = await fetch(url, {
            next: { revalidate: 0 }, // Dynamic data
        });

        if (!response.ok) {
            return { error: 'Failed to fetch artworks' };
        }

        const data: Artwork[] = await response.json();
        return { success: true, data };
    } catch (error) {
        return { error: 'Connection error' };
    }
}

export async function getArtworkById(id: string) {
    try {
        const response = await fetch(ENDPOINTS.ARTWORKS.DETAILS(id), {
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            if (response.status === 404) return { error: 'Artwork not found' };
            return { error: 'Failed to fetch artwork' };
        }

        const data: Artwork = await response.json();
        return { success: true, data };
    } catch (error) {
        return { error: 'Connection error' };
    }
}

export async function createArtwork(formData: FormData) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
        return { error: 'Not authenticated' };
    }

    try {
        // Forward FormData to backend
        // Note: When using fetch with FormData, do NOT set Content-Type header.
        // The browser/runtime sets it with the boundary automatically.

        // However, we are in Node.js environment (Server Action).
        // 'fetch' in Next.js (Node) handles FormData correctly properly.

        const response = await fetch(ENDPOINTS.ARTWORKS.CREATE, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.detail || 'Failed to create artwork' };
        }

        const data: Artwork = await response.json();
        return { success: true, data };
    } catch (error) {
        return { error: 'Connection error' };
    }
}

export async function deleteArtwork(id: string) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
        return { error: 'Not authenticated' };
    }

    try {
        const response = await fetch(ENDPOINTS.ARTWORKS.DELETE(id), {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            return { error: 'Failed to delete artwork' };
        }

        return { success: true };
    } catch (error) {
        return { error: 'Connection error' };
    }
}

export async function updateArtwork(id: string, formData: FormData) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
        return { error: 'Not authenticated' };
    }

    try {
        const response = await fetch(ENDPOINTS.ARTWORKS.DETAILS(id), {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            body: formData,
        });

        if (!response.ok) {
            return { error: 'Failed to update artwork' };
        }

        const data: Artwork = await response.json();
        return { success: true, data };
    } catch (error) {
        return { error: 'Connection error' };
    }
}

