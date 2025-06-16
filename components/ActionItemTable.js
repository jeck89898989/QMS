import React from 'react';
import htm from 'htm';
import { TrashIcon } from './Icons.js';

const html = htm.bind(React.createElement);

const { useState, useRef, useEffect } = React;

const ActionItemTableRow = ({ item, onUpdateItem, onDeleteItem, visibleColumns }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onUpdateItem({ ...item, [name]: value });
        if (e.target.tagName.toLowerCase() === 'textarea') {
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
        }
    };

    const priorities = ['Low', 'Medium', 'High', 'Critical'];
    const statuses = ['Open', 'In Progress', 'Pending Review', 'Completed', 'Cancelled'];

    const isOverdue = item.dueDate && new Date(item.dueDate) < new Date() && item.status !== 'Completed' && item.status !== 'Cancelled';

    return html`
        <tr className=${`audit-item-row ${isOverdue ? 'overdue' : ''}`}>
            ${visibleColumns.title && html`<td><textarea rows="1" name="title" value=${item.title} onInput=${handleInputChange} className="form-control" placeholder="Action Title" aria-label=${`Title for ${item.id}`}></textarea></td>`}
            ${visibleColumns.description && html`<td><textarea name="description" value=${item.description} onInput=${handleInputChange} className="form-control" rows="1" placeholder="Description" aria-label=${`Description for ${item.id}`}></textarea></td>`}
            ${visibleColumns.assignedTo && html`<td><textarea rows="1" name="assignedTo" value=${item.assignedTo} onInput=${handleInputChange} className="form-control" placeholder="Assigned To" aria-label=${`Assigned to for ${item.id}`}></textarea></td>`}
            ${visibleColumns.priority && html`<td>
                <select name="priority" value=${item.priority} onChange=${handleInputChange} className="form-control" aria-label=${`Priority for ${item.id}`}>
                    ${priorities.map(priority => html`<option key=${priority} value=${priority}>${priority}</option>`)}
                </select>
            </td>`}
            ${visibleColumns.status && html`<td>
                <select name="status" value=${item.status} onChange=${handleInputChange} className="form-control" aria-label=${`Status for ${item.id}`}>
                    ${statuses.map(status => html`<option key=${status} value=${status}>${status}</option>`)}
                </select>
            </td>`}
            ${visibleColumns.dueDate && html`<td><input type="date" name="dueDate" value=${item.dueDate} onInput=${handleInputChange} className="form-control" aria-label=${`Due date for ${item.id}`} /></td>`}
            ${visibleColumns.category && html`<td><textarea rows="1" name="category" value=${item.category} onInput=${handleInputChange} className="form-control" placeholder="Category" aria-label=${`Category for ${item.id}`}></textarea></td>`}
            ${visibleColumns.completedDate && html`<td><input type="date" name="completedDate" value=${item.completedDate} onInput=${handleInputChange} className="form-control" aria-label=${`Completed date for ${item.id}`} /></td>`}
            ${visibleColumns.notes && html`<td><textarea name="notes" value=${item.notes} onInput=${handleInputChange} className="form-control" rows="1" placeholder="Notes..." aria-label=${`Notes for ${item.id}`}></textarea></td>`}
            <td>
                <button type="button" className="delete-item-btn" onClick=${() => onDeleteItem(item.id)} aria-label=${`Delete action item ${item.title}`}>
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
        if (sortColumn === 'dueDate' || sortColumn === 'completedDate') {
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

export const ActionItemTable = ({ actionItems, onUpdateItem, onDeleteItem, tableView = 'dense', visibleColumns, onToggleColumn }) => {
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
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Description' },
        { key: 'assignedTo', label: 'Assigned To' },
        { key: 'priority', label: 'Priority' },
        { key: 'status', label: 'Status' },
        { key: 'dueDate', label: 'Due Date' },
        { key: 'category', label: 'Category' },
        { key: 'completedDate', label: 'Completed' },
        { key: 'notes', label: 'Notes' }
    ];

    if (!actionItems || actionItems.length === 0) {
        return html`
            <div className="empty-state">
                <h4>No Action Items Found</h4>
                <p>Add a new action item or adjust your filters.</p>
            </div>
        `;
    }

    const sortedItems = sortData(actionItems, sortColumn, sortDirection);

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
                            ${visibleColumns.title && html`<th onMouseDown=${(e) => handleMouseDown(e, 0)} onClick=${() => handleSort('title')} className="sortable-header">Title${getSortIcon('title')}</th>`}
                            ${visibleColumns.description && html`<th onMouseDown=${(e) => handleMouseDown(e, 1)} onClick=${() => handleSort('description')} className="sortable-header">Description${getSortIcon('description')}</th>`}
                            ${visibleColumns.assignedTo && html`<th onMouseDown=${(e) => handleMouseDown(e, 2)} onClick=${() => handleSort('assignedTo')} className="sortable-header">Assigned To${getSortIcon('assignedTo')}</th>`}
                            ${visibleColumns.priority && html`<th onMouseDown=${(e) => handleMouseDown(e, 3)} onClick=${() => handleSort('priority')} className="sortable-header">Priority${getSortIcon('priority')}</th>`}
                            ${visibleColumns.status && html`<th onMouseDown=${(e) => handleMouseDown(e, 4)} onClick=${() => handleSort('status')} className="sortable-header">Status${getSortIcon('status')}</th>`}
                            ${visibleColumns.dueDate && html`<th onMouseDown=${(e) => handleMouseDown(e, 5)} onClick=${() => handleSort('dueDate')} className="sortable-header">Due Date${getSortIcon('dueDate')}</th>`}
                            ${visibleColumns.category && html`<th onMouseDown=${(e) => handleMouseDown(e, 6)} onClick=${() => handleSort('category')} className="sortable-header">Category${getSortIcon('category')}</th>`}
                            ${visibleColumns.completedDate && html`<th onMouseDown=${(e) => handleMouseDown(e, 7)} onClick=${() => handleSort('completedDate')} className="sortable-header">Completed${getSortIcon('completedDate')}</th>`}
                            ${visibleColumns.notes && html`<th onMouseDown=${(e) => handleMouseDown(e, 8)} onClick=${() => handleSort('notes')} className="sortable-header">Notes${getSortIcon('notes')}</th>`}
                            <th onMouseDown=${(e) => handleMouseDown(e, 9)}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sortedItems.map(item => html`
                            <${ActionItemTableRow}
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