import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  decimal,
  timestamp,
  jsonb,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// Enums
export const stockStatusEnum = pgEnum("stock_status", [
  "in_stock",
  "low_stock",
  "out_of_stock",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

// Tables
export const brands = pgTable(
  "brands",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 50 }).notNull().unique(),
    slug: varchar("slug", { length: 50 }).notNull().unique(),
    logoUrl: varchar("logo_url", { length: 255 }),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [
    index("idx_brands_slug").on(table.slug),
    index("idx_brands_sort").on(table.sortOrder),
  ]
);

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    icon: varchar("icon", { length: 50 }),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [
    index("idx_categories_slug").on(table.slug),
    index("idx_categories_sort").on(table.sortOrder),
  ]
);

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    brandId: integer("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "restrict", onUpdate: "cascade" }),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict", onUpdate: "cascade" }),
    name: varchar("name", { length: 150 }).notNull(),
    slug: varchar("slug", { length: 150 }).notNull().unique(),
    description: text("description"),
    specs: jsonb("specs"),
    colors: varchar("colors", { length: 500 }),
    imageUrl: varchar("image_url", { length: 255 }),
    images: jsonb("images"),
    badge: varchar("badge", { length: 50 }),
    isFeatured: boolean("is_featured").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("idx_products_slug").on(table.slug),
    index("idx_products_brand").on(table.brandId),
    index("idx_products_category").on(table.categoryId),
    index("idx_products_featured").on(table.isFeatured),
    index("idx_products_active").on(table.isActive),
  ]
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade", onUpdate: "cascade" }),
    ram: varchar("ram", { length: 10 }).notNull().default(""),
    storage: varchar("storage", { length: 10 }).notNull().default(""),
    storageUnit: varchar("storage_unit", { length: 5 }).notNull().default("GB"),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
    stockStatus: stockStatusEnum("stock_status").notNull().default("in_stock"),
    isDefault: boolean("is_default").notNull().default(false),
  },
  (table) => [
    index("idx_variants_product").on(table.productId),
    index("idx_variants_default").on(table.isDefault),
  ]
);

export const orders = pgTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    orderNumber: varchar("order_number", { length: 20 }).notNull().unique(),
    customerName: varchar("customer_name", { length: 100 }).notNull(),
    customerPhone: varchar("customer_phone", { length: 20 }).notNull(),
    customerEmail: varchar("customer_email", { length: 255 }),
    customerAddress: text("customer_address").notNull(),
    customerCity: varchar("customer_city", { length: 100 }),
    customerGovernorate: varchar("customer_governorate", { length: 100 }),
    notes: text("notes"),
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
    total: decimal("total", { precision: 10, scale: 2 }).notNull(),
    status: orderStatusEnum("status").notNull().default("pending"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("idx_orders_number").on(table.orderNumber),
    index("idx_orders_status").on(table.status),
    index("idx_orders_created").on(table.createdAt),
  ]
);

export const orderItems = pgTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade", onUpdate: "cascade" }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict", onUpdate: "cascade" }),
    variantId: integer("variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "restrict", onUpdate: "cascade" }),
    productName: varchar("product_name", { length: 150 }).notNull(),
    variantLabel: varchar("variant_label", { length: 100 }).notNull().default(""),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    quantity: integer("quantity").notNull().default(1),
  },
  (table) => [index("idx_order_items_order").on(table.orderId)]
);

export const adminUsers = pgTable(
  "admin_users",
  {
    id: serial("id").primaryKey(),
    username: varchar("username", { length: 50 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    displayName: varchar("display_name", { length: 100 }),
    lastLogin: timestamp("last_login"),
  },
  (table) => [index("idx_admin_username").on(table.username)]
);
