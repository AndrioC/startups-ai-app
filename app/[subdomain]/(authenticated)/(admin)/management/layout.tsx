import { ToastContainer } from "react-toastify";
import { Theme } from "@radix-ui/themes";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";

import AuthProvider from "@/app/api/auth/Provider";
import QueryClientProvider from "@/app/QueryClientProvider";
import { auth } from "@/auth";
import SideBar from "@/components/sidebar";

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
  const messages = await import(`@/translation/admin/${locale}.json`).then(
    (module) => module.default
  );

  return (
    <AuthProvider session={session}>
      <html lang={locale} className="h-full">
        <body className={`${inter.className} h-full`}>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <QueryClientProvider>
              <Theme>
                <SideBar>{children}</SideBar>
                <ToastContainer />
              </Theme>
            </QueryClientProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
