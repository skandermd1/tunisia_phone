async function adminFetch(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin/login';
    }
    throw new Error('Non autorise');
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erreur serveur' }));
    throw new Error(error.message || `Erreur ${res.status}`);
  }

  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'API error');
  return json.data;
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

// Auth
export async function adminLogin(username: string, password: string): Promise<{ token: string; admin: { id: string; username: string; name: string } }> {
  return adminFetch('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

// Dashboard
export async function adminGetDashboard(token: string): Promise<{
  total_orders: number;
  pending_orders: number;
  total_revenue: number;
  total_products: number;
  recent_orders: Order[];
}> {
  return adminFetch('/admin/dashboard', { headers: authHeaders(token) });
}

// Orders
export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  total: number;
  status: string;
  created_at: string;
  items?: OrderItem[];
  customer_address?: string;
  customer_city?: string;
  notes?: string;
}

export interface OrderItem {
  product_name: string;
  variant_label: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export async function adminGetOrders(
  token: string,
  params?: { page?: number; limit?: number; status?: string }
): Promise<{ orders: Order[]; total: number; page: number; total_pages: number }> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('per_page', String(params.limit));
  if (params?.status) query.set('status', params.status);
  const qs = query.toString();
  return adminFetch(`/admin/orders${qs ? `?${qs}` : ''}`, { headers: authHeaders(token) });
}

export async function adminGetOrder(token: string, orderId: string): Promise<Order> {
  return adminFetch(`/admin/orders/${orderId}`, { headers: authHeaders(token) });
}

export async function adminUpdateOrderStatus(token: string, orderId: string, status: string): Promise<{ id: number; status: string }> {
  return adminFetch(`/admin/orders/${orderId}/status`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
  });
}

// Products
export interface ProductVariant {
  ram?: string;
  storage: string;
  storage_unit: string;
  price: number;
  original_price?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand_id: number;
  brand_name: string;
  category_id: number;
  category_name: string;
  description: string;
  specs: Record<string, string>;
  colors: string[];
  image_url: string;
  images?: string[];
  badge?: string;
  variants?: ProductVariant[];
  default_price?: number | null;
  variant_count?: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

export async function adminGetProducts(token: string): Promise<Product[]> {
  const res = await adminFetch('/admin/products', { headers: authHeaders(token) });
  return res.products;
}

export async function adminGetProduct(token: string, id: string): Promise<Product> {
  return adminFetch(`/admin/products/${id}`, { headers: authHeaders(token) });
}

export async function adminCreateProduct(token: string, data: Partial<Product>): Promise<Product> {
  return adminFetch('/admin/products', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export async function adminUpdateProduct(token: string, id: string, data: Partial<Product>): Promise<Product> {
  return adminFetch(`/admin/products/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export async function adminUploadImages(token: string, files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach((f) => formData.append('files', f));

  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin/login';
    }
    throw new Error('Non autorise');
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erreur upload' }));
    throw new Error(error.message || `Erreur ${res.status}`);
  }

  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Erreur upload');
  return json.data.urls;
}

export async function adminDeleteProduct(token: string, id: string): Promise<void> {
  return adminFetch(`/admin/products/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
}

export async function adminDeactivateProduct(token: string, id: string): Promise<void> {
  return adminFetch(`/admin/products/${id}?soft=1`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
}

export async function adminActivateProduct(token: string, id: string): Promise<void> {
  return adminFetch(`/admin/products/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ is_active: true }),
  });
}
