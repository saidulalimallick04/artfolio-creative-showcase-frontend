export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const ENDPOINTS = {
    AUTH: {
        REGISTER: `${API_BASE_URL}/auth/register`,
        LOGIN: `${API_BASE_URL}/auth/login`,
        REFRESH: `${API_BASE_URL}/auth/refresh`,
    },
    ACCOUNT: {
        GET: `${API_BASE_URL}/account-details`,
        UPDATE: `${API_BASE_URL}/account-details`,
        DEACTIVATE: `${API_BASE_URL}/account-details/deactivate`,
        REACTIVATE: `${API_BASE_URL}/account-details/reactivate`,
    },
    USERS: {
        LIST: `${API_BASE_URL}/users`,
        SEARCH: `${API_BASE_URL}/users/search`,
        PROFILE: (username: string) => `${API_BASE_URL}/users/${username}`,
        ARTWORKS: (userId: string) => `${API_BASE_URL}/users/${userId}/artworks`,
    },
    ARTWORKS: {
        LIST: `${API_BASE_URL}/artworks`,
        CREATE: `${API_BASE_URL}/artworks`,
        SEARCH: `${API_BASE_URL}/artworks/search`,
        DETAILS: (id: string) => `${API_BASE_URL}/artworks/${id}`,
        UPDATE: (id: string) => `${API_BASE_URL}/artworks/${id}`,
        DELETE: (id: string) => `${API_BASE_URL}/artworks/${id}`,
    },
};
