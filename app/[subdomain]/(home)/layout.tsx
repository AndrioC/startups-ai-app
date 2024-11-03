import type { Metadata } from "next";
import { Inter } from "next/font/google";

import QueryClientProvider from "@/app/QueryClientProvider";

import "react-toastify/dist/ReactToastify.css";
import "@/styles/custom.css";
import "@/styles/global.css";
import "@/app/globals.css";
import "@/app/theme-config.css";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Startups AI",
    icons: {
      icon: "/favicon.svg",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider>{children}</QueryClientProvider>
      </body>
    </html>
  );
}
