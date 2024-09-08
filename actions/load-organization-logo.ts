import prisma from "@/prisma/client";

const S3_ORGANIZATIONS_IMGS_BUCKET_NAME = process.env
  .S3_ORGANIZATIONS_IMGS_BUCKET_NAME as string;

export async function loadOrganizationLogo(
  slug: string
): Promise<{ logoImgUrl: string | null }> {
  console.log("slug", slug);
  if (!slug) {
    throw new Error("Slug is required to load organization logo");
  }

  try {
    const organization = await prisma.organizations.findUnique({
      where: { slug },
    });

    console.log(organization);

    const logoImgUrl = organization?.logo_img
      ? `https://${S3_ORGANIZATIONS_IMGS_BUCKET_NAME}.s3.amazonaws.com/${organization?.logo_img}`
      : null;

    return { logoImgUrl };
  } catch (error) {
    console.error("Error loading organization logo:", error);
    throw error;
  }
}
