import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { jsonResponse, errorResponse, getJsonBody } from "@/lib/api-helpers";
import { authenticate } from "@/lib/auth";

const VALID_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

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

    if (!data.status) {
      return errorResponse("Status is required");
    }

    const status = data.status as string;
    if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
      return errorResponse(`Invalid status. Allowed: ${VALID_STATUSES.join(", ")}`);
    }

    const result = await db
      .update(orders)
      .set({ status: status as (typeof VALID_STATUSES)[number] })
      .where(eq(orders.id, id))
      .returning({ id: orders.id });

    if (result.length === 0) {
      return errorResponse("Order not found", 404);
    }

    return jsonResponse({ id, status });
  } catch (err) {
    console.error("PUT /api/admin/orders/[id]/status error:", err);
    return errorResponse("Internal server error", 500);
  }
}
