"use server";

import { organizations, PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
import { randomBytes } from "crypto";
import { addHours } from "date-fns";
import { Resend } from "resend";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

const resetTranslations = {
  pt: {
    subject: "Redefinição de Senha - StartupsAI",
    title: "Redefinir Senha",
    description: "Clique no botão abaixo para redefinir sua senha:",
    button: "Redefinir Senha",
    warning:
      "Se você não solicitou essa redefinição, por favor ignore este email.",
    expiration: "Este link expira em 1 hora.",
    footer: "Este é um email automático. Por favor, não responda.",
    errors: {
      invalidToken: "Token inválido ou expirado",
      resetFailed: "Falha ao redefinir senha",
      emailFailed: "Falha ao enviar email de redefinição de senha",
    },
  },
  en: {
    subject: "Password Reset - BRICS Cooperation Hub",
    title: "Reset Your Password",
    description: "Click the button below to reset your password:",
    button: "Reset Password",
    warning: "If you didn't request this reset, please ignore this email.",
    expiration: "This link expires in 1 hour.",
    footer: "This is an automated email. Please do not reply.",
    errors: {
      invalidToken: "Invalid or expired token",
      resetFailed: "Failed to reset password",
      emailFailed: "Failed to send password reset email",
    },
  },
};

export async function sendResetPasswordEmail(
  email: string,
  locale: string = "pt",
  organization: organizations,
  subdomain: string
) {
  try {
    const token = randomBytes(32).toString("hex");
    const expires = addHours(new Date(), 1);
    const t =
      resetTranslations[locale as keyof typeof resetTranslations] ||
      resetTranslations.pt;

    await prisma.password_reset_token.create({
      data: {
        email,
        token,
        expires,
      },
    });

    const protocol =
      process.env.NEXT_PUBLIC_PROTOCOL ||
      (process.env.NODE_ENV === "development" ? "http://" : "https://");

    const resetUrl = `${protocol}${subdomain}.${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;

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
                              <h2 style="margin: 0 0 16px 0; color: #374151; font-size: 18px; font-weight: 600;">${t.description}</h2>
                              <div style="margin-top: 24px; text-align: center;">
                                <a href="${resetUrl}" style="display: inline-block; background-color: #3B82F6; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; margin: 16px 0;">
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
    console.error("Error sending password reset email:", error);
    const t =
      resetTranslations[locale as keyof typeof resetTranslations] ||
      resetTranslations.pt;
    return { success: false, error: t.errors.emailFailed };
  }
}

export async function resetPassword(
  token: string,
  newPassword: string,
  locale: string = "pt",
  organization_id: number
) {
  try {
    const resetToken = await prisma.password_reset_token.findUnique({
      where: { token },
    });
    const t =
      resetTranslations[locale as keyof typeof resetTranslations] ||
      resetTranslations.pt;

    if (!resetToken || resetToken.expires < new Date()) {
      return { success: false, error: t.errors.invalidToken };
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    await prisma.user.update({
      where: {
        email_organization_id: {
          email: resetToken.email,
          organization_id: Number(organization_id),
        },
      },
      data: { hashed_password: hashedPassword },
    });

    await prisma.password_reset_token.delete({
      where: { token },
    });

    return { success: true };
  } catch (error) {
    console.error("Error resetting password:", error);
    const t =
      resetTranslations[locale as keyof typeof resetTranslations] ||
      resetTranslations.pt;
    return { success: false, error: t.errors.resetFailed };
  }
}
