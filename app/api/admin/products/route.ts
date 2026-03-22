import { db } from "@/db";
import {
  products,
  brands,
  categories,
  productVariants,
} from "@/db/schema";
import { eq, and, ilike, count, sql, desc } from "drizzle-orm";
import {
  jsonResponse,
  errorResponse,
  getJsonBody,
  validateRequired,
} from "@/lib/api-helpers";
import { authenticate } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { error } = authenticate(request);
  if (error) return error;

  try {
    const { searchParams } = request.nextUrl;
    const brand = searchParams.get("brand");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const active = searchParams.get("active");
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const perPage = Math.min(100, Math.max(1, Number(searchParams.get("per_page")) || 20));
    const offset = (page - 1) * perPage;

    const conditions = [];
    if (brand) conditions.push(eq(brands.slug, brand));
    if (category) conditions.push(eq(categories.slug, category));
    if (search) conditions.push(ilike(products.name, `%${search}%`));
    if (active !== null && active !== undefined && active !== "") {
      conditions.push(eq(products.isActive, active === "1"));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total: totalCount }] = await db
      .select({ total: count() })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(where);

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
        isActive: products.isActive,
        sortOrder: products.sortOrder,
        brandId: products.brandId,
        brandName: brands.name,
        categoryId: products.categoryId,
        categoryName: categories.name,
        defaultPrice: sql<string>`(SELECT pv.price FROM product_variants pv WHERE pv.product_id = ${products.id} AND pv.is_default = true LIMIT 1)`,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(where)
      .orderBy(desc(products.createdAt))
      .limit(perPage)
      .offset(offset);

    return jsonResponse({
      products: rows.map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        description: r.description,
        specs: r.specs,
        colors: r.colors,
        image_url: r.imageUrl,
        images: r.images ?? [],
        badge: r.badge,
        is_featured: r.isFeatured,
        is_active: r.isActive,
        sort_order: r.sortOrder,
        brand_id: r.brandId,
        brand_name: r.brandName,
        category_id: r.categoryId,
        category_name: r.categoryName,
        default_price: r.defaultPrice ? Number(r.defaultPrice) : null,
        created_at: r.createdAt,
        updated_at: r.updatedAt,
      })),
      total: totalCount,
      page,
      per_page: perPage,
      total_pages: Math.ceil(totalCount / perPage),
    });
  } catch (err) {
    console.error("GET /api/admin/products error:", err);
    return errorResponse("Internal server error", 500);
  }
}

export async function POST(request: Request) {
  const { error } = authenticate(request);
  if (error) return error;

  try {
    const data = await getJsonBody(request);

    const missing = validateRequired(["name", "slug", "brand_id", "category_id"], data);
    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(", ")}`);
    }

    // Check slug uniqueness
    const existing = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, data.slug as string))
      .limit(1);

    if (existing.length > 0) {
      return errorResponse("Product slug already exists");
    }

    const colors = Array.isArray(data.colors) ? JSON.stringify(data.colors) : (data.colors as string) || "";

    const [inserted] = await db
      .insert(products)
      .values({
        brandId: Number(data.brand_id),
        categoryId: Number(data.category_id),
        name: String(data.name).trim(),
        slug: String(data.slug).trim(),
        description: data.description ? String(data.description).trim() : null,
        specs: data.specs ?? null,
        colors,
        imageUrl: data.image_url ? String(data.image_url).trim() : null,
        images: data.images ?? null,
        badge: data.badge ? String(data.badge).trim() : null,
        isFeatured: Boolean(data.is_featured),
        isActive: data.is_active !== undefined ? Boolean(data.is_active) : true,
        sortOrder: Number(data.sort_order ?? 0),
      })
      .returning({ id: products.id, slug: products.slug });

    // Insert variants
    const variants = data.variants as Array<Record<string, unknown>> | undefined;
    if (variants && Array.isArray(variants) && variants.length > 0) {
      await db.insert(productVariants).values(
        variants.map((v) => ({
          productId: inserted.id,
          ram: String(v.ram ?? "").trim(),
          storage: String(v.storage ?? "").trim(),
          storageUnit: String(v.storage_unit ?? "GB").trim(),
          price: String(v.price),
          originalPrice: v.original_price ? String(v.original_price) : null,
          stockStatus: (v.stock_status as "in_stock" | "low_stock" | "out_of_stock") ?? "in_stock",
          isDefault: Boolean(v.is_default),
        }))
      );
    }

    return jsonResponse({ id: inserted.id, slug: inserted.slug }, 201);
  } catch (err) {
    console.error("POST /api/admin/products error:", err);
    return errorResponse("Internal server error", 500);
  }
}
