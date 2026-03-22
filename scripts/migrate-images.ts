import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "tunisia-phone-images";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function main() {
  const imagesDir = join(__dirname, "..", "backend", "uploads", "products");
  const files = readdirSync(imagesDir).filter(
    (f) => f.endsWith(".jpg") || f.endsWith(".png") || f.endsWith(".webp")
  );

  console.log(`Found ${files.length} images to upload...`);

  for (const file of files) {
    const filePath = join(imagesDir, file);
    const body = readFileSync(filePath);
    const key = `products/${file}`;

    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: key,
          Body: body,
          ContentType: file.endsWith(".png")
            ? "image/png"
            : file.endsWith(".webp")
              ? "image/webp"
              : "image/jpeg",
        })
      );
      console.log(`  Uploaded: ${key}`);
    } catch (err) {
      console.error(`  FAILED: ${key}`, err);
    }
  }

  console.log("Done!");
}

main();
