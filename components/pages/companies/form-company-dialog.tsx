import { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Unlock,
  User,
  UserPlus,
  X,
} from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { z } from "zod";

import { CompanyTable } from "@/app/api/companies/[organization_id]/list/route";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useFormProgramData } from "@/contexts/FormProgramContext";
import { CompanySchema } from "@/lib/schemas/schema-companies";

import "react-image-crop/dist/ReactCrop.css";

interface Props {
  company?: CompanyTable;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface ImageError {
  file: File;
  message: string;
}

const getCroppedImg = (
  image: HTMLImageElement,
  crop: PixelCrop,
  fileName: string
): Promise<File> => {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        const file = new File([blob], fileName, { type: "image/png" });
        resolve(file);
      },
      "image/png",
      1
    );
  });
};

const verifyImageSize = (
  file: File
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error("Failed to load image"));
    };
    img.src = URL.createObjectURL(file);
  });
};

export default function FormCompanyDialog({
  company,
  isOpen,
  setIsOpen,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { refetch } = useFormProgramData();
  const formSchema = CompanySchema();

  const logoInputRef = useRef<HTMLInputElement>(null);
  const logoSidebarInputRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoSidebarPreview, setLogoSidebarPreview] = useState<string | null>(
    null
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoSidebarFile, setLogoSidebarFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<ImageError[]>([]);
  const [showCrop, setShowCrop] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [cropType, setCropType] = useState<"logo" | "logoSidebar" | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "px",
    width: 300,
    height: 100,
    x: 0,
    y: 0,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors: formErrors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: company?.companyName || "",
      createdAt: company?.createdAt || new Date(),
      isPaying: company?.isPaying || true,
      users:
        company?.users.map((user) => ({
          ...user,
          is_blocked: user.is_blocked || false,
        })) || [],
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: "users",
  });

  useEffect(() => {
    if (company) {
      reset({
        companyName: company.companyName,
        createdAt: company.createdAt,
        isPaying: company.isPaying,
        users: company.users,
      });
      setLogoPreview(company.logo || null);
      setLogoSidebarPreview(company.logoSidebar || null);
    }
  }, [company, reset]);

  const removeError = (errorToRemove: ImageError) => {
    setErrors(errors.filter((error) => error !== errorToRemove));
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "logoSidebar"
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      try {
        const { width, height } = await verifyImageSize(file);
        const minWidth = type === "logo" ? 300 : 50;
        const minHeight = type === "logo" ? 100 : 50;
        const maxWidth = type === "logo" ? 600 : 200;
        const maxHeight = type === "logo" ? 500 : 200;

        if (file.size > 2 * 1024 * 1024) {
          setErrors((prev) => [
            ...prev,
            {
              file,
              message: "O tamanho do arquivo excede o limite de 2MB.",
            },
          ]);
        } else if (width < minWidth || height < minHeight) {
          setErrors((prev) => [
            ...prev,
            {
              file,
              message: `A imagem é muito pequena. Tamanho mínimo requerido: ${minWidth}x${minHeight} pixels. Tamanho atual: ${width}x${height} pixels.`,
            },
          ]);
        } else if (width > maxWidth || height > maxHeight) {
          setErrors((prev) => [
            ...prev,
            {
              file,
              message: `A imagem é muito grande. Tamanho máximo permitido: ${maxWidth}x${maxHeight} pixels. Tamanho atual: ${width}x${height} pixels.`,
            },
          ]);
        } else {
          const reader = new FileReader();
          reader.onload = () => {
            setCropImage(reader.result as string);
            setCropType(type);
            setCrop({
              unit: "px",
              width: type === "logo" ? 300 : 50,
              height: type === "logo" ? 100 : 50,
              x: 0,
              y: 0,
            });
            setImageDimensions({ width, height });
            setShowCrop(true);
          };
          reader.readAsDataURL(file);
        }
      } catch (error) {
        console.error("Error verifying image size:", error);
        setErrors((prev) => [
          ...prev,
          {
            file,
            message:
              "Erro ao verificar o tamanho da imagem. Por favor, tente novamente.",
          },
        ]);
      }
    }
    event.target.value = "";
  };

  const handleConfirmCrop = async () => {
    if (cropImage && cropType) {
      setIsSubmitting(true);
      try {
        const img = document.createElement("img");
        img.src = cropImage;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const cropDimensions: PixelCrop = completedCrop || {
          unit: "px",
          x: 0,
          y: 0,
          width: cropType === "logo" ? 300 : 50,
          height: cropType === "logo" ? 100 : 50,
        };

        const imageToUpload = await getCroppedImg(
          img,
          cropDimensions,
          cropType === "logo" ? "logo.png" : "logo-sidebar.png"
        );

        const preview = URL.createObjectURL(imageToUpload);
        if (cropType === "logo") {
          setLogoPreview(preview);
          setLogoFile(imageToUpload);
        } else {
          setLogoSidebarPreview(preview);
          setLogoSidebarFile(imageToUpload);
        }

        handleCloseCropModal();
      } catch (error) {
        console.log("Error processing image:", error);
        toast.error("Erro ao processar a imagem. Por favor, tente novamente.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCloseCropModal = () => {
    setShowCrop(false);
    setCropImage(null);
    setCropType(null);
    setCompletedCrop(null);
    if (logoInputRef.current) logoInputRef.current.value = "";
    if (logoSidebarInputRef.current) logoSidebarInputRef.current.value = "";
  };

  const toggleUserBlock = (index: number) => {
    const users = [...fields];
    users[index].is_blocked = !users[index].is_blocked;
    reset({ ...control._formValues, users });
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "users") {
        formData.append(key, JSON.stringify(value));
      } else if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    });

    if (logoFile) {
      formData.append("logo", logoFile);
    }
    if (logoSidebarFile) {
      formData.append("logoSidebar", logoSidebarFile);
    }

    mutation.mutate(formData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toastSuccess = () => {
    toast.success(
      company
        ? "Organização atualizada com sucesso!"
        : "Organização criada com sucesso!",
      {
        autoClose: 2000,
        position: "top-center",
      }
    );
  };

  const toastError = () => {
    toast.error(
      company
        ? "Erro ao atualizar a organização!"
        : "Erro ao criar a organização!",
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
        const method = company?.id ? "PATCH" : "POST";
        const url = company?.id
          ? `/api/companies/${session?.user?.organization_id}/update?companyId=${company.id}`
          : `/api/companies/${session?.user?.organization_id}/create`;

        const response = await axios({
          method,
          url,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200 || response.status === 201) {
          setIsSubmitting(false);
          toastSuccess();
          refetch();
          setIsOpen(false);
          reset();
        }
      } catch (error) {
        toastError();
        console.log("error: ", error);
      }
      setIsSubmitting(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-companies"],
      });
    },
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-4xl translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg shadow-lg focus:outline-none overflow-y-auto"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <div
            className={`relative ${isSubmitting ? "pointer-events-none" : ""}`}
          >
            <div className="p-6">
              <Dialog.Title className="text-lg font-bold uppercase">
                {company ? "Editar organização" : "Nova organização"}
              </Dialog.Title>
            </div>
            <Separator className="w-full" />
            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="companyName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      <span className="text-red-500">*</span>
                      Nome da Organização{" "}
                    </label>
                    <Input id="companyName" {...register("companyName")} />
                    {formErrors.companyName && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.companyName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="createdAt"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {" "}
                      <span className="text-red-500">*</span>
                      Data de Criação
                    </label>
                    <Controller
                      name="createdAt"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          onChange={field.onChange}
                          value={field.value}
                        />
                      )}
                    />
                    {formErrors.createdAt && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.createdAt.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-1">
                    <input
                      id="registerUserTerms"
                      {...register("isPaying")}
                      type="checkbox"
                      className="appearance-none w-5 h-5 border-2 border-blue-500 rounded checked:bg-blue-500 checked:border-0 cursor-pointer bg-white transition-colors duration-300 ease-in-out"
                    />
                    <label
                      htmlFor="isPaying"
                      className="text-sm font-medium text-gray-700"
                    >
                      Pagante
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg w-[320px] h-[120px] flex items-center justify-center cursor-pointer relative">
                      <input
                        type="file"
                        onChange={(e) => handleImageChange(e, "logo")}
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        ref={logoInputRef}
                      />
                      {logoPreview ? (
                        <Image
                          src={logoPreview}
                          alt="Logo preview"
                          layout="fill"
                          objectFit="contain"
                        />
                      ) : (
                        <div className="text-gray-400 text-sm">
                          Escolher arquivo (max 300 x 100)
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo sidebar
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg w-[60px] h-[60px] flex items-center justify-center cursor-pointer relative">
                      <input
                        type="file"
                        onChange={(e) => handleImageChange(e, "logoSidebar")}
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        ref={logoSidebarInputRef}
                      />
                      {logoSidebarPreview ? (
                        <Image
                          src={logoSidebarPreview}
                          alt="Logo sidebar preview"
                          layout="fill"
                          objectFit="contain"
                        />
                      ) : (
                        <div className="text-gray-400 text-xs">50 x 50</div>
                      )}
                    </div>
                  </div>

                  {errors.length > 0 && (
                    <div className="space-y-2">
                      {errors.map((error, index) => (
                        <Alert
                          key={index}
                          variant="destructive"
                          className="relative"
                        >
                          <AlertTitle>Erro de imagem</AlertTitle>
                          <AlertDescription>{error.message}</AlertDescription>
                          <button
                            onClick={() => removeError(error)}
                            className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-300 transition-colors duration-200"
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Fechar</span>
                          </button>
                        </Alert>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Separator className="w-full my-6" />

              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Usuários</h3>
                  <Button
                    type="button"
                    onClick={() =>
                      append({
                        name: "",
                        email: "",
                        password: "",
                        is_blocked: false,
                      })
                    }
                    variant="outline"
                    size="sm"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Adicionar Usuário
                  </Button>
                </div>
                <AnimatePresence>
                  {fields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`mb-4 p-4 rounded-lg ${field.is_blocked ? "bg-red-50" : "bg-gray-50"} transition-colors duration-300`}
                    >
                      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="relative">
                              <User className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                              <Input
                                placeholder="Nome"
                                {...register(`users.${index}.name` as const)}
                                className="pl-10 h-12 text-base"
                              />
                            </div>
                            {formErrors.users?.[index]?.name && (
                              <p className="mt-1 text-sm text-red-600">
                                {formErrors.users[index]?.name?.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <div className="relative">
                              <Mail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                              <Input
                                placeholder="E-mail"
                                {...register(`users.${index}.email` as const)}
                                className="pl-10 h-12 text-base"
                              />
                            </div>
                            {formErrors.users?.[index]?.email && (
                              <p className="mt-1 text-sm text-red-600">
                                {formErrors.users[index]?.email?.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <div className="relative">
                              <Lock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                              <Input
                                placeholder="Senha"
                                type={showPassword ? "text" : "password"}
                                {...register(
                                  `users.${index}.password` as const
                                )}
                                className="pl-10 pr-10 h-12 text-base"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-1/2 right-2 transform -translate-y-1/2"
                                onClick={togglePasswordVisibility}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-5 w-5 text-gray-400" />
                                ) : (
                                  <Eye className="h-5 w-5 text-gray-400" />
                                )}
                                <span className="sr-only">
                                  {showPassword
                                    ? "Hide password"
                                    : "Show password"}
                                </span>
                              </Button>
                            </div>
                            {formErrors.users?.[index]?.password && (
                              <p className="mt-1 text-sm text-red-600">
                                {formErrors.users[index]?.password?.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-end mt-4">
                          <Button
                            type="button"
                            onClick={() => toggleUserBlock(index)}
                            variant="outline"
                            size="sm"
                            className={`
                            flex items-center space-x-2 px-3 py-2
                            text-sm font-medium
                            border border-gray-300
                            rounded-md shadow-sm
                            transition-all duration-300
                            ${
                              field.is_blocked
                                ? "bg-red-100 hover:bg-red-200 text-red-700 hover:text-red-800 border-red-300"
                                : "bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                            }
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                          `}
                          >
                            {field.is_blocked ? (
                              <Lock className="w-4 h-4" aria-hidden="true" />
                            ) : (
                              <Unlock className="w-4 h-4" aria-hidden="true" />
                            )}
                            <span>
                              {field.is_blocked
                                ? "Desbloquear usuário"
                                : "Bloquear usuário"}
                            </span>
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  variant="outline"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting} variant="blue">
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
            <Dialog.Close asChild>
              <button className="absolute top-3 right-3" aria-label="Close">
                <Cross2Icon className="w-6 h-6 text-black" />
              </button>
            </Dialog.Close>
            {isSubmitting && (
              <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#2292EA]" />
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>

      {showCrop && cropImage && (
        <Dialog.Root open={showCrop} onOpenChange={setShowCrop}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
            <Dialog.Content
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg max-w-3xl w-full z-50"
              onInteractOutside={(e) => e.preventDefault()}
            >
              <h2 className="text-2xl font-bold mb-4">Cortar Imagem</h2>
              <div className="mb-4 relative">
                <div
                  className="absolute border-2 border-dashed border-red-500 pointer-events-none"
                  style={{
                    width: `${imageDimensions.width}px`,
                    height: `${imageDimensions.height}px`,
                    maxWidth: "100%",
                    maxHeight: "60vh",
                  }}
                ></div>
                <div className="overflow-auto max-h-[60vh]">
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={cropType === "logo" ? 3 : 1}
                    minWidth={cropType === "logo" ? 300 : 50}
                    minHeight={cropType === "logo" ? 100 : 50}
                    maxWidth={cropType === "logo" ? 300 : 50}
                    maxHeight={cropType === "logo" ? 100 : 50}
                  >
                    <img
                      src={cropImage}
                      alt="Crop"
                      style={{ maxWidth: "100%", maxHeight: "60vh" }}
                    />
                  </ReactCrop>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {cropType === "logo"
                    ? "Tamanho exato: 300x100"
                    : "Tamanho exato: 50x50"}
                </p>
                <div className="flex justify-end gap-4">
                  <Button onClick={handleCloseCropModal} variant="secondary">
                    Cancelar
                  </Button>
                  <Button
                    variant="blue"
                    onClick={handleConfirmCrop}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      "Confirmar"
                    )}
                  </Button>
                </div>
              </div>
              <Dialog.Close asChild>
                <button
                  className="absolute top-2 right-2 p-1"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </Dialog.Root>
  );
}
