import React from 'react';
import htm from 'htm';
import { InternalAuditSchedulerControls } from './InternalAuditSchedulerControls.js';
import { InternalAuditSchedulerTable } from './InternalAuditSchedulerTable.js';

const html = htm.bind(React.createElement);
const { useState, useEffect, useCallback, useMemo } = React;

/**
 * InternalAuditScheduler Component (Stateful Container)
 * @param {{
 *   title: string,
 *   storageKey: string,
 *   initialData: Array<object>
 * }} props
 */
export const InternalAuditScheduler = ({ title, storageKey, initialData }) => {
    const [schedules, setSchedules] = useState([]);
    const [filters, setFilters] = useState({});
    const [tableView, setTableView] = useState('dense');
    const [visibleColumns, setVisibleColumns] = useState({
        auditTitle: true,
        auditType: true,
        department: true,
        leadAuditor: true,
        auditTeam: true,
        scheduledStartDate: true,
        scheduledEndDate: true,
        status: true,
        notes: false,
    });

    useEffect(() => {
        try {
            const storedData = localStorage.getItem(storageKey);
            setSchedules(storedData ? JSON.parse(storedData) : initialData);
        } catch (error) {
            console.error("Failed to load audit schedule data", error);
            setSchedules(initialData);
        }
    }, [storageKey, initialData]);

    const persistData = (newData) => {
        setSchedules(newData);
        try {
            localStorage.setItem(storageKey, JSON.stringify(newData));
        } catch (error) {
            console.error("Failed to save audit schedule data", error);
        }
    };

    const handleAddItem = useCallback(() => {
        const newItem = {
            id: `ias-${Date.now()}`,
            auditTitle: 'New Internal Audit',
            auditType: 'Process',
            department: '',
            leadAuditor: '',
            auditTeam: '',
            scheduledStartDate: new Date().toISOString().split('T')[0],
            scheduledEndDate: new Date().toISOString().split('T')[0],
            status: 'Planned',
            notes: ''
        };
        persistData([newItem, ...schedules]);
    }, [schedules, storageKey]);

    const handleUpdateItem = useCallback((updatedItem) => {
        const newItems = schedules.map(item => item.id === updatedItem.id ? updatedItem : item);
        persistData(newItems);
    }, [schedules, storageKey]);
    
    const handleDeleteItem = useCallback((itemIdToDelete) => {
        if (window.confirm('Are you sure you want to delete this scheduled audit?')) {
            const newItems = schedules.filter(item => item.id !== itemIdToDelete);
            persistData(newItems);
        }
    }, [schedules, storageKey]);

    const handleImport = useCallback((importedData) => {
        if (window.confirm('This will overwrite the current list. Are you sure?')) {
            if (Array.isArray(importedData)) {
                persistData(importedData);
            } else {
                alert('Invalid data format for import. Expected an array of audit schedules.');
            }
        }
    }, [storageKey]);

    const handleToggleColumn = useCallback((columnKey) => {
        setVisibleColumns(prev => ({
            ...prev,
            [columnKey]: !prev[columnKey]
        }));
    }, []);

    const filteredSchedules = useMemo(() => {
        return schedules.filter(item => {
            return Object.entries(filters).every(([key, value]) => {
                if (!value) return true;
                const itemValue = item[key];
                if (itemValue === null || itemValue === undefined) return false;
                return itemValue.toString().toLowerCase().includes(value.toLowerCase());
            });
        });
    }, [schedules, filters]);
    
    return html`
        <div className="component-showcase">
            <h2>${title}</h2>
            <${InternalAuditSchedulerControls} 
                onAddItem=${handleAddItem}
                onImport=${handleImport}
                onExport=${() => filteredSchedules}
                filters=${filters}
                setFilters=${setFilters}
                title=${title}
                tableView=${tableView}
                setTableView=${setTableView}
            />
            <${InternalAuditSchedulerTable}
                schedules=${filteredSchedules}
                onUpdateItem=${handleUpdateItem}
                onDeleteItem=${handleDeleteItem}
                tableView=${tableView}
                visibleColumns=${visibleColumns}
                onToggleColumn=${handleToggleColumn}
            />
        </div>
    `;
};