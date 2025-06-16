import React from 'react';
import htm from 'htm';
import { AuditChecklistItem } from './AuditChecklistItem.js';

const html = htm.bind(React.createElement);

/**
 * AuditChecklist Component (Presentational Card View)
 * @param {{
 *   items: Array<object>,
 *   onUpdate: (item: object) => void,
 *   onDelete: (id: string) => void,
 * }} props
 */
export const AuditChecklist = ({ items, onUpdate, onDelete }) => {
    if (!items || items.length === 0) {
        return html`
            <div className="empty-state">
                <h4>No Audit Items</h4>
                <p>Add an item to get started.</p>
            </div>
        `;
    }

    return html`
        <div className="audit-checklist" role="list">
            ${items.map(item => html`
                <${AuditChecklistItem}
                    key=${item.id}
                    item=${item}
                    onUpdate=${onUpdate}
                    onDelete=${onDelete}
                />
            `)}
        </div>
    `;
};