import React from 'react';
import htm from 'htm';
import { TrashIcon } from './Icons.js';
const { useState, useRef, useEffect } = React;

const html = htm.bind(React.createElement);

const ParTableRow = ({ item, onUpdateItem, onDeleteItem, visibleColumns }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onUpdateItem({ ...item, [name]: value });
        if (e.target.tagName.toLowerCase() === 'textarea') {
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
        }
    };

    const statuses = ['Open', 'In Progress', 'Implemented', 'Closed'];
    const priorities = ['Low', 'Medium', 'High', 'Critical'];

    return html`
        <tr className="audit-item-row">
            ${visibleColumns.title && html`<td><textarea name="title" rows="1" value=${item.title} onInput=${handleInputChange} className="form-control" placeholder="PAR Title" aria-label=${`Title for ${item.id}`}></textarea></td>`}
            ${visibleColumns.description && html`<td><textarea name="description" value=${item.description} onInput=${handleInputChange} className="form-control" rows="1" placeholder="Description" aria-label=${`Description for ${item.id}`}></textarea></td>`}
            ${visibleColumns.status && html`<td>
                <select name="status" value=${item.status} onChange=${handleInputChange} className="form-control" aria-label=${`Status for ${item.id}`}>
                    ${statuses.map(status => html`<option key=${status} value=${status}>${status}</option>`)}
                </select>
            </td>`}
            ${visibleColumns.priority && html`<td>
                <select name="priority" value=${item.priority} onChange=${handleInputChange} className="form-control" aria-label=${`Priority for ${item.id}`}>
                    ${priorities.map(priority => html`<option key=${priority} value=${priority}>${priority}</option>`)}
                </select>
            </td>`}
            ${visibleColumns.assignedTo && html`<td><textarea name="assignedTo" rows="1" value=${item.assignedTo} onInput=${handleInputChange} className="form-control" placeholder="Assigned To" aria-label=${`Assigned to for ${item.id}`}></textarea></td>`}
            ${visibleColumns.dueDate && html`<td><input type="date" name="dueDate" value=${item.dueDate} onInput=${handleInputChange} className="form-control" aria-label=${`Due date for ${item.id}`} /></td>`}
            ${visibleColumns.rootCauseAnalysis && html`<td><textarea name="rootCauseAnalysis" value=${item.rootCauseAnalysis} onInput=${handleInputChange} className="form-control" rows="1" placeholder="Root Cause Analysis" aria-label=${`Root Cause Analysis for ${item.id}`}></textarea></td>`}
            ${visibleColumns.preventiveActionPlan && html`<td><textarea name="preventiveActionPlan" value=${item.preventiveActionPlan} onInput=${handleInputChange} className="form-control" rows="1" placeholder="Preventive Action Plan" aria-label=${`Preventive Action Plan for ${item.id}`}></textarea></td>`}
            ${visibleColumns.implementationDate && html`<td><input type="date" name="implementationDate" value=${item.implementationDate} onInput=${handleInputChange} className="form-control" aria-label=${`Implementation date for ${item.id}`} /></td>`}
            ${visibleColumns.effectivenessVerification && html`<td><textarea name="effectivenessVerification" value=${item.effectivenessVerification} onInput=${handleInputChange} className="form-control" rows="1" placeholder="Effectiveness Verification" aria-label=${`Effectiveness Verification for ${item.id}`}></textarea></td>`}
            ${visibleColumns.notes && html`<td><textarea name="notes" value=${item.notes} onInput=${handleInputChange} className="form-control" rows="1" placeholder="Notes..." aria-label=${`Notes for ${item.id}`}></textarea></td>`}
            <td>
                <button type="button" className="delete-item-btn" onClick=${() => onDeleteItem(item.id)} aria-label=${`Delete PAR ${item.title}`}>
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
        if (sortColumn === 'dueDate' || sortColumn === 'implementationDate') {
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

export const ParTable = ({ pars, onUpdateItem, onDeleteItem, tableView = 'dense', visibleColumns, onToggleColumn }) => {
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
        { key: 'status', label: 'Status' },
        { key: 'priority', label: 'Priority' },
        { key: 'assignedTo', label: 'Assigned To' },
        { key: 'dueDate', label: 'Due Date' },
        { key: 'rootCauseAnalysis', label: 'Root Cause' },
        { key: 'preventiveActionPlan', label: 'Action Plan' },
        { key: 'implementationDate', label: 'Implementation Date' },
        { key: 'effectivenessVerification', label: 'Verification' },
        { key: 'notes', label: 'Notes' }
    ];

    if (!pars || pars.length === 0) {
        return html`
            <div className="empty-state">
                <h4>No Preventive Action Requests Found</h4>
                <p>Add a new PAR or adjust your filters.</p>
            </div>
        `;
    }

    const sortedItems = sortData(pars, sortColumn, sortDirection);

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
                            ${visibleColumns.status && html`<th onMouseDown=${(e) => handleMouseDown(e, 2)} onClick=${() => handleSort('status')} className="sortable-header">Status${getSortIcon('status')}</th>`}
                            ${visibleColumns.priority && html`<th onMouseDown=${(e) => handleMouseDown(e, 3)} onClick=${() => handleSort('priority')} className="sortable-header">Priority${getSortIcon('priority')}</th>`}
                            ${visibleColumns.assignedTo && html`<th onMouseDown=${(e) => handleMouseDown(e, 4)} onClick=${() => handleSort('assignedTo')} className="sortable-header">Assigned To${getSortIcon('assignedTo')}</th>`}
                            ${visibleColumns.dueDate && html`<th onMouseDown=${(e) => handleMouseDown(e, 5)} onClick=${() => handleSort('dueDate')} className="sortable-header">Due Date${getSortIcon('dueDate')}</th>`}
                            ${visibleColumns.rootCauseAnalysis && html`<th onMouseDown=${(e) => handleMouseDown(e, 6)} onClick=${() => handleSort('rootCauseAnalysis')} className="sortable-header">Root Cause Analysis${getSortIcon('rootCauseAnalysis')}</th>`}
                            ${visibleColumns.preventiveActionPlan && html`<th onMouseDown=${(e) => handleMouseDown(e, 7)} onClick=${() => handleSort('preventiveActionPlan')} className="sortable-header">Preventive Action Plan${getSortIcon('preventiveActionPlan')}</th>`}
                            ${visibleColumns.implementationDate && html`<th onMouseDown=${(e) => handleMouseDown(e, 8)} onClick=${() => handleSort('implementationDate')} className="sortable-header">Implementation Date${getSortIcon('implementationDate')}</th>`}
                            ${visibleColumns.effectivenessVerification && html`<th onMouseDown=${(e) => handleMouseDown(e, 9)} onClick=${() => handleSort('effectivenessVerification')} className="sortable-header">Effectiveness Verification${getSortIcon('effectivenessVerification')}</th>`}
                            ${visibleColumns.notes && html`<th onMouseDown=${(e) => handleMouseDown(e, 10)} onClick=${() => handleSort('notes')} className="sortable-header">Notes${getSortIcon('notes')}</th>`}
                            <th onMouseDown=${(e) => handleMouseDown(e, 11)}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sortedItems.map(item => html`
                            <${ParTableRow}
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