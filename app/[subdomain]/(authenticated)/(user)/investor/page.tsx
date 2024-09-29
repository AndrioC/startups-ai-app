import { Briefcase, Construction, Rocket } from "lucide-react";

export default function InvestorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white p-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8 flex justify-center">
          <Construction className="h-24 w-24 text-indigo-500 animate-pulse" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Perfil de Investidor em Desenvolvimento
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Estamos aprimorando sua experiência como investidor. Em breve, você
          terá acesso a ferramentas poderosas para gerenciar seus investimentos
          e descobrir novas oportunidades emocionantes!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex flex-col items-center bg-blue-100 rounded-lg px-4 py-3">
            <Briefcase className="h-8 w-8 text-blue-500 mb-2" />
            <span className="text-blue-700 text-sm">
              Gestão de Investimentos
            </span>
          </div>
          <div className="flex flex-col items-center bg-green-100 rounded-lg px-4 py-3">
            <Rocket className="h-8 w-8 text-green-500 mb-2" />
            <span className="text-green-700 text-sm">
              Descoberta de Startups
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
