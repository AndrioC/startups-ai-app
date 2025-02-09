import { ToastContainer } from "react-toastify";
import { Theme } from "@radix-ui/themes";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";

import AuthProvider from "@/app/api/auth/Provider";
import QueryClientProvider from "@/app/QueryClientProvider";
import { auth } from "@/auth";
import HeaderExternalStartupComponent from "@/components/external/startup/header";

import "react-toastify/dist/ReactToastify.css";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

type Language = "PT_BR" | "EN";

const getLocaleFromLanguage = (language: Language | undefined): string => {
  switch (language) {
    case "PT_BR":
      return "pt-br";
    case "EN":
      return "en";
    default:
      return "pt-br";
  }
};

export const metadata: Metadata = {
  title: "Startups AI",
  description: "Business platform for Startups with Artificial Intelligence",
  icons: {
    icon: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    return null;
  }

  const locale = getLocaleFromLanguage(session?.user?.language as Language);
  const messages = await import(`@/translation/enterprise/${locale}.json`).then(
    (module) => module.default
  );

  return (
    <AuthProvider session={session}>
      <html lang={locale}>
        <body className={inter.className}>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
              <HeaderExternalStartupComponent
                logoAlt="startup-logo"
                userName={session?.user?.name || ""}
                organizationLogo={session?.user?.logo_img || ""}
              />
              <main className="min-h-screen">
                <QueryClientProvider>
                  <Theme>{children}</Theme>
                  <ToastContainer />
                </QueryClientProvider>
              </main>
            </div>
          </NextIntlClientProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
