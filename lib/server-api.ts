const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

interface ApiSuccess<T> {
  status: string;
  data: T;
}

async function fetchPublicApi<T>(path: string, revalidateSeconds = 300): Promise<T> {
  const res = await fetch(`${baseURL}${path}`, {
    next: { revalidate: revalidateSeconds },
  });
  if (!res.ok) {
    throw new Error(`API request failed: ${path} (${res.status})`);
  }
  const body = (await res.json()) as ApiSuccess<T>;
  return body.data;
}

export function fetchCategoriesServer() {
  return fetchPublicApi<string[]>('/categories');
}

export function fetchTopRestaurantsServer() {
  return fetchPublicApi<unknown[]>('/restaurants/top');
}

export function fetchRestaurantBySlugServer(slug: string) {
  return fetchPublicApi<unknown>(`/restaurants/${slug}`);
}

export function fetchRestaurantMenuServer(slug: string) {
  return fetchPublicApi<unknown[]>(`/restaurants/${slug}/menu`);
}
