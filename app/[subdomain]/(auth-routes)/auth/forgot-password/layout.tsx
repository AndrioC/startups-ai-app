import QueryClientProvider from "@/app/QueryClientProvider";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider>{children}</QueryClientProvider>
      </body>
    </html>
  );
}
