// src/App.jsx
import React, { useState, useRef, useCallback } from "react";
import "./App.css";

const GRID_SIZE = 10; // 10x10 grid
const CELL_SIZE = 50; // 50px per cell

const DraggableGrid = () => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [items, setItems] = useState([
    { id: 1, x: 2, y: 3, width: 1, height: 1, name: "farm", color: "#ff6b6b" },
    { id: 2, x: 5, y: 5, width: 2, height: 1, name: "death", color: "#4ecdc4" },
    {
      id: 3,
      x: 7,
      y: 1,
      width: 2,
      height: 2,
      name: "minecraft",
      color: "#45b7d1",
    },
  ]);

  const gridRef = useRef(null);

  const getGridPosition = useCallback((clientX, clientY) => {
    if (!gridRef.current) return { x: 0, y: 0 };

    const gridRect = gridRef.current.getBoundingClientRect();
    const relativeX = clientX - gridRect.left;
    const relativeY = clientY - gridRect.top;

    const gridX = Math.floor(relativeX / CELL_SIZE);
    const gridY = Math.floor(relativeY / CELL_SIZE);

    // Constrain to grid boundaries
    return {
      x: Math.max(0, Math.min(GRID_SIZE - 1, gridX)),
      y: Math.max(0, Math.min(GRID_SIZE - 1, gridY)),
    };
  }, []);

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.setData("text/plain", ""); // Required for Firefox
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e) => {
    e.preventDefault();

    if (!draggedItem) return;

    const newPosition = getGridPosition(e.clientX, e.clientY);

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === draggedItem.id
          ? { ...item, x: newPosition.x, y: newPosition.y }
          : item
      )
    );

    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const addNewSquare = () => {
    const newItem = {
      id: Date.now(),
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      name: "new",
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const clearAll = () => {
    setItems([]);
  };

  const handleDoubleClick = (item) => {
    return () => {
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    };
  };

  return (
    <div className="app">
      <h1>Draggable Grid</h1>

      <div className="controls">
        <button onClick={addNewSquare}>Add Square</button>
        <button onClick={clearAll}>Clear All</button>
        <span className="hint">
          Drag and drop squares to move them around the grid
        </span>
      </div>

      <div
        ref={gridRef}
        className="grid"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
        }}
      >
        {/* Render grid cells */}
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);
          return (
            <div key={index} className="grid-cell" data-x={x} data-y={y} />
          );
        })}

        {/* Render draggable items */}
        {items.map((item) => (
          <div
            key={item.id}
            className="draggable-item"
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            onDragEnd={handleDragEnd}
            onDoubleClick={handleDoubleClick(item)}
            style={{
              gridColumn: `${item.x + 1} / span ${item.width}`,
              gridRow: `${item.y + 1} / span ${item.height}`,
              backgroundColor: item.color,
            }}
          >
            <span className="item-coordinates">
              {item.x},{item.y}
            </span>
          </div>
        ))}
      </div>

      <div className="items-list">
        <h3>Items on Grid:</h3>
        {items.length === 0 ? (
          <p>No items on grid. Click "Add Square" to add one.</p>
        ) : (
          <ul>
            {items.map((item) => (
              <li key={item.id} style={{ color: item.color }}>
                Square at position ({item.x}, {item.y})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DraggableGrid;
