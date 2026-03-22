import { db } from "@/db";
import { orders, orderItems, productVariants, products } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import {
  jsonResponse,
  errorResponse,
  getJsonBody,
  validateRequired,
  validatePhone,
} from "@/lib/api-helpers";

export async function POST(request: Request) {
  try {
    const data = await getJsonBody(request);

    const missing = validateRequired(
      ["customer_name", "customer_phone", "customer_address", "items"],
      data
    );
    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(", ")}`);
    }

    if (!validatePhone(data.customer_phone as string)) {
      return errorResponse("Invalid Tunisian phone number (must be 8 digits)");
    }

    const items = data.items as Array<{ variant_id: number; quantity?: number }>;
    if (!Array.isArray(items) || items.length === 0) {
      return errorResponse("Order must contain at least one item");
    }

    for (let i = 0; i < items.length; i++) {
      if (!items[i].variant_id) {
        return errorResponse(`Item at index ${i} is missing variant_id`);
      }
    }

    // Resolve items
    let subtotal = 0;
    const resolvedItems: Array<{
      productId: number;
      variantId: number;
      productName: string;
      variantLabel: string;
      price: string;
      quantity: number;
    }> = [];

    for (const item of items) {
      const qty = Math.max(1, Number(item.quantity) || 1);

      const rows = await db
        .select({
          variantId: productVariants.id,
          productId: productVariants.productId,
          price: productVariants.price,
          ram: productVariants.ram,
          storage: productVariants.storage,
          storageUnit: productVariants.storageUnit,
          stockStatus: productVariants.stockStatus,
          productName: products.name,
        })
        .from(productVariants)
        .innerJoin(products, eq(products.id, productVariants.productId))
        .where(eq(productVariants.id, item.variant_id))
        .limit(1);

      if (rows.length === 0) {
        return errorResponse(`Variant ID ${item.variant_id} not found`);
      }

      const variant = rows[0];
      if (variant.stockStatus === "out_of_stock") {
        return errorResponse(`Product "${variant.productName}" is out of stock`);
      }

      const variantLabel = `${variant.ram} / ${variant.storage}${variant.storageUnit}`.trim();
      subtotal += Number(variant.price) * qty;

      resolvedItems.push({
        productId: variant.productId,
        variantId: variant.variantId,
        productName: variant.productName,
        variantLabel,
        price: variant.price,
        quantity: qty,
      });
    }

    const total = subtotal;

    // Retry loop for order number uniqueness
    const maxRetries = 3;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const prefix = `TP-${today}-`;

        const [{ dayCount }] = await db
          .select({
            dayCount: sql<number>`count(*)`,
          })
          .from(orders)
          .where(sql`${orders.orderNumber} LIKE ${prefix + "%"}`);

        const orderNumber = `${prefix}${String(Number(dayCount) + 1).padStart(4, "0")}`;

        // Insert order
        const [inserted] = await db
          .insert(orders)
          .values({
            orderNumber,
            customerName: String(data.customer_name).trim(),
            customerPhone: String(data.customer_phone).trim(),
            customerAddress: String(data.customer_address).trim(),
            customerCity: data.customer_city ? String(data.customer_city).trim() : null,
            customerGovernorate: data.customer_governorate
              ? String(data.customer_governorate).trim()
              : null,
            notes: data.notes ? String(data.notes).trim() : null,
            subtotal: String(subtotal),
            total: String(total),
          })
          .returning({ id: orders.id, orderNumber: orders.orderNumber });

        // Insert items
        await db.insert(orderItems).values(
          resolvedItems.map((ri) => ({
            orderId: inserted.id,
            productId: ri.productId,
            variantId: ri.variantId,
            productName: ri.productName,
            variantLabel: ri.variantLabel,
            price: ri.price,
            quantity: ri.quantity,
          }))
        );

        return jsonResponse(
          {
            order_number: inserted.orderNumber,
            total,
            status: "pending",
            items_count: resolvedItems.length,
          },
          201
        );
      } catch (err: unknown) {
        // PG unique violation = 23505
        const pgErr = err as { code?: string };
        if (pgErr.code === "23505" && attempt < maxRetries - 1) {
          continue;
        }
        throw err;
      }
    }

    return errorResponse("Failed to create order after retries", 500);
  } catch (err) {
    console.error("POST /api/orders error:", err);
    return errorResponse("Internal server error", 500);
  }
}
