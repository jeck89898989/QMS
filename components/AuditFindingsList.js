import React from 'react';
import htm from 'htm';
import { AuditFindingsControls } from './AuditFindingsControls.js';
import { AuditFindingsTable } from './AuditFindingsTable.js';

const html = htm.bind(React.createElement);
const { useState, useEffect, useCallback, useMemo } = React;

/**
 * AuditFindingsList Component (Stateful Container)
 * @param {{
 *   title: string,
 *   storageKey: string,
 *   initialData: Array<object>
 * }} props
 */
export const AuditFindingsList = ({ title, storageKey, initialData }) => {
    const [findings, setFindings] = useState([]);
    const [filters, setFilters] = useState({});
    const [tableView, setTableView] = useState('dense');
    const [visibleColumns, setVisibleColumns] = useState({
        finding: true,
        auditType: true,
        department: true,
        severity: true,
        status: true,
        carId: true,
        dateFound: true,
        notes: false,
    });

    useEffect(() => {
        try {
            const storedData = localStorage.getItem(storageKey);
            setFindings(storedData ? JSON.parse(storedData) : initialData);
        } catch (error) {
            console.error("Failed to load audit findings data", error);
            setFindings(initialData);
        }
    }, [storageKey, initialData]);

    const persistData = (newData) => {
        setFindings(newData);
        try {
            localStorage.setItem(storageKey, JSON.stringify(newData));
        } catch (error) {
            console.error("Failed to save audit findings data", error);
        }
    };

    const handleAddItem = useCallback(() => {
        const newFinding = {
            id: `af-${Date.now()}`,
            finding: 'New Audit Finding',
            auditType: '',
            department: '',
            severity: 'Minor',
            status: 'Open',
            carId: '',
            dateFound: new Date().toISOString().split('T')[0],
            notes: ''
        };
        persistData([newFinding, ...findings]);
    }, [findings, storageKey]);

    const handleUpdateItem = useCallback((updatedItem) => {
        const newItems = findings.map(item => item.id === updatedItem.id ? updatedItem : item);
        persistData(newItems);
    }, [findings, storageKey]);
    
    const handleDeleteItem = useCallback((itemIdToDelete) => {
        if (window.confirm('Are you sure you want to delete this finding?')) {
            const newItems = findings.filter(item => item.id !== itemIdToDelete);
            persistData(newItems);
        }
    }, [findings, storageKey]);

    const handleImport = useCallback((importedData) => {
        if (window.confirm('This will overwrite the current list. Are you sure?')) {
            if (Array.isArray(importedData)) {
                persistData(importedData);
            } else {
                alert('Invalid data format for import. Expected an array of findings.');
            }
        }
    }, [storageKey]);

    const handleToggleColumn = useCallback((columnKey) => {
        setVisibleColumns(prev => ({
            ...prev,
            [columnKey]: !prev[columnKey]
        }));
    }, []);

    const filteredFindings = useMemo(() => {
        return findings.filter(finding => {
            return Object.entries(filters).every(([key, value]) => {
                if (!value) return true;
                const itemValue = finding[key];
                if (itemValue === null || itemValue === undefined) return false;
                return itemValue.toString().toLowerCase().includes(value.toLowerCase());
            });
        });
    }, [findings, filters]);
    
    return html`
        <div className="component-showcase">
            <h2>${title}</h2>
            <${AuditFindingsControls} 
                onAddItem=${handleAddItem}
                onImport=${handleImport}
                onExport=${() => filteredFindings}
                filters=${filters}
                setFilters=${setFilters}
                title=${title}
                tableView=${tableView}
                setTableView=${setTableView}
            />
            <${AuditFindingsTable}
                findings=${filteredFindings}
                onUpdateItem=${handleUpdateItem}
                onDeleteItem=${handleDeleteItem}
                tableView=${tableView}
                visibleColumns=${visibleColumns}
                onToggleColumn=${handleToggleColumn}
            />
        </div>
    `;
};