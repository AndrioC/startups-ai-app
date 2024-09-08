import { createContext, useContext } from "react";
import { QueryObserverResult, UseQueryResult } from "@tanstack/react-query";

export interface User {
  name: string;
  email: string;
}

export interface FormCompanyData {
  companyName: string;
  createdAt: Date;
  isPaying: boolean;
  logo?: string | null;
  logoSidebar?: string | null;
  users: User[];
}

interface FormCompanyDataContext {
  initialData: FormCompanyData[];
  refetch: UseQueryResult["refetch"];
  isRefetching: boolean;
}

const initialFormCompanyData: FormCompanyData[] = [
  {
    companyName: "",
    createdAt: new Date(),
    isPaying: true,
    logo: null,
    logoSidebar: null,
    users: [],
  },
];

const FormCompanyContext = createContext<FormCompanyDataContext>({
  initialData: initialFormCompanyData,
  refetch: () => Promise.resolve({} as QueryObserverResult<unknown, Error>),
  isRefetching: false,
});

interface Props {
  children: React.ReactNode;
  initialData: FormCompanyData[];
  refetch: UseQueryResult["refetch"];
  isRefetching: boolean;
}

export function FormCompanyProvider({
  children,
  initialData,
  refetch,
  isRefetching,
}: Props) {
  return (
    <FormCompanyContext.Provider
      value={{
        initialData,
        refetch,
        isRefetching,
      }}
    >
      {children}
    </FormCompanyContext.Provider>
  );
}

export function useFormCompanyData() {
  return useContext(FormCompanyContext);
}
