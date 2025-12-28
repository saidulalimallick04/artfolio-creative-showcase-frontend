'use server';

import { ENDPOINTS } from '@/lib/endpoints';
import { User } from '@/types/api';
import { cookies } from 'next/headers';

export async function getAccountDetails() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
        return { error: 'Not authenticated' };
    }

    try {
        const response = await fetch(ENDPOINTS.ACCOUNT.GET, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            // If 401, maybe token expired and refresher hasn't caught up?
            // For now, just return error.
            return { error: 'Failed to fetch account details' };
        }

        const data: User = await response.json();
        return { success: true, data };
    } catch (error) {
        return { error: 'Connection failed' };
    }
}


export async function updateAccountDetails(formData: FormData) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
        return { error: 'Not authenticated' };
    }

    try {
        const response = await fetch(ENDPOINTS.ACCOUNT.UPDATE, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.detail || 'Failed to update account' };
        }

        const data: User = await response.json();
        return { success: true, data };
    } catch (error) {
        return { error: 'Connection failed' };
    }
}
