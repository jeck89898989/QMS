import React from 'react';
import htm from 'htm';
import { ChecklistControls } from './ChecklistControls.js';
import { AuditChecklist } from './AuditChecklist.js';
import { AuditChecklistTable } from './AuditChecklistTable.js';
import { CHECKLIST_TEMPLATES } from '../data/checklistTemplates.js';

const html = htm.bind(React.createElement);
const { useState, useEffect, useCallback, useMemo } = React;

const GeneratorControls = ({ onGenerate }) => {
    const [selectedTemplate, setSelectedTemplate] = useState('');

    const handleGenerate = () => {
        if (selectedTemplate) {
            onGenerate(selectedTemplate);
        }
    };

    return html`
        <div className="generator-controls controls-container">
            <div className="form-group">
                <label htmlFor="template-select">Select a Checklist Template:</label>
                <select 
                    id="template-select"
                    className="form-control" 
                    value=${selectedTemplate} 
                    onChange=${e => setSelectedTemplate(e.target.value)}
                >
                    <option value="" disabled>-- Choose a template --</option>
                    ${Object.entries(CHECKLIST_TEMPLATES).map(([key, template]) => html`
                        <option key=${key} value=${key}>${template.name}</option>
                    `)}
                </select>
            </div>
            <button 
                className="btn" 
                onClick=${handleGenerate} 
                disabled=${!selectedTemplate}
            >
                Generate Checklist
            </button>
        </div>
    `;
};

export const ChecklistGenerator = ({ title, storageKey, initialData }) => {
    const [items, setItems] = useState([]);
    const [view, setView] = useState('card');
    const [tableView, setTableView] = useState('dense');
    const [visibleColumns, setVisibleColumns] = useState({
        completed: true,
        text: true,
        reference: true,
        status: true,
        comments: true,
        actions: true,
    });

    useEffect(() => {
        try {
            const storedItems = localStorage.getItem(storageKey);
            // Use initialData if nothing is stored. initialData is an empty array for generators.
            setItems(storedItems ? JSON.parse(storedItems) : initialData);
        } catch (error) {
            console.error(`Failed to load checklist data for ${title}`, error);
            setItems(initialData);
        }
    }, [storageKey, initialData, title]);

    const persistItems = (newItems) => {
        setItems(newItems);
        try {
            localStorage.setItem(storageKey, JSON.stringify(newItems));
        } catch (error) {
            console.error(`Failed to save checklist data for ${title}`, error);
        }
    };

    const handleGenerate = useCallback((templateKey) => {
        if (window.confirm('This will replace your current checklist. Are you sure you want to generate a new one from this template?')) {
            const template = CHECKLIST_TEMPLATES[templateKey];
            if (template) {
                // Give new unique IDs to the items when generating
                const newItems = template.items.map((item, index) => ({
                    ...item,
                    id: `${storageKey}-${Date.now()}-${index}`
                }));
                persistItems(newItems);
            }
        }
    }, [storageKey]);

    const handleUpdateItem = useCallback((updatedItem) => {
        const newItems = items.map(item => item.id === updatedItem.id ? updatedItem : item);
        persistItems(newItems);
    }, [items, storageKey]);

    const handleDeleteItem = useCallback((itemIdToDelete) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            const newItems = items.filter(item => item.id !== itemIdToDelete);
            persistItems(newItems);
        }
    }, [items, storageKey]);

    const handleAddItem = useCallback((text) => {
        const newItem = {
            id: `${storageKey}-${Date.now()}`,
            text,
            completed: false,
            comments: "",
            actions: "",
            status: "not-started"
        };
        if (items.length > 0 && items[0].hasOwnProperty('reference')) {
            newItem.reference = "";
        }
        const newItems = [...items, newItem];
        persistItems(newItems);
    }, [items, storageKey]);

    const handleToggleColumn = useCallback((columnKey) => {
        setVisibleColumns(prev => ({
            ...prev,
            [columnKey]: !prev[columnKey]
        }));
    }, []);

    const handleImport = useCallback((importedItems) => {
        if (window.confirm('This will overwrite the current checklist. Are you sure?')) {
            if (Array.isArray(importedItems) && (importedItems.length === 0 || (importedItems[0].id && importedItems[0].text))) {
                persistItems(importedItems);
            } else {
                 alert('Invalid JSON file format for checklist.');
            }
        }
    }, [storageKey]);

    const totalItems = items.length;
    const completedItems = useMemo(() => items.filter(item => item.completed).length, [items]);

    return html`
        <div className="component-showcase">
            <h2>${title}</h2>
            <${GeneratorControls} onGenerate=${handleGenerate} />

            <h3>Current Checklist (${completedItems}/${totalItems} completed)</h3>
            <${ChecklistControls} onAddItem=${handleAddItem} view=${view} setView=${setView} items=${items} title=${title} onImport=${handleImport} tableView=${tableView} setTableView=${setTableView} />
            
            ${items.length === 0 ? html`
                <div className="empty-state">
                    <h4>No Checklist Loaded</h4>
                    <p>Use the generator above to create a new checklist from a template, or add items manually.</p>
                </div>
            ` : html`
                ${view === 'card' ? html`<${AuditChecklist} items=${items} onUpdate=${handleUpdateItem} onDelete=${handleDeleteItem} />` : ''}
                ${view === 'table' ? html`<${AuditChecklistTable} items=${items} onUpdate=${handleUpdateItem} onDelete=${handleDeleteItem} tableView=${tableView} visibleColumns=${visibleColumns} onToggleColumn=${handleToggleColumn} />` : ''}
            `}
        </div>
    `;
};