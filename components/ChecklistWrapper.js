import React from 'react';
import htm from 'htm';
import { ChecklistControls } from './ChecklistControls.js';
import { AuditChecklist } from './AuditChecklist.js';
import { AuditChecklistTable } from './AuditChecklistTable.js';

const html = htm.bind(React.createElement);
const { useState, useEffect, useCallback, useMemo } = React;

/**
 * ChecklistWrapper Component (Stateful Container)
 * Manages the state and data persistence for a single checklist instance.
 * @param {{
 *   title: string,
 *   storageKey: string,
 *   initialData: Array<object>
 * }} props
 */
export const ChecklistWrapper = ({ title, storageKey, initialData }) => {
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
            setItems(storedItems ? JSON.parse(storedItems) : initialData);
        } catch (error) {
            console.error("Failed to load checklist data", error);
            setItems(initialData);
        }
    }, [storageKey, initialData]);

    const persistItems = (newItems) => {
        setItems(newItems);
        try {
            localStorage.setItem(storageKey, JSON.stringify(newItems));
        } catch (error) {
            console.error("Failed to save checklist data", error);
        }
    };
    
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
        // If other items have a 'reference' property, add it to the new item.
        if (items.length > 0 && items[0].hasOwnProperty('reference')) {
            newItem.reference = "";
        }
        const newItems = [...items, newItem];
        persistItems(newItems);
    }, [items, storageKey]);

    const handleImport = useCallback((importedItems) => {
        if (window.confirm('This will overwrite the current checklist. Are you sure?')) {
            // Basic validation
            if (Array.isArray(importedItems) && (importedItems.length === 0 || (importedItems[0].id && importedItems[0].text))) {
                persistItems(importedItems);
            } else {
                 alert('Invalid JSON file format for checklist.');
            }
        }
    }, [storageKey]);

    const handleToggleColumn = useCallback((columnKey) => {
        setVisibleColumns(prev => ({
            ...prev,
            [columnKey]: !prev[columnKey]
        }));
    }, []);

    const totalItems = items.length;
    const completedItems = useMemo(() => items.filter(item => item.completed).length, [items]);

    return html`
        <div className="component-showcase">
            <h2>${title} (${completedItems}/${totalItems} completed)</h2>
            <${ChecklistControls} onAddItem=${handleAddItem} view=${view} setView=${setView} items=${items} title=${title} onImport=${handleImport} tableView=${tableView} setTableView=${setTableView} />
            
            ${view === 'card' ? html`<${AuditChecklist} items=${items} onUpdate=${handleUpdateItem} onDelete=${handleDeleteItem} />` : ''}
            ${view === 'table' ? html`<${AuditChecklistTable} items=${items} onUpdate=${handleUpdateItem} onDelete=${handleDeleteItem} tableView=${tableView} visibleColumns=${visibleColumns} onToggleColumn=${handleToggleColumn} />` : ''}
        </div>
    `;
};