import React from 'react';
import htm from 'htm';
import { ManufacturerControls } from './ManufacturerControls.js';
import { ManufacturerTable } from './ManufacturerTable.js';

const html = htm.bind(React.createElement);
const { useState, useEffect, useCallback, useMemo } = React;

/**
 * ApprovedManufacturerList Component (Stateful Container)
 * Manages state for the approved manufacturer list, including data persistence,
 * filtering, and interactions.
 * @param {{
 *   title: string,
 *   storageKey: string,
 *   initialData: Array<object>
 * }} props
 */
export const ApprovedManufacturerList = ({ title, storageKey, initialData }) => {
    const [manufacturers, setManufacturers] = useState([]);
    const [filters, setFilters] = useState({});
    const [tableView, setTableView] = useState('dense');
    const [visibleColumns, setVisibleColumns] = useState({
        name: true,
        approvalStatus: true,
        materials: true,
        region: true,
        country: false,
        location: true,
        capabilities: true,
        lastAuditDate: true,
        notes: true
    });

    useEffect(() => {
        try {
            const storedData = localStorage.getItem(storageKey);
            setManufacturers(storedData ? JSON.parse(storedData) : initialData);
        } catch (error) {
            console.error("Failed to load manufacturer data", error);
            setManufacturers(initialData);
        }
    }, [storageKey, initialData]);

    const persistData = (newData) => {
        setManufacturers(newData);
        try {
            localStorage.setItem(storageKey, JSON.stringify(newData));
        } catch (error) {
            console.error("Failed to save manufacturer data", error);
        }
    };

    const handleAddItem = useCallback(() => {
        const newManufacturer = {
            id: `mfg-${Date.now()}`,
            name: 'New Manufacturer',
            approvalStatus: 'Pending',
            materials: '',
            region: '',
            country: '',
            location: '',
            capabilities: '',
            lastAuditDate: '',
            notes: '',
        };
        persistData([...manufacturers, newManufacturer]);
    }, [manufacturers, storageKey]);

    const handleUpdateItem = useCallback((updatedItem) => {
        const newItems = manufacturers.map(item => item.id === updatedItem.id ? updatedItem : item);
        persistData(newItems);
    }, [manufacturers, storageKey]);
    
    const handleDeleteItem = useCallback((itemIdToDelete) => {
        if (window.confirm('Are you sure you want to delete this manufacturer?')) {
            const newItems = manufacturers.filter(item => item.id !== itemIdToDelete);
            persistData(newItems);
        }
    }, [manufacturers, storageKey]);

    const handleImport = useCallback((importedData) => {
        if (window.confirm('This will overwrite the current list. Are you sure?')) {
            if (Array.isArray(importedData)) {
                persistData(importedData);
            } else {
                alert('Invalid data format for import. Expected an array of manufacturers.');
            }
        }
    }, [storageKey]);

    const handleToggleColumn = useCallback((columnKey) => {
        setVisibleColumns(prev => ({
            ...prev,
            [columnKey]: !prev[columnKey]
        }));
    }, []);

    const filteredManufacturers = useMemo(() => {
        return manufacturers.filter(m => {
            return Object.entries(filters).every(([key, value]) => {
                if (!value) return true;
                const itemValue = m[key];
                if (itemValue === null || itemValue === undefined) return false;
                return itemValue.toString().toLowerCase().includes(value.toLowerCase());
            });
        });
    }, [manufacturers, filters]);
    
    return html`
        <div className="component-showcase">
            <h2>${title}</h2>
            <${ManufacturerControls} 
                onAddItem=${handleAddItem}
                onImport=${handleImport}
                onExport=${() => filteredManufacturers}
                filters=${filters}
                setFilters=${setFilters}
                title=${title}
                tableView=${tableView}
                setTableView=${setTableView}
            />
            <${ManufacturerTable}
                manufacturers=${filteredManufacturers}
                onUpdateItem=${handleUpdateItem}
                onDeleteItem=${handleDeleteItem}
                tableView=${tableView}
                visibleColumns=${visibleColumns}
                onToggleColumn=${handleToggleColumn}
            />
        </div>
    `;
};