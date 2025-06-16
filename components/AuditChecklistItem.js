import React from 'react';
import htm from 'htm';
import { TrashIcon } from './Icons.js';

const html = htm.bind(React.createElement);

/**
 * AuditChecklistItem Component
 * Displays a single interactive item in the audit checklist.
 * @param {{
 *   item: {id: string, text: string, completed: boolean, comments: string, actions: string, status: string, reference?: string},
 *   onUpdate: (item: object) => void,
 *   onDelete: (id: string) => void
 * }} props
 */
export const AuditChecklistItem = ({ item, onUpdate, onDelete }) => {
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        onUpdate({ ...item, [name]: newValue });
        if (e.target.tagName.toLowerCase() === 'textarea') {
            e.target.style.height = 'auto';
            e.target.style.height = `${Math.max(40, e.target.scrollHeight)}px`;
        }
    };

    const statusClasses = {
        'not-started': 'status-not-started',
        'in-progress': 'status-in-progress',
        'completed': 'status-completed',
        'needs-review': 'status-needs-review'
    };
    
    return html`
        <fieldset className="audit-item" aria-labelledby=${`item-label-${item.id}`}>
            <legend className="visually-hidden">Audit item: ${item.text}</legend>
            <div className="audit-item-header">
                <label htmlFor=${`item-checkbox-${item.id}`} className="audit-item-main-label">
                    <input
                        type="checkbox"
                        id=${`item-checkbox-${item.id}`}
                        name="completed"
                        checked=${item.completed}
                        onChange=${handleInputChange}
                    />
                    <span id=${`item-label-${item.id}`}>${item.text}</span>
                </label>
                 <button
                    type="button"
                    className="delete-item-btn"
                    onClick=${() => onDelete(item.id)}
                    aria-label=${`Delete item: ${item.text}`}
                >
                    <${TrashIcon} />
                </button>
            </div>
            <div className="audit-item-body">
                ${item.hasOwnProperty('reference') && html`
                    <div className="form-group">
                        <label htmlFor=${`item-reference-${item.id}`}>Reference</label>
                        <textarea
                            rows="1"
                            id=${`item-reference-${item.id}`}
                            name="reference"
                            className="form-control"
                            value=${item.reference}
                            onInput=${handleInputChange}
                            placeholder="e.g., ISO 9001: 7.1.5"
                        ></textarea>
                    </div>
                `}
                <div className="form-group">
                    <label htmlFor=${`item-status-${item.id}`}>Status</label>
                    <select
                        id=${`item-status-${item.id}`}
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
                </div>
                <div className="form-group">
                    <label htmlFor=${`item-comments-${item.id}`}>Comments</label>
                    <textarea
                        id=${`item-comments-${item.id}`}
                        name="comments"
                        className="form-control"
                        rows="3"
                        value=${item.comments}
                        onInput=${handleInputChange}
                        placeholder="Observations, evidence..."
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor=${`item-actions-${item.id}`}>Corrective Actions</label>
                    <textarea
                        id=${`item-actions-${item.id}`}
                        name="actions"
                        className="form-control"
                        rows="3"
                        value=${item.actions}
                        onInput=${handleInputChange}
                        placeholder="Required actions..."
                    ></textarea>
                </div>
            </div>
        </fieldset>
    `;
};