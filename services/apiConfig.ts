declare global {
  interface Window {
    __APP_CONFIG__?: {
      apiBaseUrl?: string;
    };
  }
}

const DEFAULT_API_BASE_URL = 'http://localhost:3001';

export const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  if (envUrl) {
    return envUrl;
  }

  if (typeof window !== 'undefined') {
    const runtimeUrl = window.__APP_CONFIG__?.apiBaseUrl?.trim();
    if (runtimeUrl) {
      return runtimeUrl;
    }
  }

  return DEFAULT_API_BASE_URL;
};

export const buildApiUrl = (path: string): string => {
  const base = getApiBaseUrl().replace(/\/+$/, '');
  const normalisedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalisedPath}`;
};
