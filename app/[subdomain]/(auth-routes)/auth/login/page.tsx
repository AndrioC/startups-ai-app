"use client";

import { useParams, usePathname } from "next/navigation";

import LoginComponent from "@/components/external/login/login-page";

export default function Login() {
  const teste = useParams();
  const teste2 = usePathname();

  console.log("teste", teste);
  console.log("teste2", teste2);
  return <LoginComponent />;
}
