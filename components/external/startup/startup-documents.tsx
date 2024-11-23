import { Construction, Hammer, HardHat } from "lucide-react";
import { useTranslations } from "next-intl";

export default function StartupDocuments() {
  const t = useTranslations("programForm.documents");
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-white p-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8 flex justify-center">
          <Construction className="h-24 w-24 text-blue-500 animate-pulse" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {t("titleConstruction")}
        </h1>
        <p className="text-xl text-gray-600 mb-8">{t("subtitle")}</p>
        <div className="flex justify-center space-x-4 mb-8">
          <div className="flex items-center bg-yellow-100 rounded-full px-4 py-2">
            <HardHat className="h-6 w-6 text-yellow-500 mr-2" />
            <span className="text-yellow-700">{t("planning")}</span>
          </div>
          <div className="flex items-center bg-green-100 rounded-full px-4 py-2">
            <Hammer className="h-6 w-6 text-green-500 mr-2" />
            <span className="text-green-700">{t("development")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
