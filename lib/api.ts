import type {
  ProductsResponse,
  ProductResponse,
  CategoriesResponse,
  BrandsResponse,
  OrderPayload,
  OrderResponse,
  OrderTrackingResponse,
} from "./types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "");
    throw new Error(
      `API error ${res.status}: ${res.statusText}${errorBody ? ` - ${errorBody}` : ""}`
    );
  }

  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'API error');
  return json.data as T;
}

// ── Public endpoints ──

export async function getProducts(
  params?: Record<string, string | number>
): Promise<ProductsResponse> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        searchParams.set(key, String(value));
      }
    });
  }
  const query = searchParams.toString();
  return fetchAPI<ProductsResponse>(`/products${query ? `?${query}` : ""}`);
}

export async function getProduct(slug: string): Promise<ProductResponse> {
  return fetchAPI<ProductResponse>(`/products/${slug}`);
}

export async function getCategories(): Promise<CategoriesResponse> {
  return fetchAPI<CategoriesResponse>("/categories");
}

export async function getBrands(): Promise<BrandsResponse> {
  return fetchAPI<BrandsResponse>("/brands");
}

export async function createOrder(
  data: OrderPayload
): Promise<OrderResponse> {
  return fetchAPI<OrderResponse>("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function trackOrder(
  orderNumber: string
): Promise<OrderTrackingResponse> {
  return fetchAPI<OrderTrackingResponse>(`/orders/track/${orderNumber}`);
}

