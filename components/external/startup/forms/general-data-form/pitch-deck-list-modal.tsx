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

import PitchdeckViewer from "./pitch-deck-viewer";

interface Pitchdeck {
  id: string;
  name: string;
  createdAt: string;
}

const mockPitchdecks: Pitchdeck[] = [
  { id: "1", name: "Pitchdeck 1", createdAt: "10/03/2024" },
  { id: "2", name: "Pitchdeck 2", createdAt: "11/03/2024" },
  { id: "3", name: "Pitchdeck 3", createdAt: "12/03/2024" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function PitchdeckListModal({ isOpen, onClose }: Props) {
  const [selectedPitchdeck, setSelectedPitchdeck] = useState<Pitchdeck | null>(
    null
  );

  const handlePitchdeckClick = (pitchdeck: Pitchdeck) => {
    setSelectedPitchdeck(pitchdeck);
  };

  const handleBack = () => {
    setSelectedPitchdeck(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {selectedPitchdeck ? "Visualizar Pitchdeck" : "Pitchdecks Gerados"}
          </DialogTitle>
        </DialogHeader>
        {selectedPitchdeck ? (
          <PitchdeckViewer pitchdeck={selectedPitchdeck} onBack={handleBack} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Data de Criação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPitchdecks.map((pitchdeck) => (
                <TableRow
                  key={pitchdeck.id}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handlePitchdeckClick(pitchdeck)}
                >
                  <TableCell>{pitchdeck.name}</TableCell>
                  <TableCell>{pitchdeck.createdAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}
