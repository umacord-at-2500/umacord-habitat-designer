// src/App.jsx
import React, { useState, useRef, useCallback } from "react";
import "./App.css";

const GRID_SIZE = 10; // 10x10 grid
const CELL_SIZE = 50; // 50px per cell

const DraggableGrid = () => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [items, setItems] = useState([
    { id: 1, x: 2, y: 3, width: 1, height: 1, name: "farm", color: '#ff2727ff' },
    { id: 2, x: 5, y: 5, width: 2, height: 1, name: "death", color: '#4ecdc4' },
    { id: 3, x: 7, y: 1, width: 2, height: 2, name: "minecraft", color: '#45b7d1' }
  ]);

  const gridRef = useRef(null);

  const getGridPosition = useCallback((relativeX, relativeY) => {
    if (!gridRef.current) return { x: 0, y: 0 };

    const gridRect = gridRef.current.getBoundingClientRect();
    
    const gridX = Math.floor(relativeX / CELL_SIZE);
    const gridY = Math.floor(relativeY / CELL_SIZE);

    // Constrain to grid boundaries
    return {
      x: Math.max(0, Math.min(GRID_SIZE - 1, gridX)),
      y: Math.max(0, Math.min(GRID_SIZE - 1, gridY)),
    };
  }, []);

  const handleDragStart = (e, item) => {
    const gridRect = gridRef.current.getBoundingClientRect();
    const itemRect = e.target.getBoundingClientRect();

    // Distance from the item's top-left corner to the cursor
    const offsetX = e.clientX - itemRect.left;
    const offsetY = e.clientY - itemRect.top;

    setDragOffset({ x: offsetX, y: offsetY });
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

    const gridRect = gridRef.current.getBoundingClientRect();
    const relativeX = e.clientX - gridRect.left - dragOffset.x;
    const relativeY = e.clientY - gridRect.top - dragOffset.y;

    const newPosition = getGridPosition(relativeX, relativeY);
    
    setItems(prevItems => 
      prevItems.map(item => 
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
      width: horizontalDim,
      height: verticalDim,
      name: colourType,
      color: colour
    };
    setItems((prev) => [...prev, newItem]);
  };

  const clearAll = () => {
    setItems([]);
  };

  const [horizontalDim, setHorizontalDim] = useState('1');
  const [verticalDim, setVerticalDim] = useState('1');
  const [colourType, setColourType] = useState('food storage');

  const colourFromType = (colourType) => {
    // Example transformation: convert to uppercase and add a suffix
    if (colourType == "food storage" ) {
      return "#ff2727ff"
    }
    else if (colourType == "waste management" ) {
      return "#ff9a27ff"
    }
    else if (colourType == "communication" ) {
      return "#f1ff27ff"
    }
    else if (colourType == "farm" ) {
      return "#40ff27ff"
    }
    else if (colourType == "resting bay" ) {
      return "#2793ffff"
    }
    return "#8827ffff"
  };

  const colour = colourFromType(colourType);


  
  const handleDoubleClick = (item) => {
    return () => {
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    };
  };

  return (
    <div className="app">
      <h1>Umacord at 25:00</h1>

      <div className="controls">
        <button onClick={addNewSquare}>Add Square</button>
        <label>
          Horizontal dimension:
        </label>
        <select
          value={horizontalDim}
          onChange={e => setHorizontalDim(e.target.value)}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
        </select>
        <label>
          Vertical dimension:
        </label>
        <select
          value={verticalDim}
          onChange={e => setVerticalDim(e.target.value)}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
        </select>
        <label>
          Type:
        </label>
        <select
          value={colourType}
          onChange={e => setColourType(e.target.value)}>
          <option value="food storage">food storage</option>
          <option value="waste management">waste management</option>
          <option value="communication">communication</option>
          <option value="farm">farm</option>
          <option value="resting bay">resting bay</option>
          <option value="entertainment">entertainment</option>
        </select>

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
              {item.name}
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
                {item.name} area of {item.width} x {item.height} at position ({item.x}, {item.y})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DraggableGrid;
