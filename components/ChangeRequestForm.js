import React from 'react';
import htm from 'htm';
import { ChangeRequestControls } from './ChangeRequestControls.js';
import { ChangeRequestTable } from './ChangeRequestTable.js';

const html = htm.bind(React.createElement);
const { useState, useEffect, useCallback, useMemo } = React;

/**
 * ChangeRequestForm Component (Stateful Container)
 * @param {{
 *   title: string,
 *   storageKey: string,
 *   initialData: Array<object>
 * }} props
 */
export const ChangeRequestForm = ({ title, storageKey, initialData }) => {
    const [changeRequests, setChangeRequests] = useState([]);
    const [filters, setFilters] = useState({});
    const [tableView, setTableView] = useState('dense');
    const [visibleColumns, setVisibleColumns] = useState({
        requestTitle: true,
        description: true,
        requestor: true,
        dateSubmitted: true,
        status: true,
        priority: true,
        impactAnalysis: false,
        businessJustification: false,
        approvalHistory: false,
        implementationDate: true,
        notes: true
    });

    useEffect(() => {
        try {
            const storedData = localStorage.getItem(storageKey);
            setChangeRequests(storedData ? JSON.parse(storedData) : initialData);
        } catch (error) {
            console.error("Failed to load change request data", error);
            setChangeRequests(initialData);
        }
    }, [storageKey, initialData]);

    const persistData = (newData) => {
        setChangeRequests(newData);
        try {
            localStorage.setItem(storageKey, JSON.stringify(newData));
        } catch (error) {
            console.error("Failed to save change request data", error);
        }
    };

    const handleAddItem = useCallback(() => {
        const newChangeRequest = {
            id: `cr-${Date.now()}`,
            requestTitle: 'New Change Request',
            description: '',
            requestor: '',
            dateSubmitted: new Date().toISOString().split('T')[0],
            status: 'Draft',
            priority: 'Medium',
            impactAnalysis: '',
            businessJustification: '',
            approvalHistory: '',
            implementationDate: '',
            notes: ''
        };
        persistData([newChangeRequest, ...changeRequests]);
    }, [changeRequests, storageKey]);

    const handleUpdateItem = useCallback((updatedItem) => {
        const newItems = changeRequests.map(item => item.id === updatedItem.id ? updatedItem : item);
        persistData(newItems);
    }, [changeRequests, storageKey]);
    
    const handleDeleteItem = useCallback((itemIdToDelete) => {
        if (window.confirm('Are you sure you want to delete this change request?')) {
            const newItems = changeRequests.filter(item => item.id !== itemIdToDelete);
            persistData(newItems);
        }
    }, [changeRequests, storageKey]);

    const handleImport = useCallback((importedData) => {
        if (window.confirm('This will overwrite the current list. Are you sure?')) {
            if (Array.isArray(importedData)) {
                persistData(importedData);
            } else {
                alert('Invalid data format for import. Expected an array of change requests.');
            }
        }
    }, [storageKey]);

    const handleToggleColumn = useCallback((columnKey) => {
        setVisibleColumns(prev => ({
            ...prev,
            [columnKey]: !prev[columnKey]
        }));
    }, []);

    const filteredChangeRequests = useMemo(() => {
        return changeRequests.filter(changeRequest => {
            return Object.entries(filters).every(([key, value]) => {
                if (!value) return true;
                const itemValue = changeRequest[key];
                if (itemValue === null || itemValue === undefined) return false;
                return itemValue.toString().toLowerCase().includes(value.toLowerCase());
            });
        });
    }, [changeRequests, filters]);
    
    return html`
        <div className="component-showcase">
            <h2>${title}</h2>
            <${ChangeRequestControls} 
                onAddItem=${handleAddItem}
                onImport=${handleImport}
                onExport=${() => filteredChangeRequests}
                filters=${filters}
                setFilters=${setFilters}
                title=${title}
                tableView=${tableView}
                setTableView=${setTableView}
            />
            <${ChangeRequestTable}
                changeRequests=${filteredChangeRequests}
                onUpdateItem=${handleUpdateItem}
                onDeleteItem=${handleDeleteItem}
                tableView=${tableView}
                visibleColumns=${visibleColumns}
                onToggleColumn=${handleToggleColumn}
            />
        </div>
    `;
};