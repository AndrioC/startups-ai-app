import { Theme } from "@radix-ui/themes";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import QueryClientProvider from "../QueryClientProvider";

import "@radix-ui/themes/styles.css";
import "@/app/globals.css";
import "@/app/theme-config.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Startups Global Link",
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
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen">
          <QueryClientProvider>
            <Theme>{children}</Theme>
          </QueryClientProvider>
        </main>
      </body>
    </html>
  );
}
