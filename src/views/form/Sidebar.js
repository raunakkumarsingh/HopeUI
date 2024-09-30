// Sidebar.js
import React from 'react';
import FormField from './FormField';

const Sidebar = () => {
  const fields = [
    { label: 'Input', type: 'text' },
    { label: 'Button', type: 'button' },
    { label: 'Checkbox', type: 'checkbox' },
    { label: 'Radio Button', type: 'radio' },
  ];

  return (
    <div className="sidebar">
      <h4>Form Elements</h4>
      {fields.map((field, index) => (
        <FormField key={index} label={field.label} type={field.type} />
      ))}
    </div>
  );
};

export default Sidebar;
