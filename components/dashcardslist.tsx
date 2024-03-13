import { BsPeople } from "react-icons/bs";
import { IoBusinessOutline, IoWalletOutline } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";

import DashCard from "./dashcard";

interface DashCount {
  startupsCount: number;
  investorsCount: number;
  expertsCount: number;
  companiesCount: number;
}

interface Props {
  dashCount: DashCount;
}
export default function DashCardsList({ dashCount }: Props) {
  return (
    <div>
      <div className="p-10 px-32">
        <h1 className="text-2xl font-normal">IFIA - ABIPIR PROGRAM</h1>
        <h2 className="text-lg font-normal">ESTATÍSTICAS DO PROGRAMA</h2>
      </div>
      <div className="grid lg:grid-cols-4 gap-4 p-10 px-32 md:grid-cols-2">
        <DashCard
          icon={<RxDashboard />}
          title="Startups"
          value={dashCount.startupsCount}
          bgClassName="bg-purple-200"
          iconClassName="text-purple-500"
        />
        <DashCard
          icon={<IoWalletOutline />}
          title="Investidores"
          value={dashCount.investorsCount}
          bgClassName="bg-yellow-200"
          iconClassName="text-yellow-500"
        />
        <DashCard
          icon={<BsPeople />}
          title="Experts"
          value={dashCount.expertsCount}
          bgClassName="bg-green-200"
          iconClassName="text-green-500"
        />
        <DashCard
          icon={<IoBusinessOutline />}
          title="Empresas"
          value={dashCount.companiesCount}
          bgClassName="bg-blue-200"
          iconClassName="text-blue-500"
        />
      </div>
    </div>
  );
}
