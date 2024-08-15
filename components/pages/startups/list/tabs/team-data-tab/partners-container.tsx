"use client";

import { FieldValues, UseFormRegister } from "react-hook-form";

type Props = {
  register: UseFormRegister<FieldValues>;
  remove: (index: number) => void;
  index: number;
  sortedPositionData: { id: number; label: string }[];
};

export default function PartnersContainer({
  register,
  index,
  sortedPositionData,
}: Props) {
  const yesNoData = [
    {
      id: "yes",
      label: "Sim",
    },
    {
      id: "no",
      label: "Não",
    },
  ];

  const dedicationData = [
    {
      id: "fulltime",
      label: "Full-time",
    },
    {
      id: "partime",
      label: "Part-time",
    },
  ];

  return (
    <div className="mb-4 border p-4 rounded-lg">
      <div className="flex w-full gap-1">
        <div className="mb-2 font-semibold text-gray-400">{index + 1}.</div>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between gap-2">
            <div>
              <label
                htmlFor={`name${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">Nome</span>
              </label>
              <input
                id={`name${index}`}
                type="text"
                {...register(`partners[${index}].name`)}
                disabled
                className="block w-[300px] h-[40px] py-1.5 pl-2 text-gray-900 ring-gray-300 focus:ring-2 focus:ring-inset sm:max-w-xs text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowedmt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor={`phone${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">Telefone</span>
              </label>
              <input
                id={`phone${index}`}
                type="text"
                {...register(`partners[${index}].phone`)}
                disabled
                className="block w-[300px] h-[40px] py-1.5 pl-2 text-gray-900 ring-gray-300 focus:ring-2 focus:ring-inset sm:max-w-xs text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowedmt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor={`email${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">Email</span>
              </label>
              <input
                id={`email${index}`}
                type="email"
                {...register(`partners[${index}].email`)}
                disabled
                className="block w-[300px] h-[40px] py-1.5 pl-2 text-gray-900 ring-gray-300 focus:ring-2 focus:ring-inset sm:max-w-xs text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowedmt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div>
              <label
                htmlFor={`position_id${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">Cargo</span>
              </label>
              <select
                id={`position_id${index}`}
                {...register(`partners[${index}].position_id`)}
                disabled
                className="block pl-2 w-[185px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6"
              >
                <option value="">Selecione uma opção</option>
                {sortedPositionData.map(
                  (option: { id: number; label: string }) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  )
                )}
              </select>
            </div>
            <div>
              <label
                htmlFor={`is_founder${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">Founder?</span>
              </label>
              <select
                id={`is_founder${index}`}
                {...register(`partners[${index}].is_founder`)}
                disabled
                className="block pl-2 w-[185px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6"
              >
                <option value="">Selecione uma opção</option>
                {yesNoData.map((option: { id: string; label: string }) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor={`dedication_type${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">Dedicação</span>
              </label>
              <select
                id={`dedication_type${index}`}
                {...register(`partners[${index}].dedication_type`)}
                disabled
                className="block pl-2 w-[185px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6"
              >
                <option value="">Selecione uma opção</option>
                {dedicationData.map((option: { id: string; label: string }) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor={`percentage_captable${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">% Captable</span>
              </label>
              <input
                id={`percentage_captable${index}`}
                type="number"
                {...register(`partners[${index}].percentage_captable`, {
                  valueAsNumber: true,
                })}
                disabled
                className="block w-[100px] h-[40px] py-1.5 pl-2 text-gray-900 ring-gray-300 focus:ring-inset sm:max-w-xs text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowedmt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor={`is_first_business${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">Primeiro negócio?</span>
              </label>
              <select
                id={`is_first_business${index}`}
                {...register(`partners[${index}].is_first_business`)}
                disabled
                className="block pl-2 w-[185px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6"
              >
                <option value="">Selecione uma opção</option>
                {yesNoData.map((option: { id: string; label: string }) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <div>
              <label
                htmlFor={`linkedin_lattes${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">Linkedin ou Lattes</span>
              </label>
              <input
                id={`linkedin_lattes${index}`}
                type="text"
                {...register(`partners[${index}].linkedin_lattes`)}
                disabled
                className="block w-[400px] h-[40px] py-1.5 pl-2 text-gray-900 ring-gray-300 focus:ring-inset sm:max-w-xs text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowedmt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor={`has_experience_or_formation${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">
                  Experiência ou formação na área da startup?
                </span>
              </label>
              <select
                id={`has_experience_or_formation${index}`}
                {...register(`partners[${index}].has_experience_or_formation`)}
                disabled
                className="block pl-2 w-[185px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6"
              >
                <option value="">Selecione uma opção</option>
                {yesNoData.map((option: { id: string; label: string }) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <div>
              <label
                htmlFor={`is_formation_complementary${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">
                  A formação e a área de atuação dos sócios são complementares?
                </span>
              </label>
              <select
                id={`is_formation_complementary${index}`}
                {...register(`partners[${index}].is_formation_complementary`)}
                disabled
                className="block pl-2 w-[185px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6"
              >
                <option value="">Selecione uma opção</option>
                {yesNoData.map((option: { id: string; label: string }) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
