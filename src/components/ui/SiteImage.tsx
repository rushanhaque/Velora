"use client";
import Image, { type ImageProps } from "next/image";
import { mediaUrl } from "@/lib/media-url";
export default function SiteImage({ src, ...props }: ImageProps) {
  return <Image {...props} src={typeof src === "string" ? mediaUrl(src) : src} />;
}
