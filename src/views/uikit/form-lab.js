import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button, Form, Tab, Nav, DropdownButton, Dropdown } from 'react-bootstrap';
import Card from '../../../src/components/Card';

const Formlab = () => {
    const [formFields, setFormFields] = useState([]);
    const [selectedFieldIndex, setSelectedFieldIndex] = useState(0);
    const [code, setCode] = useState('');
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, index: null });
    const [selectedComponent, setSelectedComponent] = useState('label & input');

    const componentOptions = ['label', 'label & input', 'input', 'button', 'radio', 'checkbox'];

    const addField = (index, position, componentType = 'label & input') => {
        let newField = createNewField(componentType);

        const updatedFields = [...formFields];
        if (position === 'top') {
            updatedFields.splice(index, 0, newField);
        } else if (position === 'bottom') {
            updatedFields.splice(index + 1, 0, newField);
        } else if (position === 'left') {
            updatedFields[index].leftField = newField;
        } else if (position === 'right') {
            updatedFields[index].rightField = newField;
        }
        setFormFields(updatedFields);
        setContextMenu({ visible: false, x: 0, y: 0, index: null });
    };

    const createNewField = (type) => {
        switch (type) {
            case 'label':
                return { label: 'Label', type: 'label' };
            case 'label & input':
                return { label: 'Label & Input', type: 'labelInput' };
            case 'input':
                return { label: 'Input', type: 'input' };
            case 'button':
                return { label: 'Button', type: 'button' };
            case 'radio':
                return { label: 'Radio Button', type: 'radio' };
            case 'checkbox':
                return { label: 'Checkbox', type: 'checkbox' };
            default:
                return { label: 'Input', type: 'input' };
        }
    };

    const generateCode = () => {
        const generatedCode = formFields
            .map((field) => {
                const leftField = field.leftField
                    ? `<div className="col-auto">
               <label className="form-label">${field.leftField.label}</label>
               ${renderComponentHTML(field.leftField)}
             </div>`
                    : '';
                const rightField = field.rightField
                    ? `<div className="col-auto">
               <label className="form-label">${field.rightField.label}</label>
               ${renderComponentHTML(field.rightField)}
             </div>`
                    : '';
                return `<div className="mb-3 row">
          ${leftField}
          <div className="col">
            ${renderComponentHTML(field)}
          </div>
          ${rightField}
        </div>`;
            })
            .join('');
        setCode(generatedCode);
    };

    const renderComponent = (field) => {
        switch (field.type) {
            case 'label':
                return <label className="form-label" onDoubleClick={() => handleLabelDoubleClick(field)}>{field.label}</label>;
            case 'labelInput':
                return (
                    <>
                        <label className="form-label" onDoubleClick={() => handleLabelDoubleClick(field)}>{field.label}</label>
                        <input type="text" className="form-control" />
                    </>
                );
            case 'input':
                return <input type="text" className="form-control" />;
            case 'button':
                return <button className="btn btn-primary">{field.label}</button>;
            case 'radio':
                return <input type="radio" className="form-check-input" />;
            case 'checkbox':
                return <input type="checkbox" className="form-check-input" />;
            default:
                return <input type="text" className="form-control" />;
        }
    };

    const renderComponentHTML = (field) => {
        switch (field.type) {
            case 'label':
                return `<label class="form-label">${field.label}</label>`;
            case 'labelInput':
                return `<label class="form-label">${field.label}</label><input type="text" class="form-control" />`;
            case 'input':
                return `<input type="text" class="form-control" />`;
            case 'button':
                return `<button class="btn btn-primary">${field.label}</button>`;
            case 'radio':
                return `<input type="radio" class="form-check-input" />`;
            case 'checkbox':
                return `<input type="checkbox" class="form-check-input" />`;
            default:
                return `<input type="text" class="form-control" />`;
        }
    };

    const updateLabel = (index, newLabel) => {
        const updatedFields = [...formFields];
        updatedFields[index].label = newLabel;
        setFormFields(updatedFields);
    };

    const handleLabelDoubleClick = (field) => {
        const newLabel = prompt('Enter new label:', field.label);
        if (newLabel) {
            updateLabel(formFields.indexOf(field), newLabel);
        }
    };

    const handleFieldClick = (index) => {
        setSelectedFieldIndex(index);
    };

    const deleteField = (index) => {
        const updatedFields = formFields.filter((_, idx) => idx !== index);
        setFormFields(updatedFields);
        setSelectedFieldIndex(null);
    };

    const handleRightClick = (event, index) => {
        event.preventDefault();
        setContextMenu({ visible: true, x: event.clientX, y: event.clientY, index });
    };

    const handleAddField = (position) => {
        if (contextMenu.index !== null) {
            addField(contextMenu.index, position, selectedComponent);
        } else if (formFields.length === 0) {
            addField(0, 'bottom', selectedComponent);
        }
    };

    useEffect(() => {
        const handleClickOutside = () => {
            if (contextMenu.visible) {
                setContextMenu({ visible: false, x: 0, y: 0, index: null });
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [contextMenu]);

    return (
        <DndProvider backend={HTML5Backend}>
            <article id="formlab">
                <div className="bd-heading sticky-xl-top align-self-start">
                    <Card>
                        <Card.Body>
                            {componentOptions.map((component, idx) => (
                                <Button
                                    key={idx}
                                    variant="secondary"
                                    onClick={() => setSelectedComponent(component)}
                                    className="me-2"
                                >
                                    {component}
                                </Button>
                            ))}
                            {selectedFieldIndex !== null && (
                                <>
                                    <Button variant="primary" onClick={() => addField(selectedFieldIndex, 'top', selectedComponent)}>Add Above</Button>
                                    <Button variant="primary" onClick={() => addField(selectedFieldIndex, 'bottom', selectedComponent)}>Add Below</Button>
                                    <Button variant="primary" onClick={() => addField(selectedFieldIndex, 'left', selectedComponent)}>Add Left</Button>
                                    <Button variant="primary" onClick={() => addField(selectedFieldIndex, 'right', selectedComponent)}>Add Right</Button>
                                    <Button variant="danger" onClick={() => deleteField(selectedFieldIndex)}>Delete</Button>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </div>

                <Card className="iq-document-card">
                    <Tab.Container defaultActiveKey="first">
                        <Nav className="nav-tabs">
                            <Nav.Item>
                                <Nav.Link eventKey="first">
                                    Preview
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="second">
                                    Code
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>

                        <Tab.Content>
                            <Tab.Pane eventKey="first">
                                <Form>
                                    {formFields.map((field, index) => (
                                        <div 
                                            key={index} 
                                            className={`mb-3 row ${selectedFieldIndex === index ? 'selected-field' : ''}`} 
                                            onClick={() => handleFieldClick(index)}
                                            onContextMenu={(e) => handleRightClick(e, index)}
                                        >
                                            {field.leftField && (
                                                <div className="col-auto">
                                                    {renderComponent(field.leftField)}
                                                </div>
                                            )}
                                            <div className="col">
                                                {renderComponent(field)}
                                            </div>
                                            {field.rightField && (
                                                <div className="col-auto">
                                                    {renderComponent(field.rightField)}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </Form>
                            </Tab.Pane>

                            <Tab.Pane eventKey="second">
                                <pre>{code}</pre>
                                <Button variant="primary" onClick={generateCode}>Generate Code</Button>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </Card>
            </article>

            {contextMenu.visible && (
                <DropdownButton
                    style={{ position: 'absolute', left: contextMenu.x, top: contextMenu.y }}
                    title="Add Field"
                    show
                    onSelect={(e) => handleAddField(e)}
                >
                    <Dropdown.Item eventKey="top">Add Above</Dropdown.Item>
                    <Dropdown.Item eventKey="bottom">Add Below</Dropdown.Item>
                    <Dropdown.Item eventKey="left">Add Left</Dropdown.Item>
                    <Dropdown.Item eventKey="right">Add Right</Dropdown.Item>
                </DropdownButton>
            )}
        </DndProvider>
    );
};

export default Formlab;
