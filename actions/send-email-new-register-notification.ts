"use server";

import { EnterpriseCategoryType, UserType } from "@prisma/client";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const translations = {
  pt: {
    subject: "Novo Cadastro Realizado - StartupsAI",
    title: "Novo Cadastro Realizado",
    description: "Um novo cadastro foi realizado com os seguintes dados:",
    nameLabel: "Nome:",
    emailLabel: "E-mail:",
    accountTypeLabel: "Tipo de conta:",
    footer: "Este é um e-mail automático. Por favor, não responda.",
    errors: {
      emailFailed: "Falha ao enviar e-mail de notificação de novo cadastro",
    },
    button: "Acessar o Sistema",
    accountTypes: {
      STARTUP: "Startup",
      TRADITIONAL_COMPANY: "Empresa Tradicional",
      GOVERNMENT: "Governo",
      INNOVATION_ENVIRONMENT: "Ambiente de Inovação",
      INVESTOR: "Investidor",
      MENTOR: "Mentor",
    },
  },
  en: {
    subject: "New Registration Completed - StartupsAI",
    title: "New Registration Completed",
    description:
      "A new registration has been completed with the following details:",
    nameLabel: "Name:",
    emailLabel: "Email:",
    accountTypeLabel: "Account type:",
    footer: "This is an automatic email. Please do not reply.",
    errors: {
      emailFailed: "Failed to send new registration notification email",
    },
    button: "Access the System",
    accountTypes: {
      STARTUP: "Startup",
      TRADITIONAL_COMPANY: "Traditional Company",
      GOVERNMENT: "Government",
      INNOVATION_ENVIRONMENT: "Innovation Environment",
      INVESTOR: "Investor",
      MENTOR: "Mentor",
    },
  },
};

const generateEmailTemplate = (
  t: typeof translations.pt,
  name: string,
  email: string,
  mainUrl: string,
  accountType: string
) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${t.title}</title>
  </head>
  <body style="
    margin: 0;
    padding: 0;
    background-color: #f6f9fc;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  ">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    ">
      <tr>
        <td style="
          padding: 40px 0;
          text-align: center;
          background: linear-gradient(135deg, #3B82F6 0%, #3B82F6 100%);
          border-radius: 8px 8px 0 0;
        ">
          <h1 style="
            margin: 0;
            color: #ffffff;
            font-size: 24px;
            font-weight: 600;
          ">${t.title}</h1>
        </td>
      </tr>

      <tr>
        <td style="padding: 32px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="
                background-color: #f8fafc;
                border-radius: 8px;
                padding: 24px;
              ">
                <h2 style="
                  margin: 0 0 16px 0;
                  color: #374151;
                  font-size: 18px;
                  font-weight: 600;
                ">${t.description}</h2>

                <!-- User Info -->
                <p style="
                  margin: 0;
                  color: #111827;
                  font-size: 16px;
                  font-weight: 500;
                ">
                  <strong>${t.nameLabel}</strong> ${name}
                </p>
                <p style="
                  margin: 8px 0 0 0;
                  color: #111827;
                  font-size: 16px;
                  font-weight: 500;
                ">
                  <strong>${t.emailLabel}</strong> ${email}
                </p>
                <p style="
                  margin: 8px 0 0 0;
                  color: #111827;
                  font-size: 16px;
                  font-weight: 500;
                ">
                  <strong>${t.accountTypeLabel}</strong> ${t.accountTypes[accountType as keyof typeof t.accountTypes] || accountType}
                </p>

                <!-- CTA Button -->
                <p style="
                  margin: 16px 0 0 0;
                  color: #111827;
                  font-size: 14px;
                ">
                  Você pode acessar o sistema clicando 
                  <a href="${mainUrl}" style="
                    color: #3B82F6;
                    text-decoration: none;
                    font-weight: 600;
                  ">${t.button}</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <tr>
        <td style="
          padding: 24px;
          text-align: center;
          background-color: #f8fafc;
          border-radius: 0 0 8px 8px;
        ">
          <p style="
            margin: 0;
            color: #6B7280;
            font-size: 14px;
          ">${t.footer}</p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

function getAccountRoute(
  accountType: UserType,
  enterpriseCategory?: EnterpriseCategoryType
): string {
  const formattedTraditionalCompany = formatString(
    EnterpriseCategoryType.TRADITIONAL_COMPANY
  );

  const formattedGovernment = formatString(EnterpriseCategoryType.GOVERNMENT);

  const formattedInnovationEnvironment = formatString(
    EnterpriseCategoryType.INNOVATION_ENVIRONMENT
  );

  switch (accountType) {
    case "STARTUP":
      return "/management/startups";
    case "ENTERPRISE":
      switch (enterpriseCategory) {
        case formattedTraditionalCompany:
          return `/management/${formattedTraditionalCompany}`;
        case formattedGovernment:
          return `/management/${formattedGovernment}`;
        case formattedInnovationEnvironment:
          return `/management/${formattedInnovationEnvironment}`;
        default:
          return "/management/home";
      }
    case "INVESTOR":
      return "/management/investors";
    case "MENTOR":
      return "/management/mentor";
    default:
      return "/management/home";
  }
}

export async function sendNewRegistrationNotification(
  name: string,
  email: string,
  slug: string,
  users: string[],
  accountType: UserType | null,
  enterpriseCategoryFormatted?: EnterpriseCategoryType
) {
  try {
    const t = translations.pt;
    const protocol =
      process.env.NEXT_PUBLIC_PROTOCOL ||
      (process.env.NODE_ENV === "development" ? "http://" : "https://");

    const adminPath = getAccountRoute(
      accountType as UserType,
      enterpriseCategoryFormatted
    );

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const mainUrl = `${protocol}${slug}.${appUrl}${adminPath}`;

    let displayAccountType = accountType || "UNKNOWN";
    if (accountType === "ENTERPRISE") {
      displayAccountType =
        unformatString(enterpriseCategoryFormatted!) || "UNKNOWN";
    }

    const htmlContent = generateEmailTemplate(
      t,
      name,
      email,
      mainUrl,
      displayAccountType
    );

    for (const recipientEmail of users) {
      await resend.emails.send({
        from: "StartupsAI <no-reply@startupsai.com.br>",
        to: recipientEmail,
        subject: t.subject,
        html: htmlContent,
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending new registration notification email:", error);
    return { success: false, error: translations.pt.errors.emailFailed };
  }
}

function formatString(input: string) {
  let result = input.toLowerCase();

  result = result.replace(/_/g, "-");

  return result;
}

function unformatString(input: string): string {
  const result = input.toUpperCase().replace(/-/g, "_");

  return result;
}
