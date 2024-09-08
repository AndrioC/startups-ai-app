"use client";

import { useParams } from "next/navigation";

import { LoginComponent } from "@/components/external/login/login-page";

export default function Login() {
  const params = useParams();
  const subdomain = params.subdomain as string;

  return <LoginComponent subdomain={subdomain} />;
}
