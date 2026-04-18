/**
 * Custom fetch wrapper for API calls that automatically prepends the API_URL
 * and centralizes error handling.
 */
export async function fetchApi(endpoint: string, options?: RequestInit): Promise<Response> {
    const url = `${process.env.API_URL}${endpoint}`;
    
    const res = await fetch(url, options);

    if (!res.ok) {
        throw new Error(`API fetch failed: ${res.status} ${res.statusText} for ${url}`);
    }

    return res;
}
