import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button, Form, Tab, Nav, Modal } from 'react-bootstrap';
import Card from '../../../src/components/Card';

const Formlab = () => {
    const [formFields, setFormFields] = useState([]);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [componentPosition, setComponentPosition] = useState({ index: null, position: null });
    const [selectedComponent, setSelectedComponent] = useState('label & input');

    const componentOptions = ['label', 'label & input', 'input', 'button', 'radio', 'checkbox'];

    const addField = (index, position, componentType = 'label & input') => {
        const newField = createNewField(componentType);

        const updatedFields = [...formFields];
        if (position === 'top') {
            updatedFields.splice(index, 0, newField);
        } else if (position === 'bottom') {
            updatedFields.splice(index + 1, 0, newField);
        } else if (position === 'left') {
            updatedFields[index].leftField = newField;
        } else if (position === 'right') {
            updatedFields[index].rightField = newField;
        } else if (position === 'initial') {
            updatedFields.push(newField);
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
                <Card className="iq-document-card">
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

                                    {formFields.map((field, index) => (
                                        <div
                                            key={index}
                                            className={`mb-3 row position-relative ${hoverIndex === index ? 'border border-primary' : ''}`}
                                            onMouseEnter={() => handleHover(index)}
                                            onMouseLeave={handleHoverLeave}
                                        >
                                            {hoverIndex === index && (
    <>
        {['top', 'bottom', 'left', 'right'].map((position) => (
            <span
                key={position}
                className={`position-absolute p-1 ${
                    position === 'top'
                        ? 'top-0 start-50 translate-middle'
                        : position === 'bottom'
                        ? 'top-100 start-50 translate-middle'
                        : position === 'left'
                        ? 'top-50 end-90 translate-middle'
                        : 'top-50 start-100 translate-middle'
                }`}
                style={{ cursor: 'pointer', width: 'fit-content' }}
                onClick={() => handleAddClick(index, position)}
            >
                <PlusIcon />
            </span>
        ))}
    </>
)}

                                            <div className="row">
                                                {field.leftField && (
                                                    <div className="col-6">{renderComponent(field.leftField)}</div>
                                                )}
                                                <div className={field.leftField && field.rightField ? 'col-6' : 'col'}>
                                                    {renderComponent(field)}
                                                </div>
                                                {field.rightField && (
                                                    <div className="col-6">{renderComponent(field.rightField)}</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </Form>
                            </Tab.Pane>

                            <Tab.Pane eventKey="second">
                                <pre>{/* Insert code generation logic here */}</pre>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </Card>

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Select Component to Add</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {componentOptions.map((component, idx) => (
                            <Button
                                key={idx}
                                variant="secondary"
                                onClick={() =>
                                    addField(componentPosition.index, componentPosition.position, component)
                                }
                                className="me-2"
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
