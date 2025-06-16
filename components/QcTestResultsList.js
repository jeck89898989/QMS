import React from 'react';
import htm from 'htm';
import { QcTestResultsControls } from './QcTestResultsControls.js';
import { QcTestResultsTable } from './QcTestResultsTable.js';

const html = htm.bind(React.createElement);
const { useState, useEffect, useCallback, useMemo } = React;

/**
 * QcTestResultsList Component (Stateful Container)
 * @param {{
 *   title: string,
 *   storageKey: string,
 *   initialData: Array<object>
 * }} props
 */
export const QcTestResultsList = ({ title, storageKey, initialData }) => {
    const [testResults, setTestResults] = useState([]);
    const [filters, setFilters] = useState({});
    const [tableView, setTableView] = useState('dense');
    const [visibleColumns, setVisibleColumns] = useState({
        sampleId: true,
        testDate: true,
        product: true,
        testParameter: true,
        specificationLimit: true,
        actualResult: true,
        status: true,
        operator: true,
        equipment: true,
        notes: true
    });

    useEffect(() => {
        try {
            const storedData = localStorage.getItem(storageKey);
            setTestResults(storedData ? JSON.parse(storedData) : initialData);
        } catch (error) {
            console.error("Failed to load QC test results data", error);
            setTestResults(initialData);
        }
    }, [storageKey, initialData]);

    const persistData = (newData) => {
        setTestResults(newData);
        try {
            localStorage.setItem(storageKey, JSON.stringify(newData));
        } catch (error) {
            console.error("Failed to save QC test results data", error);
        }
    };

    const handleAddItem = useCallback(() => {
        const newTestResult = {
            id: `qc-${Date.now()}`,
            sampleId: 'New Sample',
            testDate: new Date().toISOString().split('T')[0],
            product: '',
            testParameter: '',
            specificationLimit: '',
            actualResult: '',
            status: 'Pending',
            operator: '',
            equipment: '',
            notes: ''
        };
        persistData([newTestResult, ...testResults]);
    }, [testResults, storageKey]);

    const handleUpdateItem = useCallback((updatedItem) => {
        const newItems = testResults.map(item => item.id === updatedItem.id ? updatedItem : item);
        persistData(newItems);
    }, [testResults, storageKey]);
    
    const handleDeleteItem = useCallback((itemIdToDelete) => {
        if (window.confirm('Are you sure you want to delete this test result?')) {
            const newItems = testResults.filter(item => item.id !== itemIdToDelete);
            persistData(newItems);
        }
    }, [testResults, storageKey]);

    const handleImport = useCallback((importedData) => {
        if (window.confirm('This will overwrite the current list. Are you sure?')) {
            if (Array.isArray(importedData)) {
                persistData(importedData);
            } else {
                alert('Invalid data format for import. Expected an array of test results.');
            }
        }
    }, [storageKey]);

    const handleToggleColumn = useCallback((columnKey) => {
        setVisibleColumns(prev => ({
            ...prev,
            [columnKey]: !prev[columnKey]
        }));
    }, []);

    const filteredTestResults = useMemo(() => {
        return testResults.filter(testResult => {
            return Object.entries(filters).every(([key, value]) => {
                if (!value) return true;
                const itemValue = testResult[key];
                if (itemValue === null || itemValue === undefined) return false;
                return itemValue.toString().toLowerCase().includes(value.toLowerCase());
            });
        });
    }, [testResults, filters]);
    
    return html`
        <div className="component-showcase">
            <h2>${title}</h2>
            <${QcTestResultsControls} 
                onAddItem=${handleAddItem}
                onImport=${handleImport}
                onExport=${() => filteredTestResults}
                filters=${filters}
                setFilters=${setFilters}
                title=${title}
                tableView=${tableView}
                setTableView=${setTableView}
            />
            <${QcTestResultsTable}
                testResults=${filteredTestResults}
                onUpdateItem=${handleUpdateItem}
                onDeleteItem=${handleDeleteItem}
                tableView=${tableView}
                visibleColumns=${visibleColumns}
                onToggleColumn=${handleToggleColumn}
            />
        </div>
    `;
};