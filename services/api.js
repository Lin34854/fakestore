export const BASE_URL = 'http://127.0.0.1:3000';

export async function apiRequest(path, method = 'GET', body = null, token = null) {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    });

    return await response.json();
}

export function fixImageUrl(product) {
    if (!product) return product;

    if (product.image && product.image.startsWith('/')) {
        return {
            ...product,
            image: `${BASE_URL}${product.image}`,
        };
    }

    return product;
}