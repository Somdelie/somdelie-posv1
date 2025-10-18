import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  // Upload to Vercel Blob Storage
  const blob = await put(file.name, file, { access: "public" });
  return NextResponse.json({ url: blob.url });
}
