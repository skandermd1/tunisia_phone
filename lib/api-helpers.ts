import { NextResponse } from "next/server";

export function jsonResponse(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function getJsonBody(request: Request): Promise<Record<string, unknown>> {
  return request.json().catch(() => ({}));
}

export function validateRequired(
  fields: string[],
  data: Record<string, unknown>
): string[] {
  return fields.filter(
    (f) => data[f] === undefined || data[f] === null || data[f] === ""
  );
}

export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s-]/g, "");
  const match = cleaned.match(/^(?:\+?216)?(\d+)$/);
  if (!match) return false;
  return match[1].length === 8;
}
