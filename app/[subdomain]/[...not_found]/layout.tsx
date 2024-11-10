export const metadata = {
  title: "Startups AI",
  icons: {
    icon: "/favicon.svg",
  },
};

import "@/app/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
