import { db } from "@/db";
import { products, brands, categories, productVariants } from "@/db/schema";
import { eq, and, desc, asc } from "drizzle-orm";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

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
        categoryId: products.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.slug, slug), eq(products.isActive, true)))
      .limit(1);

    if (rows.length === 0) {
      return errorResponse("Product not found", 404);
    }

    const r = rows[0];

    // Fetch variants
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

    return jsonResponse({
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description,
      specs: r.specs,
      colors,
      image_url: r.imageUrl,
      images: r.images ?? [],
      badge: r.badge,
      is_featured: r.isFeatured,
      brand: { id: r.brandId, name: r.brandName, slug: r.brandSlug },
      category: { id: r.categoryId, name: r.categoryName, slug: r.categorySlug },
      variants: variants.map((v) => ({
        id: v.id,
        ram: v.ram,
        storage: v.storage,
        storage_unit: v.storageUnit,
        price: Number(v.price),
        original_price: v.originalPrice ? Number(v.originalPrice) : null,
        stock_status: v.stockStatus,
        is_default: v.isDefault,
      })),
    });
  } catch (err) {
    console.error("GET /api/products/[slug] error:", err);
    return errorResponse("Internal server error", 500);
  }
}
