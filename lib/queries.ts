import { cache } from "react";
import { db } from "@/db";
import { products, brands, categories, productVariants } from "@/db/schema";
import { eq, and, desc, asc } from "drizzle-orm";
import type { Product } from "@/lib/types";

export const getProductBySlug = cache(async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      specs: products.specs,
      colors: products.colors,
      imageUrl: products.imageUrl,
      images: products.images,
      badge: products.badge,
      isFeatured: products.isFeatured,
      brandId: products.brandId,
      brandName: brands.name,
      brandSlug: brands.slug,
      brandLogoUrl: brands.logoUrl,
      categoryId: products.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
      categoryIcon: categories.icon,
    })
    .from(products)
    .leftJoin(brands, eq(products.brandId, brands.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.slug, slug), eq(products.isActive, true)))
    .limit(1);

  if (rows.length === 0) return null;

  const r = rows[0];

  const variants = await db
    .select({
      id: productVariants.id,
      ram: productVariants.ram,
      storage: productVariants.storage,
      storageUnit: productVariants.storageUnit,
      price: productVariants.price,
      originalPrice: productVariants.originalPrice,
      stockStatus: productVariants.stockStatus,
      isDefault: productVariants.isDefault,
    })
    .from(productVariants)
    .where(eq(productVariants.productId, r.id))
    .orderBy(desc(productVariants.isDefault), asc(productVariants.price));

  let colors: string[] = [];
  try {
    colors = r.colors ? JSON.parse(r.colors) : [];
  } catch {
    colors = [];
  }

  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description ?? "",
    specs: (r.specs as Record<string, string>) ?? {},
    colors,
    image_url: r.imageUrl ?? "",
    images: (r.images as string[]) ?? [],
    badge: r.badge,
    is_featured: r.isFeatured,
    brand: {
      id: r.brandId,
      name: r.brandName ?? "",
      slug: r.brandSlug ?? "",
      logo_url: r.brandLogoUrl ?? "",
    },
    category: {
      id: r.categoryId,
      name: r.categoryName ?? "",
      slug: r.categorySlug ?? "",
      icon: r.categoryIcon ?? "",
    },
    variants: variants.map((v) => ({
      id: v.id,
      ram: v.ram,
      storage: v.storage,
      storage_unit: v.storageUnit,
      price: Number(v.price),
      original_price: v.originalPrice ? Number(v.originalPrice) : 0,
      stock_status: v.stockStatus,
      is_default: v.isDefault,
    })),
  };
});
