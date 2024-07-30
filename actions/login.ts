"use server";

import { UserType } from "@prisma/client";
import { AuthError } from "next-auth";
import * as z from "zod";

import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { LoginSchema } from "@/lib/schemas/schema";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, slug } = validatedFields.data;

  const existingUser = await getUserByEmail(email, values.slug);

  if (!existingUser || !existingUser.email || !existingUser.hashed_password) {
    return { error: "Email does not exist!" };
  }

  const redirectPath = pageRedirect(existingUser.type);

  // if (!existingUser.email_verified) {
  //   const verificationToken = await generateVerificationToken(
  //     existingUser.email
  //   );

  //   await sendVerificationEmail(
  //     verificationToken.email,
  //     verificationToken.token
  //   );

  //   return { success: "Confirmation email sent!" };
  // }

  try {
    await signIn("credentials", {
      email,
      password,
      slug,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    return { success: "Logged successfully!", redirectPath };
  }
};

export const pageRedirect = (type: UserType): string => {
  switch (type) {
    case UserType.ADMIN:
      return "/management/home";
    case UserType.STARTUP:
      return "/startup";
    case UserType.MENTOR:
      return "/mentor";
    case UserType.INVESTOR:
      return "/investor";
    default:
      return "/";
  }
};
