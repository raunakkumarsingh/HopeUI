// FormCanvas.js
import React, { useState } from 'react';
import { useDrop } from 'react-dnd';

const FormCanvas = () => {
  const [droppedFields, setDroppedFields] = useState([]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'form-field',
    drop: (item) => addField(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const addField = (field) => {
    setDroppedFields([...droppedFields, field]);
  };

  return (
    <div
      ref={drop}
      className="form-canvas"
      style={{
        border: '2px dashed #ccc',
        minHeight: '400px',
        padding: '10px',
        backgroundColor: isOver ? '#f0f8ff' : 'white',
      }}
    >
      {droppedFields.length > 0 ? (
        droppedFields.map((field, index) => (
          <div key={index} className="mb-3">
            <label>{field.label}</label>
            <input type={field.type} className="form-control" />
          </div>
        ))
      ) : (
        <p>Drag and drop form elements here</p>
      )}
    </div>
  );
};

export default FormCanvas;
