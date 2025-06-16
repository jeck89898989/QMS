import React from 'react';
import htm from 'htm';
import { CarControls } from './CarControls.js';
import { CarTable } from './CarTable.js';

const html = htm.bind(React.createElement);
const { useState, useEffect, useCallback, useMemo } = React;

/**
 * CorrectiveActionRequest Component (Stateful Container)
 * @param {{
 *   title: string,
 *   storageKey: string,
 *   initialData: Array<object>
 * }} props
 */
export const CorrectiveActionRequest = ({ title, storageKey, initialData }) => {
    const [cars, setCars] = useState([]);
    const [filters, setFilters] = useState({});
    const [tableView, setTableView] = useState('dense');
    const [visibleColumns, setVisibleColumns] = useState({
        description: true,
        status: true,
        assignedTo: true,
        dueDate: true,
        correctiveAction: true,
        notes: true
    });

    useEffect(() => {
        try {
            const storedData = localStorage.getItem(storageKey);
            setCars(storedData ? JSON.parse(storedData) : initialData);
        } catch (error) {
            console.error("Failed to load CAR data", error);
            setCars(initialData);
        }
    }, [storageKey, initialData]);

    const persistData = (newData) => {
        setCars(newData);
        try {
            localStorage.setItem(storageKey, JSON.stringify(newData));
        } catch (error) {
            console.error("Failed to save CAR data", error);
        }
    };

    const handleAddItem = useCallback(() => {
        const newCar = {
            id: `car-${Date.now()}`,
            description: 'New Corrective Action Request',
            status: 'Open',
            assignedTo: '',
            dueDate: new Date().toISOString().split('T')[0],
            correctiveAction: '',
            notes: ''
        };
        persistData([newCar, ...cars]);
    }, [cars, storageKey]);

    const handleUpdateItem = useCallback((updatedItem) => {
        const newItems = cars.map(item => item.id === updatedItem.id ? updatedItem : item);
        persistData(newItems);
    }, [cars, storageKey]);
    
    const handleDeleteItem = useCallback((itemIdToDelete) => {
        if (window.confirm('Are you sure you want to delete this CAR?')) {
            const newItems = cars.filter(item => item.id !== itemIdToDelete);
            persistData(newItems);
        }
    }, [cars, storageKey]);

    const handleImport = useCallback((importedData) => {
        if (window.confirm('This will overwrite the current list. Are you sure?')) {
            if (Array.isArray(importedData)) {
                persistData(importedData);
            } else {
                alert('Invalid data format for import. Expected an array of CARs.');
            }
        }
    }, [storageKey]);

    const handleToggleColumn = useCallback((columnKey) => {
        setVisibleColumns(prev => ({
            ...prev,
            [columnKey]: !prev[columnKey]
        }));
    }, []);

    const filteredCars = useMemo(() => {
        return cars.filter(car => {
            return Object.entries(filters).every(([key, value]) => {
                if (!value) return true;
                const itemValue = car[key];
                if (itemValue === null || itemValue === undefined) return false;
                return itemValue.toString().toLowerCase().includes(value.toLowerCase());
            });
        });
    }, [cars, filters]);
    
    return html`
        <div className="component-showcase">
            <h2>${title}</h2>
            <${CarControls} 
                onAddItem=${handleAddItem}
                onImport=${handleImport}
                onExport=${() => filteredCars}
                filters=${filters}
                setFilters=${setFilters}
                title=${title}
                tableView=${tableView}
                setTableView=${setTableView}
            />
            <${CarTable}
                cars=${filteredCars}
                onUpdateItem=${handleUpdateItem}
                onDeleteItem=${handleDeleteItem}
                tableView=${tableView}
                visibleColumns=${visibleColumns}
                onToggleColumn=${handleToggleColumn}
            />
        </div>
    `;
};