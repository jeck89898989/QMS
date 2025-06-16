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
 * ChecklistControls Component (Add, View, Export)
 */
export const ChecklistControls = ({ onAddItem, view, setView, items, title, onImport, tableView, setTableView }) => {
    const [newItemText, setNewItemText] = useState('');
    const importInputRef = useRef(null);

    const handleAddItem = (e) => {
        e.preventDefault();
        if (newItemText.trim()) {
            onAddItem(newItemText.trim());
            setNewItemText('');
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
                            const data = results.data.map((item, index) => ({
                                ...item,
                                completed: item.completed === 'true' || item.completed === true,
                                id: item.id || `${title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}-${index}`,
                                text: item.text || 'Imported item',
                                comments: item.comments || "",
                                actions: item.actions || "",
                                status: item.status || "not-started",
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

    const exportJSON = () => downloadFile(JSON.stringify(items, null, 2), `${title}.json`, 'application/json');
    
    const exportCSV = () => {
        const hasReference = items.length > 0 && items.some(i => i.hasOwnProperty('reference'));
        const headers = ["id", "text", "completed", "status", "comments", "actions"];
        if (hasReference) headers.splice(2, 0, "reference");

        const rows = items.map(i => {
            const row = [i.id, `"${i.text.replace(/"/g, '""')}"`, i.completed, i.status, `"${i.comments.replace(/"/g, '""')}"`, `"${i.actions.replace(/"/g, '""')}"`];
            if (hasReference) row.splice(2, 0, `"${(i.reference || '').replace(/"/g, '""')}"`);
            return row.join(',');
        });
        const csvContent = [headers.join(','), ...rows].join('\n');
        downloadFile(csvContent, `${title}.csv`, 'text/csv');
    };
    
    const exportPDF = () => {
        const doc = new jsPDF();
        const hasReference = items.length > 0 && items.some(i => i.hasOwnProperty('reference'));
        
        const head = [['Item', 'Status', 'Completed', 'Comments', 'Actions']];
        if (hasReference) head[0].splice(1, 0, 'Reference');

        const body = items.map(i => {
            const row = [i.text, i.status, i.completed ? 'Yes' : 'No', i.comments, i.actions];
            if (hasReference) row.splice(1, 0, i.reference || '');
            return row;
        });

        doc.text(title, 14, 16);
        autoTable(doc, {
            startY: 22,
            head: head,
            body: body,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [41, 128, 185] },
        });
        doc.save(`${title}.pdf`);
    };

    const exportXLSX = () => {
        const hasReference = items.length > 0 && items.some(i => i.hasOwnProperty('reference'));
        const dataToExport = items.map(item => {
            const base = {
                id: item.id,
                text: item.text,
            };
            if (hasReference) {
                base.reference = item.reference;
            }
            return {
                ...base,
                completed: item.completed,
                status: item.status,
                comments: item.comments,
                actions: item.actions
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Audit");
        XLSX.writeFile(workbook, `${title}.xlsx`);
    };

    const exportXML = () => {
        const xmlString = jsonToXML(items, 'Checklist', 'Item');
        downloadFile(xmlString, `${title}.xml`, 'application/xml');
    };

    const exportHTML = () => {
        const hasReference = items.length > 0 && items.some(i => i.hasOwnProperty('reference'));
        
        const escapeHtml = (unsafe) => 
            unsafe === null || unsafe === undefined ? '' : String(unsafe)
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");

        let tableHeader = `<th>Done</th><th>Checklist Item</th>`;
        if (hasReference) tableHeader += '<th>Reference</th>';
        tableHeader += '<th>Status</th><th>Comments</th><th>Corrective Actions</th>';

        const tableBody = items.map(item => `
            <tr>
                <td>${item.completed ? 'Yes' : 'No'}</td>
                <td>${escapeHtml(item.text)}</td>
                ${hasReference ? `<td>${escapeHtml(item.reference)}</td>` : ''}
                <td>${escapeHtml(item.status)}</td>
                <td>${escapeHtml(item.comments)}</td>
                <td>${escapeHtml(item.actions)}</td>
            </tr>
        `).join('');

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>${escapeHtml(title)} Export</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; }
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; vertical-align: top; }
                    th { background-color: #f2f2f2; font-weight: bold; }
                    h1 { font-size: 1.5rem; }
                </style>
            </head>
            <body>
                <h1>${escapeHtml(title)}</h1>
                <table border="1">
                    <thead>
                        <tr>${tableHeader}</tr>
                    </thead>
                    <tbody>
                        ${tableBody}
                    </tbody>
                </table>
            </body>
            </html>
        `;
        downloadFile(htmlContent, `${title}.html`, 'text/html');
    };

    return html`
        <div className="controls-container">
            <form className="add-item-form" onSubmit=${handleAddItem}>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Add a new checklist item..."
                    value=${newItemText}
                    onInput=${(e) => setNewItemText(e.target.value)}
                />
                <button type="submit" className="btn">Add Item</button>
            </form>
            <div className="view-controls">
                <button className=${`control-btn ${view === 'card' ? 'active' : ''}`} onClick=${() => setView('card')}>Card View</button>
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
                <button className="control-btn" onClick=${exportJSON}>JSON</button>
                <button className="control-btn" onClick=${exportCSV}>CSV</button>
                <button className="control-btn" onClick=${exportPDF}>PDF</button>
                <button className="control-btn" onClick=${exportXLSX}>XLSX</button>
                <button className="control-btn" onClick=${exportXML}>XML</button>
                <button className="control-btn" onClick=${exportHTML}>HTML</button>
            </div>
        </div>
    `;
};