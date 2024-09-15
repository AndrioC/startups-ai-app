import { PageType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

import { deleteFileFromS3, uploadFileToS3 } from "@/actions/upload-s3";
import prisma from "@/prisma/client";

const S3_EXTERNAL_PAGE_SETTINGS = process.env.S3_EXTERNAL_PAGE_SETTINGS;

type SettingsData = {
  page_type: PageType;
  organization_id: number;
  program_id: number | null;
  load_banner: string;
  banner_phrase: string | null;
  show_learn_more: boolean;
  learn_more_text: string | null;
  learn_more_link: string | null;
  page_title: string | null;
  link_video: string | null;
  free_text: string | null;
};

export async function POST(
  request: NextRequest,
  { params }: { params: { organization_id: string } }
) {
  if (!params.organization_id) {
    return NextResponse.json(
      { error: "Organization ID is required" },
      { status: 400 }
    );
  }

  try {
    const formData = await request.formData();
    const loadBanner = formData.get("load_banner");
    const pageType = formData.get("page_type") as PageType;
    const programId = formData.get("program_id") as string | null;

    if (pageType !== PageType.ORGANIZATION && pageType !== PageType.PROGRAM) {
      return NextResponse.json(
        { error: "Invalid page_type. Must be 'ORGANIZATION' or 'PROGRAM'" },
        { status: 400 }
      );
    }

    if (pageType === PageType.PROGRAM && !programId) {
      return NextResponse.json(
        { error: "Program ID is required for PROGRAM page type" },
        { status: 400 }
      );
    }

    const existingSettings = await prisma.external_page_settings.findFirst({
      where: {
        organization_id: Number(params.organization_id),
        page_type: pageType,
        program_id: programId ? Number(programId) : null,
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

    let fileName = existingSettings?.load_banner || "";
    if (loadBanner instanceof Blob) {
      if (loadBanner.size > 2 * 1024 * 1024) {
        return NextResponse.json(
          { error: "File size exceeds 2MB limit" },
          { status: 400 }
        );
      }
      const buffer = Buffer.from(await loadBanner.arrayBuffer());
      const fileNameWithoutExtension = path.parse(loadBanner.name).name;
      fileName = await uploadFileToS3(
        buffer,
        fileNameWithoutExtension,
        S3_EXTERNAL_PAGE_SETTINGS as string,
        "image"
      );

      if (existingSettings?.load_banner) {
        try {
          await deleteFileFromS3(
            existingSettings.load_banner,
            S3_EXTERNAL_PAGE_SETTINGS as string
          );
        } catch (deleteError) {
          console.error("Error deleting previous banner:", deleteError);
        }
      }
    } else if (typeof loadBanner === "string") {
      fileName = loadBanner;
    }

    const settingsData: SettingsData = {
      page_type: pageType,
      organization_id: Number(params.organization_id),
      program_id: programId ? Number(programId) : null,
      load_banner: fileName,
      banner_phrase: formData.get("banner_phrase") as string | null,
      show_learn_more: formData.get("show_learn_more") === "true",
      learn_more_text: formData.get("learn_more_text") as string | null,
      learn_more_link: formData.get("learn_more_link") as string | null,
      page_title: formData.get("page_title") as string | null,
      link_video: formData.get("link_video") as string | null,
      free_text: formData.get("free_text") as string | null,
    };

    const enabledTabsData = JSON.parse(
      (formData.get("enabled_tabs") as string) || "[]"
    );

    let result;
    if (existingSettings) {
      result = await prisma.$transaction(async (prisma) => {
        await prisma.external_page_settings_benefit.deleteMany({
          where: {
            tabs_cards: {
              enabled_tab: {
                external_page_settings_id: existingSettings.id,
              },
            },
          },
        });

        await prisma.external_page_settings_tabs_cards.deleteMany({
          where: {
            enabled_tab: {
              external_page_settings_id: existingSettings.id,
            },
          },
        });

        await prisma.external_page_settings_enabled_tabs.deleteMany({
          where: { external_page_settings_id: existingSettings.id },
        });

        return prisma.external_page_settings.update({
          where: { id: existingSettings.id },
          data: {
            ...settingsData,
            enabled_tabs: {
              create: enabledTabsData.map((enabledTab: any) => ({
                tab_number: enabledTab.tab_number,
                is_enabled: enabledTab.is_enabled,
                tab_card:
                  enabledTab.is_enabled && enabledTab.tab_card
                    ? {
                        create: {
                          external_page_settings_id: existingSettings.id,
                          title: enabledTab.tab_card.title,
                          button_text: enabledTab.tab_card.buttonText,
                          button_link: enabledTab.tab_card.buttonLink || "",
                          benefits: {
                            create: (enabledTab.tab_card.benefits || []).map(
                              (benefit: string, benefitIndex: number) => ({
                                description: benefit,
                                order: benefitIndex + 1,
                              })
                            ),
                          },
                        },
                      }
                    : undefined,
              })),
            },
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
      });
    } else {
      result = await prisma.external_page_settings.create({
        data: {
          ...settingsData,
          enabled_tabs: {
            create: enabledTabsData.map((enabledTab: any) => ({
              tab_number: enabledTab.tab_number,
              is_enabled: enabledTab.is_enabled,
              tab_card:
                enabledTab.is_enabled && enabledTab.tab_card
                  ? {
                      create: {
                        title: enabledTab.tab_card.title,
                        button_text: enabledTab.tab_card.buttonText,
                        button_link: enabledTab.tab_card.buttonLink || "",
                        benefits: {
                          create: (enabledTab.tab_card.benefits || []).map(
                            (benefit: string, benefitIndex: number) => ({
                              description: benefit,
                              order: benefitIndex + 1,
                            })
                          ),
                        },
                      },
                    }
                  : undefined,
            })),
          },
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

      if (result.enabled_tabs.length > 0) {
        await prisma.external_page_settings_tabs_cards.updateMany({
          where: {
            enabled_tab: {
              external_page_settings_id: result.id,
            },
          },
          data: {
            external_page_settings_id: result.id,
          },
        });
      }
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error processing external page settings:", error);
    return NextResponse.json(
      { error: "Error processing external page settings" },
      { status: 500 }
    );
  }
}
