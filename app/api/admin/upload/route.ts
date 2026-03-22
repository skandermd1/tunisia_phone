import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { authenticate } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";

export const runtime = "nodejs";

let _s3: S3Client | null = null;
function getS3Client() {
  if (!_s3) {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKey = process.env.R2_ACCESS_KEY_ID;
    const secret = process.env.R2_SECRET_ACCESS_KEY;
    if (!accountId || !accessKey || !secret) {
      throw new Error("R2 environment variables are not configured");
    }
    _s3 = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: accessKey, secretAccessKey: secret },
    });
  }
  return _s3;
}

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const ALLOWED_TYPES = Object.keys(MIME_TO_EXT);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 10;

function detectMimeFromBytes(buffer: Buffer): string | null {
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) return "image/jpeg";
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) return "image/png";
  if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
      buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) return "image/webp";
  return null;
}

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

    const s3 = getS3Client();
    const urls: string[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const detectedMime = detectMimeFromBytes(buffer);
      if (!detectedMime) {
        return errorResponse(`Fichier invalide: ${file.name}. Le contenu n'est pas une image valide.`);
      }

      const ext = MIME_TO_EXT[detectedMime];
      const key = `products/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key: key,
          Body: buffer,
          ContentType: detectedMime,
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
