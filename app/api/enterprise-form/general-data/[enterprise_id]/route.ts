import { Language } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { uploadFileToS3 } from "@/actions/upload-s3";
import { auth } from "@/auth";
import { EnterpriseSchema } from "@/lib/schemas/schema-enterprise";
import prisma from "@/prisma/client";

const ENTERPRISE_LOGO_BUCKET = process.env
  .S3_ENTERPRISE_LOGO_IMGS_BUCKET_NAME as string;

export async function PATCH(
  request: NextRequest,
  { params }: { params: { enterprise_id: string } }
) {
  const session = await auth();
  const locale = session?.user?.language === Language.PT_BR ? "pt-br" : "en";

  const messages = (await import(`@/translation/enterprise/${locale}.json`))
    .default;
  const t = (key: string) => {
    const [namespace, messageKey] = key.split(".");
    if (namespace && messageKey && messages[namespace]?.[messageKey]) {
      return messages[namespace][messageKey];
    }
    return messages.validation.required;
  };

  try {
    const formSchema = EnterpriseSchema(t);
    const formData = await request.formData();
    const dataString = formData.get("data") as string;
    const data = JSON.parse(dataString) as z.infer<typeof formSchema>;
    const fileLogo = formData.get("file-logo");

    await prisma.$transaction(async (prisma) => {
      await prisma.enterprise.update({
        where: { id: Number(params.enterprise_id) },
        data: {
          name: data.name,
          country_id: Number(data.countryId),
          state_city: data.stateCity,
          subscription_number: data.subscriptionNumber,
          full_address: data.fullAddress,
          website: data.website,

          main_responsible_name: data.mainResponsibleName,
          main_responsible_email: data.mainResponsibleEmail,
          main_responsible_phone: data.mainResponsiblePhone,

          government_organization_type: data.governmentOrganizationType,
          government_main_responsible_name: data.governmentMainResponsibleName,
          government_business_hour: data.governmentBusinessHour,
          government_coverage_area: data.governmentCoverageArea,

          college_organization_type_id: data.collegeOrganizationTypeId,
          college_public_private: data.collegePublicPrivate,
          college_main_responsible_name: data.collegeMainResponsibleName,
          college_enrolled_students_quantity:
            data.collegeEnrolledStudentsQuantity,

          enterprise_organization_type: data.enterpriseOrganizationType,
          enterprise_employees_quantity: data.enterpriseEmployeesQuantity,
          enterprise_social_capital: data.enterpriseSocialCapital,
          enterprise_main_responsible_name: data.enterpriseMainResponsibleName,
          enterprise_products: data.enterpriseProducts,
          enterprise_certifications: data.enterpriseCertifications,

          fully_description: data.fullyDescription,
          profile_updated: true,
          updated_at: new Date(),
        },
      });

      await prisma.enterprise_activity_area_relations.deleteMany({
        where: { enterprise_id: Number(params.enterprise_id) },
      });

      if (data?.activityAreas && data.activityAreas?.length > 0) {
        await prisma.enterprise_activity_area_relations.createMany({
          data: data.activityAreas.map((areaId) => ({
            enterprise_id: Number(params.enterprise_id),
            activity_area_id: Number(areaId),
          })),
        });
      }

      await prisma.enterprise_objective_relations.deleteMany({
        where: { enterprise_id: Number(params.enterprise_id) },
      });

      if (
        data?.enterpriseObjectives &&
        data?.enterpriseObjectives?.length > 0
      ) {
        await prisma.enterprise_objective_relations.createMany({
          data: data.enterpriseObjectives.map((objectiveId) => ({
            enterprise_id: Number(params.enterprise_id),
            objective_id: Number(objectiveId),
          })),
        });
      }

      await prisma.enterprise_college_activity_area_relations.deleteMany({
        where: { enterprise_id: Number(params.enterprise_id) },
      });

      if (data?.collegeActivityArea && data?.collegeActivityArea?.length > 0) {
        await prisma.enterprise_college_activity_area_relations.createMany({
          data: data.collegeActivityArea.map((areaId) => ({
            enterprise_id: Number(params.enterprise_id),
            enterprise_college_activity_area_id: Number(areaId),
          })),
        });
      }
    });

    if (fileLogo && typeof fileLogo !== "string" && "arrayBuffer" in fileLogo) {
      const bufferLogoImage = Buffer.from(await fileLogo.arrayBuffer());
      const logoImageFileName = await uploadFileToS3(
        bufferLogoImage,
        data.name + "_logo_img",
        ENTERPRISE_LOGO_BUCKET,
        "image"
      );

      await prisma.enterprise.update({
        where: { id: Number(params.enterprise_id) },
        data: {
          logo_img: logoImageFileName,
        },
      });
    }

    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    console.error("Error updating enterprise data: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
