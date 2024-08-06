"use client";

import { Fragment, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import axios from "axios";
import { AlertCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

import { Rule } from "@/actions/rules";
import { KanbanDataWithCards } from "@/app/api/kanban/[organization_id]/load-kanbans-by-program-token/route";
import { Button } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../ui/tooltip";

import AddRulesComponent from "./add-rules-component";
import ProfileUpdatedInfo from "./profile-updated-info";

interface Props {
  kanbanData: KanbanDataWithCards[];
  rules: Rule[];
  refetch: () => void;
}

interface Startup {
  id: number;
  name: string;
  profile_filled_percentage: number;
  profile_updated: boolean;
}

export default function KanbanComponent({ kanbanData, rules, refetch }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token } = useParams();
  const [newListTitle, setNewListTitle] = useState("");
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);

  const { data: session } = useSession();

  const addNewList = async () => {
    await fetch(`/api/kanban/${session?.user?.organization_id}/create-kanban`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        program_token: token,
        user_id: session?.user?.id,
        name: newListTitle,
      }),
    });

    setNewListTitle("");
    setIsModalOpen(false);
    refetch();
  };

  const onDragEnd = async (result: any) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    await axios.put(
      `/api/kanban/${session?.user?.organization_id}/move-card-kanban`,
      {
        kanban_card_id: Number(draggableId),
        old_kanban_id: Number(source?.droppableId),
        new_kanban_id: Number(destination?.droppableId),
        new_position: Number(destination?.index),
      }
    );

    refetch();
  };

  return (
    <div className="flex bg-[#FCFCFC] p-5 min-h-screen">
      <div className="flex h-full overflow-x-auto custom-scrollbar">
        <div className="flex gap-4 h-full mb-5 pl-5 pr-5">
          <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragEnd}>
            {kanbanData
              ?.sort((a, b) => a.kanban_position - b.kanban_position)
              .map((list) => (
                <Droppable
                  key={list.kanban_id}
                  droppableId={list.kanban_id.toString()}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`bg-[#F0F2F5] rounded-lg shadow-md w-[300px] max-h-[900px] p-4 ${
                        snapshot.isDraggingOver ? "bg-blue-100" : ""
                      }`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-gray-400 text-[16px] font-bold">
                          {list.kanban_name} - {list.kanban_cards.length}
                        </h3>
                        <AddRulesComponent
                          rules={rules}
                          kanbanData={kanbanData}
                          selectedKanban={list}
                          refetch={refetch}
                        />
                      </div>
                      {list.kanban_cards
                        .sort((a, b) => a.position_value - b.position_value)
                        .map((card, index) => (
                          <Draggable
                            key={card.id}
                            draggableId={card.id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white rounded-md shadow-md w-[250px] h-[60px] mb-3 flex items-center justify-between ${
                                  snapshot.isDragging ? "bg-gray-200" : ""
                                }`}
                              >
                                <div
                                  className="rounded-l-md w-2 h-full"
                                  style={{ backgroundColor: list.kanban_color }}
                                ></div>
                                <div className="flex flex-col w-full p-2">
                                  <div className="flex justify-between items-start mb-2">
                                    <span className="text-gray-700 text-[15px] font-semibold">
                                      {card.startup.name}
                                    </span>
                                    {typeof card.startup
                                      .profile_filled_percentage ===
                                      "number" && (
                                      <span
                                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                          card.startup
                                            .profile_filled_percentage < 50
                                            ? "bg-red-100 text-red-800"
                                            : card.startup
                                                  .profile_filled_percentage <
                                                100
                                              ? "bg-yellow-100 text-yellow-800"
                                              : "bg-green-100 text-green-800"
                                        }`}
                                      >
                                        {Math.round(
                                          card.startup.profile_filled_percentage
                                        )}
                                        %
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex justify-end">
                                    {card.startup.profile_updated && (
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger>
                                            <AlertCircle
                                              className="h-5 w-5 text-red-500 cursor-pointer"
                                              onClick={() => {
                                                setSelectedStartup(
                                                  card.startup as Startup
                                                );
                                                setIsUpdateModalOpen(true);
                                              }}
                                            />
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Informações atualizadas</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
          </DragDropContext>
          <ProfileUpdatedInfo
            isOpen={isUpdateModalOpen}
            setIsOpen={setIsUpdateModalOpen}
            selectedStartup={selectedStartup}
            refetch={refetch}
          />
        </div>
      </div>

      <div className="flex flex-col ml-2">
        <Button
          className="bg-[#F5F7FA] w-[160px] text-[#747D8C] px-4 py-2 rounded-lg shadow-md mb-4 hover:bg-[#eaebec]"
          onClick={() => setIsModalOpen(true)}
        >
          + Adicionar nova lista
        </Button>
      </div>

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsModalOpen(false)}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto custom-scrollbar">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Adicionar nova lista
                  </DialogTitle>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={newListTitle}
                      onChange={(e) => setNewListTitle(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md"
                      placeholder="Título da lista"
                    />
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={addNewList}
                    >
                      Adicionar Lista
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center ml-4 px-4 py-2 text-sm text-gray-700 font-medium border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isCardModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsCardModalOpen(false)}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />
          </TransitionChild>
        </Dialog>
      </Transition>
    </div>
  );
}
