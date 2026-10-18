const DEFAULT_WORKER_URL = "https://api.agkalaa.ir";

let inMemoryWorkerUrl = DEFAULT_WORKER_URL;

if (typeof window !== "undefined") {
  const saved = localStorage.getItem("cloudflare_worker_url");
  if (saved) {
    inMemoryWorkerUrl = saved;
  }
} else if (typeof process !== "undefined" && process.env) {
  inMemoryWorkerUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || DEFAULT_WORKER_URL;
}

export function getCloudflareWorkerUrl(): string {
  return inMemoryWorkerUrl;
}

export function setCloudflareWorkerUrl(url: string) {
  inMemoryWorkerUrl = url;
  if (typeof window !== "undefined") {
    localStorage.setItem("cloudflare_worker_url", url);
  }
}

/**
 * Checks if the Cloudflare Worker URL is actually customized/active rather than the placeholder.
 */
export function isCloudflareEnabled(): boolean {
  const url = getCloudflareWorkerUrl();
  return url !== "" && !url.includes("YOUR_SUBDOMAIN");
}
