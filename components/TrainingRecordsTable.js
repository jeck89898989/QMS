import React from 'react';
import htm from 'htm';
import { TrashIcon } from './Icons.js';

const html = htm.bind(React.createElement);

const { useState, useRef, useEffect } = React;

const TrainingRecordsTableRow = ({ item, onUpdateItem, onDeleteItem, visibleColumns }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onUpdateItem({ ...item, [name]: value });
        if (e.target.tagName.toLowerCase() === 'textarea') {
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
        }
    };

    const statuses = ['Completed', 'Scheduled', 'In Progress', 'Cancelled'];

    return html`
        <tr className="audit-item-row">
            ${visibleColumns.employeeName && html`<td><textarea name="employeeName" rows="1" value=${item.employeeName} onInput=${handleInputChange} className="form-control" placeholder="Employee Name" aria-label=${`Employee Name for ${item.id}`}></textarea></td>`}
            ${visibleColumns.courseTitle && html`<td><textarea name="courseTitle" rows="1" value=${item.courseTitle} onInput=${handleInputChange} className="form-control" placeholder="Course Title" aria-label=${`Course Title for ${item.id}`}></textarea></td>`}
            ${visibleColumns.trainingDate && html`<td><input type="date" name="trainingDate" value=${item.trainingDate} onInput=${handleInputChange} className="form-control" aria-label=${`Training Date for ${item.id}`} /></td>`}
            ${visibleColumns.expirationDate && html`<td><input type="date" name="expirationDate" value=${item.expirationDate} onInput=${handleInputChange} className="form-control" aria-label=${`Expiration Date for ${item.id}`} /></td>`}
            ${visibleColumns.status && html`<td>
                <select name="status" value=${item.status} onChange=${handleInputChange} className="form-control" aria-label=${`Status for ${item.id}`}>
                    ${statuses.map(status => html`<option key=${status} value=${status}>${status}</option>`)}
                </select>
            </td>`}
            ${visibleColumns.trainer && html`<td><textarea name="trainer" rows="1" value=${item.trainer} onInput=${handleInputChange} className="form-control" placeholder="Trainer" aria-label=${`Trainer for ${item.id}`}></textarea></td>`}
            ${visibleColumns.certificatePath && html`<td><textarea name="certificatePath" rows="1" value=${item.certificatePath} onInput=${handleInputChange} className="form-control" placeholder="Path/Link" aria-label=${`Certificate Path for ${item.id}`}></textarea></td>`}
            ${visibleColumns.notes && html`<td><textarea name="notes" value=${item.notes} onInput=${handleInputChange} className="form-control" rows="1" placeholder="Notes..." aria-label=${`Notes for ${item.id}`}></textarea></td>`}
            <td>
                <button type="button" className="delete-item-btn" onClick=${() => onDeleteItem(item.id)} aria-label=${`Delete training record ${item.courseTitle} for ${item.employeeName}`}>
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
        if (sortColumn === 'trainingDate' || sortColumn === 'expirationDate') {
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

export const TrainingRecordsTable = ({ records, onUpdateItem, onDeleteItem, tableView = 'dense', visibleColumns, onToggleColumn }) => {
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
        { key: 'employeeName', label: 'Employee Name' },
        { key: 'courseTitle', label: 'Course Title' },
        { key: 'trainingDate', label: 'Training Date' },
        { key: 'expirationDate', label: 'Expiration Date' },
        { key: 'status', label: 'Status' },
        { key: 'trainer', label: 'Trainer' },
        { key: 'certificatePath', label: 'Certificate' },
        { key: 'notes', label: 'Notes' }
    ];

    if (!records || records.length === 0) {
        return html`
            <div className="empty-state">
                <h4>No Training Records Found</h4>
                <p>Add a new record or adjust your filters.</p>
            </div>
        `;
    }

    const sortedItems = sortData(records, sortColumn, sortDirection);

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
                            ${visibleColumns.employeeName && html`<th onMouseDown=${(e) => handleMouseDown(e, 0)} onClick=${() => handleSort('employeeName')} className="sortable-header">Employee Name${getSortIcon('employeeName')}</th>`}
                            ${visibleColumns.courseTitle && html`<th onMouseDown=${(e) => handleMouseDown(e, 1)} onClick=${() => handleSort('courseTitle')} className="sortable-header">Course Title${getSortIcon('courseTitle')}</th>`}
                            ${visibleColumns.trainingDate && html`<th onMouseDown=${(e) => handleMouseDown(e, 2)} onClick=${() => handleSort('trainingDate')} className="sortable-header">Training Date${getSortIcon('trainingDate')}</th>`}
                            ${visibleColumns.expirationDate && html`<th onMouseDown=${(e) => handleMouseDown(e, 3)} onClick=${() => handleSort('expirationDate')} className="sortable-header">Expiration Date${getSortIcon('expirationDate')}</th>`}
                            ${visibleColumns.status && html`<th onMouseDown=${(e) => handleMouseDown(e, 4)} onClick=${() => handleSort('status')} className="sortable-header">Status${getSortIcon('status')}</th>`}
                            ${visibleColumns.trainer && html`<th onMouseDown=${(e) => handleMouseDown(e, 5)} onClick=${() => handleSort('trainer')} className="sortable-header">Trainer${getSortIcon('trainer')}</th>`}
                            ${visibleColumns.certificatePath && html`<th onMouseDown=${(e) => handleMouseDown(e, 6)} onClick=${() => handleSort('certificatePath')} className="sortable-header">Certificate${getSortIcon('certificatePath')}</th>`}
                            ${visibleColumns.notes && html`<th onMouseDown=${(e) => handleMouseDown(e, 7)} onClick=${() => handleSort('notes')} className="sortable-header">Notes${getSortIcon('notes')}</th>`}
                            <th onMouseDown=${(e) => handleMouseDown(e, 8)}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sortedItems.map(item => html`
                            <${TrainingRecordsTableRow}
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