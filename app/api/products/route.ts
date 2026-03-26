import { db } from "@/db";
import { products, brands, categories, productVariants } from "@/db/schema";
import { eq, and, ilike, or, sql, count, inArray } from "drizzle-orm";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const brand = searchParams.get("brand");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const sort = searchParams.get("sort");
    const minPrice = searchParams.get("min_price");
    const maxPrice = searchParams.get("max_price");
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const perPage = Math.min(100, Math.max(1, Number(searchParams.get("per_page")) || 20));
    const offset = (page - 1) * perPage;

    // Build conditions
    const conditions = [eq(products.isActive, true)];
    if (brand) {
      const slugs = brand.split(",").filter(Boolean);
      conditions.push(slugs.length === 1 ? eq(brands.slug, slugs[0]) : inArray(brands.slug, slugs));
    }
    if (category) {
      const slugs = category.split(",").filter(Boolean);
      conditions.push(slugs.length === 1 ? eq(categories.slug, slugs[0]) : inArray(categories.slug, slugs));
    }
    if (search) {
      conditions.push(
        or(
          ilike(products.name, `%${search}%`),
          ilike(products.description, `%${search}%`)
        )!
      );
    }
    if (featured === "1") conditions.push(eq(products.isFeatured, true));
    if (minPrice && !isNaN(Number(minPrice))) {
      conditions.push(
        sql`(SELECT pv.price FROM product_variants pv WHERE pv.product_id = ${products.id} AND pv.is_default = true LIMIT 1) >= ${Number(minPrice)}`
      );
    }
    if (maxPrice && !isNaN(Number(maxPrice))) {
      conditions.push(
        sql`(SELECT pv.price FROM product_variants pv WHERE pv.product_id = ${products.id} AND pv.is_default = true LIMIT 1) <= ${Number(maxPrice)}`
      );
    }

    const where = and(...conditions);

    // Count total
    const [{ total: totalCount }] = await db
      .select({ total: count() })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(where);

    // Sort
    const sortMap: Record<string, ReturnType<typeof sql>> = {
      newest: sql`${products.createdAt} DESC`,
      oldest: sql`${products.createdAt} ASC`,
      name_asc: sql`${products.name} ASC`,
      name_desc: sql`${products.name} DESC`,
      price_asc: sql`default_price ASC`,
      price_desc: sql`default_price DESC`,
    };
    const orderBy = sortMap[sort ?? ""] ?? sql`${products.sortOrder} ASC, ${products.createdAt} DESC`;

    // Fetch products
    const rows = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        imageUrl: products.imageUrl,
        images: products.images,
        badge: products.badge,
        isFeatured: products.isFeatured,
        colors: products.colors,
        brandId: products.brandId,
        brandName: brands.name,
        brandSlug: brands.slug,
        categoryId: products.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
        defaultPrice: sql<string>`(SELECT pv.price FROM product_variants pv WHERE pv.product_id = ${products.id} AND pv.is_default = true LIMIT 1)`.as("default_price"),
        defaultOriginalPrice: sql<string | null>`(SELECT pv.original_price FROM product_variants pv WHERE pv.product_id = ${products.id} AND pv.is_default = true LIMIT 1)`,
      })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(where)
      .orderBy(orderBy)
      .limit(perPage)
      .offset(offset);

    const result = rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description,
      image_url: r.imageUrl,
      images: r.images ?? [],
      badge: r.badge,
      is_featured: r.isFeatured,
      colors: parseColors(r.colors),
      brand: { id: r.brandId, name: r.brandName, slug: r.brandSlug },
      category: { id: r.categoryId, name: r.categoryName, slug: r.categorySlug },
      default_price: r.defaultPrice ? Number(r.defaultPrice) : null,
      default_original_price: r.defaultOriginalPrice ? Number(r.defaultOriginalPrice) : null,
    }));

    return jsonResponse({
      products: result,
      pagination: {
        total: totalCount,
        page,
        per_page: perPage,
        total_pages: Math.ceil(totalCount / perPage),
      },
    });
  } catch (err) {
    console.error("GET /api/products error:", err);
    return errorResponse("Internal server error", 500);
  }
}

function parseColors(colors: string | null): string[] {
  if (!colors) return [];
  try {
    return JSON.parse(colors);
  } catch {
    return [];
  }
}
