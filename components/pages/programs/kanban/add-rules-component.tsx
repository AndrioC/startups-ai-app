import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { HiDotsHorizontal } from "react-icons/hi";
import { HiOutlineTrash } from "react-icons/hi2";
import Select, {
  components,
  DropdownIndicatorProps,
  MultiValueProps,
} from "react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { z } from "zod";

import { KanbanDataWithCards } from "@/app/api/kanban/[organization_id]/load-kanbans-by-program-token/route";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { KanbanProgramRulesSchema } from "@/lib/schemas/schema-kanban-program-rules";

interface ComparationType {
  key: "equal" | "greater_than" | "less_than";
  label_pt: string;
  label_en: string;
}

interface Option {
  value: string;
  label_pt: string;
  label_en: string;
}

interface Rule {
  key: string;
  rule_en: string;
  rule_pt: string;
  comparation_type: ComparationType[];
  field_type:
    | "multiple_select"
    | "single_select"
    | "datepicker"
    | "numeric_input";
  options?: Option[];
}

const DropdownIndicator: React.FC<DropdownIndicatorProps> = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <svg
        width="10"
        height="6"
        viewBox="0 0 10 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M5 6L0.669872 0L9.33013 0L5 6Z" fill="#A7B6CD" />
      </svg>
    </components.DropdownIndicator>
  );
};

const MultiValue: React.FC<MultiValueProps> = (props) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    props.removeProps.onClick?.(event as any);
  };

  return (
    <components.MultiValue {...props}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#EBEDED",
          border: "1px solid #A5B5C1",
          borderRadius: "15px",
          padding: "4px 8px",
          margin: "2px",
        }}
      >
        <span style={{ color: "#747D8C", marginRight: "8px" }}>
          {props.children}
        </span>
        <button
          onClick={handleClick}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            padding: 0,
            fontSize: "14px",
            color: "#747D8C",
          }}
        >
          ×
        </button>
      </div>
    </components.MultiValue>
  );
};

interface Props {
  rules: Rule[];
  kanbanData: KanbanDataWithCards[];
  selectedKanban: KanbanDataWithCards;
  refetch: () => void;
}

export default function AddRulesComponent({
  rules,
  kanbanData,
  selectedKanban,
  refetch,
}: Props) {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedKanbanId, setSelectedKanbanId] = useState<number | "">(
    selectedKanban?.rules.length > 0 ? selectedKanban.kanban_id : ""
  );

  const formSchema = KanbanProgramRulesSchema();

  type FormValues = z.infer<ReturnType<typeof KanbanProgramRulesSchema>>;

  const getInitialValues = (): FormValues => {
    if (selectedKanban && selectedKanban.rules.length > 0) {
      const existingRules = selectedKanban.rules.map((q) => ({
        key: q.key,
        rule: rules.find((ques) => ques.key === q.key)?.rule_pt || "",
        comparationType:
          q.comparation_type.length > 0 ? q.comparation_type[0].key : "",
        value: q.options ? q.options.map((opt) => opt.value) : "",
      }));
      return {
        kanban_id: selectedKanban.rules[0].move_to_kanban_id,
        program_id: selectedKanban.program_id,
        rules: existingRules,
      };
    }
    return {
      kanban_id: undefined,
      program_id: kanbanData[0].program_id,
      rules: [],
    };
  };

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getInitialValues(),
  });

  const watchedRules = watch("rules");

  const addRule = () => {
    const availableQuestions = getAvailableRules(-1);
    if (availableQuestions.length > 0) {
      setValue("rules", [
        ...watchedRules,
        { key: "", rule: "", comparationType: "", value: "" },
      ]);
    }
  };

  const removeRule = (index: number) => {
    setValue(
      "rules",
      watchedRules.filter((_, i) => i !== index)
    );
  };

  const saveQuestions = async (data: any) => {
    setIsLoading(true);
    const transformedData = {
      ...data,
      kanban_id: selectedKanban.kanban_id,
      rules: data.rules.map((rule: any) => {
        const ruleDefinition = rules.find((r) => r.key === rule.key);

        const baseRule = {
          ...rule,
          field_type: ruleDefinition?.field_type,
        };

        if (
          ruleDefinition?.field_type === "multiple_select" ||
          ruleDefinition?.field_type === "single_select"
        ) {
          return {
            ...baseRule,
            value: Array.isArray(rule.value)
              ? rule.value.map((v: string) => ({
                  value: v,
                  label_pt:
                    ruleDefinition.options?.find((opt) => opt.value === v)
                      ?.label_pt || v,
                  label_en:
                    ruleDefinition.options?.find((opt) => opt.value === v)
                      ?.label_en || v,
                }))
              : [
                  {
                    value: rule.value,
                    label_pt:
                      ruleDefinition.options?.find(
                        (opt) => opt.value === rule.value
                      )?.label_pt || rule.value,
                    label_en:
                      ruleDefinition.options?.find(
                        (opt) => opt.value === rule.value
                      )?.label_en || rule.value,
                  },
                ],
          };
        }
        return baseRule;
      }),
    };

    try {
      const response = await fetch(
        `/api/programs/${session?.user?.organization_id}/create-rule`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            program_id: data.program_id,
            kanban_id: selectedKanban?.kanban_id,
            move_to_kanban_id: selectedKanbanId,
            rules: transformedData.rules,
          }),
        }
      );

      if (response.ok) {
        setIsLoading(false);
        refetch();
        setIsModalOpen(false);
      } else {
        console.error("Erro ao salvar perguntas");
      }
    } catch (error) {
      console.error("Erro ao salvar perguntas:", error);
    }
  };

  const onSubmit = async (data: any) => {
    await saveQuestions(data);
  };

  const renderFieldInput = (index: number) => {
    const rule = rules.find((q) => q.rule_pt === watch(`rules.${index}.rule`));

    if (!rule) return null;

    switch (rule.field_type) {
      case "multiple_select":
        return (
          <Controller
            name={`rules.${index}.value`}
            control={control}
            render={({ field }) => (
              <div className="flex flex-col">
                <Select
                  {...field}
                  isMulti
                  options={rule.options?.map((option) => ({
                    value: option.value,
                    label: option.label_pt,
                  }))}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  components={{ DropdownIndicator, MultiValue }}
                  placeholder="Selecione uma opção"
                  onChange={(selectedOptions) => {
                    const values = Array.isArray(selectedOptions)
                      ? selectedOptions.map((opt) => opt.value)
                      : [];
                    field.onChange(values);
                  }}
                  value={
                    Array.isArray(field.value)
                      ? field.value.map((value) => ({
                          value,
                          label:
                            rule.options?.find((opt) => opt.value === value)
                              ?.label_pt || value,
                        }))
                      : field.value
                        ? [
                            {
                              value: field.value,
                              label:
                                rule.options?.find(
                                  (opt) => opt.value === field.value
                                )?.label_pt || field.value,
                            },
                          ]
                        : []
                  }
                  styles={{
                    placeholder: (base) => ({
                      ...base,
                      fontSize: "14px",
                      color: "#747D8C",
                    }),
                    option: (base) => ({
                      ...base,
                      fontSize: "14px",
                      color: "#747D8C",
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: "transparent",
                      border: "none",
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      padding: 0,
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      display: "none",
                    }),
                    control: (base, state) => ({
                      ...base,
                      minHeight: "38px",
                      borderColor: state.isFocused
                        ? "#A5B5C1"
                        : errors.rules?.[index]?.value
                          ? "red"
                          : "#A5B5C1",
                      "&:hover": {
                        borderColor: "#A5B5C1",
                      },
                      boxShadow: state.isFocused
                        ? errors.rules?.[index]?.value
                          ? "0 0 0 1px red"
                          : "0 0 0 1px #A5B5C1"
                        : "none",
                    }),
                    menuPortal: (defaultStyles) => ({
                      ...defaultStyles,
                      zIndex: 1100,
                      pointerEvents: "all",
                    }),
                    dropdownIndicator: (base) => ({
                      ...base,
                      color: "#A7B6CD",
                      "&:hover": {
                        color: "#A7B6CD",
                      },
                    }),
                    indicatorSeparator: () => ({
                      display: "none",
                    }),
                  }}
                />
                <p
                  className="text-xs mt-2"
                  style={{
                    minHeight: "20px",
                    color: errors.rules?.[index]?.value
                      ? "#dc3545"
                      : "transparent",
                    opacity: errors.rules?.[index]?.value ? 1 : 0,
                  }}
                >
                  {errors.rules?.[index]?.value?.message || " "}
                </p>
              </div>
            )}
          />
        );

      case "single_select":
        return (
          <Controller
            name={`rules.${index}.value`}
            control={control}
            render={({ field }) => (
              <div className="flex flex-col">
                <div className="relative inline-block w-[250px]">
                  <select
                    {...field}
                    value={typeof field.value === "string" ? field.value : ""}
                    className="w-full py-2 px-3 border border-[#A5B5C1] text-[#747D8C] bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none"
                  >
                    <option value="">Selecione uma opção</option>
                    {rule.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label_pt}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 10 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M5 6L0.669872 0L9.33013 0L5 6Z" fill="#A7B6CD" />
                    </svg>
                  </div>
                </div>
                <p
                  className="text-xs mt-2"
                  style={{
                    minHeight: "20px",
                    color: errors.rules?.[index]?.value
                      ? "#dc3545"
                      : "transparent",
                    opacity: errors.rules?.[index]?.value ? 1 : 0,
                  }}
                >
                  {errors.rules?.[index]?.value?.message || " "}
                </p>
              </div>
            )}
          />
        );
      case "datepicker":
        return (
          <Controller
            name={`rules.${index}.value`}
            control={control}
            render={({ field }) => (
              <div className="flex flex-col">
                <DatePicker
                  onChange={(newValue: Date | undefined) => {
                    field.onChange(newValue);
                  }}
                  value={field.value instanceof Date ? field.value : undefined}
                  className="border-[#A5B5C1] text-[#747D8C]"
                />
                <p
                  className="text-xs mt-2"
                  style={{
                    minHeight: "20px",
                    color: errors.rules?.[index]?.value
                      ? "#dc3545"
                      : "transparent",
                    opacity: errors.rules?.[index]?.value ? 1 : 0,
                  }}
                >
                  {errors.rules?.[index]?.value?.message || " "}
                </p>
              </div>
            )}
          />
        );
      case "numeric_input":
        return (
          <Controller
            name={`rules.${index}.value`}
            control={control}
            render={({ field }) => (
              <div className="flex flex-col">
                <input
                  {...field}
                  type="number"
                  value={typeof field.value === "number" ? field.value : ""}
                  onChange={(e) =>
                    field.onChange(
                      isNaN(e.target.valueAsNumber)
                        ? ""
                        : e.target.valueAsNumber
                    )
                  }
                  className="py-2 px-3 w-[210px] block border border-[#A5B5C1] text-[#747D8C] bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <p
                  className="text-xs mt-2"
                  style={{
                    minHeight: "20px",
                    color: errors.rules?.[index]?.value
                      ? "#dc3545"
                      : "transparent",
                    opacity: errors.rules?.[index]?.value ? 1 : 0,
                  }}
                >
                  {errors.rules?.[index]?.value?.message || " "}
                </p>
              </div>
            )}
          />
        );
      default:
        return null;
    }
  };

  const getAvailableRules = (currentIndex: number) => {
    const selectedRules = watchedRules
      .map((rule, index) => (index !== currentIndex ? rule.rule : null))
      .filter((rule): rule is string => rule !== null);

    return rules.filter((q) => !selectedRules.includes(q.rule_pt));
  };

  const listHasRules = (kanbanId: number) => {
    return kanbanData.some(
      (kanban) =>
        kanban.kanban_id === kanbanId && kanban.rules && kanban.rules.length > 0
    );
  };

  const hasAvailableKanbans = () => {
    return kanbanData.some((kanban) => !listHasRules(kanban.kanban_id));
  };

  const isKanbanDisabled = (
    kanban: KanbanDataWithCards,
    selectedKanbanId: number | "",
    rulesExist: boolean
  ) => {
    if (rulesExist && selectedKanban?.kanban_id === kanban.kanban_id) {
      return false;
    }
    return (
      selectedKanbanId === kanban.kanban_id ||
      kanban.kanban_position <= selectedKanban?.kanban_position! ||
      kanbanData.some((k) =>
        k.rules.some((rule) => rule.move_to_kanban_id === kanban.kanban_id)
      )
    );
  };

  const isFormDisabled = selectedKanbanId === "";
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <HiDotsHorizontal className="text-gray-400" />
        </Button>
      </DialogTrigger>

      <DialogContent className="fixed top-1/2 left-1/2 w-[1100px] max-w-[95vw] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg focus:outline-none overflow-y-auto custom-scrollbar">
        <Spinner isLoading={isLoading}>
          <div className="h-full">
            <DialogTitle className="text-2xl font-bold uppercase mb-4">
              Adicionar Regras
            </DialogTitle>
            <Separator className="w-[calc(100%+48px)] -mx-6" />
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-2 space-y-4">
                <div>
                  <label className="block text-base font-medium text-[#747D8C] mb-1">
                    Mover cards para a lista:
                  </label>
                  <div className="relative inline-block">
                    <select
                      {...register("kanban_id", { valueAsNumber: true })}
                      value={selectedKanbanId}
                      onChange={(e) => {
                        const newValue = Number(e.target.value);
                        if (!isNaN(newValue)) {
                          setSelectedKanbanId(newValue);
                        }
                      }}
                      className="w-[400px] block py-2 px-3 border border-[#A5B5C1] text-[#747D8C] bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none pr-10"
                    >
                      <option value="">Selecione uma lista</option>
                      {kanbanData.map((kanban) => {
                        const hasRules = listHasRules(kanban.kanban_id);
                        const isDisabled = isKanbanDisabled(
                          kanban,
                          selectedKanbanId,
                          hasRules
                        );

                        return (
                          <option
                            key={kanban.kanban_id}
                            value={kanban.kanban_id}
                            disabled={isDisabled}
                          >
                            {kanban.kanban_name}
                          </option>
                        );
                      })}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 10 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 6L0.669872 0L9.33013 0L5 6Z"
                          fill="#A7B6CD"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-base font-medium text-[#747D8C] mb-1">
                    Quando:
                  </label>
                  {watchedRules.map((_rule, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <input
                        type="hidden"
                        {...register(`rules.${index}.key`)}
                      />
                      <Controller
                        name={`rules.${index}.rule`}
                        control={control}
                        render={({ field }) => (
                          <div className="flex flex-col">
                            <div className="relative inline-block w-[250px]">
                              <select
                                {...field}
                                className="w-full py-2 px-3 border border-[#A5B5C1] text-[#747D8C] bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none"
                                onChange={(e) => {
                                  const selectedQuestion = rules.find(
                                    (q) => q.rule_pt === e.target.value
                                  );
                                  field.onChange(e.target.value);
                                  if (selectedQuestion) {
                                    setValue(
                                      `rules.${index}.key`,
                                      selectedQuestion.key
                                    );
                                    setValue(
                                      `rules.${index}.comparationType`,
                                      ""
                                    );
                                    setValue(`rules.${index}.value`, "");
                                  }
                                }}
                              >
                                <option value="">Selecione uma pergunta</option>
                                {getAvailableRules(index).map((q) => (
                                  <option key={q.key} value={q.rule_pt}>
                                    {q.rule_pt}
                                  </option>
                                ))}
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                                <svg
                                  width="15"
                                  height="15"
                                  viewBox="0 0 10 6"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5 6L0.669872 0L9.33013 0L5 6Z"
                                    fill="#A7B6CD"
                                  />
                                </svg>
                              </div>
                            </div>
                            <p
                              className={`text-xs mt-2 ${
                                errors.rules?.[index]?.rule
                                  ? "text-red-500"
                                  : "text-transparent"
                              }`}
                              style={{ minHeight: "20px" }}
                            >
                              {errors.rules?.[index]?.rule?.message || " "}
                            </p>
                          </div>
                        )}
                      />

                      <Controller
                        name={`rules.${index}.comparationType`}
                        control={control}
                        render={({ field }) => (
                          <div className="flex flex-col">
                            <div className="relative inline-block w-[250px]">
                              <select
                                {...field}
                                className="w-full py-2 px-3 border border-[#A5B5C1] text-[#747D8C] bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none"
                              >
                                <option value="">Tipo de comparação</option>
                                {rules
                                  .find(
                                    (q) =>
                                      q.rule_pt === watch(`rules.${index}.rule`)
                                  )
                                  ?.comparation_type.map((type) => (
                                    <option key={type.key} value={type.key}>
                                      {type.label_pt}
                                    </option>
                                  ))}
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                                <svg
                                  width="15"
                                  height="15"
                                  viewBox="0 0 10 6"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5 6L0.669872 0L9.33013 0L5 6Z"
                                    fill="#A7B6CD"
                                  />
                                </svg>
                              </div>
                            </div>
                            <p
                              className={`text-xs mt-2 ${
                                errors.rules?.[index]?.comparationType
                                  ? "text-red-500"
                                  : "text-transparent"
                              }`}
                              style={{ minHeight: "20px" }}
                            >
                              {errors.rules?.[index]?.comparationType
                                ?.message || " "}
                            </p>
                          </div>
                        )}
                      />

                      {renderFieldInput(index)}
                      <button
                        type="button"
                        onClick={() => removeRule(index)}
                        className="flex-shrink-0 mb-7 pl-1"
                        style={{ marginLeft: "auto" }}
                      >
                        <HiOutlineTrash className="h-8 w-8" />
                      </button>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={addRule}
                  variant="ghost"
                  className="flex items-center text-[#747D8C] w-[165px]"
                  disabled={
                    isFormDisabled ||
                    (!selectedKanban &&
                      (!hasAvailableKanbans() ||
                        getAvailableRules(-1).length === 0))
                  }
                >
                  + Adicionar outra regra
                </Button>
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  type="submit"
                  variant="blue"
                  disabled={isLoading || isFormDisabled}
                  className="bg-[#2292EA] text-white font-semibold uppercase text-base sm:text-lg rounded-full w-full sm:w-[120px] h-[40px] shadow-xl hover:bg-[#3686c3] hover:text-white transition-colors duration-300 ease-in-out"
                >
                  Salvar
                </Button>
              </div>
            </form>
          </div>
        </Spinner>
      </DialogContent>
    </Dialog>
  );
}
