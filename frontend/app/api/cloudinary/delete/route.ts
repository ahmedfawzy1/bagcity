import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function extractPublicId(url: string): string | null {
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const { urls } = await req.json() as { urls: string[] };

  if (!Array.isArray(urls) || urls.length === 0) {
    return NextResponse.json({ deleted: [] });
  }

  const publicIds = urls.map(extractPublicId).filter(Boolean) as string[];

  if (publicIds.length === 0) {
    return NextResponse.json({ deleted: [] });
  }

  const result = await cloudinary.api.delete_resources(publicIds);
  return NextResponse.json({ deleted: Object.keys(result.deleted) });
}
