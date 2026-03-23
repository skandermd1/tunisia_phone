import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { readFileSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { readFileSync as readFile } from "fs";

// Load .env.local manually (no dotenv dependency)
// .env.local is in the main project dir (worktrees don't copy it)
const envPath = process.env.ENV_PATH || join(__dirname, "..", ".env.local");
const envContent = readFile(envPath, "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  const val = trimmed.slice(eqIdx + 1).trim();
  if (!process.env[key]) process.env[key] = val;
}

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "tunisia-phone-images";
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "https://pub-5ed6c3b4f370427db81ffb0d12c0b2f8.r2.dev";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const TMP_DIR = join(__dirname, "tmp");
const PROCESSED_DIR = join(__dirname, "processed");

const IMAGE_SIZE = 800;
const JPEG_QUALITY = 85;

interface Result {
  filename: string;
  status: "success" | "failed";
  error?: string;
  originalSize?: number;
  processedSize?: number;
}

async function downloadImage(url: string, filename: string): Promise<Buffer> {
  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "image/*,*/*",
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      const buffer = Buffer.from(await res.arrayBuffer());
      writeFileSync(join(TMP_DIR, filename), buffer);
      return buffer;
    } catch (err: any) {
      console.log(`    Attempt ${attempt}/${maxRetries} failed: ${err.message}`);
      if (attempt === maxRetries) throw err;
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
  throw new Error("Unreachable");
}

async function processImage(input: Buffer): Promise<Buffer> {
  return sharp(input)
    .resize(IMAGE_SIZE, IMAGE_SIZE, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .jpeg({ quality: JPEG_QUALITY })
    .toBuffer();
}

async function uploadToR2(buffer: Buffer, filename: string): Promise<void> {
  const key = `products/${filename}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: "image/jpeg",
    })
  );
}

async function main() {
  const sources: Record<string, string> = JSON.parse(
    readFileSync(join(__dirname, "image-sources.json"), "utf-8")
  );

  mkdirSync(TMP_DIR, { recursive: true });
  mkdirSync(PROCESSED_DIR, { recursive: true });

  const filenames = Object.keys(sources);
  console.log(`\nProcessing ${filenames.length} images...\n`);

  const results: Result[] = [];

  for (let i = 0; i < filenames.length; i++) {
    const filename = filenames[i];
    const url = sources[filename];
    const progress = `[${i + 1}/${filenames.length}]`;

    console.log(`${progress} ${filename}`);

    try {
      // Download
      console.log(`  Downloading from ${new URL(url).hostname}...`);
      const raw = await downloadImage(url, filename);
      console.log(`  Downloaded: ${(raw.length / 1024).toFixed(1)} KB`);

      // Process
      const processed = await processImage(raw);
      writeFileSync(join(PROCESSED_DIR, filename), processed);
      console.log(`  Processed: ${(processed.length / 1024).toFixed(1)} KB (${IMAGE_SIZE}x${IMAGE_SIZE})`);

      // Upload
      await uploadToR2(processed, filename);
      console.log(`  Uploaded to R2: products/${filename}`);

      results.push({
        filename,
        status: "success",
        originalSize: raw.length,
        processedSize: processed.length,
      });

      // Delay between requests to avoid rate limiting
      if (i < filenames.length - 1) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    } catch (err: any) {
      console.log(`  FAILED: ${err.message}`);
      results.push({ filename, status: "failed", error: err.message });
    }
  }

  // Summary
  const succeeded = results.filter((r) => r.status === "success");
  const failed = results.filter((r) => r.status === "failed");

  console.log(`\n${"=".repeat(60)}`);
  console.log(`SUMMARY: ${succeeded.length} succeeded, ${failed.length} failed out of ${results.length}`);

  if (failed.length > 0) {
    console.log("\nFailed images:");
    for (const f of failed) {
      console.log(`  - ${f.filename}: ${f.error}`);
    }
  }

  if (succeeded.length > 0) {
    const totalOriginal = succeeded.reduce((s, r) => s + (r.originalSize || 0), 0);
    const totalProcessed = succeeded.reduce((s, r) => s + (r.processedSize || 0), 0);
    console.log(`\nTotal downloaded: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Total processed: ${(totalProcessed / 1024 / 1024).toFixed(2)} MB`);
  }

  console.log(`\nVerify at: ${R2_PUBLIC_URL}/products/samsung-galaxy-a56.jpg`);
  console.log("Done!");
}

main().catch(console.error);
