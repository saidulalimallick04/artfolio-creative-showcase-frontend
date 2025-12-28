'use server';

import { ENDPOINTS } from '@/lib/endpoints';
import { TokenResponse } from '@/types/api';
import { cookies } from 'next/headers';

export async function registerUser(formData: FormData) {
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        const response = await fetch(ENDPOINTS.AUTH.REGISTER, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                email,
                password,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.detail || 'Registration failed' };
        }

        return { success: true };
    } catch (error) {
        return { error: 'Failed to connect to the server' };
    }
}

export async function loginUser(formData: FormData) {
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        const response = await fetch(ENDPOINTS.AUTH.LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.detail || 'Login failed' };
        }

        const data: TokenResponse = await response.json();

        // Store tokens
        const cookieStore = await cookies();
        cookieStore.set('access_token', data.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 60, // 30 minutes
            path: '/',
        });

        cookieStore.set('refresh_token', data.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        // Store username for navbar
        cookieStore.set('username', data.username, {
            httpOnly: false, // readable by client
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
        });

        return { success: true, user: data.username };
    } catch (error) {
        return { error: 'Failed to connect to the server' };
    }
}

export async function refreshAccessToken() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) {
        return { error: 'No refresh token' };
    }

    try {
        const response = await fetch(ENDPOINTS.AUTH.REFRESH, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (!response.ok) {
            return { error: 'Refresh failed' };
        }

        const data: TokenResponse = await response.json();

        // Update Access Token only
        cookieStore.set('access_token', data.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 60, // 30 minutes
            path: '/',
        });

        // Some APIs rotate refresh tokens too. The docs say "If yes, issue a new one".
        // So if a new refresh token is returned, update it.
        if (data.refresh_token) {
            cookieStore.set('refresh_token', data.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60,
                path: '/',
            });
        }

        return { success: true, access_token: data.access_token };
    } catch (error) {
        return { error: 'Failed to refresh token' };
    }
}

export async function logoutUser() {
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');
    cookieStore.delete('username');
    return { success: true };
}
