import { PageType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/prisma/client";

const S3_ORGANIZATIONS_IMGS_BUCKET_NAME = process.env
  .S3_ORGANIZATIONS_IMGS_BUCKET_NAME as string;
const S3_BUCKET_NAME = process.env.S3_EXTERNAL_PAGE_SETTINGS;

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const url = new URL(request.url);
  const pageType = url.searchParams.get("pageType") as PageType;

  if (!params.slug || typeof params.slug !== "string") {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  if (!pageType) {
    return NextResponse.json(
      { error: "Page type is required" },
      { status: 400 }
    );
  }

  try {
    const organization = await prisma.organizations.findFirst({
      where: { slug: params.slug },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    const settings = await prisma.external_page_settings.findFirst({
      where: {
        organization_id: Number(organization.id),
        page_type: pageType,
      },
      include: {
        enabled_tabs: {
          include: {
            tab_card: {
              include: {
                benefits: true,
              },
            },
          },
        },
      },
    });

    const formattedSettings = {
      headerLogoUrl: organization?.logo_img
        ? `https://${S3_ORGANIZATIONS_IMGS_BUCKET_NAME}.s3.amazonaws.com/${organization.logo_img}`
        : "",
      loadBanner: settings?.load_banner || "",
      loadBannerUrl: settings?.load_banner
        ? `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${settings.load_banner}`
        : "",
      bannerPhrase: settings?.banner_phrase || "",
      showLearnMore: settings?.show_learn_more || false,
      learnMoreText: settings?.learn_more_text || "",
      learnMoreLink: settings?.learn_more_link || "",
      pageTitle: settings?.page_title || "",
      linkVideo: settings?.link_video || "",
      freeText: settings?.free_text || "",
      enabled_tabs:
        settings?.enabled_tabs?.map((tab) => ({
          tab_number: tab.tab_number,
          is_enabled: tab.is_enabled,
          tab_card:
            tab.is_enabled && tab.tab_card
              ? {
                  title: tab.tab_card.title || "",
                  buttonText: tab.tab_card.button_text || "",
                  buttonLink: tab.tab_card.button_link || "",
                  benefits:
                    tab.tab_card.benefits?.map(
                      (benefit) => benefit.description || ""
                    ) || [],
                }
              : null,
        })) || [],
    };

    return NextResponse.json(formattedSettings, { status: 201 });
  } catch (error) {
    console.error("Error fetching organization logo:", error);
    return NextResponse.json(
      { error: "Error fetching organization logo" },
      { status: 500 }
    );
  }
}
