import React from 'react';
import htm from 'htm';
import { TrashIcon } from './Icons.js';

const html = htm.bind(React.createElement);

const { useState, useRef, useEffect } = React;

const ScorecardTableRow = ({ item, onUpdateItem, onDeleteItem, visibleColumns }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onUpdateItem({ ...item, [name]: value });
        if (e.target.tagName.toLowerCase() === 'textarea') {
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
        }
    };

    const getScoreColor = (score) => {
        if (score >= 95) return 'score-excellent';
        if (score >= 85) return 'score-good';
        if (score >= 75) return 'score-average';
        return 'score-poor';
    };

    return html`
        <tr className="audit-item-row">
            ${visibleColumns.supplierName && html`<td><textarea name="supplierName" rows="1" value=${item.supplierName} onInput=${handleInputChange} className="form-control" placeholder="Supplier Name" aria-label=${`Supplier Name for ${item.id}`}></textarea></td>`}
            ${visibleColumns.period && html`<td><textarea name="period" rows="1" value=${item.period} onInput=${handleInputChange} className="form-control" placeholder="e.g. 2024-Q3" aria-label=${`Period for ${item.id}`}></textarea></td>`}
            ${visibleColumns.onTimeDelivery && html`<td><input type="number" name="onTimeDelivery" value=${item.onTimeDelivery} onInput=${handleInputChange} className="form-control" min="0" max="100" step="0.1" placeholder="%" aria-label=${`On-Time Delivery for ${item.id}`} /></td>`}
            ${visibleColumns.qualityAcceptance && html`<td><input type="number" name="qualityAcceptance" value=${item.qualityAcceptance} onInput=${handleInputChange} className="form-control" min="0" max="100" step="0.1" placeholder="%" aria-label=${`Quality Acceptance for ${item.id}`} /></td>`}
            ${visibleColumns.carResponseTime && html`<td><input type="number" name="carResponseTime" value=${item.carResponseTime} onInput=${handleInputChange} className="form-control" min="0" placeholder="days" aria-label=${`CAR Response Time for ${item.id}`} /></td>`}
            ${visibleColumns.overallScore && html`<td className=${`score-cell ${getScoreColor(item.overallScore)}`}>
                <strong>${item.overallScore}</strong>
            </td>`}
            ${visibleColumns.notes && html`<td><textarea name="notes" value=${item.notes} onInput=${handleInputChange} className="form-control" rows="1" placeholder="Notes..." aria-label=${`Notes for ${item.id}`}></textarea></td>`}
            <td>
                <button type="button" className="delete-item-btn" onClick=${() => onDeleteItem(item.id)} aria-label=${`Delete scorecard ${item.supplierName}`}>
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
        
        // Handle numeric fields
        if (sortColumn === 'onTimeDelivery' || sortColumn === 'qualityAcceptance' || sortColumn === 'carResponseTime' || sortColumn === 'overallScore') {
            aVal = parseFloat(aVal) || 0;
            bVal = parseFloat(bVal) || 0;
        } else if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });
};

export const SupplierScorecardTable = ({ scorecards, onUpdateItem, onDeleteItem, tableView = 'dense', visibleColumns, onToggleColumn }) => {
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
        { key: 'supplierName', label: 'Supplier Name' },
        { key: 'period', label: 'Period' },
        { key: 'onTimeDelivery', label: 'On-Time Delivery (%)' },
        { key: 'qualityAcceptance', label: 'Quality Acceptance (%)' },
        { key: 'carResponseTime', label: 'CAR Response (days)' },
        { key: 'overallScore', label: 'Overall Score' },
        { key: 'notes', label: 'Notes' }
    ];

    if (!scorecards || scorecards.length === 0) {
        return html`
            <div className="empty-state">
                <h4>No Supplier Scorecards Found</h4>
                <p>Add a new scorecard entry or adjust your filters.</p>
            </div>
        `;
    }

    const sortedItems = sortData(scorecards, sortColumn, sortDirection);

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
                            ${visibleColumns.supplierName && html`<th onMouseDown=${(e) => handleMouseDown(e, 0)} onClick=${() => handleSort('supplierName')} className="sortable-header">Supplier Name${getSortIcon('supplierName')}</th>`}
                            ${visibleColumns.period && html`<th onMouseDown=${(e) => handleMouseDown(e, 1)} onClick=${() => handleSort('period')} className="sortable-header">Period${getSortIcon('period')}</th>`}
                            ${visibleColumns.onTimeDelivery && html`<th onMouseDown=${(e) => handleMouseDown(e, 2)} onClick=${() => handleSort('onTimeDelivery')} className="sortable-header">On-Time Delivery (%)${getSortIcon('onTimeDelivery')}</th>`}
                            ${visibleColumns.qualityAcceptance && html`<th onMouseDown=${(e) => handleMouseDown(e, 3)} onClick=${() => handleSort('qualityAcceptance')} className="sortable-header">Quality Acceptance (%)${getSortIcon('qualityAcceptance')}</th>`}
                            ${visibleColumns.carResponseTime && html`<th onMouseDown=${(e) => handleMouseDown(e, 4)} onClick=${() => handleSort('carResponseTime')} className="sortable-header">CAR Response Time (days)${getSortIcon('carResponseTime')}</th>`}
                            ${visibleColumns.overallScore && html`<th onMouseDown=${(e) => handleMouseDown(e, 5)} onClick=${() => handleSort('overallScore')} className="sortable-header">Overall Score${getSortIcon('overallScore')}</th>`}
                            ${visibleColumns.notes && html`<th onMouseDown=${(e) => handleMouseDown(e, 6)} onClick=${() => handleSort('notes')} className="sortable-header">Notes${getSortIcon('notes')}</th>`}
                            <th onMouseDown=${(e) => handleMouseDown(e, 7)}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sortedItems.map(item => html`
                            <${ScorecardTableRow}
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