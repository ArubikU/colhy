
import { SignJWT, jwtVerify } from 'jose';
import { Resend } from 'resend';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-change-me');
const resend = new Resend(process.env.RESEND_API_KEY);

export async function signToken(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(secret);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch (error) {
        return null;
    }
}

export async function sendLoginEmail(email: string, url: string) {
    if (process.env.NODE_ENV === 'development') {
        console.log('Login Link:', url);
    }

    try {
        await resend.emails.send({
            from: 'Auth <colhy@ulima.dev>', // Update this with your verified domain
            to: email,
            subject: 'Login to Colhy',
            html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Bienvenido a Colhy</h2>
              <p>Has solicitado iniciar sesión. Haz clic en el siguiente botón para continuar:</p>
              <a href="${url}" style="display: inline-block; background-color: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
                Iniciar Sesión
              </a>
              <p style="color: #666; font-size: 14px;">Si no solicitaste este correo, puedes ignorarlo.</p>
            </div>
            `,
        });
    } catch (error) {
        console.error('Failed to send email:', error);
        throw new Error('Failed to send login email');
    }
}
