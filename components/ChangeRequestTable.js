import React from 'react';
import htm from 'htm';
import { TrashIcon } from './Icons.js';
const { useState, useRef, useEffect } = React;

const html = htm.bind(React.createElement);

const ChangeRequestTableRow = ({ item, onUpdateItem, onDeleteItem, visibleColumns }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onUpdateItem({ ...item, [name]: value });
        if (e.target.tagName.toLowerCase() === 'textarea') {
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
        }
    };

    const statuses = ['Draft', 'Under Review', 'Approved', 'Rejected', 'Implemented'];
    const priorities = ['Low', 'Medium', 'High', 'Critical'];

    return html`
        <tr className="audit-item-row">
            ${visibleColumns.requestTitle && html`<td><textarea name="requestTitle" rows="1" value=${item.requestTitle} onInput=${handleInputChange} className="form-control" placeholder="Request Title" aria-label=${`Title for ${item.id}`}></textarea></td>`}
            ${visibleColumns.description && html`<td><textarea name="description" value=${item.description} onInput=${handleInputChange} className="form-control" rows="1" placeholder="Description" aria-label=${`Description for ${item.id}`}></textarea></td>`}
            ${visibleColumns.requestor && html`<td><textarea name="requestor" rows="1" value=${item.requestor} onInput=${handleInputChange} className="form-control" placeholder="Requestor" aria-label=${`Requestor for ${item.id}`}></textarea></td>`}
            ${visibleColumns.dateSubmitted && html`<td><input type="date" name="dateSubmitted" value=${item.dateSubmitted} onInput=${handleInputChange} className="form-control" aria-label=${`Date Submitted for ${item.id}`} /></td>`}
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
            ${visibleColumns.impactAnalysis && html`<td><textarea name="impactAnalysis" value=${item.impactAnalysis} onInput=${handleInputChange} className="form-control" rows="1" placeholder="Impact Analysis" aria-label=${`Impact Analysis for ${item.id}`}></textarea></td>`}
            ${visibleColumns.businessJustification && html`<td><textarea name="businessJustification" value=${item.businessJustification} onInput=${handleInputChange} className="form-control" rows="1" placeholder="Business Justification" aria-label=${`Business Justification for ${item.id}`}></textarea></td>`}
            ${visibleColumns.approvalHistory && html`<td><textarea name="approvalHistory" value=${item.approvalHistory} onInput=${handleInputChange} className="form-control" rows="1" placeholder="Approval History" aria-label=${`Approval History for ${item.id}`}></textarea></td>`}
            ${visibleColumns.implementationDate && html`<td><input type="date" name="implementationDate" value=${item.implementationDate} onInput=${handleInputChange} className="form-control" aria-label=${`Implementation Date for ${item.id}`} /></td>`}
            ${visibleColumns.notes && html`<td><textarea name="notes" value=${item.notes} onInput=${handleInputChange} className="form-control" rows="1" placeholder="Notes..." aria-label=${`Notes for ${item.id}`}></textarea></td>`}
            <td>
                <button type="button" className="delete-item-btn" onClick=${() => onDeleteItem(item.id)} aria-label=${`Delete change request ${item.requestTitle}`}>
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
        if (sortColumn === 'dateSubmitted' || sortColumn === 'implementationDate') {
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

export const ChangeRequestTable = ({ changeRequests, onUpdateItem, onDeleteItem, tableView = 'dense', visibleColumns, onToggleColumn }) => {
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
        { key: 'requestTitle', label: 'Title' },
        { key: 'description', label: 'Description' },
        { key: 'requestor', label: 'Requestor' },
        { key: 'dateSubmitted', label: 'Date Submitted' },
        { key: 'status', label: 'Status' },
        { key: 'priority', label: 'Priority' },
        { key: 'impactAnalysis', label: 'Impact Analysis' },
        { key: 'businessJustification', label: 'Business Justification' },
        { key: 'approvalHistory', label: 'Approval History' },
        { key: 'implementationDate', label: 'Implementation Date' },
        { key: 'notes', label: 'Notes' }
    ];

    if (!changeRequests || changeRequests.length === 0) {
        return html`
            <div className="empty-state">
                <h4>No Change Requests Found</h4>
                <p>Add a new change request or adjust your filters.</p>
            </div>
        `;
    }

    const sortedItems = sortData(changeRequests, sortColumn, sortDirection);

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
                            ${visibleColumns.requestTitle && html`<th onMouseDown=${(e) => handleMouseDown(e, 0)} onClick=${() => handleSort('requestTitle')} className="sortable-header">Title${getSortIcon('requestTitle')}</th>`}
                            ${visibleColumns.description && html`<th onMouseDown=${(e) => handleMouseDown(e, 1)} onClick=${() => handleSort('description')} className="sortable-header">Description${getSortIcon('description')}</th>`}
                            ${visibleColumns.requestor && html`<th onMouseDown=${(e) => handleMouseDown(e, 2)} onClick=${() => handleSort('requestor')} className="sortable-header">Requestor${getSortIcon('requestor')}</th>`}
                            ${visibleColumns.dateSubmitted && html`<th onMouseDown=${(e) => handleMouseDown(e, 3)} onClick=${() => handleSort('dateSubmitted')} className="sortable-header">Date Submitted${getSortIcon('dateSubmitted')}</th>`}
                            ${visibleColumns.status && html`<th onMouseDown=${(e) => handleMouseDown(e, 4)} onClick=${() => handleSort('status')} className="sortable-header">Status${getSortIcon('status')}</th>`}
                            ${visibleColumns.priority && html`<th onMouseDown=${(e) => handleMouseDown(e, 5)} onClick=${() => handleSort('priority')} className="sortable-header">Priority${getSortIcon('priority')}</th>`}
                            ${visibleColumns.impactAnalysis && html`<th onMouseDown=${(e) => handleMouseDown(e, 6)} onClick=${() => handleSort('impactAnalysis')} className="sortable-header">Impact Analysis${getSortIcon('impactAnalysis')}</th>`}
                            ${visibleColumns.businessJustification && html`<th onMouseDown=${(e) => handleMouseDown(e, 7)} onClick=${() => handleSort('businessJustification')} className="sortable-header">Business Justification${getSortIcon('businessJustification')}</th>`}
                            ${visibleColumns.approvalHistory && html`<th onMouseDown=${(e) => handleMouseDown(e, 8)} onClick=${() => handleSort('approvalHistory')} className="sortable-header">Approval History${getSortIcon('approvalHistory')}</th>`}
                            ${visibleColumns.implementationDate && html`<th onMouseDown=${(e) => handleMouseDown(e, 9)} onClick=${() => handleSort('implementationDate')} className="sortable-header">Implementation Date${getSortIcon('implementationDate')}</th>`}
                            ${visibleColumns.notes && html`<th onMouseDown=${(e) => handleMouseDown(e, 10)} onClick=${() => handleSort('notes')} className="sortable-header">Notes${getSortIcon('notes')}</th>`}
                            <th onMouseDown=${(e) => handleMouseDown(e, 11)}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sortedItems.map(item => html`
                            <${ChangeRequestTableRow}
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