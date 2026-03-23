import { db } from "@/db";
import { products, brands, categories, productVariants } from "@/db/schema";
import { eq, desc, asc, and, ne } from "drizzle-orm";
import {
  jsonResponse,
  errorResponse,
  getJsonBody,
} from "@/lib/api-helpers";
import { authenticate } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = authenticate(request);
  if (error) return error;

  try {
    const { id: idStr } = await params;
    const id = Number(idStr);

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
      })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.id, id))
      .limit(1);

    if (rows.length === 0) {
      return errorResponse("Product not found", 404);
    }

    const r = rows[0];

    const variants = await db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, id))
      .orderBy(desc(productVariants.isDefault), asc(productVariants.price));

    return jsonResponse({
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
      variants: variants.map((v) => ({
        id: v.id,
        product_id: v.productId,
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
    console.error("GET /api/admin/products/[id] error:", err);
    return errorResponse("Internal server error", 500);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = authenticate(request);
  if (error) return error;

  try {
    const { id: idStr } = await params;
    const id = Number(idStr);
    const data = await getJsonBody(request);

    // Check exists
    const existing = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (existing.length === 0) {
      return errorResponse("Product not found", 404);
    }

    // Check slug uniqueness
    if (data.slug) {
      const slugConflict = await db
        .select({ id: products.id })
        .from(products)
        .where(and(eq(products.slug, data.slug as string), ne(products.id, id)))
        .limit(1);

      if (slugConflict.length > 0) {
        return errorResponse("Product slug already exists");
      }
    }

    // Build update object
    const update: Record<string, unknown> = {};
    const fieldMap: Record<string, string> = {
      brand_id: "brandId",
      category_id: "categoryId",
      name: "name",
      slug: "slug",
      description: "description",
      colors: "colors",
      image_url: "imageUrl",
      badge: "badge",
      is_featured: "isFeatured",
      is_active: "isActive",
      sort_order: "sortOrder",
    };

    for (const [dataKey, schemaKey] of Object.entries(fieldMap)) {
      if (dataKey in data) {
        update[schemaKey] = data[dataKey];
      }
    }

    if ("specs" in data) {
      update.specs = data.specs;
    }
    if ("images" in data) {
      update.images = data.images;
    }

    if (Object.keys(update).length > 0) {
      await db.update(products).set(update).where(eq(products.id, id));
    }

    // Replace variants if provided
    const variants = data.variants as Array<Record<string, unknown>> | undefined;
    if (variants && Array.isArray(variants)) {
      await db.delete(productVariants).where(eq(productVariants.productId, id));

      if (variants.length > 0) {
        await db.insert(productVariants).values(
          variants.map((v) => ({
            productId: id,
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
    }

    return jsonResponse({ id, updated: true });
  } catch (err) {
    console.error("PUT /api/admin/products/[id] error:", err);
    return errorResponse("Internal server error", 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = authenticate(request);
  if (error) return error;

  try {
    const { id: idStr } = await params;
    const id = Number(idStr);
    const url = new URL(request.url);
    const soft = url.searchParams.get("soft") === "1";

    if (soft) {
      const result = await db
        .update(products)
        .set({ isActive: false })
        .where(eq(products.id, id))
        .returning({ id: products.id });

      if (result.length === 0) {
        return errorResponse("Product not found", 404);
      }

      return jsonResponse({ id, deactivated: true });
    }

    // Hard delete — variants cascade automatically
    const result = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning({ id: products.id });

    if (result.length === 0) {
      return errorResponse("Product not found", 404);
    }

    return jsonResponse({ id, deleted: true });
  } catch (err: unknown) {
    // Foreign key constraint — product has orders
    const message = err instanceof Error ? err.message : "";
    if (message.includes("violates foreign key constraint")) {
      return errorResponse(
        "Impossible de supprimer : ce produit est lie a des commandes existantes. Utilisez la desactivation.",
        409
      );
    }
    console.error("DELETE /api/admin/products/[id] error:", err);
    return errorResponse("Internal server error", 500);
  }
}
