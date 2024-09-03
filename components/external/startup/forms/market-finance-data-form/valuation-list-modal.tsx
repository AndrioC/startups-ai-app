import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import ValuationViewer from "./valuation-viewer";

interface Valuation {
  id: string;
  name: string;
  createdAt: string;
  value: string;
}

const mockValuations: Valuation[] = [
  {
    id: "1",
    name: "Valuation 1",
    createdAt: "10/03/2024",
    value: "$1,000,000",
  },
  {
    id: "2",
    name: "Valuation 2",
    createdAt: "11/03/2024",
    value: "$1,200,000",
  },
  {
    id: "3",
    name: "Valuation 3",
    createdAt: "12/03/2024",
    value: "$1,500,000",
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ValuationListModal({ isOpen, onClose }: Props) {
  const [selectedValuation, setSelectedValuation] = useState<Valuation | null>(
    null
  );

  const handleValuationClick = (valuation: Valuation) => {
    setSelectedValuation(valuation);
  };

  const handleBack = () => {
    setSelectedValuation(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {selectedValuation ? "Visualizar Valuation" : "Valuations Gerados"}
          </DialogTitle>
        </DialogHeader>
        {selectedValuation ? (
          <ValuationViewer valuation={selectedValuation} onBack={handleBack} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead>Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockValuations.map((valuation) => (
                <TableRow
                  key={valuation.id}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleValuationClick(valuation)}
                >
                  <TableCell>{valuation.name}</TableCell>
                  <TableCell>{valuation.createdAt}</TableCell>
                  <TableCell>{valuation.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}
