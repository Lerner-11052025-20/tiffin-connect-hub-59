// Centralized API client for MongoDB backend
// Replaces all supabase.from(...) calls

const API_BASE = '/api';

export function getToken(): string | null {
    return localStorage.getItem('tc_auth_token');
}

export function setToken(token: string): void {
    localStorage.setItem('tc_auth_token', token);
}

export function removeToken(): void {
    localStorage.removeItem('tc_auth_token');
}

async function request<T>(
    method: string,
    url: string,
    data?: unknown
): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${url}`, {
        method,
        headers,
        body: data !== undefined ? JSON.stringify(data) : undefined,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(err.message || `HTTP ${res.status}`);
    }

    // Handle 204 No Content
    if (res.status === 204) return undefined as T;
    return res.json();
}

export const api = {
    get: <T>(url: string) => request<T>('GET', url),
    post: <T>(url: string, data?: unknown) => request<T>('POST', url, data),
    put: <T>(url: string, data?: unknown) => request<T>('PUT', url, data),
    patch: <T>(url: string, data?: unknown) => request<T>('PATCH', url, data),
    delete: <T>(url: string) => request<T>('DELETE', url),
};

export default api;
