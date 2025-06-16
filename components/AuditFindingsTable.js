import React from 'react';
import htm from 'htm';
import { TrashIcon } from './Icons.js';

const html = htm.bind(React.createElement);

const FindingTableRow = ({ item, onUpdateItem, onDeleteItem, visibleColumns }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onUpdateItem({ ...item, [name]: value });
        if (e.target.tagName.toLowerCase() === 'textarea') {
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
        }
    };

    const statuses = ['Open', 'In Progress', 'Pending Verification', 'Closed'];
    const severities = ['Minor', 'Major', 'Critical'];

    return html`
        <tr className="audit-item-row">
            ${visibleColumns.finding && html`<td><textarea name="finding" value=${item.finding} onInput=${handleInputChange} className="form-control" rows="1" placeholder="Finding Description" aria-label=${`Finding for ${item.id}`}></textarea></td>`}
            ${visibleColumns.auditType && html`<td><textarea name="auditType" rows="1" value=${item.auditType} onInput=${handleInputChange} className="form-control" placeholder="e.g. Internal" aria-label=${`Audit Type for ${item.id}`}></textarea></td>`}
            ${visibleColumns.department && html`<td><textarea name="department" rows="1" value=${item.department} onInput=${handleInputChange} className="form-control" placeholder="e.g. Engineering" aria-label=${`Department for ${item.id}`}></textarea></td>`}
            ${visibleColumns.severity && html`<td>
                <select name="severity" value=${item.severity} onChange=${handleInputChange} className="form-control" aria-label=${`Severity for ${item.id}`}>
                    ${severities.map(s => html`<option key=${s} value=${s}>${s}</option>`)}
                </select>
            </td>`}
            ${visibleColumns.status && html`<td>
                <select name="status" value=${item.status} onChange=${handleInputChange} className="form-control" aria-label=${`Status for ${item.id}`}>
                    ${statuses.map(s => html`<option key=${s} value=${s}>${s}</option>`)}
                </select>
            </td>`}
            ${visibleColumns.carId && html`<td><textarea name="carId" rows="1" value=${item.carId} onInput=${handleInputChange} className="form-control" placeholder="CAR-ID" aria-label=${`CAR ID for ${item.id}`}></textarea></td>`}
            ${visibleColumns.dateFound && html`<td><input type="date" name="dateFound" value=${item.dateFound} onInput=${handleInputChange} className="form-control" aria-label=${`Date Found for ${item.id}`} /></td>`}
            ${visibleColumns.notes && html`<td><textarea name="notes" value=${item.notes} onInput=${handleInputChange} className="form-control" rows="1" placeholder="Notes..." aria-label=${`Notes for ${item.id}`}></textarea></td>`}
            <td>
                <button type="button" className="delete-item-btn" onClick=${() => onDeleteItem(item.id)} aria-label=${`Delete Finding ${item.id}`}>
                    <${TrashIcon} />
                </button>
            </td>
        </tr>
    `;
};

const { useState, useRef, useEffect } = React;

const sortData = (data, sortColumn, sortDirection) => {
    if (!sortColumn) return data;
    
    return [...data].sort((a, b) => {
        let aVal = a[sortColumn];
        let bVal = b[sortColumn];
        
        // Handle different data types
        if (sortColumn === 'dateFound') {
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

export const AuditFindingsTable = ({ findings, onUpdateItem, onDeleteItem, tableView = 'dense', visibleColumns, onToggleColumn }) => {
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
        { key: 'finding', label: 'Finding' },
        { key: 'auditType', label: 'Audit Type' },
        { key: 'department', label: 'Department' },
        { key: 'severity', label: 'Severity' },
        { key: 'status', label: 'Status' },
        { key: 'carId', label: 'CAR ID' },
        { key: 'dateFound', label: 'Date Found' },
        { key: 'notes', label: 'Notes' }
    ];

    if (!findings || findings.length === 0) {
        return html`
            <div className="empty-state">
                <h4>No Audit Findings Found</h4>
                <p>Add a new finding or adjust your filters.</p>
            </div>
        `;
    }

    const sortedItems = sortData(findings, sortColumn, sortDirection);

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
                            ${visibleColumns.finding && html`<th onMouseDown=${(e) => handleMouseDown(e, 0)} onClick=${() => handleSort('finding')} className="sortable-header">Finding${getSortIcon('finding')}</th>`}
                            ${visibleColumns.auditType && html`<th onMouseDown=${(e) => handleMouseDown(e, 1)} onClick=${() => handleSort('auditType')} className="sortable-header">Audit Type${getSortIcon('auditType')}</th>`}
                            ${visibleColumns.department && html`<th onMouseDown=${(e) => handleMouseDown(e, 2)} onClick=${() => handleSort('department')} className="sortable-header">Department${getSortIcon('department')}</th>`}
                            ${visibleColumns.severity && html`<th onMouseDown=${(e) => handleMouseDown(e, 3)} onClick=${() => handleSort('severity')} className="sortable-header">Severity${getSortIcon('severity')}</th>`}
                            ${visibleColumns.status && html`<th onMouseDown=${(e) => handleMouseDown(e, 4)} onClick=${() => handleSort('status')} className="sortable-header">Status${getSortIcon('status')}</th>`}
                            ${visibleColumns.carId && html`<th onMouseDown=${(e) => handleMouseDown(e, 5)} onClick=${() => handleSort('carId')} className="sortable-header">CAR ID${getSortIcon('carId')}</th>`}
                            ${visibleColumns.dateFound && html`<th onMouseDown=${(e) => handleMouseDown(e, 6)} onClick=${() => handleSort('dateFound')} className="sortable-header">Date Found${getSortIcon('dateFound')}</th>`}
                            ${visibleColumns.notes && html`<th onMouseDown=${(e) => handleMouseDown(e, 7)} onClick=${() => handleSort('notes')} className="sortable-header">Notes${getSortIcon('notes')}</th>`}
                            <th onMouseDown=${(e) => handleMouseDown(e, 8)}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sortedItems.map(item => html`
                            <${FindingTableRow}
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