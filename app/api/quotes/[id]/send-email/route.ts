import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { db } from '@/lib/db';
import { quotes } from '@/lib/db/schema';
import { verifyToken } from '@/lib/auth';
import { eq } from 'drizzle-orm';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = request.cookies.get('session')?.value;
    const jwtPayload = session ? await verifyToken(session) : null;

    if (!jwtPayload) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await request.json();
        const { recipientEmail } = body;

        if (!recipientEmail) {
            return NextResponse.json({ error: 'Recipient email is required' }, { status: 400 });
        }

        // Fetch the quote
        const [quote] = await db.select().from(quotes).where(eq(quotes.id, id));

        if (!quote) {
            return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
        }

        // Check ownership
        const userId = jwtPayload.sub as string;
        if (quote.consultantId !== userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Get user email for "from" field
        const userEmail = jwtPayload.email as string;
        const emailPrefix = userEmail.split('@')[0];

        // Send email using Resend
        const { data, error } = await resend.emails.send({
            from: `${userEmail} <${emailPrefix}-colhy@ulima.dev>`,
            to: [recipientEmail],
            subject: `Cotización: ${quote.description}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">Nueva Cotización de Proyecto</h2>
                    <p>Hola,</p>
                    <p>Adjunto encontrarás la cotización para el proyecto: <strong>${quote.description}</strong></p>
                    
                    <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>ID:</strong> ${quote.id}</p>
                        <p style="margin: 5px 0;"><strong>Tarifa por hora:</strong> $${quote.hourlyRate}</p>
                        <p style="margin: 5px 0;"><strong>Estado:</strong> ${quote.status}</p>
                    </div>

                    ${quote.generatedQuote ? `
                        <div style="margin: 20px 0;">
                            <a href="${process.env.NEXT_PUBLIC_APP_URL}/quote/${quote.id}" 
                               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                                Ver Cotización Completa
                            </a>
                        </div>
                    ` : ''}

                    <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
                        Este email fue enviado desde Colhy - Sistema de Gestión de Cotizaciones
                    </p>
                </div>
            `,
            // Attach the HTML as a file
            attachments: quote.generatedQuote ? [{
                filename: `Cotizacion_${quote.id}.html`,
                content: Buffer.from(quote.generatedQuote).toString('base64'),
            }] : undefined,
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json({ error: 'Failed to send email', details: error }, { status: 500 });
        }

        return NextResponse.json({ success: true, messageId: data?.id });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
