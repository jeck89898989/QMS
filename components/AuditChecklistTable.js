import React from 'react';
import htm from 'htm';
import { TrashIcon } from './Icons.js';

const html = htm.bind(React.createElement);

const { useState, useRef, useEffect } = React;

/**
 * AuditChecklistTableRow Component (Table View)
 */
const AuditChecklistTableRow = ({ item, onUpdate, onDelete, visibleColumns }) => {
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        onUpdate({ ...item, [name]: newValue });
        if (e.target.tagName.toLowerCase() === 'textarea') {
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
        }
    };

    return html`
        <tr className="audit-item-row">
            ${visibleColumns.completed && html`<td>
                <input
                    type="checkbox"
                    id=${`item-checkbox-table-${item.id}`}
                    name="completed"
                    checked=${item.completed}
                    onChange=${handleInputChange}
                    aria-label=${item.text}
                />
            </td>`}
            ${visibleColumns.text && html`<td>${item.text}</td>`}
             ${visibleColumns.reference && item.hasOwnProperty('reference') && html`
                <td>
                    <textarea
                        rows="1"
                        id=${`item-reference-table-${item.id}`}
                        name="reference"
                        className="form-control"
                        value=${item.reference}
                        onInput=${handleInputChange}
                        placeholder="e.g., ISO 9001: 7.1.5"
                    ></textarea>
                </td>
            `}
            ${visibleColumns.status && html`<td>
                 <select
                    id=${`item-status-table-${item.id}`}
                    name="status"
                    className="form-control"
                    value=${item.status}
                    onChange=${handleInputChange}
                >
                    <option value="not-started">Not Started</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="needs-review">Needs Review</option>
                </select>
            </td>`}
            ${visibleColumns.comments && html`<td>
                <textarea
                    id=${`item-comments-table-${item.id}`}
                    name="comments"
                    className="form-control"
                    rows="1"
                    value=${item.comments}
                    onInput=${handleInputChange}
                    placeholder="Observations..."
                ></textarea>
            </td>`}
            ${visibleColumns.actions && html`<td>
                 <textarea
                    id=${`item-actions-table-${item.id}`}
                    name="actions"
                    className="form-control"
                    rows="1"
                    value=${item.actions}
                    onInput=${handleInputChange}
                    placeholder="Actions..."
                ></textarea>
            </td>`}
            <td>
                <button
                    type="button"
                    className="delete-item-btn"
                    onClick=${() => onDelete(item.id)}
                    aria-label=${`Delete item: ${item.text}`}
                >
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
        if (sortColumn === 'completed') {
            aVal = aVal ? 1 : 0;
            bVal = bVal ? 1 : 0;
        } else if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });
};

/**
 * AuditChecklistTable Component (Presentational Table View)
 */
export const AuditChecklistTable = ({ items, onUpdate, onDelete, tableView = 'dense', visibleColumns, onToggleColumn }) => {
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
            const newWidth = Math.max(80, startWidth + diff); // Minimum 80px width
            
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

    if (!items || items.length === 0) {
        return html`
            <div className="empty-state">
                <h4>No Audit Items</h4>
                <p>Add an item to get started.</p>
            </div>
        `;
    }

    const displayReferenceColumn = items.length > 0 && items.some(i => i.hasOwnProperty('reference'));
    const sortedItems = sortData(items, sortColumn, sortDirection);
    
    const columnDefinitions = [
        { key: 'completed', label: 'Done' },
        { key: 'text', label: 'Checklist Item' },
        ...(displayReferenceColumn ? [{ key: 'reference', label: 'Reference' }] : []),
        { key: 'status', label: 'Status' },
        { key: 'comments', label: 'Comments' },
        { key: 'actions', label: 'Corrective Actions' },
    ];

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
                            ${visibleColumns.completed && html`<th onMouseDown=${(e) => handleMouseDown(e, 0)} onClick=${() => handleSort('completed')} className="sortable-header">Done${getSortIcon('completed')}</th>`}
                            ${visibleColumns.text && html`<th onMouseDown=${(e) => handleMouseDown(e, 1)} onClick=${() => handleSort('text')} className="sortable-header">Checklist Item${getSortIcon('text')}</th>`}
                            ${displayReferenceColumn && visibleColumns.reference && html`<th onMouseDown=${(e) => handleMouseDown(e, 2)} onClick=${() => handleSort('reference')} className="sortable-header">Reference${getSortIcon('reference')}</th>`}
                            ${visibleColumns.status && html`<th onMouseDown=${(e) => handleMouseDown(e, displayReferenceColumn ? 3 : 2)} onClick=${() => handleSort('status')} className="sortable-header">Status${getSortIcon('status')}</th>`}
                            ${visibleColumns.comments && html`<th onMouseDown=${(e) => handleMouseDown(e, displayReferenceColumn ? 4 : 3)} onClick=${() => handleSort('comments')} className="sortable-header">Comments${getSortIcon('comments')}</th>`}
                            ${visibleColumns.actions && html`<th onMouseDown=${(e) => handleMouseDown(e, displayReferenceColumn ? 5 : 4)} onClick=${() => handleSort('actions')} className="sortable-header">Corrective Actions${getSortIcon('actions')}</th>`}
                            <th onMouseDown=${(e) => handleMouseDown(e, displayReferenceColumn ? 6 : 5)}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sortedItems.map(item => html`
                            <${AuditChecklistTableRow}
                                key=${item.id}
                                item=${item}
                                onUpdate=${onUpdate}
                                onDelete=${onDelete}
                                visibleColumns=${visibleColumns}
                            />
                        `)}
                    </tbody>
                </table>
            </div>
        </div>
    `;
};