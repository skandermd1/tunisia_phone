import { db } from "@/db";
import { brands, products } from "@/db/schema";
import { eq, asc, sql } from "drizzle-orm";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET() {
  try {
    const rows = await db
      .select({
        id: brands.id,
        name: brands.name,
        slug: brands.slug,
        logoUrl: brands.logoUrl,
        sortOrder: brands.sortOrder,
        productCount: sql<number>`count(CASE WHEN ${products.isActive} = true THEN 1 END)`,
      })
      .from(brands)
      .leftJoin(products, eq(products.brandId, brands.id))
      .groupBy(brands.id)
      .orderBy(asc(brands.sortOrder), asc(brands.name));

    return jsonResponse(
      rows.map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        logo_url: r.logoUrl,
        sort_order: r.sortOrder,
        product_count: Number(r.productCount),
      }))
    );
  } catch (err) {
    console.error("GET /api/brands error:", err);
    return errorResponse("Internal server error", 500);
  }
}
