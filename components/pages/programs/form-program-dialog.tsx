"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { z } from "zod";

import { ProgramTable } from "@/app/api/programs/[organization_id]/list/route";
import Spinner from "@/components/spinner";
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
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const formSchema = ProgramSchema();
  const { refetch } = useFormProgramData();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      programName: program?.programName || "",
      startDate: program?.startDate ? new Date(program.startDate) : undefined,
      endDate: program?.endDate ? new Date(program.endDate) : undefined,
    },
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (program) {
      reset({
        programName: program.programName,
        startDate: program.startDate ? new Date(program.startDate) : undefined,
        endDate: program.endDate ? new Date(program.endDate) : undefined,
      });
    }
  }, [program, reset]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    mutation.mutate(data);
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
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      try {
        setIsSubmiting(true);
        const response = await axios({
          method: program ? "PATCH" : "POST",
          url: `/api/programs/${session?.user?.organization_id}/${
            program ? `update-program?programId=${program.id}` : "create"
          }`,
          data: JSON.stringify({ ...data, userId: session?.user?.id }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200 || response.status === 201) {
          setIsSubmiting(false);
          toastSuccess();
          refetch();
          setIsOpen(false);
          reset({
            programName: "",
            startDate: undefined,
            endDate: undefined,
          });
        }
      } catch (error) {
        toastError();
        console.log("error: ", error);
      }
      setIsSubmiting(false);
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

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-xl translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg p-6 shadow-lg focus:outline-none"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <Spinner isLoading={isSubmiting}>
            <Dialog.Title className="text-lg font-bold uppercase mb-4">
              {program ? "Editar programa" : "Novo programa"}
            </Dialog.Title>
            <Separator />
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label
                  htmlFor="programName"
                  className="flex items-center space-x-1"
                >
                  <span className="text-red-500">*</span>
                  <span className="text-gray-500">Nome do programa</span>
                </label>
                <input
                  id="programName"
                  type="text"
                  className="w-full h-[40px] border border-gray-200 rounded px-2 text-[#747D8C] mt-1"
                  {...register("programName")}
                />
                {errors.programName?.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.programName.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                  <label
                    htmlFor="startDate"
                    className="flex items-center space-x-1"
                  >
                    <span className="text-red-500">*</span>
                    <span className="text-gray-500">Início do Programa</span>
                  </label>
                  <Controller
                    control={control}
                    name="startDate"
                    render={({ field }) => {
                      return (
                        <DatePicker
                          onChange={(newValue: Date | undefined) => {
                            field.onChange(newValue);
                          }}
                          value={field.value}
                        />
                      );
                    }}
                  />
                  {errors?.startDate && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors?.startDate?.message}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="endDate"
                    className="flex items-center space-x-1"
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
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmiting}
                  variant="blue"
                  className="bg-[#2292EA] text-white font-medium uppercase text-[15px] rounded-[30px] w-[120px] h-[40px] shadow-xl hover:bg-[#3686c3] hover:text-white transition-colors duration-300 ease-in-out"
                >
                  Salvar
                </Button>
              </div>
            </form>
          </Spinner>
          <Dialog.Close asChild>
            <button className="absolute top-3 right-3" aria-label="Close">
              <Cross2Icon className="w-6 h-6 text-black" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}