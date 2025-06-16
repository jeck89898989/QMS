import React from 'react';
import htm from 'htm';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { downloadFile } from '../utils/fileDownload.js';
import { jsonToXML } from '../utils/xmlExport.js';

const html = htm.bind(React.createElement);
const { useState, useRef } = React;

/**
 * ManufacturerControls Component
 * Provides UI for adding, filtering, importing, and exporting manufacturers.
 */
export const ManufacturerControls = ({ onAddItem, onImport, onExport, filters, setFilters, title, tableView, setTableView }) => {
    const [showFilters, setShowFilters] = useState(false);
    const importInputRef = useRef(null);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
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
                            const data = results.data.map((item, index) => ({
                                id: item.id || `mfg-${Date.now()}-${index}`,
                                name: item.name || 'Imported Manufacturer',
                                approvalStatus: item.approvalStatus || 'Pending',
                                materials: item.materials || '',
                                region: item.region || '',
                                country: item.country || '',
                                location: item.location || '',
                                capabilities: item.capabilities || '',
                                lastAuditDate: item.lastAuditDate || '',
                                notes: item.notes || '',
                            }));
                            onImport(data);
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
        e.target.value = null; // Reset file input
    };

    const triggerFileImport = () => {
        importInputRef.current.click();
    };
    
    const exportCSV = () => {
        const items = onExport();
        if (items.length === 0) {
            alert("No data to export.");
            return;
        }
        const headers = Object.keys(items[0]);
        const rows = items.map(i => headers.map(h => `"${(i[h] || '').toString().replace(/"/g, '""')}"`).join(','));
        const csvContent = [headers.join(','), ...rows].join('\n');
        downloadFile(csvContent, `${title}.csv`, 'text/csv');
    };

    const exportXLSX = () => {
        const items = onExport();
         if (items.length === 0) {
            alert("No data to export.");
            return;
        }
        const worksheet = XLSX.utils.json_to_sheet(items);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Manufacturers");
        XLSX.writeFile(workbook, `${title}.xlsx`);
    };

    const exportJSON = () => {
        const items = onExport();
         if (items.length === 0) {
            alert("No data to export.");
            return;
        }
        downloadFile(JSON.stringify(items, null, 2), `${title}.json`, 'application/json');
    }

    const exportXML = () => {
        const items = onExport();
         if (items.length === 0) {
            alert("No data to export.");
            return;
        }
        const xmlString = jsonToXML(items, 'Manufacturers', 'Manufacturer');
        downloadFile(xmlString, `${title}.xml`, 'application/xml');
    }

    return html`
        <div className="controls-container manufacturer-controls">
            <div className="main-controls">
                <button type="button" className="btn" onClick=${onAddItem}>Add Manufacturer</button>
                <button type="button" className="control-btn" onClick=${() => setShowFilters(!showFilters)}>
                    ${showFilters ? 'Hide' : 'Show'} Filters
                </button>
                <div className="table-view-controls">
                    <label className="view-label">Table View:</label>
                    <select value=${tableView} onChange=${(e) => setTableView(e.target.value)} className="form-control view-select">
                        <option value="compact">Compact</option>
                        <option value="standard">Standard</option>
                        <option value="expanded">Expanded</option>
                        <option value="dense">Dense</option>
                    </select>
                </div>
                <div className="export-controls">
                    <input type="file" ref=${importInputRef} onChange=${handleFileImport} style=${{ display: 'none' }} accept=".json,.csv" />
                    <button className="control-btn" onClick=${triggerFileImport}>Import</button>
                    <button className="control-btn" onClick=${exportJSON}>JSON</button>
                    <button className="control-btn" onClick=${exportCSV}>CSV</button>
                    <button className="control-btn" onClick=${exportXLSX}>XLSX</button>
                    <button className="control-btn" onClick=${exportXML}>XML</button>
                </div>
            </div>
            ${showFilters && html`
                <div className="filter-grid">
                    <input type="text" name="name" placeholder="Filter by Name..." value=${filters.name || ''} onInput=${handleFilterChange} className="form-control" aria-label="Filter by Name" />
                    <input type="text" name="materials" placeholder="Filter by Materials..." value=${filters.materials || ''} onInput=${handleFilterChange} className="form-control" aria-label="Filter by Materials" />
                    <input type="text" name="region" placeholder="Filter by Region..." value=${filters.region || ''} onInput=${handleFilterChange} className="form-control" aria-label="Filter by Region" />
                    <input type="text" name="country" placeholder="Filter by Country..." value=${filters.country || ''} onInput=${handleFilterChange} className="form-control" aria-label="Filter by Country" />
                    <input type="text" name="capabilities" placeholder="Filter by Capabilities..." value=${filters.capabilities || ''} onInput=${handleFilterChange} className="form-control" aria-label="Filter by Capabilities" />
                    <select name="approvalStatus" value=${filters.approvalStatus || ''} onChange=${handleFilterChange} className="form-control" aria-label="Filter by Approval Status">
                        <option value="">All Statuses</option>
                        <option value="Approved">Approved</option>
                        <option value="Probationary">Probationary</option>
                        <option value="Pending">Pending</option>
                        <option value="Disqualified">Disqualified</option>
                    </select>
                    <button type="button" className="control-btn" onClick=${() => setFilters({})}>Clear Filters</button>
                </div>
            `}
        </div>
    `;
};