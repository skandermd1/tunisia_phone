export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo_url: string;
  product_count?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  product_count?: number;
}

export interface ProductVariant {
  id: number;
  ram: string;
  storage: string;
  storage_unit: string;
  price: number;
  original_price: number;
  stock_status: string;
  is_default: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  brand: Brand;
  category: Category;
  description: string;
  specs: Record<string, string>;
  colors: string[];
  image_url: string;
  images: string[];
  badge: string | null;
  is_featured: boolean;
  variants?: ProductVariant[];
  min_price?: number;
  default_price?: number;
}

export interface OrderItem {
  variant_id: number;
  quantity: number;
}

export interface OrderPayload {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_city: string;
  customer_governorate: string;
  notes?: string;
  items: OrderItem[];
}

export interface OrderDetailItem {
  id: number;
  product_name: string;
  variant_label: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  status: string;
  items: OrderDetailItem[];
  created_at: string;
}

export interface Pagination {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: Pagination;
}

export type ProductResponse = Product;

export type CategoriesResponse = Category[];

export type BrandsResponse = Brand[];

export interface OrderResponse {
  order_number: string;
  message: string;
}

export type OrderTrackingResponse = Order;
