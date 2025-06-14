"use server";
import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const lang = cookies().get("lang")?.value ?? "en";
  console.log("Resolved locale:", lang);

  return {
    locale: lang,
    messages: (await import(`../../messages/${lang}.json`)).default,
  };
});