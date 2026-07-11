import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { usingBlob } from "@/lib/catalog-store";
import { isAuthed } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const DIR = path.join(process.cwd(), "public", "media", "catalog");
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};
const MAX_BYTES = 15 * 1024 * 1024; // 15 MB — next/image optimises delivery anyway

function slugifyBase(name: string): string {
  return (
    name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "image"
  );
}

/**
 * Accepts one image (multipart field `file`) and returns its public URL/path.
 * On Vercel it goes to Vercel Blob; locally it is written under
 * public/media/catalog. Called by the CMS during Save, so images land at the
 * same moment the catalog is written.
 */
export async function POST(req: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "Not authorised." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form data." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  const ext = EXT[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Unsupported image type (use JPG, PNG, WebP or AVIF)." },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image is larger than 15 MB." }, { status: 413 });
  }

  const preferred = slugifyBase((form.get("slug") as string) || file.name);

  if (usingBlob) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`catalog/${preferred}.${ext}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    });
    return NextResponse.json({ path: blob.url });
  }

  // Local dev — write into public/media/catalog with a unique, slug-based name.
  await fs.mkdir(DIR, { recursive: true });
  let name = `${preferred}.${ext}`;
  let i = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      await fs.access(path.join(DIR, name));
      name = `${preferred}-${i++}.${ext}`;
    } catch {
      break;
    }
  }
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(DIR, name), buf);
  return NextResponse.json({ path: `/media/catalog/${name}` });
}
