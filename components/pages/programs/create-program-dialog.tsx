"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useFormProgramData } from "@/contexts/FormProgramContext";
import { ProgramSchema } from "@/lib/schemas/schema-programs";

import Spinner from "../../spinner";
import { DatePicker } from "../../ui/date-picker";

import "@/styles/styles.css";

export default function CreateProgramDialog() {
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const formSchema = ProgramSchema();
  const [isOpen, setIsOpen] = useState(false);
  const { refetch } = useFormProgramData();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      programName: "",
      startDate: undefined,
      endDate: undefined,
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    mutation.mutate(data);
  };

  const toastSuccess = () => {
    toast.success("Programa criado com sucesso!", {
      autoClose: 2000,
      position: "top-center",
    });
  };

  const toastError = () => {
    toast.error("Erro ao criar o programa!", {
      autoClose: 2000,
      position: "top-center",
    });
  };

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      try {
        setIsSubmiting(true);
        const response = await axios.post(
          `/api/programs/${session?.user?.organization_id}/create`,
          JSON.stringify({ ...data, userId: session?.user?.id }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 201) {
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
      <Dialog.Trigger asChild>
        <Button
          variant="blue"
          className="bg-[#2292EA] text-white font-semibold uppercase text-[18px] rounded-[30px] w-[120px] h-[40px] shadow-xl hover:bg-[#3686c3] hover:text-white transition-colors duration-300 ease-in-out"
        >
          + Novo
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content
          className="DialogContent bg-red-200"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <Spinner isLoading={isSubmiting}>
            <Dialog.Title className="DialogTitle uppercase font-bold p-[25px]">
              Novo programa
            </Dialog.Title>
            <Separator />
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4 p-[25px]">
                <div>
                  <label htmlFor="programName" className="flex items-center">
                    <span className="text-red-500">*</span>
                    <span className="text-gray-500">Nome do programa</span>
                  </label>
                  <input
                    id="programName"
                    type="text"
                    className="w-full h-[40px] border-[1px] border-gray-200 rounded-[6px] px-2 text-[#747D8C]"
                    {...register("programName")}
                  />
                  {errors.programName?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.programName.message}
                    </p>
                  )}
                </div>
                <div className="flex space-x-4 justify-between">
                  <div>
                    <label htmlFor="startDate" className="flex items-center">
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
                  <div>
                    <label htmlFor="endDate" className="flex items-center">
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
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 25,
                  justifyContent: "flex-end",
                }}
                className="p-[25px]"
              >
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
            <button className="IconButton mt-1 mr-1" aria-label="Close">
              <Cross2Icon className="w-6 h-6 text-black" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
