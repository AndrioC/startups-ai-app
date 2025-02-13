import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const cookieStore = cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "pt";

  const newLocale = locale === "pt" ? "pt-br" : locale;

  return {
    locale,
    messages: (await import(`../translation/${newLocale}.json`)).default,
    timeZone: "America/Sao_Paulo",
    defaultLocale: "pt",
    locales: ["pt", "en"],
  };
});
