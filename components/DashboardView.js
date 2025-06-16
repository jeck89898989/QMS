import React from 'react';
import htm from 'htm';
import { DownloadIcon } from './Icons.js';
import { DashboardCardContent } from './DashboardCardContent.js';
import { MODULE_GROUPS } from '../data/appConfig.js';

const html = htm.bind(React.createElement);

/**
 * DashboardView Component
 */
export const DashboardView = ({ dashboardData, setActiveTab, onExport, theme }) => {
    const hasData = Object.keys(dashboardData).length > 0;
    
    // Group dashboard data by module groups
    const groupedData = {};
    if (hasData) {
        // Initialize groups
        Object.entries(MODULE_GROUPS).forEach(([groupKey, group]) => {
            groupedData[groupKey] = {
                title: group.title,
                items: []
            };
        });

        // Add ungrouped category for items not in any group
        groupedData.ungrouped = {
            title: 'Other',
            items: []
        };

        // Categorize each dashboard item
        Object.entries(dashboardData).forEach(([key, entryData]) => {
            if (!entryData || !entryData.data) return;
            
            // Find which group this module belongs to
            let foundGroup = false;
            Object.entries(MODULE_GROUPS).forEach(([groupKey, group]) => {
                if (group.modules.includes(key)) {
                    groupedData[groupKey].items.push({ key, entryData });
                    foundGroup = true;
                }
            });
            
            // If not found in any group, add to ungrouped
            if (!foundGroup) {
                groupedData.ungrouped.items.push({ key, entryData });
            }
        });

        // Remove empty groups
        Object.keys(groupedData).forEach(groupKey => {
            if (groupedData[groupKey].items.length === 0) {
                delete groupedData[groupKey];
            }
        });
    }
    
    return html`
        <div>
            <h2>Dashboard</h2>
            <p>Welcome to the MRC Global Quality Management System. Here's an overview of your enabled modules.</p>
            ${!hasData ? html`
                <div className="empty-state">
                    <h4>No Modules Enabled</h4>
                    <p>Enable some modules in the settings to see them here.</p>
                </div>
            ` : html`
                <div>
                    ${Object.entries(groupedData).map(([groupKey, group]) => html`
                        <div key=${groupKey} className="dashboard-group">
                            <h3 className="dashboard-group-title">${group.title}</h3>
                            <div className="dashboard-grid">
                                ${group.items.map(({ key, entryData }) => html`
                                    <div key=${key} className="dashboard-card">
                                        <h4>${entryData.config.title}</h4>
                                        <${DashboardCardContent} config=${entryData.config} data=${entryData.data} theme=${theme} />
                                        <div className="dashboard-card-actions">
                                            <button className="btn" onClick=${() => setActiveTab(key)}>
                                                View Details
                                            </button>
                                             <button className="control-btn" onClick=${() => onExport(key)} title="Export summary to XLSX">
                                                <${DownloadIcon} /> XLSX
                                            </button>
                                        </div>
                                    </div>
                                `)}
                            </div>
                        </div>
                    `)}
                </div>
            `}
        </div>
    `;
};