import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  let errorMessage = 'Cloudinary environment variables are not fully configured.';
  if (!cloudName) errorMessage = 'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set.';
  if (!apiKey) errorMessage = 'NEXT_PUBLIC_CLOUDINARY_API_KEY is not set.';
  if (!apiSecret) errorMessage = 'CLOUDINARY_API_SECRET is not set.';
  
  console.error(errorMessage);
  return NextResponse.json(
    { error: 'Cloudinary environment variables are not configured correctly.' },
    { status: 500 }
  );
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});


export async function POST(request: Request) {
  const body = await request.json();
  const { paramsToSign } = body;

  try {
    const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);
    return NextResponse.json({ signature });
  } catch (error) {
    console.error('Failed to sign Cloudinary params', error);
    return NextResponse.json({ error: 'Failed to create signature.' }, { status: 500 });
  }
}
