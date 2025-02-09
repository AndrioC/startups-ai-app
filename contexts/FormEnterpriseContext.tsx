import { createContext, useContext, useState } from "react";
import { QueryObserverResult, UseQueryResult } from "@tanstack/react-query";

interface BaseType {
  id: number;
  code: string;
  name_en: string;
  name_pt: string;
}

interface EnterpriseActivityAreaCategory extends BaseType {}

interface EnterpriseActivityArea extends BaseType {
  enterprise_activity_area_category_id: number;
  enterprise_activity_area_category: EnterpriseActivityAreaCategory;
}
export interface FormEnterpriseData {
  id: number;
  organizationId: number;
  name: string;
  countryId: number;
  enterpriseCategoryId: number;
  stateCity: string;
  subscriptionNumber: string;
  fullAddress: string;
  email: string;
  website: string;
  activityAreas: number[];

  mainResponsibleName: string;
  mainResponsiblePhone: string;
  mainResponsibleEmail: string;

  enterpriseOrganizationType: string;
  enterpriseEmployeesQuantity: number;
  enterpriseSocialCapital: number;
  enterpriseMainResponsibleName: string;
  enterpriseProducts: string;
  enterpriseCertifications: string;

  governmentOrganizationType: string;
  governmentCoverageArea: string;
  governmentBusinessHour: string;
  governmentMainResponsibleName: string;

  collegeOrganizationTypeId: number;
  collegePublicPrivate: string;
  collegeEnrolledStudentsQuantity: number;
  collegeMainResponsibleName: string;
  collegeActivityArea: number[];

  fullyDescription: string;
  enterpriseObjectives: string[];

  logoImage: File;
  logoImageUrl: string;
  scoreClassification: number;
  fullyCompletedProfile: boolean;
  profileFilledPercentage: number;
  profileUpdated: boolean;

  enterpriseActivityAreas: EnterpriseActivityArea[];
  enterpriseCollegeActivityArea: EnterpriseActivityArea[];

  plan: string;
  isDeleted: boolean;
  isApproved: boolean;
  isBlocked: boolean;
  wasProcessed: boolean;
  freeSubscriptionExpiresAt: Date | undefined;
}

interface FormEnterpriseDataContext {
  initialData: FormEnterpriseData;
  logoFile: string | undefined;
  setLogoFile: React.Dispatch<React.SetStateAction<string | undefined>>;
  actorId: number;
  refetch: UseQueryResult["refetch"];
  isRefetching: boolean;
}

const initialFormEnterpriseData: FormEnterpriseData = {
  id: 0,
  organizationId: 0,
  name: "",
  countryId: 0,
  enterpriseCategoryId: 0,
  stateCity: "",
  subscriptionNumber: "",
  fullAddress: "",
  email: "",
  website: "",
  activityAreas: [],

  mainResponsibleName: "",
  mainResponsibleEmail: "",
  mainResponsiblePhone: "",

  governmentOrganizationType: "",
  governmentCoverageArea: "",
  governmentMainResponsibleName: "",
  governmentBusinessHour: "",

  collegeOrganizationTypeId: 0,
  collegePublicPrivate: "",
  collegeEnrolledStudentsQuantity: 0,
  collegeMainResponsibleName: "",
  collegeActivityArea: [],

  fullyDescription: "",
  enterpriseObjectives: [],

  enterpriseOrganizationType: "",
  enterpriseEmployeesQuantity: 0,
  enterpriseSocialCapital: 0,
  enterpriseMainResponsibleName: "",
  enterpriseProducts: "",
  enterpriseCertifications: "",

  logoImage: null as unknown as File,
  logoImageUrl: "",
  scoreClassification: 0,
  fullyCompletedProfile: false,
  profileFilledPercentage: 0,
  profileUpdated: false,

  enterpriseActivityAreas: [],
  enterpriseCollegeActivityArea: [],

  plan: "free",
  isDeleted: false,
  isApproved: false,
  isBlocked: false,
  wasProcessed: false,
  freeSubscriptionExpiresAt: undefined,
};

const FormContext = createContext<FormEnterpriseDataContext>({
  logoFile: "",
  setLogoFile: () => {},
  actorId: 0,
  refetch: () => Promise.resolve({} as QueryObserverResult<unknown, Error>),
  initialData: initialFormEnterpriseData,
  isRefetching: false,
});

interface Props {
  children: React.ReactNode;
  initialData: FormEnterpriseData;
  actorId: number;
  refetch: UseQueryResult["refetch"];
  isRefetching: boolean;
}

export function FormEnterpriseProvider({
  children,
  initialData,
  actorId,
  refetch,
  isRefetching,
}: Props) {
  const [logoFile, setLogoFile] = useState<string | undefined>(
    initialData?.logoImageUrl
  );

  return (
    <FormContext.Provider
      value={{
        initialData,
        logoFile,
        setLogoFile,
        actorId,
        refetch,
        isRefetching,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormEnterpriseDataState() {
  return useContext(FormContext);
}
