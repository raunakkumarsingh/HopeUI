import React, { useState, useEffect } from 'react';
import { Col, Row, Form } from 'react-bootstrap';
import Formlab from '../uikit/form-lab';
import './form.css';

// First Section Component (File List)
const FileList = ({ onFileClick }) => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        // Mocking file names fetch
        setFiles(['file1.html', 'file2.html', 'file3.html']);
    }, []);

    return (
        <div className="file-list">
            <h5>Files</h5>
            <ul>
                {files.map((file, index) => (
                    <li key={index} onClick={() => onFileClick(file)}>{file}</li>
                ))}
            </ul>
        </div>
    );
};

// Third Section (Design Panel)
const DesignPanel = ({ formValues, onComponentChange }) => {

  const handleChange = (e) => {
      const { name, value } = e.target;
      onComponentChange(prev => ({ ...prev, [name]: value }));
  };

  return (
      <div className="design-panel">
          <h5>Design Panel</h5>
          <Form>
              <Form.Group className="mb-3">
                  <Form.Label>Label</Form.Label>
                  <Form.Control name="label" value={formValues.label} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                  <Form.Label>Class</Form.Label>
                  <Form.Control name="class" value={formValues.class} onChange={handleChange} placeholder='Enter class name with spaces'/>
              </Form.Group>
              <Form.Group className="mb-3">
                  <Form.Label>Color</Form.Label>
                  <Form.Control type="color" name="color" value={formValues.color} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                  <Form.Label>Height</Form.Label>
                  <Form.Control name="height" value={formValues.height} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                  <Form.Label>Width</Form.Label>
                  <Form.Control name="width" value={formValues.width} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                  <Form.Label>ID</Form.Label>
                  <Form.Control name="id" value={formValues.id} onChange={handleChange} placeholder='ID should be unique'/>
              </Form.Group>
          </Form>
      </div>
  );
};

// Main Forms Component
const Forms = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [componentData, setComponentData] = useState({
        label: '',
        class: '',
        color: '',
        height: '',
        width: '',
        id: '',
    });

    const handleFileClick = (file) => {
        console.log(`Fetching details for ${file}`);
        setSelectedFile(file);
    };

    const handleComponentChange = (updatedComponent) => {
        setComponentData(updatedComponent); // Real-time data update
    };

    return (
        <div className="app-container p-4">
            <Row noGutters>
                {/* First Section: File List */}
                <Col md={3} className="file-section">
                    <FileList onFileClick={handleFileClick} />
                </Col>

                {/* Second Section: Design Form */}
                <Col md={6} className="form-section">
                    <Formlab onComponentSelect={setSelectedComponent} selectedComponent={selectedComponent} />
                </Col>

                {/* Third Section: Design Panel */}
                <Col md={3} className="design-section">
                    <DesignPanel formValues={componentData} onComponentChange={handleComponentChange} />
                </Col>
            </Row>
        </div>
    );
};

export default Forms;
