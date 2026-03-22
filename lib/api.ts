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

  return res.json();
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

// ── Admin endpoints ──

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export async function adminLogin(
  username: string,
  password: string
): Promise<{ token: string }> {
  return fetchAPI<{ token: string }>("/admin/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function adminGetDashboard(
  token: string
): Promise<{ data: Record<string, unknown> }> {
  return fetchAPI("/admin/dashboard", {
    headers: authHeaders(token),
  });
}

export async function adminGetOrders(
  token: string,
  params?: Record<string, string | number>
): Promise<{ data: unknown[]; pagination: unknown }> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        searchParams.set(key, String(value));
      }
    });
  }
  const query = searchParams.toString();
  return fetchAPI(`/admin/orders${query ? `?${query}` : ""}`, {
    headers: authHeaders(token),
  });
}

export async function adminUpdateOrderStatus(
  token: string,
  id: number,
  status: string
): Promise<{ data: unknown }> {
  return fetchAPI(`/admin/orders/${id}/status`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
  });
}

export async function adminGetProducts(
  token: string
): Promise<{ data: unknown[] }> {
  return fetchAPI("/admin/products", {
    headers: authHeaders(token),
  });
}

export async function adminCreateProduct(
  token: string,
  data: unknown
): Promise<{ data: unknown }> {
  return fetchAPI("/admin/products", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export async function adminUpdateProduct(
  token: string,
  id: number,
  data: unknown
): Promise<{ data: unknown }> {
  return fetchAPI(`/admin/products/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export async function adminDeleteProduct(
  token: string,
  id: number
): Promise<{ message: string }> {
  return fetchAPI(`/admin/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}
