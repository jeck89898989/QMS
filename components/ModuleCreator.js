import React from 'react';
import htm from 'htm';
import { AVAILABLE_COMPONENT_TYPES, createCustomModule, exportCustomModules, importCustomModules } from '../data/appConfig.js';
import { CloseIcon } from './Icons.js';

const html = htm.bind(React.createElement);
const { useState, useRef } = React;

export const ModuleCreator = ({ isOpen, onClose, onModuleCreated }) => {
    const [formData, setFormData] = useState({
        key: '',
        title: '',
        componentType: 'ChecklistWrapper',
        category: 'custom',
        description: ''
    });
    const [isCreating, setIsCreating] = useState(false);
    const importFileRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // Auto-generate key from title
            ...(name === 'title' && { key: value.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_') })
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.key || !formData.title) {
            alert('Please fill in all required fields');
            return;
        }

        setIsCreating(true);
        try {
            const result = createCustomModule(formData);
            onModuleCreated(result.moduleKey, result.module);
            setFormData({
                key: '',
                title: '',
                componentType: 'ChecklistWrapper',
                category: 'custom',
                description: ''
            });
            alert('Module created successfully!');
        } catch (error) {
            alert(`Failed to create module: ${error.message}`);
        } finally {
            setIsCreating(false);
        }
    };

    const handleExport = () => {
        try {
            const exportData = exportCustomModules();
            const blob = new Blob([exportData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `custom-modules-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            alert(`Failed to export modules: ${error.message}`);
        }
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedKeys = importCustomModules(event.target.result);
                alert(`Successfully imported ${importedKeys.length} modules`);
                onModuleCreated(); // Trigger refresh
            } catch (error) {
                alert(`Failed to import modules: ${error.message}`);
            }
        };
        reader.readAsText(file);
        e.target.value = null;
    };

    if (!isOpen) return null;

    const selectedComponent = AVAILABLE_COMPONENT_TYPES[formData.componentType];

    return html`
        <div className="module-creator-overlay" onClick=${onClose}>
            <div className="module-creator-modal" onClick=${e => e.stopPropagation()}>
                <div className="module-creator-header">
                    <h3>Create New Module</h3>
                    <button onClick=${onClose} className="close-btn" aria-label="Close">
                        <${CloseIcon} />
                    </button>
                </div>
                
                <div className="module-creator-content">
                    <form onSubmit=${handleSubmit} className="module-creator-form">
                        <div className="form-group">
                            <label htmlFor="module-title">Module Title *</label>
                            <input
                                type="text"
                                id="module-title"
                                name="title"
                                value=${formData.title}
                                onInput=${handleInputChange}
                                className="form-control"
                                placeholder="e.g., Custom Audit Checklist"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="module-key">Module Key *</label>
                            <input
                                type="text"
                                id="module-key"
                                name="key"
                                value=${formData.key}
                                onInput=${handleInputChange}
                                className="form-control"
                                placeholder="auto-generated from title"
                                pattern="[a-z0-9_]+"
                                title="Only lowercase letters, numbers, and underscores allowed"
                                required
                            />
                            <small className="form-help">Used internally to identify the module</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="component-type">Component Type *</label>
                            <select
                                id="component-type"
                                name="componentType"
                                value=${formData.componentType}
                                onChange=${handleInputChange}
                                className="form-control"
                                required
                            >
                                ${Object.entries(AVAILABLE_COMPONENT_TYPES).map(([key, component]) => html`
                                    <option key=${key} value=${key}>${component.name}</option>
                                `)}
                            </select>
                            ${selectedComponent && html`
                                <small className="form-help">${selectedComponent.description}</small>
                            `}
                        </div>

                        <div className="form-group">
                            <label htmlFor="module-category">Category</label>
                            <select
                                id="module-category"
                                name="category"
                                value=${formData.category}
                                onChange=${handleInputChange}
                                className="form-control"
                            >
                                <option value="custom">Custom</option>
                                <option value="core">Core QMS</option>
                                <option value="audits">Audit Management</option>
                                <option value="capa">CAPA</option>
                                <option value="suppliers">Supplier Management</option>
                                <option value="risk">Risk Management</option>
                                <option value="qc">Quality Control</option>
                                <option value="processChecklists">Process Checklists</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="module-description">Description</label>
                            <textarea
                                id="module-description"
                                name="description"
                                value=${formData.description}
                                onInput=${handleInputChange}
                                className="form-control"
                                rows="3"
                                placeholder="Describe what this module does..."
                            ></textarea>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn" disabled=${isCreating}>
                                ${isCreating ? 'Creating...' : 'Create Module'}
                            </button>
                            <button type="button" className="control-btn" onClick=${onClose}>
                                Cancel
                            </button>
                        </div>
                    </form>

                    <div className="module-creator-tools">
                        <h4>Module Management</h4>
                        <div className="tools-actions">
                            <input
                                type="file"
                                ref=${importFileRef}
                                onChange=${handleImport}
                                accept=".json"
                                style=${{ display: 'none' }}
                            />
                            <button 
                                type="button" 
                                className="control-btn"
                                onClick=${() => importFileRef.current.click()}
                            >
                                Import Modules
                            </button>
                            <button 
                                type="button" 
                                className="control-btn"
                                onClick=${handleExport}
                            >
                                Export Modules
                            </button>
                        </div>
                        <p className="tools-help">
                            Export your custom modules to share with others or as a backup. 
                            Import modules created by others or restore from backup.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
};