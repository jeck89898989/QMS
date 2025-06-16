import React from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);
const { useState, useEffect } = React;

/**
 * ExternalLink Component
 * Displays an external link with description and opens in a new tab
 */
export const ExternalLink = ({ title, storageKey, initialData }) => {
    const [linkData, setLinkData] = useState(initialData);

    useEffect(() => {
        try {
            const storedData = localStorage.getItem(storageKey);
            setLinkData(storedData ? JSON.parse(storedData) : initialData);
        } catch (error) {
            console.error("Failed to load external link data", error);
            setLinkData(initialData);
        }
    }, [storageKey, initialData]);

    const persistData = (newData) => {
        setLinkData(newData);
        try {
            localStorage.setItem(storageKey, JSON.stringify(newData));
        } catch (error) {
            console.error("Failed to save external link data", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedData = { ...linkData, [name]: value };
        persistData(updatedData);
    };

    const handleOpenLink = () => {
        if (linkData.url) {
            window.open(linkData.url, '_blank', 'noopener,noreferrer');
        }
    };

    return html`
        <div className="component-showcase">
            <h2>${title}</h2>
            <div className="external-link-container">
                <div className="external-link-form">
                    <div className="form-group">
                        <label htmlFor="url">URL</label>
                        <input
                            type="url"
                            id="url"
                            name="url"
                            className="form-control"
                            value=${linkData.url}
                            onInput=${handleInputChange}
                            placeholder="https://example.com"
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
                            placeholder="Describe this external resource..."
                        ></textarea>
                    </div>
                </div>
                <div className="external-link-preview">
                    <div className="external-link-card">
                        <h3>${title}</h3>
                        <p>${linkData.description}</p>
                        <div className="external-link-actions">
                            <button 
                                className="btn"
                                onClick=${handleOpenLink}
                                disabled=${!linkData.url}
                            >
                                Open Link
                            </button>
                            <div className="external-link-url">
                                <small>${linkData.url}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};