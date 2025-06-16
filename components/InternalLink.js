import React from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);
const { useState, useEffect } = React;

/**
 * InternalLink Component
 * Displays an internal navigation link within the application
 */
export const InternalLink = ({ title, storageKey, initialData }) => {
    const [linkData, setLinkData] = useState(initialData);

    useEffect(() => {
        try {
            const storedData = localStorage.getItem(storageKey);
            setLinkData(storedData ? JSON.parse(storedData) : initialData);
        } catch (error) {
            console.error("Failed to load internal link data", error);
            setLinkData(initialData);
        }
    }, [storageKey, initialData]);

    const persistData = (newData) => {
        setLinkData(newData);
        try {
            localStorage.setItem(storageKey, JSON.stringify(newData));
        } catch (error) {
            console.error("Failed to save internal link data", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedData = { ...linkData, [name]: value };
        persistData(updatedData);
    };

    const handleNavigate = () => {
        if (linkData.targetModule) {
            // Trigger navigation to the target module
            const event = new CustomEvent('navigate-to-module', { 
                detail: { moduleKey: linkData.targetModule } 
            });
            window.dispatchEvent(event);
        }
    };

    return html`
        <div className="component-showcase">
            <h2>${title}</h2>
            <div className="internal-link-container">
                <div className="internal-link-form">
                    <div className="form-group">
                        <label htmlFor="targetModule">Target Module</label>
                        <input
                            type="text"
                            id="targetModule"
                            name="targetModule"
                            className="form-control"
                            value=${linkData.targetModule}
                            onInput=${handleInputChange}
                            placeholder="e.g., car, actionItems, documentControl"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            className="form-control"
                            rows="3"
                            value=${linkData.description}
                            onInput=${handleInputChange}
                            placeholder="Describe this internal navigation link..."
                        ></textarea>
                    </div>
                </div>
                <div className="internal-link-preview">
                    <div className="internal-link-card">
                        <h3>${title}</h3>
                        <p>${linkData.description}</p>
                        <div className="internal-link-actions">
                            <button 
                                className="btn"
                                onClick=${handleNavigate}
                                disabled=${!linkData.targetModule}
                            >
                                Navigate to Module
                            </button>
                            <div className="internal-link-target">
                                <small>Target: ${linkData.targetModule || 'None specified'}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};