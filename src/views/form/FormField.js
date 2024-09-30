// FormField.js
import React from 'react';
import { useDrag } from 'react-dnd';

const FormField = ({ label, type }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'form-field',
    item: { label, type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`form-field-item ${isDragging ? 'dragging' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}
    >
      <label>{label}</label>
      <input type={type} disabled className="form-control mt-1" />
    </div>
  );
};

export default FormField;
