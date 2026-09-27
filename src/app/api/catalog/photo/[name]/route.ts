import { NextResponse } from "next/server";
import { readPhotoFromGitHub, isGitHubConfigured } from "@/lib/github-commit";
import { PHOTO_PATTERN } from "@/lib/photo-shared";
import { photoName } from "@/lib/catalog-store";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export async function GET(_req: Request, { params }: { params: { name: string } }) {
  const name = params.name;
  if (!PHOTO_PATTERN.test("product-photos/" + name)) {
    return NextResponse.json({ error: "Invalid photo name." }, { status: 400 });
  }
  try {
    const bytes = isGitHubConfigured()
      ? await readPhotoFromGitHub("public/product-photos/" + name)
      : new Uint8Array(await fs.readFile(path.join(process.cwd(), "public/product-photos", name)));
    const ext = name.split(".").pop()!;
    if (photoName(bytes, ext) !== name) throw new Error("Photo hash mismatch.");
    return new NextResponse(new Uint8Array(bytes).buffer, { headers: {
      "Content-Type": "image/" + (ext === "jpg" ? "jpeg" : ext),
      "Cache-Control": "public, max-age=31536000, immutable",
      "CDN-Cache-Control": "public, max-age=31536000, immutable",
      "Vercel-CDN-Cache-Control": "public, max-age=31536000, immutable",
    } });
  } catch {
    return NextResponse.json({ error: "Photo temporarily unavailable." }, {
      status: 503, headers: { "Cache-Control": "no-store", "CDN-Cache-Control": "no-store", "Vercel-CDN-Cache-Control": "no-store" },
    });
  }
}
