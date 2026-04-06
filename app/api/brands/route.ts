import { db } from "@/db";
import { brands, products } from "@/db/schema";
import { eq, asc, sql } from "drizzle-orm";
import { jsonResponse, errorResponse, getJsonBody, validateRequired } from "@/lib/api-helpers";
import { authenticate } from "@/lib/auth";
import { NextRequest } from "next/server";

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

export async function POST(request: NextRequest) {
  const { error } = authenticate(request);
  if (error) return error;

  try {
    const body = await getJsonBody(request);
    const missing = validateRequired(["name", "slug"], body);
    if (missing.length > 0) {
      return errorResponse(`Champs requis manquants: ${missing.join(", ")}`);
    }

    const name = String(body.name).trim();
    const slug = String(body.slug).trim();
    const sortOrder = Number(body.sort_order) || 0;

    if (!/^[a-z0-9-]+$/.test(slug)) {
      return errorResponse("Le slug ne peut contenir que des lettres minuscules, chiffres et tirets");
    }

    const [inserted] = await db
      .insert(brands)
      .values({ name, slug, sortOrder })
      .returning();

    return jsonResponse({ id: inserted.id, name: inserted.name, slug: inserted.slug, sort_order: inserted.sortOrder, product_count: 0 }, 201);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("unique")) return errorResponse("Une marque avec ce nom ou ce slug existe deja", 409);
    console.error("POST /api/brands error:", err);
    return errorResponse("Internal server error", 500);
  }
}
