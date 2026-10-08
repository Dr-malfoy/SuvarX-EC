const PROD_API_URL = "https://api.backend.suvarx.com";
const LOCAL_API_URL = "http://localhost:5000";

export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Browser runtime check
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return LOCAL_API_URL;
    }
    // Any production domain (e.g. shop.suvarx.com)
    return PROD_API_URL;
  }

  // Server-side runtime check
  if (process.env.NODE_ENV === "production") {
    return PROD_API_URL;
  }

  return LOCAL_API_URL;
}

export function getApiUrl(path: string): string {
  if (!path) return getApiBaseUrl();
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("blob:") || path.startsWith("data:")) {
    return path;
  }
  const base = getApiBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
