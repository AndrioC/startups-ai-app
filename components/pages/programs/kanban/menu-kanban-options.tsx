interface Props {
  onMove: () => void;
  onCreateRules: () => void;
  onDelete: () => void;
}

const MenuKanbanPopover = ({ onMove, onCreateRules, onDelete }: Props) => {
  return (
    <div className="absolute z-10 right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden">
      <div
        className="py-1 px-3 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
        onClick={onMove}
      >
        Mover lista
      </div>
      <div
        className="py-1 px-3 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
        onClick={onCreateRules}
      >
        Criar regras
      </div>
      <div
        className="py-1 px-3 hover:bg-red-100 cursor-pointer text-sm text-red-600"
        onClick={onDelete}
      >
        Excluir
      </div>
    </div>
  );
};

export default MenuKanbanPopover;
