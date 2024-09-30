import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ItemTypes = {
  FORM_FIELD: 'formField',
};

const FormField = ({ field, index, moveField, handleDoubleClick }) => {
  const [, ref] = useDrag({
    type: ItemTypes.FORM_FIELD,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemTypes.FORM_FIELD,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveField(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} className="mb-3 row">
      <div className="col">
        {field.leftField && (
          <div>
            <label
              className="form-label"
              onDoubleClick={() => handleDoubleClick(index, 'left')}
            >
              {field.leftField.label}
            </label>
            <input type={field.leftField.type} className="form-control" />
          </div>
        )}
      </div>
      <div className="col">
        <label
          className="form-label"
          onDoubleClick={() => handleDoubleClick(index)}
        >
          {field.label}
        </label>
        <input type={field.type} className="form-control" />
      </div>
      <div className="col">
        {field.rightField && (
          <div>
            <label
              className="form-label"
              onDoubleClick={() => handleDoubleClick(index, 'right')}
            >
              {field.rightField.label}
            </label>
            <input type={field.rightField.type} className="form-control" />
          </div>
        )}
      </div>
    </div>
  );
};

export default FormField;
