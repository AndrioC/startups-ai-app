"use server";

import { organizations, PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";
import { addHours } from "date-fns";
import { Resend } from "resend";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

const translations = {
  pt: {
    subject: "Verificação de Email - StartupsAI",
    title: "Novo Email para Verificação",
    description: "Clique no botão abaixo para verificar seu endereço de email:",
    button: "Verificar Email",
    warning:
      "Se você não solicitou esta verificação, por favor ignore este email.",
    expiration: "Este link expira em 24 horas.",
    footer: "Este é um email automático. Por favor, não responda.",
    verificationSection: "Verificação de Email",
    errors: {
      invalidToken: "Token inválido ou expirado",
      verificationFailed: "Falha ao verificar token",
      emailFailed: "Falha ao enviar email de verificação",
    },
  },
  en: {
    subject: "Email Verification - BRICS Cooperation Hub",
    title: "New Email for Verification",
    description: "Click the button below to verify your email address:",
    button: "Verify Email",
    warning:
      "If you didn't request this verification, please ignore this email.",
    expiration: "This link expires in 24 hours.",
    footer: "This is an automated email. Please do not reply.",
    verificationSection: "Email Verification",
    errors: {
      invalidToken: "Invalid or expired token",
      verificationFailed: "Failed to verify token",
      emailFailed: "Failed to send verification email",
    },
  },
};

export async function sendVerificationEmail(
  email: string,
  locale: string = "pt",
  organization: organizations
) {
  try {
    const token = randomBytes(32).toString("hex");
    const expires = addHours(new Date(), 24);
    const t =
      translations[locale as keyof typeof translations] || translations.pt;

    await prisma.verification_token.create({
      data: {
        email,
        token,
        expires,
      },
    });

    const protocol =
      process.env.NEXT_PUBLIC_PROTOCOL ||
      (process.env.NODE_ENV === "development" ? "http://" : "https://");

    const subdomain = organization.slug;

    const verificationUrl = `${protocol}${subdomain}.${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm-account?token=${token}`;

    await resend.emails.send({
      from: "StartupsAI <no-reply@startupsai.com.br>",
      to: email,
      subject: t.subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${t.title}</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <tr>
                <td style="padding: 40px 0; text-align: center; background: linear-gradient(135deg, #3B82F6 0%, #3B82F6 100%); border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">${t.title}</h1>
                </td>
              </tr>

              <tr>
                <td style="padding: 32px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td>
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                          <tr>
                            <td>
                              <h2 style="margin: 0 0 16px 0; color: #374151; font-size: 18px; font-weight: 600;">${t.verificationSection}</h2>
                              
                              <div style="margin-bottom: 16px;">
                                <p style="margin: 0 0 8px 0; color: #6B7280; font-size: 14px;">E-mail:</p>
                                <p style="margin: 0; color: #111827; font-size: 16px; font-weight: 500;">${email}</p>
                              </div>

                              <div style="margin-top: 24px; text-align: center;">
                                <a href="${verificationUrl}" style="display: inline-block; background-color: #3B82F6; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; margin: 16px 0;">
                                  ${t.button}
                                </a>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border-radius: 8px; padding: 24px;">
                          <tr>
                            <td>
                              <p style="margin: 0 0 16px 0; color: #6B7280; font-size: 14px;">
                                ${t.warning}
                              </p>
                              <p style="margin: 0; color: #6B7280; font-size: 14px;">
                                ${t.expiration}
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding: 24px; text-align: center; background-color: #f8fafc; border-radius: 0 0 8px 8px;">
                  <p style="margin: 0; color: #6B7280; font-size: 14px;">${t.footer}</p>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending verification email:", error);
    const t =
      translations[locale as keyof typeof translations] || translations.pt;
    return { success: false, error: t.errors.emailFailed };
  }
}

export async function verifyToken(token: string, locale: string = "pt") {
  try {
    const verificationToken = await prisma.verification_token.findUnique({
      where: { token },
    });

    const t =
      translations[locale as keyof typeof translations] || translations.pt;

    if (!verificationToken || verificationToken.expires < new Date()) {
      return { success: false, error: t.errors.invalidToken };
    }

    await prisma.verification_token.delete({
      where: { token },
    });

    return { success: true, email: verificationToken.email };
  } catch (error) {
    console.error("Error verifying token:", error);
    const t =
      translations[locale as keyof typeof translations] || translations.pt;
    return { success: false, error: t.errors.verificationFailed };
  }
}
