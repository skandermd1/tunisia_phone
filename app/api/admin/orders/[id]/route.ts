import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";
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

    const rows = await db.select().from(orders).where(eq(orders.id, id)).limit(1);

    if (rows.length === 0) {
      return errorResponse("Order not found", 404);
    }

    const order = rows[0];
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, id));

    return jsonResponse({
      id: order.id,
      order_number: order.orderNumber,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      customer_address: order.customerAddress,
      customer_city: order.customerCity,
      customer_governorate: order.customerGovernorate,
      notes: order.notes,
      subtotal: Number(order.subtotal),
      total: Number(order.total),
      status: order.status,
      created_at: order.createdAt,
      updated_at: order.updatedAt,
      items: items.map((i) => ({
        id: i.id,
        order_id: i.orderId,
        product_id: i.productId,
        variant_id: i.variantId,
        product_name: i.productName,
        variant_label: i.variantLabel,
        price: Number(i.price),
        quantity: i.quantity,
      })),
    });
  } catch (err) {
    console.error("GET /api/admin/orders/[id] error:", err);
    return errorResponse("Internal server error", 500);
  }
}
