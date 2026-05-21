/**
 * Custom fetch wrapper for API calls that automatically prepends the API_URL
 * and centralizes error handling.
 */
export async function fetchApi(endpoint: string, options?: RequestInit): Promise<Response> {
    const url = `${process.env.API_URL}${endpoint}`;
    
    const finalOptions: RequestInit = {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    };

    const res = await fetch(url, finalOptions);

    if (!res.ok) {
        let errorMessage = `API fetch failed: ${res.status} ${res.statusText} for ${url}`;
        try {
            const errorData = await res.json();
            if (errorData.message) {
                errorMessage = errorData.message;
            }
        } catch (e) {
            // Fallback to default generic error if JSON parsing fails
        }
        throw new Error(errorMessage);
    }

    return res;
}
