import { ToastContainer } from "react-toastify";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import QueryClientProvider from "@/app/QueryClientProvider";

import "react-toastify/dist/ReactToastify.css";
import "@/styles/custom.css";
import "@/styles/global.css";
import "@/app/globals.css";
import "@/app/theme-config.css";

export const metadata = {
  title: "Startups AI",
  icons: {
    icon: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <QueryClientProvider>
            <main>{children}</main>
            <ToastContainer />
          </QueryClientProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
