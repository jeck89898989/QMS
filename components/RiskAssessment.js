import React from 'react';
import htm from 'htm';
import { RiskControls } from './RiskControls.js';
import { RiskMatrix } from './RiskMatrix.js';
import { RiskTable } from './RiskTable.js';

const html = htm.bind(React.createElement);
const { useState, useEffect, useCallback } = React;

/**
 * RiskAssessment Component (Stateful Container)
 * Manages state, data persistence, and views for the risk assessment module.
 * @param {{
 *   title: string,
 *   storageKey: string,
 *   initialData: object
 * }} props
 */
export const RiskAssessment = ({ title, storageKey, initialData }) => {
    const [riskData, setRiskData] = useState(initialData);
    const [view, setView] = useState('matrix');
    const [tableView, setTableView] = useState('dense');
    const [visibleColumns, setVisibleColumns] = useState({
        description: true,
        severity: true,
        likelihood: true,
        mitigation: true,
    });

    useEffect(() => {
        try {
            const storedData = localStorage.getItem(storageKey);
            setRiskData(storedData ? JSON.parse(storedData) : initialData);
        } catch (error) {
            console.error("Failed to load risk data", error);
            setRiskData(initialData);
        }
    }, [storageKey, initialData]);

    const persistData = (newData) => {
        setRiskData(newData);
        try {
            localStorage.setItem(storageKey, JSON.stringify(newData));
        } catch (error) {
            console.error("Failed to save risk data", error);
        }
    };
    
    const handleAddRisk = useCallback((newRisk) => {
        const riskWithId = { ...newRisk, id: `risk-${Date.now()}` };
        const newRisks = [...riskData.risks, riskWithId];
        persistData({ ...riskData, risks: newRisks });
    }, [riskData, storageKey]);

    const handleUpdateRisk = useCallback((updatedRisk) => {
        const newRisks = riskData.risks.map(risk => risk.id === updatedRisk.id ? updatedRisk : risk);
        persistData({ ...riskData, risks: newRisks });
    }, [riskData, storageKey]);

    const handleDeleteRisk = useCallback((riskIdToDelete) => {
        if (window.confirm('Are you sure you want to delete this risk?')) {
            const newRisks = riskData.risks.filter(risk => risk.id !== riskIdToDelete);
            persistData({ ...riskData, risks: newRisks });
        }
    }, [riskData, storageKey]);

    const handleToggleColumn = useCallback((columnKey) => {
        setVisibleColumns(prev => ({
            ...prev,
            [columnKey]: !prev[columnKey]
        }));
    }, []);

    const handleImport = useCallback((importedData) => {
        // Full data object from JSON
        if (importedData && importedData.risks && importedData.likelihoodLevels && importedData.severityLevels) {
             if (window.confirm('This will overwrite all current risk data. Are you sure?')) {
                persistData(importedData);
            }
        } 
        // Just an array of risks, likely from CSV
        else if (Array.isArray(importedData)) {
             if (window.confirm('This will overwrite the current list of risks. Are you sure?')) {
                const newRiskData = { ...riskData, risks: importedData };
                persistData(newRiskData);
            }
        }
        else {
            alert('Invalid file format for risk assessment data. Expected a full JSON object or a CSV with a list of risks.');
        }
    }, [storageKey, riskData]);

    return html`
        <div className="component-showcase">
            <h2>${title}</h2>
            <${RiskControls}
                title=${title}
                riskData=${riskData}
                view=${view}
                setView=${setView}
                onAddRisk=${handleAddRisk}
                onImport=${handleImport}
                tableView=${tableView}
                setTableView=${setTableView}
            />
            
            ${view === 'matrix' ? html`<${RiskMatrix} data=${riskData} onUpdateRisk=${handleUpdateRisk} />` : ''}
            ${view === 'table' ? html`<${RiskTable} data=${riskData} onUpdateRisk=${handleUpdateRisk} onDeleteRisk=${handleDeleteRisk} tableView=${tableView} visibleColumns=${visibleColumns} onToggleColumn=${handleToggleColumn} />` : ''}
        </div>
    `;
};