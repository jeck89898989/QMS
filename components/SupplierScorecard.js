import React from 'react';
import htm from 'htm';
import { SupplierScorecardControls } from './SupplierScorecardControls.js';
import { SupplierScorecardTable } from './SupplierScorecardTable.js';

const html = htm.bind(React.createElement);
const { useState, useEffect, useCallback, useMemo } = React;

/**
 * SupplierScorecard Component (Stateful Container)
 * @param {{
 *   title: string,
 *   storageKey: string,
 *   initialData: Array<object>
 * }} props
 */
export const SupplierScorecard = ({ title, storageKey, initialData }) => {
    const [scorecards, setScorecards] = useState([]);
    const [filters, setFilters] = useState({});
    const [tableView, setTableView] = useState('dense');
    const [visibleColumns, setVisibleColumns] = useState({
        supplierName: true,
        period: true,
        onTimeDelivery: true,
        qualityAcceptance: true,
        carResponseTime: true,
        overallScore: true,
        notes: true
    });

    useEffect(() => {
        try {
            const storedData = localStorage.getItem(storageKey);
            setScorecards(storedData ? JSON.parse(storedData) : initialData);
        } catch (error) {
            console.error("Failed to load scorecard data", error);
            setScorecards(initialData);
        }
    }, [storageKey, initialData]);

    const persistData = (newData) => {
        setScorecards(newData);
        try {
            localStorage.setItem(storageKey, JSON.stringify(newData));
        } catch (error) {
            console.error("Failed to save scorecard data", error);
        }
    };

    const handleAddItem = useCallback(() => {
        const newItem = {
            id: `sc-${Date.now()}`,
            supplierName: 'New Supplier',
            period: `${new Date().getFullYear()}-Q${Math.floor(new Date().getMonth() / 3) + 1}`,
            onTimeDelivery: 100,
            qualityAcceptance: 100,
            carResponseTime: 0,
            overallScore: 100,
            notes: ''
        };
        persistData([newItem, ...scorecards]);
    }, [scorecards, storageKey]);

    const handleUpdateItem = useCallback((updatedItem) => {
        // Recalculate score
        const otd = parseFloat(updatedItem.onTimeDelivery) || 0;
        const qa = parseFloat(updatedItem.qualityAcceptance) || 0;
        // Simple weighted score: 40% OTD, 60% Quality
        const score = (otd * 0.4) + (qa * 0.6);
        updatedItem.overallScore = score.toFixed(2);
        
        const newItems = scorecards.map(item => item.id === updatedItem.id ? updatedItem : item);
        persistData(newItems);
    }, [scorecards, storageKey]);
    
    const handleDeleteItem = useCallback((itemIdToDelete) => {
        if (window.confirm('Are you sure you want to delete this scorecard entry?')) {
            const newItems = scorecards.filter(item => item.id !== itemIdToDelete);
            persistData(newItems);
        }
    }, [scorecards, storageKey]);

    const handleImport = useCallback((importedData) => {
        if (window.confirm('This will overwrite the current list. Are you sure?')) {
            if (Array.isArray(importedData)) {
                // Ensure imported data has scores calculated
                const processedData = importedData.map(item => {
                    const otd = parseFloat(item.onTimeDelivery) || 0;
                    const qa = parseFloat(item.qualityAcceptance) || 0;
                    const score = (otd * 0.4) + (qa * 0.6);
                    return { ...item, overallScore: score.toFixed(2) };
                });
                persistData(processedData);
            } else {
                alert('Invalid data format for import. Expected an array of scorecard entries.');
            }
        }
    }, [storageKey]);

    const handleToggleColumn = useCallback((columnKey) => {
        setVisibleColumns(prev => ({
            ...prev,
            [columnKey]: !prev[columnKey]
        }));
    }, []);

    const filteredScorecards = useMemo(() => {
        return scorecards.filter(item => {
            return Object.entries(filters).every(([key, value]) => {
                if (!value) return true;
                const itemValue = item[key];
                if (itemValue === null || itemValue === undefined) return false;
                return itemValue.toString().toLowerCase().includes(value.toLowerCase());
            });
        });
    }, [scorecards, filters]);
    
    return html`
        <div className="component-showcase">
            <h2>${title}</h2>
            <${SupplierScorecardControls} 
                onAddItem=${handleAddItem}
                onImport=${handleImport}
                onExport=${() => filteredScorecards}
                filters=${filters}
                setFilters=${setFilters}
                title=${title}
                tableView=${tableView}
                setTableView=${setTableView}
            />
            <${SupplierScorecardTable}
                scorecards=${filteredScorecards}
                onUpdateItem=${handleUpdateItem}
                onDeleteItem=${handleDeleteItem}
                tableView=${tableView}
                visibleColumns=${visibleColumns}
                onToggleColumn=${handleToggleColumn}
            />
        </div>
    `;
};