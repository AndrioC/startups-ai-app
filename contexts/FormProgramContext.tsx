import { createContext, useContext } from "react";
import { QueryObserverResult, UseQueryResult } from "@tanstack/react-query";

export interface FormProgramData {
  programName: string;
  startDate: Date;
  endDate: Date;
}

interface FormProgramDataContext {
  initialData: FormProgramData[];
  refetch: UseQueryResult["refetch"];
  isRefetching: boolean;
}

const initialFormProgramData: FormProgramData[] = [
  {
    programName: "",
    startDate: new Date(),
    endDate: new Date(),
  },
];

const FormProgramContext = createContext<FormProgramDataContext>({
  initialData: initialFormProgramData,
  refetch: () => Promise.resolve({} as QueryObserverResult<unknown, Error>),
  isRefetching: false,
});

interface Props {
  children: React.ReactNode;
  initialData: FormProgramData[];
  refetch: UseQueryResult["refetch"];
  isRefetching: boolean;
}

export function FormProgramProvider({
  children,
  initialData,
  refetch,
  isRefetching,
}: Props) {
  return (
    <FormProgramContext.Provider
      value={{
        initialData,
        refetch,
        isRefetching,
      }}
    >
      {children}
    </FormProgramContext.Provider>
  );
}

export function useFormProgramData() {
  return useContext(FormProgramContext);
}
