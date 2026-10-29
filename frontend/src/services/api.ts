/**
 * API configuration helper.
 * When frontend and backend are deployed separately,
 * VITE_API_URL can be set to the backend URL (e.g. https://my-backend.onrender.com or https://backend.vercel.app).
 * If VITE_API_URL is omitted or empty, it defaults to relative paths (e.g. for local dev or monolithic deployment).
 */
const RAW_API_URL = (import.meta.env.VITE_API_URL || '').trim();
export const API_BASE_URL = RAW_API_URL.replace(/\/+$/, '');

export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}

