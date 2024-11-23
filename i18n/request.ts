import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const cookieStore = cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "pt-br";

  return {
    locale,
    messages: (await import(`../translation/${locale}.json`)).default,
    timeZone: "America/Sao_Paulo",
    defaultLocale: "pt-br",
    locales: ["pt-br", "en"],
  };
});
