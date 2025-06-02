import React, { useState } from "react";
import { useEffect } from "react";
import { getPlayers } from "../services/firebase";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function MatchDayPage() {
  const [players, setPlayers] = useState([]);
  const [field, setField] = useState([]);

  useEffect(() => {
    getPlayers().then(setPlayers);
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newList = Array.from(field);
    const [moved] = players.splice(result.source.index, 1);
    newList.splice(result.destination.index, 0, moved);
    setField(newList);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Día Partido</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="players">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="bg-gray-100 p-4 flex gap-2"
            >
              {players.map((player, index) => (
                <Draggable
                  key={player.id}
                  draggableId={player.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="text-center w-20"
                    >
                      <img
                        src={player.photoURL}
                        className="w-16 h-16 rounded-full border"
                      />
                      <p className="text-sm">{player.name}</p>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default MatchDayPage;
