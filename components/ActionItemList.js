import React from 'react';
import htm from 'htm';
import { ActionItemControls } from './ActionItemControls.js';
import { ActionItemTable } from './ActionItemTable.js';

const html = htm.bind(React.createElement);
const { useState, useEffect, useCallback, useMemo } = React;

/**
 * ActionItemList Component (Stateful Container)
 * @param {{
 *   title: string,
 *   storageKey: string,
 *   initialData: Array<object>
 * }} props
 */
export const ActionItemList = ({ title, storageKey, initialData }) => {
    const [actionItems, setActionItems] = useState([]);
    const [filters, setFilters] = useState({});
    const [tableView, setTableView] = useState('dense');
    const [visibleColumns, setVisibleColumns] = useState({
        title: true,
        description: true,
        assignedTo: true,
        priority: true,
        status: true,
        dueDate: true,
        category: true,
        completedDate: false,
        notes: true
    });

    useEffect(() => {
        try {
            const storedData = localStorage.getItem(storageKey);
            setActionItems(storedData ? JSON.parse(storedData) : initialData);
        } catch (error) {
            console.error("Failed to load action items data", error);
            setActionItems(initialData);
        }
    }, [storageKey, initialData]);

    const persistData = (newData) => {
        setActionItems(newData);
        try {
            localStorage.setItem(storageKey, JSON.stringify(newData));
        } catch (error) {
            console.error("Failed to save action items data", error);
        }
    };

    const handleAddItem = useCallback(() => {
        const newActionItem = {
            id: `ai-${Date.now()}`,
            title: 'New Action Item',
            description: '',
            assignedTo: '',
            priority: 'Medium',
            status: 'Open',
            dueDate: new Date().toISOString().split('T')[0],
            category: '',
            completedDate: '',
            notes: ''
        };
        persistData([newActionItem, ...actionItems]);
    }, [actionItems, storageKey]);

    const handleUpdateItem = useCallback((updatedItem) => {
        const newItems = actionItems.map(item => item.id === updatedItem.id ? updatedItem : item);
        persistData(newItems);
    }, [actionItems, storageKey]);
    
    const handleDeleteItem = useCallback((itemIdToDelete) => {
        if (window.confirm('Are you sure you want to delete this action item?')) {
            const newItems = actionItems.filter(item => item.id !== itemIdToDelete);
            persistData(newItems);
        }
    }, [actionItems, storageKey]);

    const handleImport = useCallback((importedData) => {
        if (window.confirm('This will overwrite the current list. Are you sure?')) {
            if (Array.isArray(importedData)) {
                persistData(importedData);
            } else {
                alert('Invalid data format for import. Expected an array of action items.');
            }
        }
    }, [storageKey]);

    const handleToggleColumn = useCallback((columnKey) => {
        setVisibleColumns(prev => ({
            ...prev,
            [columnKey]: !prev[columnKey]
        }));
    }, []);

    const filteredActionItems = useMemo(() => {
        return actionItems.filter(actionItem => {
            return Object.entries(filters).every(([key, value]) => {
                if (!value) return true;
                const itemValue = actionItem[key];
                if (itemValue === null || itemValue === undefined) return false;
                return itemValue.toString().toLowerCase().includes(value.toLowerCase());
            });
        });
    }, [actionItems, filters]);
    
    return html`
        <div className="component-showcase">
            <h2>${title}</h2>
            <${ActionItemControls} 
                onAddItem=${handleAddItem}
                onImport=${handleImport}
                onExport=${() => filteredActionItems}
                filters=${filters}
                setFilters=${setFilters}
                title=${title}
                tableView=${tableView}
                setTableView=${setTableView}
            />
            <${ActionItemTable}
                actionItems=${filteredActionItems}
                onUpdateItem=${handleUpdateItem}
                onDeleteItem=${handleDeleteItem}
                tableView=${tableView}
                visibleColumns=${visibleColumns}
                onToggleColumn=${handleToggleColumn}
            />
        </div>
    `;
};