import { ToastContainer } from "react-toastify";
import { Theme } from "@radix-ui/themes";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { redirect } from "next/navigation";

import QueryClientProvider from "@/app/QueryClientProvider";
import { auth } from "@/auth";
import SideBar from "@/components/sidebar";

import AuthProvider from "../api/auth/Provider";

import "react-toastify/dist/ReactToastify.css";
import "../../styles/custom.css";
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
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <AuthProvider>
      <html lang="en">
        <body className={inter.className}>
          <main className="min-h-screen">
            <QueryClientProvider>
              <SideBar>
                <Theme>{children}</Theme>
                <ToastContainer />
              </SideBar>
            </QueryClientProvider>
          </main>
        </body>
      </html>
    </AuthProvider>
  );
}
