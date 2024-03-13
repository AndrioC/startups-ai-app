import prisma from "../prisma/client";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.users_admin.findFirst({
      where: { email },
    });
    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: number) => {
  try {
    const user = await prisma.users_admin.findUnique({ where: { id } });
    return user;
  } catch {
    return null;
  }
};
