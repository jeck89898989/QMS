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

/**
 * DocumentControls Component
 * Provides UI for adding, filtering, importing, and exporting document version control.
 */
export const DocumentControls = ({ onAddItem, onImport, onExport, filters, setFilters, title, tableView, setTableView }) => {
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
                let data;
                if (file.name.endsWith('.json')) {
                    data = JSON.parse(fileContent);
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
                            data = results.data.map((item, index) => ({
                                id: item.id || `doc-${Date.now()}-${index}`,
                                documentName: item.documentName || 'Imported Document',
                                version: item.version || '1.0',
                                status: item.status || 'Draft',
                                documentType: item.documentType || '',
                                author: item.author || '',
                                dateCreated: item.dateCreated || '',
                                dateModified: item.dateModified || '',
                                approvalDate: item.approvalDate || '',
                                nextReviewDate: item.nextReviewDate || '',
                                changeSummary: item.changeSummary || '',
                                filePath: item.filePath || '',
                                notes: item.notes || '',
                            }));
                            onImport(data);
                        },
                        error: (error) => {
                            console.error("CSV parsing error:", error);
                            alert("Error parsing the CSV file.");
                        }
                    });
                    return; // PapaParse is async
                } else {
                    alert('Unsupported file type. Please import a .json or .csv file.');
                    return;
                }
                onImport(data);
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
    
    const exportItems = (format) => {
        const items = onExport();
        if (items.length === 0) {
            alert("No data to export.");
            return;
        }

        switch (format) {
            case 'json':
                downloadFile(JSON.stringify(items, null, 2), `${title}.json`, 'application/json');
                break;
            case 'csv':
                const csvContent = Papa.unparse(items);
                downloadFile(csvContent, `${title}.csv`, 'text/csv');
                break;
            case 'xlsx':
                const worksheet = XLSX.utils.json_to_sheet(items);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Documents");
                XLSX.writeFile(workbook, `${title}.xlsx`);
                break;
            case 'pdf':
                const doc = new jsPDF();
                doc.text(title, 14, 16);
                autoTable(doc, {
                    startY: 22,
                    head: [['Document Name', 'Version', 'Status', 'Type', 'Author', 'Date Modified']],
                    body: items.map(i => [i.documentName, i.version, i.status, i.documentType, i.author, i.dateModified]),
                    styles: { fontSize: 8 },
                    headStyles: { fillColor: [41, 128, 185] },
                });
                doc.save(`${title}.pdf`);
                break;
            case 'xml':
                const xmlString = jsonToXML(items, 'DocumentVersionControl', 'Document');
                downloadFile(xmlString, `${title}.xml`, 'application/xml');
                break;
        }
    };

    return html`
        <div className="controls-container manufacturer-controls">
            <div className="main-controls">
                <button type="button" className="btn" onClick=${onAddItem}>Add Document</button>
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
                    <button className="control-btn" onClick=${() => exportItems('json')}>JSON</button>
                    <button className="control-btn" onClick=${() => exportItems('csv')}>CSV</button>
                    <button className="control-btn" onClick=${() => exportItems('xlsx')}>XLSX</button>
                    <button className="control-btn" onClick=${() => exportItems('pdf')}>PDF</button>
                    <button className="control-btn" onClick=${() => exportItems('xml')}>XML</button>
                </div>
            </div>
            ${showFilters && html`
                <div className="filter-grid">
                    <input type="text" name="documentName" placeholder="Filter by Document Name..." value=${filters.documentName || ''} onInput=${handleFilterChange} className="form-control" aria-label="Filter by Document Name" />
                    <input type="text" name="version" placeholder="Filter by Version..." value=${filters.version || ''} onInput=${handleFilterChange} className="form-control" aria-label="Filter by Version" />
                    <select name="status" value=${filters.status || ''} onChange=${handleFilterChange} className="form-control" aria-label="Filter by Status">
                        <option value="">All Statuses</option>
                        <option value="Draft">Draft</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Approved">Approved</option>
                        <option value="Obsolete">Obsolete</option>
                    </select>
                    <input type="text" name="documentType" placeholder="Filter by Type..." value=${filters.documentType || ''} onInput=${handleFilterChange} className="form-control" aria-label="Filter by Document Type" />
                    <input type="text" name="author" placeholder="Filter by Author..." value=${filters.author || ''} onInput=${handleFilterChange} className="form-control" aria-label="Filter by Author" />
                    <button type="button" className="control-btn" onClick=${() => setFilters({})}>Clear Filters</button>
                </div>
            `}
        </div>
    `;
};