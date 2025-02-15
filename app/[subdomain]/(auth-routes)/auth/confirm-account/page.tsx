"use client";

import { useParams } from "next/navigation";

import { ConfirmAccount } from "@/components/external/confirm-account/confirm-account";

export default function Page() {
  const params = useParams();
  const subdomain = params.subdomain as string;

  return <ConfirmAccount subdomain={subdomain} />;
}
