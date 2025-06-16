import React from 'react';
import htm from 'htm';
import { TrashIcon } from './Icons.js';

const html = htm.bind(React.createElement);

const ManufacturerTableRow = ({ item, onUpdateItem, onDeleteItem, visibleColumns }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onUpdateItem({ ...item, [name]: value });
        if (e.target.tagName.toLowerCase() === 'textarea') {
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
        }
    };

    const approvalStatuses = ['Approved', 'Probationary', 'Pending', 'Disqualified'];

    return html`
        <tr className="audit-item-row">
            ${visibleColumns.name && html`<td><textarea name="name" rows="1" value=${item.name} onInput=${handleInputChange} className="form-control" placeholder="Name" aria-label=${`Name for ${item.id}`}></textarea></td>`}
            ${visibleColumns.approvalStatus && html`<td>
                <select name="approvalStatus" value=${item.approvalStatus} onChange=${handleInputChange} className="form-control" aria-label=${`Approval status for ${item.name}`}>
                    ${approvalStatuses.map(status => html`<option key=${status} value=${status}>${status}</option>`)}
                </select>
            </td>`}
            ${visibleColumns.materials && html`<td><textarea name="materials" rows="1" value=${item.materials} onInput=${handleInputChange} className="form-control" placeholder="Materials Offered" aria-label=${`Materials for ${item.name}`}></textarea></td>`}
            ${visibleColumns.region && html`<td><textarea name="region" rows="1" value=${item.region} onInput=${handleInputChange} className="form-control" placeholder="Region" aria-label=${`Region for ${item.name}`}></textarea></td>`}
            ${visibleColumns.country && html`<td><textarea name="country" rows="1" value=${item.country} onInput=${handleInputChange} className="form-control" placeholder="Country" aria-label=${`Country for ${item.name}`}></textarea></td>`}
            ${visibleColumns.location && html`<td><textarea name="location" rows="1" value=${item.location} onInput=${handleInputChange} className="form-control" placeholder="City, State/Province" aria-label=${`Location for ${item.name}`}></textarea></td>`}
            ${visibleColumns.capabilities && html`<td><textarea name="capabilities" rows="1" value=${item.capabilities} onInput=${handleInputChange} className="form-control" placeholder="Capabilities" aria-label=${`Capabilities for ${item.name}`}></textarea></td>`}
            ${visibleColumns.lastAuditDate && html`<td><input type="date" name="lastAuditDate" value=${item.lastAuditDate} onInput=${handleInputChange} className="form-control" aria-label=${`Last audit date for ${item.name}`} /></td>`}
            ${visibleColumns.notes && html`<td><textarea name="notes" value=${item.notes} onInput=${handleInputChange} className="form-control" rows="1" placeholder="Audit/Inspection Notes..." aria-label=${`Notes for ${item.name}`}></textarea></td>`}
            <td>
                <button type="button" className="delete-item-btn" onClick=${() => onDeleteItem(item.id)} aria-label=${`Delete manufacturer ${item.name}`}>
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
        if (sortColumn === 'lastAuditDate') {
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

export const ManufacturerTable = ({ manufacturers, onUpdateItem, onDeleteItem, tableView = 'dense', visibleColumns, onToggleColumn }) => {
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
        { key: 'name', label: 'Name' },
        { key: 'approvalStatus', label: 'Status' },
        { key: 'materials', label: 'Materials' },
        { key: 'region', label: 'Region' },
        { key: 'country', label: 'Country' },
        { key: 'location', label: 'Location' },
        { key: 'capabilities', label: 'Capabilities' },
        { key: 'lastAuditDate', label: 'Last Audit' },
        { key: 'notes', label: 'Notes' }
    ];

    if (!manufacturers || manufacturers.length === 0) {
        return html`
            <div className="empty-state">
                <h4>No Manufacturers Found</h4>
                <p>Add a new manufacturer or adjust your filters.</p>
            </div>
        `;
    }

    const sortedItems = sortData(manufacturers, sortColumn, sortDirection);

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
                            ${visibleColumns.name && html`<th onMouseDown=${(e) => handleMouseDown(e, 0)} onClick=${() => handleSort('name')} className="sortable-header">Name${getSortIcon('name')}</th>`}
                            ${visibleColumns.approvalStatus && html`<th onMouseDown=${(e) => handleMouseDown(e, 1)} onClick=${() => handleSort('approvalStatus')} className="sortable-header">Status${getSortIcon('approvalStatus')}</th>`}
                            ${visibleColumns.materials && html`<th onMouseDown=${(e) => handleMouseDown(e, 2)} onClick=${() => handleSort('materials')} className="sortable-header">Materials${getSortIcon('materials')}</th>`}
                            ${visibleColumns.region && html`<th onMouseDown=${(e) => handleMouseDown(e, 3)} onClick=${() => handleSort('region')} className="sortable-header">Region${getSortIcon('region')}</th>`}
                            ${visibleColumns.country && html`<th onMouseDown=${(e) => handleMouseDown(e, 4)} onClick=${() => handleSort('country')} className="sortable-header">Country${getSortIcon('country')}</th>`}
                            ${visibleColumns.location && html`<th onMouseDown=${(e) => handleMouseDown(e, 5)} onClick=${() => handleSort('location')} className="sortable-header">Location${getSortIcon('location')}</th>`}
                            ${visibleColumns.capabilities && html`<th onMouseDown=${(e) => handleMouseDown(e, 6)} onClick=${() => handleSort('capabilities')} className="sortable-header">Capabilities${getSortIcon('capabilities')}</th>`}
                            ${visibleColumns.lastAuditDate && html`<th onMouseDown=${(e) => handleMouseDown(e, 7)} onClick=${() => handleSort('lastAuditDate')} className="sortable-header">Last Audit${getSortIcon('lastAuditDate')}</th>`}
                            ${visibleColumns.notes && html`<th onMouseDown=${(e) => handleMouseDown(e, 8)} onClick=${() => handleSort('notes')} className="sortable-header">Notes${getSortIcon('notes')}</th>`}
                            <th onMouseDown=${(e) => handleMouseDown(e, 9)}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sortedItems.map(item => html`
                            <${ManufacturerTableRow}
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