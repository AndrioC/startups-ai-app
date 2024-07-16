"use client";

import { Fragment, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Dialog, Transition } from "@headlessui/react";
import { v4 as uuidv4 } from "uuid";

interface Card {
  id: string;
  title: string;
}

interface List {
  id: string;
  title: string;
  cards: Card[];
}

export default function Page() {
  const [lists, setLists] = useState<List[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [activeListId, setActiveListId] = useState<string | null>(null);

  const addNewList = () => {
    if (newListTitle.trim()) {
      const newList: List = {
        id: uuidv4(),
        title: newListTitle,
        cards: [],
      };
      setLists([...lists, newList]);
      setNewListTitle("");
      setIsModalOpen(false);
    }
  };

  const openCardModal = (listId: string) => {
    setActiveListId(listId);
    setIsCardModalOpen(true);
  };

  const addNewCard = () => {
    if (newCardTitle.trim() && activeListId) {
      const updatedLists = lists.map((list) => {
        if (list.id === activeListId) {
          const newCard: Card = {
            id: uuidv4(),
            title: newCardTitle,
          };
          return { ...list, cards: [...list.cards, newCard] };
        }
        return list;
      });
      setLists(updatedLists);
      setNewCardTitle("");
      setIsCardModalOpen(false);
    }
  };

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      // Movendo dentro da mesma lista
      const list = lists.find((list) => list.id === source.droppableId);
      if (list) {
        const newCards = Array.from(list.cards);
        const [movedCard] = newCards.splice(source.index, 1);
        newCards.splice(destination.index, 0, movedCard);

        const updatedLists = lists.map((l) =>
          l.id === list.id ? { ...l, cards: newCards } : l
        );
        setLists(updatedLists);
      }
    } else {
      // Movendo entre listas diferentes
      const sourceList = lists.find((list) => list.id === source.droppableId);
      const destinationList = lists.find(
        (list) => list.id === destination.droppableId
      );

      if (sourceList && destinationList) {
        const sourceCards = Array.from(sourceList.cards);
        const [movedCard] = sourceCards.splice(source.index, 1);
        const destinationCards = Array.from(destinationList.cards);
        destinationCards.splice(destination.index, 0, movedCard);

        const updatedLists = lists.map((l) => {
          if (l.id === sourceList.id) {
            return { ...l, cards: sourceCards };
          }
          if (l.id === destinationList.id) {
            return { ...l, cards: destinationCards };
          }
          return l;
        });
        setLists(updatedLists);
      }
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F5F7FA] p-5">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md"
        onClick={() => setIsModalOpen(true)}
      >
        + Adicionar nova lista
      </button>

      <div className="flex flex-wrap mt-10 gap-4">
        <DragDropContext onDragEnd={onDragEnd}>
          {lists.map((list) => (
            <Droppable key={list.id} droppableId={list.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-[#F0F2F5] rounded-lg shadow-md w-[275px] p-4"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-gray-700 text-[16px] font-bold">
                      {list.title} ({list.cards.length})
                    </h3>
                    <button>
                      <img
                        src="/path/to/three-dots-icon.png"
                        alt="Menu"
                        className="h-5 w-5"
                      />
                    </button>
                  </div>
                  {list.cards.map((card, index) => (
                    <Draggable
                      key={card.id}
                      draggableId={card.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white rounded-md shadow-md w-[250px] h-[60px] mb-3 flex items-center p-2"
                        >
                          <span className="text-gray-700 text-[15px]">
                            {card.title}
                          </span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <button
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
                    onClick={() => openCardModal(list.id)}
                  >
                    + Adicionar Card
                  </button>
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>

      {/* Modal para adicionar nova lista */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Adicionar nova lista
                  </Dialog.Title>
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
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600"
                      onClick={addNewList}
                    >
                      Salvar
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Modal para adicionar novo card */}
      <Transition appear show={isCardModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsCardModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Adicionar novo card
                  </Dialog.Title>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={newCardTitle}
                      onChange={(e) => setNewCardTitle(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md"
                      placeholder="Título do card"
                    />
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600"
                      onClick={addNewCard}
                    >
                      Salvar
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
