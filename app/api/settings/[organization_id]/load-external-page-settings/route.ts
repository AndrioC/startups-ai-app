import { PageType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/prisma/client";

const S3_BUCKET_NAME = process.env.S3_EXTERNAL_PAGE_SETTINGS;

export async function GET(
  request: NextRequest,
  { params }: { params: { organization_id: string } }
) {
  const url = new URL(request.url);
  const pageType = url.searchParams.get("pageType") as PageType;

  if (!params.organization_id) {
    return NextResponse.json(
      { error: "Organization ID is required" },
      { status: 400 }
    );
  }

  if (!pageType) {
    return NextResponse.json(
      { error: "Page type is required" },
      { status: 400 }
    );
  }

  try {
    const settings = await prisma.external_page_settings.findFirst({
      where: {
        organization_id: Number(params.organization_id),
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

    if (!settings) {
      return NextResponse.json(null);
    }

    const formattedSettings = {
      headerLogoUrl: "",
      loadBanner: settings.load_banner,
      loadBannerUrl: `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${settings.load_banner}`,
      bannerPhrase: settings.banner_phrase,
      showLearnMore: settings.show_learn_more,
      learnMoreText: settings.learn_more_text,
      learnMoreLink: settings.learn_more_link,
      pageTitle: settings.page_title,
      linkVideo: settings.link_video,
      freeText: settings.free_text,
      enabled_tabs: settings.enabled_tabs.map((tab) => ({
        tab_number: tab.tab_number,
        is_enabled: tab.is_enabled,
        tab_card:
          tab.is_enabled && tab.tab_card
            ? {
                title: tab.tab_card.title,
                buttonText: tab.tab_card.button_text,
                buttonLink: tab.tab_card.button_link,
                benefits: tab.tab_card.benefits.map(
                  (benefit) => benefit.description
                ),
              }
            : null,
      })),
    };

    return NextResponse.json(formattedSettings);
  } catch (error) {
    console.error("Error fetching external page settings:", error);
    return NextResponse.json(
      { message: "Error fetching external page settings" },
      { status: 500 }
    );
  }
}
