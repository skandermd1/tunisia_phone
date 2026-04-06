import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { jsonResponse, errorResponse, getJsonBody } from "@/lib/api-helpers";
import { authenticate } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = authenticate(request);
  if (error) return error;

  const { id } = await params;
  const catId = Number(id);
  if (isNaN(catId)) return errorResponse("ID invalide");

  try {
    const body = await getJsonBody(request);
    const updates: Partial<{ name: string; slug: string; icon: string | null; sortOrder: number }> = {};

    if (body.name !== undefined) updates.name = String(body.name).trim();
    if (body.slug !== undefined) {
      const slug = String(body.slug).trim();
      if (!/^[a-z0-9-]+$/.test(slug)) {
        return errorResponse("Le slug ne peut contenir que des lettres minuscules, chiffres et tirets");
      }
      updates.slug = slug;
    }
    if (body.icon !== undefined) updates.icon = body.icon ? String(body.icon).trim() : null;
    if (body.sort_order !== undefined) updates.sortOrder = Number(body.sort_order);

    if (Object.keys(updates).length === 0) return errorResponse("Aucune donnee a mettre a jour");

    const [updated] = await db.update(categories).set(updates).where(eq(categories.id, catId)).returning();
    if (!updated) return errorResponse("Categorie introuvable", 404);

    return jsonResponse({ id: updated.id, name: updated.name, slug: updated.slug, icon: updated.icon, sort_order: updated.sortOrder });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("unique")) return errorResponse("Une categorie avec ce slug existe deja", 409);
    console.error("PUT /api/categories/[id] error:", err);
    return errorResponse("Internal server error", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = authenticate(request);
  if (error) return error;

  const { id } = await params;
  const catId = Number(id);
  if (isNaN(catId)) return errorResponse("ID invalide");

  try {
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(eq(products.categoryId, catId));

    if (Number(count) > 0) {
      return errorResponse(`Impossible de supprimer: ${count} produit(s) utilisent cette categorie`, 409);
    }

    const [deleted] = await db.delete(categories).where(eq(categories.id, catId)).returning();
    if (!deleted) return errorResponse("Categorie introuvable", 404);

    return jsonResponse({ deleted: true });
  } catch (err) {
    console.error("DELETE /api/categories/[id] error:", err);
    return errorResponse("Internal server error", 500);
  }
}
