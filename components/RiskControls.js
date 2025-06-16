import React from 'react';
import htm from 'htm';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { downloadFile } from '../utils/fileDownload.js';
import { jsonToXML } from '../utils/xmlExport.js';

const html = htm.bind(React.createElement);
const { useState, useRef } = React;

export const RiskControls = ({ title, riskData, view, setView, onAddRisk, onImport, tableView, setTableView }) => {
    const [description, setDescription] = useState('');
    const importInputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (description.trim()) {
            onAddRisk({
                description,
                severity: riskData.severityLevels[0],
                likelihood: riskData.likelihoodLevels[0],
                mitigation: '',
            });
            setDescription('');
        }
    };
    
    const handleFileImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const fileContent = event.target.result;
                if (file.name.endsWith('.json')) {
                    const importedData = JSON.parse(fileContent);
                    onImport(importedData);
                } else if (file.name.endsWith('.csv')) {
                    Papa.parse(fileContent, {
                        header: true,
                        skipEmptyLines: true,
                        complete: (results) => {
                            if (results.errors.length > 0) {
                                console.error("CSV parsing errors:", results.errors);
                                alert(`Error parsing CSV file: ${results.errors[0].message}`);
                                return;
                            }
                            const importedRisks = results.data.map((risk, index) => ({
                                ...risk,
                                id: risk.id || `risk-${Date.now()}-${index}`,
                                description: risk.description || 'Imported risk',
                                severity: risk.severity || riskData.severityLevels[0],
                                likelihood: risk.likelihood || riskData.likelihoodLevels[0],
                                mitigation: risk.mitigation || '',
                            }));
                            // For CSV, we only import the risks array, not the whole data structure.
                            onImport(importedRisks);
                        },
                         error: (error) => {
                            console.error("CSV parsing error:", error);
                            alert("Error parsing the CSV file.");
                        }
                    });
                } else {
                    alert('Unsupported file type. Please import a .json or .csv file.');
                }
            } catch (error) {
                console.error("Failed to parse file", error);
                alert("Error reading or parsing the file.");
            }
        };
        reader.readAsText(file);
        e.target.value = null;
    };
    
    const triggerFileImport = () => {
        importInputRef.current.click();
    };
    
    const exportData = (format) => {
        const dataToExport = riskData.risks.map(r => ({
            id: r.id,
            description: r.description,
            severity: r.severity,
            likelihood: r.likelihood,
            mitigation: r.mitigation
        }));

        if (format === 'json') {
            downloadFile(JSON.stringify(riskData, null, 2), `${title}.json`, 'application/json');
        } else if (format === 'xlsx') {
            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Risks");
            XLSX.writeFile(workbook, `${title}.xlsx`);
        } else if (format === 'pdf') {
            const doc = new jsPDF();
            doc.text(title, 14, 16);
            autoTable(doc, {
                startY: 22,
                head: [['Description', 'Severity', 'Likelihood', 'Mitigation Plan']],
                body: dataToExport.map(r => [r.description, r.severity, r.likelihood, r.mitigation]),
                styles: { fontSize: 8 },
                headStyles: { fillColor: [200, 70, 70] },
            });
            doc.save(`${title}.pdf`);
        } else if (format === 'xml') {
            const xmlString = jsonToXML(dataToExport, 'Risks', 'Risk');
            downloadFile(xmlString, `${title}.xml`, 'application/xml');
        }
    };

    return html`
        <div className="controls-container">
            <form className="add-item-form" onSubmit=${handleSubmit}>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Add a new risk description..."
                    value=${description}
                    onInput=${e => setDescription(e.target.value)}
                />
                <button type="submit" className="btn">Add Risk</button>
            </form>
            <div className="view-controls">
                <button className=${`control-btn ${view === 'matrix' ? 'active' : ''}`} onClick=${() => setView('matrix')}>Matrix View</button>
                <button className=${`control-btn ${view === 'table' ? 'active' : ''}`} onClick=${() => setView('table')}>Table View</button>
            </div>
            ${view === 'table' && html`
                <div className="table-view-controls">
                    <label className="view-label">Table View:</label>
                    <select value=${tableView} onChange=${(e) => setTableView(e.target.value)} className="form-control view-select">
                        <option value="compact">Compact</option>
                        <option value="standard">Standard</option>
                        <option value="expanded">Expanded</option>
                        <option value="dense">Dense</option>
                    </select>
                </div>
            `}
            <div className="export-controls">
                <input type="file" ref=${importInputRef} onChange=${handleFileImport} style=${{ display: 'none' }} accept=".json,.csv" />
                <button className="control-btn" onClick=${triggerFileImport}>Import</button>
                <button className="control-btn" onClick=${() => exportData('json')}>JSON</button>
                <button className="control-btn" onClick=${() => exportData('pdf')}>PDF</button>
                <button className="control-btn" onClick=${() => exportData('xlsx')}>XLSX</button>
                <button className="control-btn" onClick=${() => exportData('xml')}>XML</button>
            </div>
        </div>
    `;
};