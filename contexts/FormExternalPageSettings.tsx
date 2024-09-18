import { createContext, useContext, useEffect, useState } from "react";
import { QueryObserverResult, UseQueryResult } from "@tanstack/react-query";

interface TabCard {
  title: string;
  buttonText: string;
  buttonLink: string;
  benefits: string[];
}

interface EnabledTab {
  tab_number: number;
  is_enabled: boolean;
  tab_card: TabCard | null;
}

interface ExternalPageSettingsData {
  headerLogoUrl: string;
  loadBanner: File | undefined;
  loadBannerUrl: string;
  bannerPhrase: string;
  showLearnMore: boolean;
  learnMoreText: string;
  learnMoreLink: string;
  pageTitle: string;
  linkVideo: string;
  freeText: string;
  enabled_tabs: EnabledTab[];
}

const initialExternalPageSettingsData: ExternalPageSettingsData = {
  headerLogoUrl: "",
  loadBanner: new File([], ""),
  loadBannerUrl: "",
  bannerPhrase: "",
  showLearnMore: false,
  learnMoreText: "",
  learnMoreLink: "",
  pageTitle: "",
  linkVideo: "",
  freeText: "",
  enabled_tabs: [
    { tab_number: 1, is_enabled: true, tab_card: null },
    { tab_number: 2, is_enabled: true, tab_card: null },
    { tab_number: 3, is_enabled: false, tab_card: null },
    { tab_number: 4, is_enabled: false, tab_card: null },
  ],
};

interface FormExternalPageSettingsContext {
  initialData: ExternalPageSettingsData;
  formData: ExternalPageSettingsData;
  updateFormData: (data: Partial<ExternalPageSettingsData>) => void;
  logoBannerFile: string | undefined;
  setLogoBannerFile: React.Dispatch<React.SetStateAction<string | undefined>>;
  refetch: UseQueryResult["refetch"];
  isRefetching: boolean;
}

const ExternalPageSettingsContext =
  createContext<FormExternalPageSettingsContext>({
    initialData: initialExternalPageSettingsData,
    formData: initialExternalPageSettingsData,
    updateFormData: () => {},
    logoBannerFile: "",
    setLogoBannerFile: () => {},
    refetch: () => Promise.resolve({} as QueryObserverResult<unknown, Error>),
    isRefetching: false,
  });

interface Props {
  children: React.ReactNode;
  initialData: ExternalPageSettingsData | null;
  refetch: UseQueryResult["refetch"];
  isRefetching: boolean;
}

export function ExternalPageSettingsProvider({
  children,
  initialData,
  refetch,
  isRefetching,
}: Props) {
  const [formData, setFormData] = useState<ExternalPageSettingsData>(
    initialData || initialExternalPageSettingsData
  );

  const [logoBannerFile, setLogoBannerFile] = useState<string | undefined>(
    initialData?.loadBannerUrl
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setLogoBannerFile(initialData.loadBannerUrl);
    }
  }, [initialData]);

  const updateFormData = (data: Partial<ExternalPageSettingsData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  return (
    <ExternalPageSettingsContext.Provider
      value={{
        initialData: initialData || initialExternalPageSettingsData,
        formData,
        updateFormData,
        logoBannerFile,
        setLogoBannerFile,
        refetch,
        isRefetching,
      }}
    >
      {children}
    </ExternalPageSettingsContext.Provider>
  );
}

export function useExternalPageSettingsData() {
  return useContext(ExternalPageSettingsContext);
}
