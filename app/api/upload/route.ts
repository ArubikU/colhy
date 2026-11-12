
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { quoteAttachments } from '@/lib/db/schema';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = request.cookies.get('session')?.value;
    const jwtPayload = session ? await verifyToken(session) : null;

    if (!jwtPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const quoteId = formData.get('quoteId') as string;

    if (!file || !quoteId) {
      return NextResponse.json(
        { error: 'Missing file or quoteId' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await db.insert(quoteAttachments).values({
      quoteId,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      fileContent: buffer,
      uploadedBy: jwtPayload.sub as string,
    });

    return NextResponse.json({
      success: true,
      fileName: file.name,
    });
  } catch (error) {
    console.error('[Colhy] Upload error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Upload failed',
      },
      { status: 500 }
    );
  }
}
