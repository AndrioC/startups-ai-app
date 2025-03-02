"use server";

import { UserType } from "@prisma/client";
import { cookies } from "next/headers";
import { AuthError } from "next-auth";
import { createTranslator } from "next-intl";
import * as z from "zod";

import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { LoginSchemaServer } from "@/lib/schemas/schema";
import prisma from "@/prisma/client";

import { checkIfEmailIsNotVerified } from "./check-if-email-is-not-verified";
import { sendVerificationEmail } from "./send-email-confirmation-account";

const locales = ["pt-br", "en"];

async function getServerTranslations() {
  const cookieStore = cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "pt-br";

  const validLocale = locales.includes(locale) ? locale : "pt-br";

  const messages = (await import(`@/translation/${validLocale}.json`)).default;

  return createTranslator({ locale: validLocale, messages });
}

export async function login(
  values: z.infer<ReturnType<typeof LoginSchemaServer>>
) {
  const cookieStore = cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "pt-br";
  const t = await getServerTranslations();

  const validatedFields = LoginSchemaServer(t).safeParse(values);

  if (!validatedFields.success) {
    return { error: t("server.login.invalidFields") };
  }

  const { email, password, slug } = validatedFields.data;

  const emailVerificationResult = await checkIfEmailIsNotVerified(email, slug);

  if (!emailVerificationResult.exists) {
    await sendVerificationEmail(
      email,
      locale,
      emailVerificationResult.organization!
    );
    return {
      emailNotVerified: true,
      error: t("server.login.emailNotVerified"),
    };
  }

  const existingUser = await getUserByEmail(email, values.slug);

  if (!existingUser || !existingUser.email) {
    return { error: t("server.login.emailNotExists") };
  }

  if (existingUser.is_blocked) {
    return {
      error: t("server.login.accountBlocked"),
    };
  }

  const redirectPath = pageRedirect(existingUser.type!);

  try {
    await signIn("credentials", {
      email,
      password,
      slug,
      redirect: false,
    });

    await prisma.user_access.create({
      data: {
        user_id: existingUser.id!,
      },
    });

    return {
      success: t("server.login.successLogin"),
      redirectPath,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: t("server.login.invalidCredentials") };
        default:
          return { error: t("server.login.genericError") };
      }
    }

    return {
      success: t("server.login.successLogin"),
      redirectPath,
    };
  }
}

export const pageRedirect = (type: UserType): string => {
  switch (type) {
    case UserType.SAI:
      return "/management/home";
    case UserType.ADMIN:
      return "/management/home";
    case UserType.STARTUP:
      return "/startup";
    case UserType.MENTOR:
      return "/mentor";
    case UserType.INVESTOR:
      return "/investor";
    case UserType.ENTERPRISE:
      return "/enterprise";
    default:
      return "/";
  }
};
