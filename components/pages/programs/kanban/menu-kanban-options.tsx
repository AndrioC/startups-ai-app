import React from "react";
import { useTranslations } from "next-intl";

interface Props {
  onMove: () => void;
  onCreateRules: () => void;
  onDelete: () => void;
}

const MenuKanbanPopover = ({ onMove, onCreateRules, onDelete }: Props) => {
  const t = useTranslations(
    "admin.programs.programStartupTab.menuKanbanPopover"
  );

  return (
    <div className="absolute z-10 right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden">
      <div
        className="py-1 px-3 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
        onClick={onMove}
      >
        {t("moveList")}
      </div>
      <div
        className="py-1 px-3 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
        onClick={onCreateRules}
      >
        {t("createRules")}
      </div>
      <div
        className="py-1 px-3 hover:bg-red-100 cursor-pointer text-sm text-red-600"
        onClick={onDelete}
      >
        {t("delete")}
      </div>
    </div>
  );
};

export default MenuKanbanPopover;
