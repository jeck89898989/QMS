import React from 'react';
import htm from 'htm';
import { TrainingRecordsControls } from './TrainingRecordsControls.js';
import { TrainingRecordsTable } from './TrainingRecordsTable.js';

const html = htm.bind(React.createElement);
const { useState, useEffect, useCallback, useMemo } = React;

/**
 * TrainingRecords Component (Stateful Container)
 * @param {{
 *   title: string,
 *   storageKey: string,
 *   initialData: Array<object>
 * }} props
 */
export const TrainingRecords = ({ title, storageKey, initialData }) => {
    const [records, setRecords] = useState([]);
    const [filters, setFilters] = useState({});
    const [tableView, setTableView] = useState('dense');
    const [visibleColumns, setVisibleColumns] = useState({
        employeeName: true,
        courseTitle: true,
        trainingDate: true,
        expirationDate: true,
        status: true,
        trainer: true,
        certificatePath: true,
        notes: true
    });

    useEffect(() => {
        try {
            const storedData = localStorage.getItem(storageKey);
            setRecords(storedData ? JSON.parse(storedData) : initialData);
        } catch (error) {
            console.error("Failed to load training records data", error);
            setRecords(initialData);
        }
    }, [storageKey, initialData]);

    const persistData = (newData) => {
        setRecords(newData);
        try {
            localStorage.setItem(storageKey, JSON.stringify(newData));
        } catch (error) {
            console.error("Failed to save training records data", error);
        }
    };

    const handleAddItem = useCallback(() => {
        const newItem = {
            id: `tr-${Date.now()}`,
            employeeName: 'New Employee',
            courseTitle: 'New Training Course',
            trainingDate: new Date().toISOString().split('T')[0],
            expirationDate: '',
            status: 'Scheduled',
            trainer: '',
            certificatePath: '',
            notes: ''
        };
        persistData([newItem, ...records]);
    }, [records, storageKey]);

    const handleUpdateItem = useCallback((updatedItem) => {
        const newItems = records.map(item => item.id === updatedItem.id ? updatedItem : item);
        persistData(newItems);
    }, [records, storageKey]);
    
    const handleDeleteItem = useCallback((itemIdToDelete) => {
        if (window.confirm('Are you sure you want to delete this training record?')) {
            const newItems = records.filter(item => item.id !== itemIdToDelete);
            persistData(newItems);
        }
    }, [records, storageKey]);

    const handleImport = useCallback((importedData) => {
        if (window.confirm('This will overwrite the current list. Are you sure?')) {
            if (Array.isArray(importedData)) {
                persistData(importedData);
            } else {
                alert('Invalid data format for import. Expected an array of training records.');
            }
        }
    }, [storageKey]);

    const handleToggleColumn = useCallback((columnKey) => {
        setVisibleColumns(prev => ({
            ...prev,
            [columnKey]: !prev[columnKey]
        }));
    }, []);

    const filteredRecords = useMemo(() => {
        return records.filter(record => {
            return Object.entries(filters).every(([key, value]) => {
                if (!value) return true;
                const itemValue = record[key];
                if (itemValue === null || itemValue === undefined) return false;
                return itemValue.toString().toLowerCase().includes(value.toLowerCase());
            });
        });
    }, [records, filters]);
    
    return html`
        <div className="component-showcase">
            <h2>${title}</h2>
            <${TrainingRecordsControls} 
                onAddItem=${handleAddItem}
                onImport=${handleImport}
                onExport=${() => filteredRecords}
                filters=${filters}
                setFilters=${setFilters}
                title=${title}
                tableView=${tableView}
                setTableView=${setTableView}
            />
            <${TrainingRecordsTable}
                records=${filteredRecords}
                onUpdateItem=${handleUpdateItem}
                onDeleteItem=${handleDeleteItem}
                tableView=${tableView}
                visibleColumns=${visibleColumns}
                onToggleColumn=${handleToggleColumn}
            />
        </div>
    `;
};