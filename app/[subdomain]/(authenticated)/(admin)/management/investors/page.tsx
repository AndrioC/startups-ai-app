import { Construction, TrendingUp, Users } from "lucide-react";

export default function InvestorsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8 flex justify-center">
          <Construction className="h-24 w-24 text-blue-500 animate-pulse" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Página de Investidores em Construção
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Estamos trabalhando para trazer a você uma experiência excepcional de
          conexão com startups inovadoras. Em breve, você terá acesso a
          oportunidades de investimento únicas!
        </p>
        <div className="flex justify-center space-x-4 mb-8">
          <div className="flex items-center bg-blue-100 rounded-full px-4 py-2">
            <TrendingUp className="h-6 w-6 text-blue-500 mr-2" />
            <span className="text-blue-700">Oportunidades de Investimento</span>
          </div>
          <div className="flex items-center bg-green-100 rounded-full px-4 py-2">
            <Users className="h-6 w-6 text-green-500 mr-2" />
            <span className="text-green-700">Networking</span>
          </div>
        </div>
      </div>
    </div>
  );
}
