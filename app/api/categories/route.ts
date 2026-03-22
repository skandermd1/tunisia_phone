import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { eq, count, asc, sql } from "drizzle-orm";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET() {
  try {
    const rows = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        icon: categories.icon,
        sortOrder: categories.sortOrder,
        productCount: sql<number>`count(CASE WHEN ${products.isActive} = true THEN 1 END)`,
      })
      .from(categories)
      .leftJoin(products, eq(products.categoryId, categories.id))
      .groupBy(categories.id)
      .orderBy(asc(categories.sortOrder), asc(categories.name));

    return jsonResponse(
      rows.map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        icon: r.icon,
        sort_order: r.sortOrder,
        product_count: Number(r.productCount),
      }))
    );
  } catch (err) {
    console.error("GET /api/categories error:", err);
    return errorResponse("Internal server error", 500);
  }
}
