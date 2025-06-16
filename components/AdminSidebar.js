import React from 'react';
import htm from 'htm';
import { CloseIcon } from './Icons.js';
import { ModuleCreator } from './ModuleCreator.js';
import { Documentation } from './Documentation.js';
import { getAllModules, getCustomModules, deleteCustomModule, deleteAllCustomModules, createCustomModule, createExternalResource, deleteExternalResource } from '../data/appConfig.js';

const html = htm.bind(React.createElement);
const { useState } = React;

export const AdminSidebar = ({ isOpen, onClose, appConfig, enabledModules, onToggleModule, groups }) => {
    const [isModuleCreatorOpen, setModuleCreatorOpen] = useState(false);
    const [isDocumentationOpen, setDocumentationOpen] = useState(false);
    const [allModules, setAllModules] = useState(getAllModules());
    // Start with all groups collapsed by default
    const [collapsedGroups, setCollapsedGroups] = useState(() => {
        const initialCollapsed = {};
        Object.keys(groups).forEach(groupKey => {
            initialCollapsed[groupKey] = true;
        });
        initialCollapsed['custom'] = true;
        return initialCollapsed;
    });
    // Set all descriptions to be collapsed by default
    const [collapsedDescriptions, setCollapsedDescriptions] = useState(() => {
        const initialCollapsed = {};
        // Get all modules including custom ones
        const modules = getAllModules();
        Object.keys(modules).forEach(moduleKey => {
            initialCollapsed[moduleKey] = true;
        });
        return initialCollapsed;
    });

    const toggleGroupCollapse = (groupKey) => {
        setCollapsedGroups(prev => ({
            ...prev,
            [groupKey]: !prev[groupKey]
        }));
    };

    const toggleDescription = (moduleKey) => {
        setCollapsedDescriptions(prev => ({
            ...prev,
            [moduleKey]: !prev[moduleKey]
        }));
    };

    const handleModuleCreated = (moduleKey, module) => {
        // Refresh the modules list
        const updatedModules = getAllModules();
        setAllModules(updatedModules);
        
        // If a specific module was created, enable it
        if (moduleKey && !enabledModules.includes(moduleKey)) {
            onToggleModule(moduleKey);
        }
        
        setModuleCreatorOpen(false);
    };

    const handleDeleteCustomModule = (moduleKey) => {
        if (window.confirm('Are you sure you want to delete this custom module? This action cannot be undone.')) {
            try {
                deleteCustomModule(moduleKey);
                const updatedModules = getAllModules();
                setAllModules(updatedModules);
                
                // If the module was enabled, disable it
                if (enabledModules.includes(moduleKey)) {
                    onToggleModule(moduleKey);
                }
                
                alert('Module deleted successfully');
            } catch (error) {
                alert(`Failed to delete module: ${error.message}`);
            }
        }
    };

    const handleDeleteAllCustomModules = () => {
        const customModules = getCustomModules();
        const customModuleCount = Object.keys(customModules).length;
        
        if (customModuleCount === 0) {
            alert('No custom modules to delete.');
            return;
        }
        
        if (window.confirm(`Are you sure you want to delete all ${customModuleCount} custom modules? This action cannot be undone and will also clear all associated data.`)) {
            try {
                const deletedCount = deleteAllCustomModules();
                const updatedModules = getAllModules();
                setAllModules(updatedModules);
                
                // Disable any custom modules that were enabled
                Object.keys(customModules).forEach(moduleKey => {
                    if (enabledModules.includes(moduleKey)) {
                        onToggleModule(moduleKey);
                    }
                });
                
                alert(`Successfully deleted ${deletedCount} custom modules.`);
            } catch (error) {
                alert(`Failed to delete custom modules: ${error.message}`);
            }
        }
    };

    const handleAddExternalResource = () => {
        const resourceName = prompt('Enter a name for the external resource:');
        if (!resourceName) return;
        
        const resourceUrl = prompt('Enter the URL for the external resource:');
        if (!resourceUrl) return;
        
        const resourceDescription = prompt('Enter a description for the external resource (optional):') || `External link to ${resourceName}`;
        
        try {
            const resourceData = {
                key: resourceName.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_'),
                title: resourceName,
                url: resourceUrl,
                description: resourceDescription
            };
            
            const result = createExternalResource(resourceData);
            const updatedModules = getAllModules();
            setAllModules(updatedModules);
            
            // Enable the new resource
            if (!enabledModules.includes(result.resourceKey)) {
                onToggleModule(result.resourceKey);
            }
            
            alert('External resource added successfully!');
        } catch (error) {
            alert(`Failed to create external resource: ${error.message}`);
        }
    };

    const handleDeleteExternalResource = (resourceKey) => {
        if (window.confirm('Are you sure you want to delete this external resource? This action cannot be undone.')) {
            try {
                deleteExternalResource(resourceKey);
                const updatedModules = getAllModules();
                setAllModules(updatedModules);
                
                // If the resource was enabled, disable it
                if (enabledModules.includes(resourceKey)) {
                    onToggleModule(resourceKey);
                }
                
                alert('External resource deleted successfully');
            } catch (error) {
                alert(`Failed to delete external resource: ${error.message}`);
            }
        }
    };

    const handleShowAll = () => {
        Object.keys(allModules).forEach(moduleKey => {
            if (!enabledModules.includes(moduleKey)) {
                onToggleModule(moduleKey);
            }
        });
    };

    const handleHideAll = () => {
        [...enabledModules].forEach(moduleKey => {
            onToggleModule(moduleKey);
        });
    };

    return html`
        <div className=${`admin-sidebar ${isOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-labelledby="sidebar-title">
            <div className="sidebar-header">
                <h3 id="sidebar-title">Settings</h3>
                <button onClick=${onClose} className="close-sidebar-btn" aria-label="Close settings">
                    <${CloseIcon} />
                </button>
            </div>
            <div className="sidebar-content">
                <div className="module-management-section">
                    <h4>Module Management</h4>
                    <div className="module-bulk-actions">
                        <button 
                            className="control-btn" 
                            onClick=${handleShowAll}
                            disabled=${enabledModules.length === Object.keys(allModules).length}
                        >
                            Show All
                        </button>
                        <button 
                            className="control-btn" 
                            onClick=${handleHideAll}
                            disabled=${enabledModules.length === 0}
                        >
                            Hide All
                        </button>
                    </div>
                    <div className="module-creation-actions">
                        <button 
                            className="btn create-module-btn" 
                            onClick=${() => setModuleCreatorOpen(true)}
                        >
                            Create New Module
                        </button>
                        <button 
                            className="control-btn" 
                            onClick=${() => setDocumentationOpen(true)}
                        >
                            View Documentation
                        </button>
                        <button 
                            className="control-btn delete-all-custom-btn" 
                            onClick=${handleDeleteAllCustomModules}
                            disabled=${Object.keys(getCustomModules()).length === 0}
                        >
                            Delete All Custom Modules
                        </button>
                    </div>
                </div>

                <h4>Enabled Modules</h4>
                <p>Select which modules are available in the application.</p>
                
                ${Object.entries(groups).map(([groupKey, group]) => {
                    // Check if there are any modules to render for this group
                    const visibleModules = group.modules.filter(moduleKey => allModules[moduleKey]);
                    if (visibleModules.length === 0) return null;

                    const isCollapsed = collapsedGroups[groupKey];

                    return html`
                        <div key=${groupKey} className="module-group">
                            <h5 
                                className="module-group-header" 
                                onClick=${() => toggleGroupCollapse(groupKey)}
                                style=${{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <span style=${{ transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>▼</span>
                                ${group.title}
                                ${groupKey === 'externalResources' && html`
                                    <button
                                        type="button"
                                        className="control-btn"
                                        onClick=${(e) => {
                                            e.stopPropagation();
                                            handleAddExternalResource();
                                        }}
                                        style=${{ marginLeft: 'auto', fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                                        title="Add External Resource"
                                    >
                                        + Add Resource
                                    </button>
                                `}
                            </h5>
                            ${!isCollapsed && html`
                                <ul className="module-toggle-list">
                                    ${visibleModules.map(moduleKey => {
                                        const config = allModules[moduleKey];
                                        return html`
                                            <label key=${moduleKey} className="module-toggle-label">
                                                <div className="module-toggle-header">
                                                    <input 
                                                        type="checkbox" 
                                                        checked=${enabledModules.includes(moduleKey)}
                                                        onChange=${() => onToggleModule(moduleKey)}
                                                    />
                                                    <div className="module-info">
                                                        <div className="module-title-row">
                                                            <span className="module-title">${config.title}</span>
                                                            <button
                                                                type="button"
                                                                className="toggle-description-btn"
                                                                onClick=${(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    toggleDescription(moduleKey);
                                                                }}
                                                                aria-label=${collapsedDescriptions[moduleKey] ? "Show description" : "Hide description"}
                                                            >
                                                                ${collapsedDescriptions[moduleKey] ? '▼' : '▲'}
                                                            </button>
                                                            ${config.isCustom && html`
                                                                <button
                                                                    type="button"
                                                                    className="delete-custom-module-btn"
                                                                    onClick=${(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        handleDeleteCustomModule(moduleKey);
                                                                    }}
                                                                    title="Delete custom module"
                                                                    aria-label=${`Delete ${config.title}`}
                                                                >
                                                                    ×
                                                                </button>
                                                            `}
                                                            ${config.isDynamic && html`
                                                                <button
                                                                    type="button"
                                                                    className="delete-custom-module-btn"
                                                                    onClick=${(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        handleDeleteExternalResource(moduleKey);
                                                                    }}
                                                                    title="Delete external resource"
                                                                    aria-label=${`Delete ${config.title}`}
                                                                >
                                                                    ×
                                                                </button>
                                                            `}
                                                        </div>
                                                        ${!collapsedDescriptions[moduleKey] && config.description && html`
                                                            <div className="module-description">${config.description}</div>
                                                        `}
                                                    </div>
                                                </div>
                                            </label>
                                        `;
                                    })}
                                </ul>
                            `}
                        </div>
                    `;
                })}

                ${/* Custom modules group if any exist */
                (() => {
                    const customModules = getCustomModules();
                    const customKeys = Object.keys(customModules);
                    if (customKeys.length === 0) return null;

                    const isCollapsed = collapsedGroups['custom'];

                    return html`
                        <div className="module-group">
                            <h5 
                                className="module-group-header" 
                                onClick=${() => toggleGroupCollapse('custom')}
                                style=${{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <span style=${{ transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>▼</span>
                                Custom Modules
                            </h5>
                            ${!isCollapsed && html`
                                <ul className="module-toggle-list">
                                    ${customKeys.map(moduleKey => {
                                        const config = customModules[moduleKey];
                                        return html`
                                            <label key=${moduleKey} className="module-toggle-label">
                                                <div className="module-toggle-header">
                                                    <input 
                                                        type="checkbox" 
                                                        checked=${enabledModules.includes(moduleKey)}
                                                        onChange=${() => onToggleModule(moduleKey)}
                                                    />
                                                    <div className="module-info">
                                                        <div className="module-title-row">
                                                            <span className="module-title">${config.title}</span>
                                                            <button
                                                                type="button"
                                                                className="toggle-description-btn"
                                                                onClick=${(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    toggleDescription(moduleKey);
                                                                }}
                                                                aria-label=${collapsedDescriptions[moduleKey] ? "Show description" : "Hide description"}
                                                            >
                                                                ${collapsedDescriptions[moduleKey] ? '▼' : '▲'}
                                                            </button>
                                                            ${config.isCustom && html`
                                                                <button
                                                                    type="button"
                                                                    className="delete-custom-module-btn"
                                                                    onClick=${(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        handleDeleteCustomModule(moduleKey);
                                                                    }}
                                                                    title="Delete custom module"
                                                                    aria-label=${`Delete ${config.title}`}
                                                                >
                                                                    ×
                                                                </button>
                                                            `}
                                                            ${config.isDynamic && html`
                                                                <button
                                                                    type="button"
                                                                    className="delete-custom-module-btn"
                                                                    onClick=${(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        handleDeleteExternalResource(moduleKey);
                                                                    }}
                                                                    title="Delete external resource"
                                                                    aria-label=${`Delete ${config.title}`}
                                                                >
                                                                    ×
                                                                </button>
                                                            `}
                                                        </div>
                                                        ${!collapsedDescriptions[moduleKey] && config.description && html`
                                                            <div className="module-description">${config.description}</div>
                                                        `}
                                                    </div>
                                                </div>
                                            </label>
                                        `;
                                    })}
                                </ul>
                            `}
                        </div>
                    `;
                })()}
            </div>
        </div>
        ${isOpen && html`<div className="sidebar-overlay" onClick=${onClose}></div>`}
        <${ModuleCreator}
            isOpen=${isModuleCreatorOpen}
            onClose=${() => setModuleCreatorOpen(false)}
            onModuleCreated=${handleModuleCreated}
        />
        <${Documentation}
            isOpen=${isDocumentationOpen}
            onClose=${() => setDocumentationOpen(false)}
        />
    `;
};