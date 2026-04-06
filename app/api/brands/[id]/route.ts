import { db } from "@/db";
import { brands, products } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { jsonResponse, errorResponse, getJsonBody } from "@/lib/api-helpers";
import { authenticate } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = authenticate(request);
  if (error) return error;

  const { id } = await params;
  const brandId = Number(id);
  if (isNaN(brandId)) return errorResponse("ID invalide");

  try {
    const body = await getJsonBody(request);
    const updates: Partial<{ name: string; slug: string; sortOrder: number }> = {};

    if (body.name !== undefined) updates.name = String(body.name).trim();
    if (body.slug !== undefined) {
      const slug = String(body.slug).trim();
      if (!/^[a-z0-9-]+$/.test(slug)) {
        return errorResponse("Le slug ne peut contenir que des lettres minuscules, chiffres et tirets");
      }
      updates.slug = slug;
    }
    if (body.sort_order !== undefined) updates.sortOrder = Number(body.sort_order);

    if (Object.keys(updates).length === 0) return errorResponse("Aucune donnee a mettre a jour");

    const [updated] = await db.update(brands).set(updates).where(eq(brands.id, brandId)).returning();
    if (!updated) return errorResponse("Marque introuvable", 404);

    return jsonResponse({ id: updated.id, name: updated.name, slug: updated.slug, sort_order: updated.sortOrder });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("unique")) return errorResponse("Une marque avec ce nom ou ce slug existe deja", 409);
    console.error("PUT /api/brands/[id] error:", err);
    return errorResponse("Internal server error", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = authenticate(request);
  if (error) return error;

  const { id } = await params;
  const brandId = Number(id);
  if (isNaN(brandId)) return errorResponse("ID invalide");

  try {
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(eq(products.brandId, brandId));

    if (Number(count) > 0) {
      return errorResponse(`Impossible de supprimer: ${count} produit(s) utilisent cette marque`, 409);
    }

    const [deleted] = await db.delete(brands).where(eq(brands.id, brandId)).returning();
    if (!deleted) return errorResponse("Marque introuvable", 404);

    return jsonResponse({ deleted: true });
  } catch (err) {
    console.error("DELETE /api/brands/[id] error:", err);
    return errorResponse("Internal server error", 500);
  }
}
