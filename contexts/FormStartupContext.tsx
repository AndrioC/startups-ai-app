import { createContext, useContext, useState } from "react";
import { QueryObserverResult, UseQueryResult } from "@tanstack/react-query";

import { ProgramData } from "../app/api/startup/load-startup-info-by-id/[startup_id]/route";

interface Partner {
  name: string;
  phone: string;
  email: string;
  position_id: string;
  is_founder: string;
  dedication_type: string;
  percentage_captable: number;
  is_first_business: string;
  linkedin_lattes: string;
  has_experience_or_formation: string;
  is_formation_complementary: string;
}

interface Investment {
  roundInvestmentStartDate: Date | undefined;
  roundInvestmentEndDate: Date | undefined;
  collectedTotal: string;
  equityDistributedPercent: string;
  investorsQuantity: string;
  investors: string;
}

export interface FormStartupData {
  startupId: number;
  startupName: string;
  country: string;
  vertical: string;
  verticalText: string;
  stateAndCity: string;
  operationalStage: string;
  businessModel: string;
  businessModelText: string;
  subscriptionNumber: string;
  foundationDate: Date;
  referenceLink: string;
  loadPitchDeck: File;
  loadLogo: File;
  loadPitchDeckUrl: string;
  loadLogoUrl: string;
  startupChallenges: string[];
  startupObjectives: string[];
  connectionsOnlyOnStartupCountryOrigin: string;
  valueProposal: string;
  shortDescription: string;

  mainResponsibleName: string;
  contactNumber: string;
  mainResponsibleEmail: string;
  employeesQuantity: string;
  fullTimeEmployeesQuantity: number;
  partners: Partner[];

  startupProductService: string[];
  quantityOdsGoals: string;
  problemThatIsSolved: string;
  competitors: string;
  competitiveDifferentiator: string;

  maturityLevel?: string;
  hasPatent?: string;
  patentAndCode?: string;

  isStartupOfficiallyRegistered: string;
  isTherePartnersAgreementSigned: string;
  haveLegalAdvice: string;
  haveAccountingConsultancy: string;
  relationshipsRegisteredInContract: string;

  payingCustomersQuantity: string;
  activeCustomersQuantity: string;
  alreadyEarning: boolean;
  lastRevenue: string;
  lastSixMonthsRevenue: string;
  lastTwelveMonthsRevenue: string;
  saasCurrentRRM: string;
  isThereOpenInvestmentRound: boolean;
  valueCollection: string;
  equityPercentage: number;
  currentStartupValuation: string;
  roundStartDate: Date;
  roundEndDate: Date;
  investments?: Investment[];

  startupProfile: string;
}

interface FormStartupDataContext {
  initialData: FormStartupData;
  pitchDeckFile: string | undefined;
  setPitchDeckFile: React.Dispatch<React.SetStateAction<string | undefined>>;
  logoFile: string | undefined;
  setLogoFile: React.Dispatch<React.SetStateAction<string | undefined>>;
  actorId: number;
  refetch: UseQueryResult["refetch"];
  programsData: ProgramData[];
  isRefetching: boolean;
}

const initialFormStartupData: FormStartupData = {
  startupId: 0,
  startupName: "",
  country: "",
  vertical: "",
  verticalText: "",
  stateAndCity: "",
  operationalStage: "",
  businessModel: "",
  businessModelText: "",
  subscriptionNumber: "",
  foundationDate: new Date(),
  referenceLink: "",
  loadPitchDeck: null as unknown as File,
  loadLogo: null as unknown as File,
  loadPitchDeckUrl: "",
  loadLogoUrl: "",
  startupChallenges: [],
  startupObjectives: [],
  connectionsOnlyOnStartupCountryOrigin: "",
  valueProposal: "",
  shortDescription: "",

  mainResponsibleName: "",
  contactNumber: "",
  mainResponsibleEmail: "",
  employeesQuantity: "",
  fullTimeEmployeesQuantity: 0,
  partners: [
    {
      name: "",
      phone: "",
      email: "",
      position_id: "",
      is_founder: "",
      dedication_type: "",
      percentage_captable: 0,
      is_first_business: "",
      linkedin_lattes: "",
      has_experience_or_formation: "",
      is_formation_complementary: "",
    },
  ],

  startupProductService: [],
  quantityOdsGoals: "",
  problemThatIsSolved: "",
  competitors: "",
  competitiveDifferentiator: "",

  maturityLevel: "",
  hasPatent: "",
  patentAndCode: "",

  isStartupOfficiallyRegistered: "",
  isTherePartnersAgreementSigned: "",
  haveLegalAdvice: "",
  haveAccountingConsultancy: "",
  relationshipsRegisteredInContract: "",

  payingCustomersQuantity: "",
  activeCustomersQuantity: "",
  alreadyEarning: false,
  lastRevenue: "",
  lastSixMonthsRevenue: "",
  lastTwelveMonthsRevenue: "",
  saasCurrentRRM: "",
  isThereOpenInvestmentRound: false,
  valueCollection: "",
  equityPercentage: 0,
  currentStartupValuation: "",
  roundStartDate: new Date(),
  roundEndDate: new Date(),
  investments: [
    {
      roundInvestmentStartDate: new Date(),
      roundInvestmentEndDate: new Date(),
      collectedTotal: "",
      equityDistributedPercent: "",
      investorsQuantity: "",
      investors: "",
    },
  ],

  startupProfile: "",
};

const FormContext = createContext<FormStartupDataContext>({
  pitchDeckFile: "",
  setPitchDeckFile: () => {},
  logoFile: "",
  setLogoFile: () => {},
  actorId: 0,
  refetch: () => Promise.resolve({} as QueryObserverResult<unknown, Error>),
  programsData: [],
  initialData: initialFormStartupData,
  isRefetching: false,
});

interface Props {
  children: React.ReactNode;
  initialData: FormStartupData;
  actorId: number;
  refetch: UseQueryResult["refetch"];
  programsData: ProgramData[];
  isRefetching: boolean;
}

export function FormStartupProvider({
  children,
  initialData,
  actorId,
  refetch,
  programsData,
  isRefetching,
}: Props) {
  const [pitchDeckFile, setPitchDeckFile] = useState<string | undefined>(
    initialData?.loadPitchDeckUrl
  );
  const [logoFile, setLogoFile] = useState<string | undefined>(
    initialData?.loadLogoUrl
  );

  return (
    <FormContext.Provider
      value={{
        initialData,
        pitchDeckFile,
        setPitchDeckFile,
        logoFile,
        setLogoFile,
        actorId,
        refetch,
        programsData,
        isRefetching,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormStartupDataState() {
  return useContext(FormContext);
}
