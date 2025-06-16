import React from 'react';
import htm from 'htm';
import { ParControls } from './ParControls.js';
import { ParTable } from './ParTable.js';

const html = htm.bind(React.createElement);
const { useState, useEffect, useCallback, useMemo } = React;

/**
 * PreventiveActionRequest Component (Stateful Container)
 * @param {{
 *   title: string,
 *   storageKey: string,
 *   initialData: Array<object>
 * }} props
 */
export const PreventiveActionRequest = ({ title, storageKey, initialData }) => {
    const [pars, setPars] = useState([]);
    const [filters, setFilters] = useState({});
    const [tableView, setTableView] = useState('dense');
    const [visibleColumns, setVisibleColumns] = useState({
        title: true,
        description: true,
        status: true,
        priority: true,
        assignedTo: true,
        dueDate: true,
        rootCauseAnalysis: false,
        preventiveActionPlan: true,
        implementationDate: true,
        effectivenessVerification: false,
        notes: true,
    });

    useEffect(() => {
        try {
            const storedData = localStorage.getItem(storageKey);
            setPars(storedData ? JSON.parse(storedData) : initialData);
        } catch (error) {
            console.error("Failed to load PAR data", error);
            setPars(initialData);
        }
    }, [storageKey, initialData]);

    const persistData = (newData) => {
        setPars(newData);
        try {
            localStorage.setItem(storageKey, JSON.stringify(newData));
        } catch (error) {
            console.error("Failed to save PAR data", error);
        }
    };

    const handleAddItem = useCallback(() => {
        const newPar = {
            id: `par-${Date.now()}`,
            title: 'New Preventive Action Request',
            description: '',
            status: 'Open',
            priority: 'Medium',
            assignedTo: '',
            dueDate: new Date().toISOString().split('T')[0],
            rootCauseAnalysis: '',
            preventiveActionPlan: '',
            implementationDate: '',
            effectivenessVerification: '',
            notes: ''
        };
        persistData([newPar, ...pars]);
    }, [pars, storageKey]);

    const handleUpdateItem = useCallback((updatedItem) => {
        const newItems = pars.map(item => item.id === updatedItem.id ? updatedItem : item);
        persistData(newItems);
    }, [pars, storageKey]);
    
    const handleDeleteItem = useCallback((itemIdToDelete) => {
        if (window.confirm('Are you sure you want to delete this PAR?')) {
            const newItems = pars.filter(item => item.id !== itemIdToDelete);
            persistData(newItems);
        }
    }, [pars, storageKey]);

    const handleImport = useCallback((importedData) => {
        if (window.confirm('This will overwrite the current list. Are you sure?')) {
            if (Array.isArray(importedData)) {
                persistData(importedData);
            } else {
                alert('Invalid data format for import. Expected an array of PARs.');
            }
        }
    }, [storageKey]);

    const handleToggleColumn = useCallback((columnKey) => {
        setVisibleColumns(prev => ({
            ...prev,
            [columnKey]: !prev[columnKey]
        }));
    }, []);

    const filteredPars = useMemo(() => {
        return pars.filter(par => {
            return Object.entries(filters).every(([key, value]) => {
                if (!value) return true;
                const itemValue = par[key];
                if (itemValue === null || itemValue === undefined) return false;
                return itemValue.toString().toLowerCase().includes(value.toLowerCase());
            });
        });
    }, [pars, filters]);
    
    return html`
        <div className="component-showcase">
            <h2>${title}</h2>
            <${ParControls} 
                onAddItem=${handleAddItem}
                onImport=${handleImport}
                onExport=${() => filteredPars}
                filters=${filters}
                setFilters=${setFilters}
                title=${title}
                tableView=${tableView}
                setTableView=${setTableView}
            />
            <${ParTable}
                pars=${filteredPars}
                onUpdateItem=${handleUpdateItem}
                onDeleteItem=${handleDeleteItem}
                tableView=${tableView}
                visibleColumns=${visibleColumns}
                onToggleColumn=${handleToggleColumn}
            />
        </div>
    `;
};