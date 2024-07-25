"use client";

import { useParams } from "next/navigation";

import RegisterComponent from "@/components/external/register/register-page";

export default function RegisterPage() {
  const teste = useParams();
  console.log(teste);

  return <RegisterComponent />;
}
