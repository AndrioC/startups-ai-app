"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon, InfoCircledIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, TrashIcon, Upload } from "lucide-react";
import { useSession } from "next-auth/react";
import { z } from "zod";

import { ProgramTable } from "@/app/api/programs/[organization_id]/list/route";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Separator } from "@/components/ui/separator";
import { useFormProgramData } from "@/contexts/FormProgramContext";
import { ProgramSchema } from "@/lib/schemas/schema-programs";

import "@/styles/styles.css";

interface Props {
  program?: ProgramTable;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function FormProgramDialog({
  program,
  isOpen,
  setIsOpen,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState("");
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const formSchema = ProgramSchema();
  const { refetch } = useFormProgramData();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      programName: program?.programName || "",
      startDate: program?.startDate ? new Date(program.startDate) : undefined,
      endDate: program?.endDate ? new Date(program.endDate) : undefined,
      description: program?.description || "",
      editalFileUrl: program?.editalFileUrl || null,
      isPublished: program?.isPublished || false,
      removeExistingFile: false,
    },
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (program) {
      reset({
        programName: program.programName,
        startDate: program.startDate ? new Date(program.startDate) : undefined,
        endDate: program.endDate ? new Date(program.endDate) : undefined,
        description: program.description || "",
        editalFile: undefined,
        editalFileUrl: program.editalFileUrl || null,
        isPublished: program.isPublished || false,
        removeExistingFile: false,
      });

      if (program.editalFileUrl) {
        const fileUrlParts = program.editalFileUrl.split("/");
        setFileName(fileUrlParts[fileUrlParts.length - 1]);
      } else {
        setFileName("");
      }
    } else {
      setFileName("");
    }
  }, [program, reset]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append(
      "json",
      JSON.stringify({
        programName: data.programName,
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description,
        isPublished: data.isPublished,
        userId: session?.user?.id,
        removeExistingFile: data.removeExistingFile,
      })
    );

    if (data.editalFile) {
      formData.append("editalFile", data.editalFile);
    }

    mutation.mutate(formData);
  };

  const toastSuccess = () => {
    toast.success(
      program
        ? "Programa atualizado com sucesso!"
        : "Programa criado com sucesso!",
      {
        autoClose: 2000,
        position: "top-center",
      }
    );
  };

  const toastError = () => {
    toast.error(
      program ? "Erro ao atualizar o programa!" : "Erro ao criar o programa!",
      {
        autoClose: 2000,
        position: "top-center",
      }
    );
  };

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        setIsSubmitting(true);

        const response = await axios({
          method: program ? "PATCH" : "POST",
          url: `/api/programs/${session?.user?.organization_id}/${
            program ? `update-program?programId=${program.id}` : "create"
          }`,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200 || response.status === 201) {
          toastSuccess();
          refetch();
          setIsOpen(false);
          reset({
            programName: "",
            startDate: undefined,
            endDate: undefined,
            description: "",
            editalFile: undefined,
            isPublished: false,
          });
        }
      } catch (error) {
        toastError();
        console.log("error: ", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "list-programs-by-organization-id",
          session?.user?.organization_id,
        ],
      });
    },
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setValue("removeExistingFile", false);
    } else {
      setFileName("");
    }
  };

  const handleRemoveFile = () => {
    setFileName(""); //
    setValue("editalFile", undefined);
    setValue("removeExistingFile", true);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 h-[80vh] w-[900px] translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg shadow-lg focus:outline-none overflow-hidden"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <div
            className={`relative ${isSubmitting ? "pointer-events-none" : ""}`}
          >
            <div className="p-6">
              <Dialog.Title className="text-lg font-bold uppercase">
                {program ? "Editar programa" : "Novo programa"}
              </Dialog.Title>
            </div>
            <Separator className="w-full" />
            <div className="p-6 pt-4 overflow-y-auto max-h-[calc(90vh-120px)]">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:space-x-4 w-full">
                  <div className="w-full sm:w-1/2">
                    <label
                      htmlFor="programName"
                      className="flex items-center space-x-1 mb-2"
                    >
                      <span className="text-red-500">*</span>
                      <span className="text-gray-500">Nome do programa</span>
                    </label>
                    <input
                      id="programName"
                      type="text"
                      className="w-full h-[40px] border border-gray-200 rounded px-2 text-[#747D8C]"
                      {...register("programName")}
                      disabled={isSubmitting}
                    />
                    {errors.programName?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.programName.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full sm:w-1/2 flex flex-col sm:flex-row sm:space-x-4">
                    <div className="flex-1">
                      <label
                        htmlFor="startDate"
                        className="flex items-center space-x-1 mb-2"
                      >
                        <span className="text-red-500">*</span>
                        <span className="text-gray-500">
                          Início do Programa
                        </span>
                      </label>
                      <Controller
                        control={control}
                        name="startDate"
                        render={({ field }) => (
                          <DatePicker
                            onChange={(newValue: Date | undefined) => {
                              field.onChange(newValue);
                            }}
                            value={field.value}
                            className="w-full"
                            disabled={isSubmitting}
                          />
                        )}
                      />
                      {errors?.startDate && (
                        <p className="mt-2 text-sm text-red-500">
                          {errors?.startDate?.message}
                        </p>
                      )}
                    </div>
                    <div className="flex-1 mt-4 sm:mt-0">
                      <label
                        htmlFor="endDate"
                        className="flex items-center space-x-1 mb-2"
                      >
                        <span className="text-red-500">*</span>
                        <span className="text-gray-500">Final do Programa</span>
                      </label>
                      <Controller
                        control={control}
                        name="endDate"
                        render={({ field }) => (
                          <DatePicker
                            onChange={(newValue: Date | undefined) => {
                              field.onChange(newValue);
                            }}
                            value={field.value}
                            className="w-full"
                            disabled={isSubmitting}
                          />
                        )}
                      />
                      {errors?.endDate && (
                        <p className="mt-2 text-sm text-red-500">
                          {errors?.endDate?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="flex flex-col items-start mb-2"
                  >
                    <div className="flex items-center space-x-1">
                      <span className="text-red-500">*</span>
                      <span className="text-gray-500">
                        Descrição do programa
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1 ml-2">
                      (Esta descrição será exibida para as Startups, caso o
                      programa seja publicado)
                    </p>
                  </label>
                  <textarea
                    id="description"
                    className="w-full h-[100px] border border-gray-200 rounded px-2 py-1 text-[#747D8C] resize-none"
                    {...register("description")}
                    disabled={isSubmitting}
                  />
                  {errors.description?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="editalFile"
                    className="flex items-center space-x-1"
                  >
                    <span className="text-gray-500">
                      Carregue o edital do programa que ficará disponível para
                      as Startups
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      id="editalFile"
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      {...register("editalFile")}
                      onChange={(e) => {
                        handleFileChange(e);
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          setValue("editalFile", files[0]);
                          setValue("removeExistingFile", false);
                        } else {
                          setValue("editalFile", undefined);
                        }
                      }}
                      disabled={isSubmitting}
                    />
                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                      <label
                        htmlFor="editalFile"
                        className={`flex-grow px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                          isSubmitting ? "pointer-events-none opacity-50" : ""
                        }`}
                      >
                        {fileName ? (
                          <div className="flex items-center text-gray-500">
                            <Upload className="w-5 h-5 mr-2" />
                            <span className="text-blue-500 font-bold">
                              {fileName}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center text-gray-500">
                            <Upload className="w-5 h-5 mr-2" />
                            <span>Selecionar arquivo</span>
                          </div>
                        )}
                      </label>
                      <div className="flex items-center px-3 py-2 bg-gray-100 border-l border-gray-300">
                        {fileName ? (
                          <Button
                            variant="ghost"
                            className="text-gray-500 hover:text-red-500 transition-colors duration-200"
                            disabled={isSubmitting}
                            onClick={handleRemoveFile}
                          >
                            <TrashIcon className="w-5 h-5" />
                          </Button>
                        ) : (
                          <span className="text-gray-400">
                            <Upload className="w-5 h-5" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {errors.editalFile?.message && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.editalFile.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="isPublished"
                    type="checkbox"
                    className="appearance-none w-5 h-5 mr-2 border-2 border-blue-500 rounded checked:bg-blue-500 checked:border-0 cursor-pointer bg-white transition-colors duration-300 ease-in-out"
                    {...register("isPublished")}
                    disabled={isSubmitting}
                  />
                  <label htmlFor="isPublished" className="text-gray-500">
                    Publicar
                  </label>
                  <div className="relative group">
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-gray-500 hover:text-gray-700"
                      disabled={isSubmitting}
                    >
                      <InfoCircledIcon className="h-5 w-5" />
                    </Button>
                    <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 z-10 w-[500px] p-4 text-sm text-gray-700 bg-gray-100 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <div className="flex items-start space-x-4">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 48 48"
                          xmlns="http://www.w3.org/2000/svg"
                          className="flex-shrink-0"
                        >
                          <path
                            d="M24 4L4 44H44L24 4Z"
                            fill="none"
                            stroke="#2292EA"
                            strokeWidth="3"
                          />
                          <path
                            d="M24 32V36"
                            stroke="#2292EA"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                          <path
                            d="M24 16V28"
                            stroke="#2292EA"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        </svg>
                        <p className="flex-1 text-gray-500 font-normal">
                          Ao publicar este programa, todas as Startups, que
                          fazem parte da base da Startups AI, serão notificadas
                          e poderão se inscrever neste programa.
                        </p>
                      </div>
                      <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-r-[16px] border-r-gray-100 border-b-8 border-b-transparent"></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="blue"
                    className="bg-[#2292EA] text-white font-medium uppercase text-[15px] rounded-[30px] w-[150px] h-[40px] shadow-xl hover:bg-[#3686c3] hover:text-white transition-colors duration-300 ease-in-out relative"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        <span>Salvando...</span>
                      </div>
                    ) : (
                      "Salvar"
                    )}
                  </Button>
                </div>
              </form>
            </div>
            <Dialog.Close asChild>
              <Button
                variant="ghost"
                className="absolute top-3 right-3"
                aria-label="Close"
                disabled={isSubmitting}
              >
                <Cross2Icon className="w-6 h-6 text-black" />
              </Button>
            </Dialog.Close>
            {isSubmitting && (
              <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#2292EA]" />
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
