import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { updateStartupKanban } from "@/actions/update-startup-kanban";
import { uploadFileToS3 } from "@/actions/upload-s3";
import { GeneralDataSchema } from "@/lib/schemas/schema-startup";
import prisma from "@/prisma/client";

const formSchema = GeneralDataSchema();

const STARTUPS_LOGO_BUCKET = process.env
  .S3_STARTUP_LOGO_IMGS_BUCKET_NAME as string;
const STARTUPS_PITCH_BUCKET = process.env
  .S3_STARTUP_PITCH_DECK_FILES_BUCKET_NAME as string;
export async function PATCH(
  request: NextRequest,
  { params }: { params: { startup_id: string } }
) {
  const formData = await request.formData();
  const dataString = formData.get("data") as string;
  const data = JSON.parse(dataString) as z.infer<typeof formSchema>;
  const fileLogo = formData.get("file-logo") as unknown as File;
  const filePitch = formData.get("file-pitch") as unknown as File;

  await prisma.$transaction(async (prisma) => {
    await prisma.startups.update({
      where: { id: Number(params.startup_id) },
      data: {
        name: data.startupName,
        vertical_id: Number(data.vertical),
        country_id: Number(data.country),
        state_city: data.stateAndCity,
        operation_stage_id: Number(data.operationalStage),
        business_model_id: Number(data.businessModel),
        subscription_number: data.subscriptionNumber,
        foundation_date: data.foundationDate,
        reference_link: data.referenceLink,
        connections_only_on_origin_country:
          data.connectionsOnlyOnStartupCountryOrigin,
        value_proposal_pt: data.valueProposal,
        value_proposal_en: data.valueProposal,
        short_description_pt: data.shortDescription,
        short_description_en: data.shortDescription,
        was_processed: false,
        updated_at: new Date(),
      },
    });

    await prisma.startup_objectives.deleteMany({
      where: { startup_id: Number(params.startup_id) },
    });

    await prisma.startup_challenges.deleteMany({
      where: { startup_id: Number(params.startup_id) },
    });

    const objectivesData = data.startupObjectives.map((value) => ({
      startup_id: Number(params.startup_id),
      objective_id: Number(value),
    }));

    const challegensData = data.startupChallenges.map((value) => ({
      startup_id: Number(params.startup_id),
      challenge_id: Number(value),
    }));

    await prisma.startup_objectives.createMany({
      data: objectivesData,
    });

    await prisma.startup_challenges.createMany({
      data: challegensData,
    });
  });

  if (fileLogo instanceof File) {
    const bufferLogoImage = Buffer.from(await fileLogo.arrayBuffer());
    const logoImageFileName = await uploadFileToS3(
      bufferLogoImage,
      data.startupName + "_logo_img",
      STARTUPS_LOGO_BUCKET,
      "image"
    );

    await prisma.startups.update({
      where: { id: Number(params.startup_id) },
      data: {
        logo_img: logoImageFileName,
      },
    });
  }

  if (filePitch instanceof File) {
    const bufferPitchDeck = Buffer.from(await filePitch.arrayBuffer());
    const pitchDeckFileName = await uploadFileToS3(
      bufferPitchDeck,
      data.startupName + "_pitch_deck.pdf",
      STARTUPS_PITCH_BUCKET,
      "file"
    );

    await prisma.startups.update({
      where: { id: Number(params.startup_id) },
      data: {
        pitch_deck: pitchDeckFileName,
      },
    });
  }

  await updateStartupKanban(Number(params.startup_id));

  try {
    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    console.log("error updating general data startup: ", error);
    return NextResponse.json({}, { status: 500 });
  }
}
