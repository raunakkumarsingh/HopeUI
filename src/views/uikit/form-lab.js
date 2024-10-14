import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button, Form, Tab, Nav, Modal } from 'react-bootstrap';
import Card from '../../../src/components/Card';

const Formlab = (props) => {
    const [formFields, setFormFields] = useState([]);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [componentPosition, setComponentPosition] = useState({ index: null, position: null });
    const [selectedComponent, setSelectedComponent] = useState('label & input');
    const [generatedCode, setGeneratedCode] = useState('');

    const componentOptions = ['label', 'label & input', 'input', 'button', 'radio', 'checkbox'];

    useEffect(() => {
        if (props?.onComponentSelect) {
            props.onComponentSelect(selectedComponent);
        }
    }, [selectedComponent, props.onComponentSelect]);

    const addField = (index, position, componentType = 'label & input') => {
        const newField = createNewField(componentType);
        const updatedFields = [...formFields];

        if (position === 'top') {
            updatedFields.splice(index, 0, { components: [newField] });
        } else if (position === 'bottom') {
            updatedFields.splice(index + 1, 0, { components: [newField] });
        } else if (position === 'left' || position === 'right') {
            const row = updatedFields[index];
            if (!row.components) row.components = []; // Ensure components is defined
            if (position === 'left') {
                row.components.unshift(newField);
            } else if (position === 'right') {
                row.components.push(newField);
            }
        } else if (position === 'initial') {
            updatedFields.push({ components: [newField] });
        }

        setFormFields(updatedFields);
        setShowModal(false);
    };

    const createNewField = (type) => {
        const fieldTypes = {
            label: { label: 'Label', type: 'label' },
            'label & input': { label: 'Label & Input', type: 'labelInput' },
            input: { label: 'Input', type: 'input' },
            button: { label: 'Button', type: 'button' },
            radio: { label: 'Radio Button', type: 'radio' },
            checkbox: { label: 'Checkbox', type: 'checkbox' }
        };
        return fieldTypes[type] || fieldTypes.input;
    };

    const renderComponent = (field) => {
        const components = {
            label: <label className="form-label">{field.label}</label>,
            labelInput: (
                <>
                    <label className="form-label">{field.label}</label>
                    <input type="text" className="form-control" />
                </>
            ),
            input: <input type="text" className="form-control" />,
            button: <button className="btn btn-primary">{field.label}</button>,
            radio: <input type="radio" className="form-check-input" />,
            checkbox: <input type="checkbox" className="form-check-input" />
        };
        return components[field.type] || components.input;
    };

    const handleHover = (index) => setHoverIndex(index);
    const handleHoverLeave = () => setHoverIndex(null);
    const handleAddClick = (index, position) => {
        setComponentPosition({ index, position });
        setShowModal(true);
    };

    // Generate Bootstrap responsive code
    const generateCode = () => {
        let code = '<form class="p-4 bg-light rounded">\n';
        formFields.forEach((row, rowIndex) => {
            code += `<div class="row mb-3">\n`;
            const componentsCount = row.components?.length || 0; // Ensure componentsCount is valid

            row.components.forEach((field, index) => {
                code += `  <div class="col-md-${12 / componentsCount}">\n    ${renderComponentCode(field)}\n  </div>\n`;
            });

            code += `</div>\n`;
        });
        code += '</form>';
        setGeneratedCode(code);
    };

    const renderComponentCode = (field) => {
        const componentMap = {
            label: '<label class="form-label">Label</label>',
            labelInput: `<label class="form-label">Label & Input</label><input type="text" class="form-control" />`,
            input: '<input type="text" class="form-control" />',
            button: '<button class="btn btn-primary">Button</button>',
            radio: '<input type="radio" class="form-check-input" />',
            checkbox: '<input type="checkbox" class="form-check-input" />'
        };
        return componentMap[field.type] || componentMap.input;
    };

    // SVG Icon for the "+" button
    const PlusIcon = () => (
        <svg
            width="25"
            height="25"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'inline-block', verticalAlign: 'middle', color: 'currentColor' }}
            className="h-full w-full"
        >
            <g fill="currentColor">
                <path d="M12.75 7a.75.75 0 0 0-1.5 0v4.25H7a.75.75 0 0 0 0 1.5h4.25V17a.75.75 0 0 0 1.5 0v-4.25H17a.75.75 0 0 0 0-1.5h-4.25V7Z" />
            </g>
        </svg>
    );

    return (
        <DndProvider backend={HTML5Backend}>
            <article id="formlab">
                <Card className="iq-document-card p-4">
                    <Tab.Container defaultActiveKey="first">
                        <Nav className="nav-tabs">
                            <Nav.Item>
                                <Nav.Link eventKey="first">Preview</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="second">Code</Nav.Link>
                            </Nav.Item>
                        </Nav>

                        <Tab.Content>
                            <Tab.Pane eventKey="first">
                                <Form>
                                    {formFields.length === 0 && (
                                        <div
                                            className="d-flex justify-content-center align-items-center border"
                                            style={{ height: '200px', border: '1px dashed #ccc' }}
                                        >
                                            <Button
                                                className="btn btn-primary"
                                                onClick={() => addField(0, 'initial', selectedComponent)}
                                            >
                                                <PlusIcon /> Add First Component
                                            </Button>
                                        </div>
                                    )}

                                    {formFields.map((row, rowIndex) => (
                                        <div
                                            key={rowIndex}
                                            className={`mb-3 row position-relative ${hoverIndex === rowIndex ? 'border border-primary' : ''}`}
                                            onMouseEnter={() => handleHover(rowIndex)}
                                            onMouseLeave={handleHoverLeave}
                                        >
                                            {hoverIndex === rowIndex && (
                                                <>
                                                    {['top', 'bottom', 'left', 'right'].map((position) => (
                                                        <span
                                                            key={position}
                                                            className={`position-absolute p-1 ${position === 'top'
                                                                    ? 'top-0 start-50 translate-middle'
                                                                    : position === 'bottom'
                                                                        ? 'top-100 start-50 translate-middle'
                                                                        : position === 'left'
                                                                            ? 'top-50 end-90 translate-middle'
                                                                            : 'top-50 start-100 translate-middle'
                                                                }`}
                                                            style={{ cursor: 'pointer', width: 'fit-content' }}
                                                            onClick={() => handleAddClick(rowIndex, position)}
                                                        >
                                                            <PlusIcon />
                                                        </span>
                                                    ))}
                                                </>
                                            )}

                                            <div className="row">
                                                {row.components?.map((field, index) => (
                                                    <div key={index} className={`col-md-${12 / (row.components.length || 1)}`}>
                                                        {renderComponent(field)}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </Form>
                            </Tab.Pane>

                            <Tab.Pane eventKey="second">
                                <pre>{generatedCode}</pre>
                                <Button onClick={generateCode} className="btn btn-success mt-3">
                                    Generate Code
                                </Button>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </Card>

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Select a Component</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {componentOptions.map((component, idx) => (
                            <Button
                                key={idx}
                                variant="secondary"
                                onClick={() => addField(componentPosition.index, componentPosition.position, component)}
                                className="me-2 mb-2"
                            >
                                {component}
                            </Button>
                        ))}
                    </Modal.Body>
                </Modal>
            </article>
        </DndProvider>
    );
};

export default Formlab;
