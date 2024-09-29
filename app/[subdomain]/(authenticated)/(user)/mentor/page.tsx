import { Calendar, Construction, Lightbulb, Users } from "lucide-react";

export default function MentorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-yellow-50 via-orange-50 to-white p-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8 flex justify-center">
          <Construction className="h-24 w-24 text-orange-500 animate-pulse" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Página de Mentor em Construção
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Estamos desenvolvendo uma plataforma incrível para você compartilhar
          seu conhecimento e orientar startups promissoras. Sua experiência será
          fundamental para o sucesso de empreendedores inovadores!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex flex-col items-center bg-yellow-100 rounded-lg px-4 py-3 transform transition-all hover:scale-105">
            <Lightbulb className="h-8 w-8 text-yellow-500 mb-2" />
            <span className="text-yellow-700 text-sm">
              Compartilhe Insights
            </span>
          </div>
          <div className="flex flex-col items-center bg-orange-100 rounded-lg px-4 py-3 transform transition-all hover:scale-105">
            <Users className="h-8 w-8 text-orange-500 mb-2" />
            <span className="text-orange-700 text-sm">Oriente Startups</span>
          </div>
          <div className="flex flex-col items-center bg-red-100 rounded-lg px-4 py-3 transform transition-all hover:scale-105">
            <Calendar className="h-8 w-8 text-red-500 mb-2" />
            <span className="text-red-700 text-sm">Agende Sessões</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 overflow-hidden">
          <div className="bg-orange-600 h-full rounded-full w-4/5 animate-pulse"></div>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Progresso estimado: 80% concluído
        </p>
        <div className="bg-orange-100 rounded-lg p-4 shadow-md">
          <p className="text-orange-800 font-medium">
            Sua jornada como mentor está prestes a começar! Prepare-se para
            inspirar e guiar a próxima geração de empreendedores.
          </p>
        </div>
      </div>
    </div>
  );
}
