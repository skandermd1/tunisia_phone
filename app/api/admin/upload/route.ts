import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { authenticate } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";

export const runtime = "nodejs";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 10;

export async function POST(request: Request) {
  const { error } = authenticate(request);
  if (error) return error;

  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return errorResponse("Aucun fichier fourni");
    }

    if (files.length > MAX_FILES) {
      return errorResponse(`Maximum ${MAX_FILES} fichiers par requete`);
    }

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return errorResponse(`Type non autorise: ${file.type}. Utilisez JPEG, PNG ou WebP.`);
      }
      if (file.size > MAX_FILE_SIZE) {
        return errorResponse(`Fichier trop volumineux: ${file.name}. Maximum 5 Mo.`);
      }
    }

    const urls: string[] = [];

    for (const file of files) {
      const ext = file.name.split(".").pop() || "jpg";
      const key = `products/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key: key,
          Body: buffer,
          ContentType: file.type,
        })
      );

      urls.push(`${process.env.R2_PUBLIC_URL}/${key}`);
    }

    return jsonResponse({ urls });
  } catch (err) {
    console.error("POST /api/admin/upload error:", err);
    return errorResponse("Erreur lors de l'upload", 500);
  }
}
