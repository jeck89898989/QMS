import React from 'react';
import htm from 'htm';
import { TrashIcon } from './Icons.js';

const html = htm.bind(React.createElement);

const { useState, useRef, useEffect } = React;

const DocumentTableRow = ({ item, onUpdateItem, onDeleteItem, visibleColumns }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onUpdateItem({ ...item, [name]: value });
        if (e.target.tagName.toLowerCase() === 'textarea') {
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
        }
    };

    const statuses = ['Draft', 'Under Review', 'Approved', 'Obsolete'];

    return html`
        <tr className="audit-item-row">
            ${visibleColumns.documentName && html`<td><textarea name="documentName" rows="1" value=${item.documentName} onInput=${handleInputChange} className="form-control" placeholder="Document Name" aria-label=${`Document Name for ${item.id}`}></textarea></td>`}
            ${visibleColumns.version && html`<td><textarea name="version" rows="1" value=${item.version} onInput=${handleInputChange} className="form-control" placeholder="1.0" aria-label=${`Version for ${item.id}`}></textarea></td>`}
            ${visibleColumns.status && html`<td>
                <select name="status" value=${item.status} onChange=${handleInputChange} className="form-control" aria-label=${`Status for ${item.id}`}>
                    ${statuses.map(status => html`<option key=${status} value=${status}>${status}</option>`)}
                </select>
            </td>`}
            ${visibleColumns.documentType && html`<td><textarea name="documentType" rows="1" value=${item.documentType} onInput=${handleInputChange} className="form-control" placeholder="e.g. Policy, Procedure" aria-label=${`Document Type for ${item.id}`}></textarea></td>`}
            ${visibleColumns.author && html`<td><textarea name="author" rows="1" value=${item.author} onInput=${handleInputChange} className="form-control" placeholder="Author Name" aria-label=${`Author for ${item.id}`}></textarea></td>`}
            ${visibleColumns.dateCreated && html`<td><input type="date" name="dateCreated" value=${item.dateCreated} onInput=${handleInputChange} className="form-control" aria-label=${`Date Created for ${item.id}`} /></td>`}
            ${visibleColumns.dateModified && html`<td><input type="date" name="dateModified" value=${item.dateModified} onInput=${handleInputChange} className="form-control" aria-label=${`Date Modified for ${item.id}`} /></td>`}
            ${visibleColumns.approvalDate && html`<td><input type="date" name="approvalDate" value=${item.approvalDate} onInput=${handleInputChange} className="form-control" aria-label=${`Approval Date for ${item.id}`} /></td>`}
            ${visibleColumns.nextReviewDate && html`<td><input type="date" name="nextReviewDate" value=${item.nextReviewDate} onInput=${handleInputChange} className="form-control" aria-label=${`Next Review Date for ${item.id}`} /></td>`}
            ${visibleColumns.changeSummary && html`<td><textarea name="changeSummary" value=${item.changeSummary} onInput=${handleInputChange} className="form-control" rows="1" placeholder="Change Summary" aria-label=${`Change Summary for ${item.id}`}></textarea></td>`}
            ${visibleColumns.filePath && html`<td><textarea name="filePath" rows="1" value=${item.filePath} onInput=${handleInputChange} className="form-control" placeholder="File Path/Location" aria-label=${`File Path for ${item.id}`}></textarea></td>`}
            ${visibleColumns.notes && html`<td><textarea name="notes" value=${item.notes} onInput=${handleInputChange} className="form-control" rows="1" placeholder="Notes..." aria-label=${`Notes for ${item.id}`}></textarea></td>`}
            <td>
                <button type="button" className="delete-item-btn" onClick=${() => onDeleteItem(item.id)} aria-label=${`Delete document ${item.documentName}`}>
                    <${TrashIcon} />
                </button>
            </td>
        </tr>
    `;
};

const sortData = (data, sortColumn, sortDirection) => {
    if (!sortColumn) return data;
    
    return [...data].sort((a, b) => {
        let aVal = a[sortColumn];
        let bVal = b[sortColumn];
        
        // Handle different data types
        if (sortColumn === 'dateCreated' || sortColumn === 'dateModified' || sortColumn === 'approvalDate' || sortColumn === 'nextReviewDate') {
            aVal = aVal ? new Date(aVal) : new Date('1900-01-01');
            bVal = bVal ? new Date(bVal) : new Date('1900-01-01');
        } else if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });
};

export const DocumentTable = ({ documents, onUpdateItem, onDeleteItem, tableView = 'dense', visibleColumns, onToggleColumn }) => {
    const tableRef = useRef(null);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeData, setResizeData] = useState(null);
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing || !resizeData) return;
            
            const { startX, startWidth, columnIndex } = resizeData;
            const diff = e.clientX - startX;
            const newWidth = Math.max(80, startWidth + diff);
            
            const table = tableRef.current;
            if (table) {
                const headers = table.querySelectorAll('th');
                if (headers[columnIndex]) {
                    headers[columnIndex].style.width = `${newWidth}px`;
                }
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            setResizeData(null);
            if (tableRef.current) {
                tableRef.current.classList.remove('resizing');
            }
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, resizeData]);

    const handleMouseDown = (e, columnIndex) => {
        const rect = e.target.getBoundingClientRect();
        const isNearRightEdge = e.clientX > rect.right - 10;
        
        if (isNearRightEdge) {
            e.preventDefault();
            const startX = e.clientX;
            const startWidth = e.target.offsetWidth;
            
            setIsResizing(true);
            setResizeData({ startX, startWidth, columnIndex });
            
            if (tableRef.current) {
                tableRef.current.classList.add('resizing');
            }
        }
    };

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (column) => {
        if (sortColumn !== column) return ' ↕️';
        return sortDirection === 'asc' ? ' ↑' : ' ↓';
    };

    const columnDefinitions = [
        { key: 'documentName', label: 'Document Name' },
        { key: 'version', label: 'Version' },
        { key: 'status', label: 'Status' },
        { key: 'documentType', label: 'Type' },
        { key: 'author', label: 'Author' },
        { key: 'dateCreated', label: 'Date Created' },
        { key: 'dateModified', label: 'Date Modified' },
        { key: 'approvalDate', label: 'Approval Date' },
        { key: 'nextReviewDate', label: 'Next Review' },
        { key: 'changeSummary', label: 'Change Summary' },
        { key: 'filePath', label: 'File Path' },
        { key: 'notes', label: 'Notes' }
    ];

    if (!documents || documents.length === 0) {
        return html`
            <div className="empty-state">
                <h4>No Documents Found</h4>
                <p>Add a new document or adjust your filters.</p>
            </div>
        `;
    }

    const sortedItems = sortData(documents, sortColumn, sortDirection);

    return html`
        <div>
            <div className="column-visibility-controls">
                <div className="column-toggles">
                    <span className="column-toggles-label">Show/Hide Columns:</span>
                    ${columnDefinitions.map(col => html`
                        <label key=${col.key} className="column-toggle">
                            <input
                                type="checkbox"
                                checked=${visibleColumns[col.key]}
                                onChange=${() => onToggleColumn(col.key)}
                            />
                            ${col.label}
                        </label>
                    `)}
                </div>
            </div>
            <div className="audit-table-container">
                <table className=${`audit-table table-view-${tableView}`} ref=${tableRef}>
                    <thead>
                        <tr>
                            ${visibleColumns.documentName && html`<th onMouseDown=${(e) => handleMouseDown(e, 0)} onClick=${() => handleSort('documentName')} className="sortable-header">Document Name${getSortIcon('documentName')}</th>`}
                            ${visibleColumns.version && html`<th onMouseDown=${(e) => handleMouseDown(e, 1)} onClick=${() => handleSort('version')} className="sortable-header">Version${getSortIcon('version')}</th>`}
                            ${visibleColumns.status && html`<th onMouseDown=${(e) => handleMouseDown(e, 2)} onClick=${() => handleSort('status')} className="sortable-header">Status${getSortIcon('status')}</th>`}
                            ${visibleColumns.documentType && html`<th onMouseDown=${(e) => handleMouseDown(e, 3)} onClick=${() => handleSort('documentType')} className="sortable-header">Type${getSortIcon('documentType')}</th>`}
                            ${visibleColumns.author && html`<th onMouseDown=${(e) => handleMouseDown(e, 4)} onClick=${() => handleSort('author')} className="sortable-header">Author${getSortIcon('author')}</th>`}
                            ${visibleColumns.dateCreated && html`<th onMouseDown=${(e) => handleMouseDown(e, 5)} onClick=${() => handleSort('dateCreated')} className="sortable-header">Date Created${getSortIcon('dateCreated')}</th>`}
                            ${visibleColumns.dateModified && html`<th onMouseDown=${(e) => handleMouseDown(e, 6)} onClick=${() => handleSort('dateModified')} className="sortable-header">Date Modified${getSortIcon('dateModified')}</th>`}
                            ${visibleColumns.approvalDate && html`<th onMouseDown=${(e) => handleMouseDown(e, 7)} onClick=${() => handleSort('approvalDate')} className="sortable-header">Approval Date${getSortIcon('approvalDate')}</th>`}
                            ${visibleColumns.nextReviewDate && html`<th onMouseDown=${(e) => handleMouseDown(e, 8)} onClick=${() => handleSort('nextReviewDate')} className="sortable-header">Next Review${getSortIcon('nextReviewDate')}</th>`}
                            ${visibleColumns.changeSummary && html`<th onMouseDown=${(e) => handleMouseDown(e, 9)} onClick=${() => handleSort('changeSummary')} className="sortable-header">Change Summary${getSortIcon('changeSummary')}</th>`}
                            ${visibleColumns.filePath && html`<th onMouseDown=${(e) => handleMouseDown(e, 10)} onClick=${() => handleSort('filePath')} className="sortable-header">File Path${getSortIcon('filePath')}</th>`}
                            ${visibleColumns.notes && html`<th onMouseDown=${(e) => handleMouseDown(e, 11)} onClick=${() => handleSort('notes')} className="sortable-header">Notes${getSortIcon('notes')}</th>`}
                            <th onMouseDown=${(e) => handleMouseDown(e, 12)}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sortedItems.map(item => html`
                            <${DocumentTableRow}
                                key=${item.id}
                                item=${item}
                                onUpdateItem=${onUpdateItem}
                                onDeleteItem=${onDeleteItem}
                                visibleColumns=${visibleColumns}
                            />
                        `)}
                    </tbody>
                </table>
            </div>
        </div>
    `;
};