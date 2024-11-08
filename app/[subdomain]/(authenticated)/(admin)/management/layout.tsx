import { ToastContainer } from "react-toastify";
import { Theme } from "@radix-ui/themes";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import AuthProvider from "@/app/api/auth/Provider";
import QueryClientProvider from "@/app/QueryClientProvider";
import { auth } from "@/auth";
import SideBar from "@/components/sidebar";

import "react-toastify/dist/ReactToastify.css";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

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

  return (
    <AuthProvider session={session}>
      <html lang="en" className="h-full">
        <body className={`${inter.className} h-full`}>
          <QueryClientProvider>
            <Theme>
              <SideBar>{children}</SideBar>
              <ToastContainer />
            </Theme>
          </QueryClientProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
