import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import prisma from "@/prisma/client";

interface Block {
  [key: string]: any;
}

const ENTERPRISE_LOGO_BUCKET = process.env
  .S3_ENTERPRISE_LOGO_IMGS_BUCKET_NAME as string;

export async function GET(
  _request: NextRequest,
  { params }: { params: { enterprise_id: string } }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const enterprise = await prisma.enterprise.findUnique({
    where: { id: Number(params.enterprise_id) },
    include: {
      enterprise_objective_relations: {
        include: {
          enterprise_objectives: true,
        },
      },
      enterprise_activity_area_relations: {
        include: {
          enterprise_activity_area: {
            include: {
              enterprise_activity_area_category: true,
            },
          },
        },
      },
      enterprise_college_activity_area_relations: {
        include: {
          enterprise_college_activity_area: true,
        },
      },
      enterprise_category: true,
      organizations: true,
      country: true,
    },
  });

  if (!enterprise) {
    return NextResponse.json(
      { error: "Enterprise not found" },
      { status: 404 }
    );
  }

  const generalData: Block = {
    id: enterprise.id,
    organizationId: enterprise.organization_id,
    name: enterprise.name,
    countryId: enterprise.country_id,
    stateCity: enterprise.state_city,
    subscriptionNumber: enterprise.subscription_number,
    fullAddress: enterprise.full_address,
    website: enterprise.website,
    fullyDescription: enterprise.fully_description,

    logoImageUrl: enterprise.logo_img
      ? `https://${ENTERPRISE_LOGO_BUCKET}.s3.amazonaws.com/${enterprise.logo_img}`
      : undefined,

    activityAreas: enterprise.enterprise_activity_area_relations.map(
      (relation) => relation.enterprise_activity_area.id
    ),
  };

  const responsibleData: Block = {
    mainResponsibleName: enterprise.main_responsible_name,
    mainResponsibleEmail: enterprise.main_responsible_email,
    mainResponsiblePhone: enterprise.main_responsible_phone,
  };

  const enterpriseData: Block = {
    enterpriseOrganizationType: enterprise.enterprise_organization_type,
    enterpriseEmployeesQuantity: enterprise.enterprise_employees_quantity,
    enterpriseSocialCapital: enterprise.enterprise_social_capital,
    enterpriseMainResponsibleName: enterprise.enterprise_main_responsible_name,
    enterpriseProducts: enterprise.enterprise_products,
    enterpriseCertifications: enterprise.enterprise_certifications,
  };

  const governmentData: Block = {
    governmentOrganizationType: enterprise.government_organization_type,
    governmentCoverageArea: enterprise.government_coverage_area,
    governmentBusinessHour: enterprise.government_business_hour,
    governmentMainResponsibleName: enterprise.government_main_responsible_name,
  };

  const collegeData: Block = {
    collegeOrganizationTypeId: enterprise.college_organization_type_id,
    collegePublicPrivate: enterprise.college_public_private,
    collegeEnrolledStudentsQuantity:
      enterprise.college_enrolled_students_quantity,
    collegeMainResponsibleName: enterprise.college_main_responsible_name,
    collegeActivityArea:
      enterprise.enterprise_college_activity_area_relations.map(
        (relation) => relation.enterprise_college_activity_area.id
      ),
  };

  const objectivesData: Block = {
    enterpriseObjectives: enterprise.enterprise_objective_relations.map(
      (relation) => {
        return relation.enterprise_objectives.id.toString();
      }
    ),
  };

  const statusData: Block = {
    scoreClassification: enterprise.score_classification,
    fullyCompletedProfile: enterprise.fully_completed_profile,
    profileFilledPercentage: enterprise.profile_filled_percentage,
    profileUpdated: enterprise.profile_updated,
    plan: enterprise.plan,
    isDeleted: enterprise.is_deleted,
    isApproved: enterprise.is_approved,
    isBlocked: enterprise.is_blocked,
    wasProcessed: enterprise.was_processed,
  };

  const blocks: { [key: string]: Block } = {
    generalData,
    responsibleData,
    enterpriseData,
    governmentData,
    collegeData,
    objectivesData,
    statusData,
  };

  const blocksToCalculate = [
    "generalData",
    "responsibleData",
    "enterpriseData",
    "governmentData",
    "collegeData",
    "objectivesData",
  ];

  const fieldsToCalculate = getFieldsToCalculate();

  const filledPercentages: { [key: string]: number } = blocksToCalculate.reduce(
    (acc: { [key: string]: number }, blockName: string) => {
      acc[blockName] = calculateFilledPercentage(
        blocks[blockName],
        fieldsToCalculate[blockName]
      );
      return acc;
    },
    {}
  );

  return NextResponse.json({ blocks, filledPercentages }, { status: 200 });
}

function calculateFilledPercentage(
  block: Block,
  relevantFields: string[] = []
): number {
  const totalFields = relevantFields.length;
  const filledFields = relevantFields.filter((field) => {
    const value = block[field];
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== undefined && value !== null && value !== "";
  }).length;

  return Math.round((filledFields / totalFields) * 100);
}

function getFieldsToCalculate(): { [key: string]: string[] } {
  return {
    generalData: [
      "name",
      "countryId",
      "stateCity",
      "fullAddress",
      "website",
      "activityAreas",
      "logoImageUrl",
    ],
    responsibleData: [
      "mainResponsibleName",
      "mainResponsibleEmail",
      "mainResponsiblePhone",
    ],
    enterpriseData: [
      "enterpriseOrganizationType",
      "enterpriseEmployeesQuantity",
      "enterpriseSocialCapital",
      "enterpriseMainResponsibleName",
      "enterpriseProducts",
      "enterpriseCertifications",
    ],
    governmentData: [
      "governmentOrganizationType",
      "governmentCoverageArea",
      "governmentBusinessHour",
      "governmentMainResponsibleName",
    ],
    collegeData: [
      "collegeOrganizationTypeId",
      "collegePublicPrivate",
      "collegeEnrolledStudentsQuantity",
      "collegeMainResponsibleName",
      "collegeActivityArea",
    ],
    objectivesData: ["enterpriseObjectives"],
  };
}
