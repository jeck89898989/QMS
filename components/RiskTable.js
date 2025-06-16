import React from 'react';
import htm from 'htm';
import { TrashIcon } from './Icons.js';

const html = htm.bind(React.createElement);

const RiskTableRow = ({ risk, data, onUpdateRisk, onDeleteRisk, visibleColumns }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onUpdateRisk({ ...risk, [name]: value });
        if (e.target.tagName.toLowerCase() === 'textarea') {
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
        }
    };

    return html`
        <tr className="audit-item-row">
            ${visibleColumns.description && html`<td>
                 <textarea
                    name="description"
                    className="form-control"
                    rows="1"
                    value=${risk.description}
                    onInput=${handleInputChange}
                    placeholder="Risk Description"
                ></textarea>
            </td>`}
            ${visibleColumns.severity && html`<td>
                <select
                    name="severity"
                    className="form-control"
                    value=${risk.severity}
                    onChange=${handleInputChange}
                >
                    ${data.severityLevels.map(s => html`<option key=${s} value=${s}>${s}</option>`)}
                </select>
            </td>`}
            ${visibleColumns.likelihood && html`<td>
                <select
                    name="likelihood"
                    className="form-control"
                    value=${risk.likelihood}
                    onChange=${handleInputChange}
                >
                    ${data.likelihoodLevels.map(l => html`<option key=${l} value=${l}>${l}</option>`)}
                </select>
            </td>`}
            ${visibleColumns.mitigation && html`<td>
                <textarea
                    name="mitigation"
                    className="form-control"
                    rows="1"
                    value=${risk.mitigation}
                    onInput=${handleInputChange}
                    placeholder="Mitigation Plan..."
                ></textarea>
            </td>`}
            <td>
                <button
                    type="button"
                    className="delete-item-btn"
                    onClick=${() => onDeleteRisk(risk.id)}
                    aria-label=${`Delete risk: ${risk.description}`}
                >
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
        
        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });
};

export const RiskTable = ({ data, onUpdateRisk, onDeleteRisk, tableView = 'dense', visibleColumns, onToggleColumn }) => {
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
        { key: 'description', label: 'Description' },
        { key: 'severity', label: 'Severity' },
        { key: 'likelihood', label: 'Likelihood' },
        { key: 'mitigation', label: 'Mitigation Plan' }
    ];

    if (!data.risks || data.risks.length === 0) {
        return html`
            <div className="empty-state">
                <h4>No Risks Defined</h4>
                <p>Add a risk to get started.</p>
            </div>
        `;
    }

    const sortedRisks = sortData(data.risks, sortColumn, sortDirection);

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
                            ${visibleColumns.description && html`<th onMouseDown=${(e) => handleMouseDown(e, 0)} onClick=${() => handleSort('description')} className="sortable-header">Description${getSortIcon('description')}</th>`}
                            ${visibleColumns.severity && html`<th onMouseDown=${(e) => handleMouseDown(e, 1)} onClick=${() => handleSort('severity')} className="sortable-header">Severity${getSortIcon('severity')}</th>`}
                            ${visibleColumns.likelihood && html`<th onMouseDown=${(e) => handleMouseDown(e, 2)} onClick=${() => handleSort('likelihood')} className="sortable-header">Likelihood${getSortIcon('likelihood')}</th>`}
                            ${visibleColumns.mitigation && html`<th onMouseDown=${(e) => handleMouseDown(e, 3)} onClick=${() => handleSort('mitigation')} className="sortable-header">Mitigation Plan${getSortIcon('mitigation')}</th>`}
                            <th onMouseDown=${(e) => handleMouseDown(e, 4)}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sortedRisks.map(risk => html`
                            <${RiskTableRow}
                                key=${risk.id}
                                risk=${risk}
                                data=${data}
                                onUpdateRisk=${onUpdateRisk}
                                onDeleteRisk=${onDeleteRisk}
                                visibleColumns=${visibleColumns}
                            />
                        `)}
                    </tbody>
                </table>
            </div>
        </div>
    `;
};