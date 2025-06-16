import React from 'react';
import htm from 'htm';
import { DashboardChart } from './DashboardChart.js';

const html = htm.bind(React.createElement);
const { useMemo, useState, useEffect } = React;

// Helper function to calculate risk level, mirrors logic from RiskMatrix
const getRiskLevel = (sevIndex, likeIndex) => {
    const score = (sevIndex + 1) * (likeIndex + 1);
    if (score > 15) return { key: 'risk-extreme', name: 'Extreme' };
    if (score > 9) return { key: 'risk-high', name: 'High' };
    if (score > 4) return { key: 'risk-medium', name: 'Medium' };
    return { key: 'risk-low', name: 'Low' };
};

// Chart configuration helpers
const createDoughnutChart = (labels, data, colors, theme, options = {}) => {
    const style = getComputedStyle(document.documentElement);
    const componentBg = style.getPropertyValue('--component-bg').trim();
    
    return {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: colors,
                borderColor: componentBg,
                borderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'right' } },
            cutout: '60%',
            ...options
        }
    };
};

const createBarChart = (labels, data, colors, theme, options = {}) => {
    const backgroundColors = Array.isArray(colors) ? colors : (data ? Array(data.length).fill(colors) : []);
    return {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: options.label || 'Count',
                data,
                backgroundColor: backgroundColors,
            }]
        },
        options: {
            indexAxis: options.indexAxis || 'x',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { 
                ...(options.indexAxis === 'y' 
                    ? { x: { beginAtZero: true, ...options.scaleOptions } } 
                    : { y: { beginAtZero: true, ...options.scaleOptions } })
            },
            ...options
        }
    };
};

const createPieChart = (labels, data, colors, theme, options = {}) => {
    const style = getComputedStyle(document.documentElement);
    const componentBg = style.getPropertyValue('--component-bg').trim();
    
    return {
        type: 'pie',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: colors,
                borderColor: componentBg,
                borderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'right' } },
            ...options
        }
    };
};

const createLineChart = (labels, data, borderColor, theme, options = {}) => {
    return {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: options.label || 'Data',
                data,
                borderColor,
                tension: 0.1,
                pointRadius: 2,
                ...options.datasetOptions
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { display: options.displayScales || false },
                x: { display: options.displayScales || false }
            },
            ...options
        }
    };
};

// Status color mapping utilities
const getStatusColors = (themeColors) => ({
    status: {
        'Draft': themeColors.border,
        'Under Review': themeColors.mediumRisk,
        'Approved': themeColors.primary,
        'Rejected': themeColors.extremeRisk,
        'Implemented': themeColors.accent,
        'Open': themeColors.extremeRisk,
        'In Progress': themeColors.mediumRisk,
        'Pending Review': themeColors.highRisk,
        'Completed': themeColors.accent,
        'Cancelled': themeColors.border,
        'Closed': themeColors.accent,
        'Planned': themeColors.primary,
        'Postponed': themeColors.highRisk,
        'Pass': themeColors.accent,
        'Fail': themeColors.extremeRisk,
        'Pending': themeColors.mediumRisk,
        'Retest': themeColors.highRisk,
        'Scheduled': themeColors.primary,
        'Expired': themeColors.extremeRisk,
        'Obsolete': '#6c757d'
    },
    severity: {
        'Critical': themeColors.extremeRisk,
        'Major': themeColors.highRisk,
        'Minor': themeColors.mediumRisk,
        'N/A': themeColors.border
    },
    approval: {
        'Approved': themeColors.accent,
        'Probationary': '#ffc107',
        'Pending': themeColors.primary,
        'Disqualified': '#6c757d'
    }
});

// Calculation utilities
const calculateOverdue = (items, dateField, statusExclusions = []) => {
    return items.filter(item => 
        item[dateField] && 
        new Date(item[dateField]) < new Date() && 
        !statusExclusions.includes(item.status)
    ).length;
};

const calculateUpcoming = (items, dateField, statusInclusions = []) => {
    return items.filter(item => 
        item[dateField] && 
        new Date(item[dateField]) > new Date() && 
        statusInclusions.includes(item.status)
    ).length;
};

const calculateExpiringSoon = (items, dateField, days = 90, statusRequirement = 'Completed') => {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);

    return items.filter(item => 
        item[dateField] &&
        item.status === statusRequirement &&
        new Date(item[dateField]) > now &&
        new Date(item[dateField]) <= futureDate
    ).length;
};

const countByField = (items, field) => {
    return items.reduce((acc, item) => {
        const value = item[field] || 'N/A';
        acc[value] = (acc[value] || 0) + 1;
        return acc;
    }, {});
};

const ChartTypeSelector = ({ availableTypes, currentType, onTypeChange, moduleKey }) => {
    if (!availableTypes || availableTypes.length <= 1) {
        return null;
    }

    const capitalize = (s) => {
        if (s === 'bar') return 'Bar (H)';
        if (s === 'column') return 'Bar (V)';
        return s.charAt(0).toUpperCase() + s.slice(1);
    };

    return html`
        <div className="dashboard-chart-controls">
            <label htmlFor="chart-type-select-${moduleKey}" class="visually-hidden">Chart Type</label>
            <select
                id="chart-type-select-${moduleKey}"
                className="form-control"
                value=${currentType}
                onChange=${(e) => onTypeChange(e.target.value)}
            >
                ${availableTypes.map(type => html`
                    <option key=${type} value=${type}>
                        ${capitalize(type)}
                    </option>
                `)}
            </select>
        </div>
    `;
};

// Component renderers
const renderMetricsWithChart = (summary, chartConfig, theme, hasData, chartProps) => html`
    <div className="dashboard-card-metrics">
        <p className="dashboard-metric-summary">${summary}</p>
        ${hasData && chartConfig ? html`
            <div className="dashboard-chart-wrapper">
                <${ChartTypeSelector} ...${chartProps} />
                <div className="chart-container">
                    <${DashboardChart} chartConfig=${chartConfig} theme=${theme} />
                </div>
            </div>
        ` : html`<p>No data available for chart.</p>`
        }
    </div>
`;

export const DashboardCardContent = ({ config, data, theme }) => {
    const [chartType, setChartType] = useState(null);

    const style = useMemo(() => getComputedStyle(document.documentElement), [theme]);
    
    const themeColors = useMemo(() => ({
        primary: style.getPropertyValue('--primary-color').trim(),
        accent: style.getPropertyValue('--accent-color').trim(),
        border: style.getPropertyValue('--border-color').trim(),
        componentBg: style.getPropertyValue('--component-bg').trim(),
        mediumRisk: '#ffc107', // orange-yellow
        highRisk: '#fd7e14', // orange
        extremeRisk: '#dc3545', // red
    }), [theme]);

    const colorMaps = useMemo(() => getStatusColors(themeColors), [themeColors]);
    
    const { summary, chartConfig, hasData, initialChartType, availableChartTypes } = useMemo(() => {
        let summary, chartConfig;
        let hasData = false;
        let availableChartTypes = [];
        let initialChartType = 'doughnut';

        const createChart = (type, labels, data, colors, options = {}) => {
            switch (type) {
                case 'bar': return createBarChart(labels, data, colors, theme, { ...options, indexAxis: 'y' }); // Horizontal
                case 'column': return createBarChart(labels, data, colors, theme, { ...options, indexAxis: 'x' }); // Vertical
                case 'pie': return createPieChart(labels, data, colors, theme, options);
                case 'line': return createLineChart(labels, data, options.borderColor || themeColors.primary, theme, options);
                case 'doughnut':
                default:
                    return createDoughnutChart(labels, data, colors, theme, options);
            }
        };

        const currentDisplayType = chartType || initialChartType;

        switch (config.component) {
            case 'ChecklistGenerator':
            case 'ChecklistWrapper': {
                const total = data.length;
                hasData = total > 0;
                const completed = data.filter(i => i.completed).length;
                summary = html`Status: <strong>${completed} / ${total}</strong> items completed.`;
                availableChartTypes = ['doughnut', 'pie', 'column'];
                initialChartType = 'doughnut';
                
                if (hasData) {
                    const chartData = [completed, total - completed];
                    const chartLabels = ['Completed', 'Pending'];
                    const chartColors = [themeColors.accent, themeColors.border];
                    chartConfig = createChart(currentDisplayType, chartLabels, chartData, chartColors);
                }
                break;
            }

            case 'RiskAssessment': {
                const { risks = [], severityLevels = [], likelihoodLevels = [] } = data;
                hasData = risks.length > 0;
                const riskCounts = { Low: 0, Medium: 0, High: 0, Extreme: 0 };
                
                risks.forEach(risk => {
                    const sevIndex = severityLevels.indexOf(risk.severity);
                    const likeIndex = likelihoodLevels.indexOf(risk.likelihood);
                    if (sevIndex !== -1 && likeIndex !== -1) {
                        const level = getRiskLevel(sevIndex, likeIndex);
                        riskCounts[level.name]++;
                    }
                });
                
                summary = html`<strong>${risks.length}</strong> total risks identified.`;
                availableChartTypes = ['bar', 'column', 'pie', 'doughnut'];
                initialChartType = 'bar';

                if (hasData) {
                    chartConfig = createChart(
                        currentDisplayType,
                        Object.keys(riskCounts),
                        Object.values(riskCounts),
                        [themeColors.accent, themeColors.mediumRisk, themeColors.highRisk, themeColors.extremeRisk]
                    );
                }
                break;
            }

            case 'ApprovedManufacturerList': {
                hasData = data.length > 0;
                const statusCounts = countByField(data, 'approvalStatus');
                summary = html`<strong>${data.length}</strong> total manufacturers tracked.`;
                availableChartTypes = ['pie', 'doughnut', 'bar', 'column'];
                initialChartType = 'pie';

                if(hasData) {
                    chartConfig = createChart(
                        currentDisplayType,
                        Object.keys(statusCounts),
                        Object.values(statusCounts),
                        Object.keys(statusCounts).map(status => colorMaps.approval[status] || themeColors.primary)
                    );
                }
                break;
            }

            case 'CorrectiveActionRequest': {
                hasData = data.length > 0;
                const statusCounts = countByField(data, 'status');
                summary = html`<strong>${data.length}</strong> total CARs tracked.`;
                availableChartTypes = ['bar', 'column', 'pie', 'doughnut'];
                initialChartType = 'bar';
                
                if (hasData) {
                    chartConfig = createChart(
                        currentDisplayType,
                        Object.keys(statusCounts),
                        Object.values(statusCounts),
                        Object.keys(statusCounts).map(status => colorMaps.status[status] || themeColors.primary)
                    );
                }
                break;
            }

            case 'AuditFindingsList': {
                hasData = data.length > 0;
                const severityCounts = countByField(data, 'severity');
                summary = html`<strong>${data.length}</strong> total findings recorded.`;
                availableChartTypes = ['pie', 'doughnut', 'column'];
                initialChartType = 'pie';
                
                if (hasData) {
                    chartConfig = createChart(
                        currentDisplayType,
                        Object.keys(severityCounts),
                        Object.values(severityCounts),
                        Object.keys(severityCounts).map(severity => colorMaps.severity[severity] || themeColors.accent)
                    );
                }
                break;
            }

            case 'ActionItemList': {
                hasData = data.length > 0;
                const statusCounts = countByField(data, 'status');
                const overdue = calculateOverdue(data, 'dueDate', ['Completed', 'Cancelled']);
                summary = html`<strong>${data.length}</strong> total action items. <strong>${overdue}</strong> overdue.`;
                availableChartTypes = ['doughnut', 'pie', 'bar'];
                initialChartType = 'doughnut';

                if (hasData) {
                    chartConfig = createChart(
                        currentDisplayType,
                        Object.keys(statusCounts),
                        Object.values(statusCounts),
                        Object.keys(statusCounts).map(status => colorMaps.status[status] || themeColors.primary)
                    );
                }
                break;
            }

            case 'DocumentVersionControl': {
                hasData = data.length > 0;
                const statusCounts = countByField(data, 'status');
                const overdue = calculateOverdue(data, 'nextReviewDate', ['Obsolete']);
                summary = html`<strong>${data.length}</strong> total documents tracked. <strong>${overdue}</strong> overdue for review.`;
                availableChartTypes = ['pie', 'doughnut', 'bar'];
                initialChartType = 'pie';
                
                if(hasData) {
                    chartConfig = createChart(
                        currentDisplayType,
                        Object.keys(statusCounts),
                        Object.values(statusCounts),
                        Object.keys(statusCounts).map(status => colorMaps.status[status] || themeColors.primary)
                    );
                }
                break;
            }

            case 'QcTestResultsList': {
                hasData = data.length > 0;
                const statusCounts = countByField(data, 'status');
                const passRate = data.length > 0 ? ((statusCounts.Pass || 0) / data.length * 100).toFixed(1) : 0;
                summary = html`<strong>${data.length}</strong> test results recorded. <strong>${passRate}%</strong> pass rate.`;
                availableChartTypes = ['doughnut', 'pie', 'column'];
                initialChartType = 'doughnut';

                if (hasData) {
                    chartConfig = createChart(
                        currentDisplayType,
                        Object.keys(statusCounts),
                        Object.values(statusCounts),
                        Object.keys(statusCounts).map(status => colorMaps.status[status] || themeColors.border)
                    );
                }
                break;
            }

            case 'ChangeRequestForm': {
                hasData = data.length > 0;
                const statusCounts = countByField(data, 'status');
                const implemented = statusCounts.Implemented || 0;
                const approved = statusCounts.Approved || 0;
                summary = html`<strong>${data.length}</strong> change requests tracked. <strong>${implemented}</strong> implemented, <strong>${approved}</strong> pending implementation.`;
                availableChartTypes = ['pie', 'doughnut', 'bar'];
                initialChartType = 'pie';
                
                if (hasData) {
                    chartConfig = createChart(
                        currentDisplayType,
                        Object.keys(statusCounts),
                        Object.values(statusCounts),
                        Object.keys(statusCounts).map(status => colorMaps.status[status] || themeColors.border)
                    );
                }
                break;
            }

            case 'PreventiveActionRequest': {
                hasData = data.length > 0;
                const statusCounts = countByField(data, 'status');
                const overdue = calculateOverdue(data, 'dueDate', ['Implemented', 'Closed']);
                const completed = (statusCounts.Implemented || 0) + (statusCounts.Closed || 0);
                summary = html`<strong>${data.length}</strong> PARs tracked. <strong>${completed}</strong> completed, <strong>${overdue}</strong> overdue.`;
                availableChartTypes = ['doughnut', 'pie', 'bar'];
                initialChartType = 'doughnut';

                if(hasData) {
                    chartConfig = createChart(
                        currentDisplayType,
                        Object.keys(statusCounts),
                        Object.values(statusCounts),
                        Object.keys(statusCounts).map(status => colorMaps.status[status] || themeColors.border)
                    );
                }
                break;
            }

            case 'InternalAuditScheduler': {
                hasData = data.length > 0;
                const statusCounts = countByField(data, 'status');
                const upcoming = calculateUpcoming(data, 'scheduledStartDate', ['Planned', 'Postponed']);
                summary = html`<strong>${data.length}</strong> total audits scheduled. <strong>${upcoming}</strong> upcoming.`;
                availableChartTypes = ['bar', 'column', 'pie', 'doughnut'];
                initialChartType = 'bar';

                if (hasData) {
                    chartConfig = createChart(
                        currentDisplayType,
                        Object.keys(statusCounts),
                        Object.values(statusCounts),
                        Object.keys(statusCounts).map(status => colorMaps.status[status] || themeColors.border)
                    );
                }
                break;
            }

            case 'SupplierScorecard': {
                hasData = data.length > 0;
                const sortedData = [...data].sort((a, b) => b.overallScore - a.overallScore).slice(0, 5);
                summary = html`Top 5 of <strong>${data.length}</strong> supplier scorecards.`;
                availableChartTypes = ['bar', 'column', 'line'];
                initialChartType = 'bar';

                if (hasData) {
                    chartConfig = createChart(
                        currentDisplayType,
                        sortedData.map(s => s.supplierName),
                        sortedData.map(s => s.overallScore),
                        sortedData.map(s => s.overallScore).map(score => {
                            if (score >= 95) return themeColors.accent;
                            if (score >= 85) return themeColors.primary;
                            if (score >= 75) return themeColors.mediumRisk;
                            return themeColors.extremeRisk;
                        }),
                        { 
                            label: 'Overall Score',
                            scaleOptions: { min: 60, max: 100 },
                            displayScales: true
                        }
                    );
                }
                break;
            }

            case 'ControlChart': {
                const dataPoints = data.dataPoints || [];
                hasData = dataPoints.length > 0;
                summary = html`<strong>${data.processName || 'Process'}</strong>: ${dataPoints.length} points.`;
                availableChartTypes = ['line', 'column'];
                initialChartType = 'line';

                if (hasData) {
                    if (dataPoints.length > 1) {
                        const mean = dataPoints.reduce((a, b) => a + b, 0) / dataPoints.length;
                        const lastPoint = dataPoints[dataPoints.length - 1];
                        summary = html`${summary} Last: ${lastPoint}, Mean: ${mean.toFixed(2)}`;
                    }
                    chartConfig = createChart(
                        currentDisplayType,
                        dataPoints.map((_, i) => i + 1),
                        dataPoints,
                        themeColors.primary,
                        { label: data.processName }
                    );
                }
                break;
            }

            case 'TrainingRecords': {
                hasData = data.length > 0;
                const expiringSoonCount = calculateExpiringSoon(data, 'expirationDate', 90, 'Completed');
                const expiredCount = calculateOverdue(data.filter(tr => tr.status === 'Completed'), 'expirationDate', []);
                
                const enhancedData = data.map(tr => {
                    if (tr.status === 'Completed' && tr.expirationDate && new Date(tr.expirationDate) < new Date()) {
                        return { ...tr, enhancedStatus: 'Expired' };
                    }
                    return { ...tr, enhancedStatus: tr.status };
                });
                
                const statusCounts = countByField(enhancedData, 'enhancedStatus');
                summary = html`<strong>${data.length}</strong> records. <strong>${expiringSoonCount}</strong> expiring soon. <strong>${expiredCount}</strong> expired.`;
                availableChartTypes = ['doughnut', 'pie', 'bar'];
                initialChartType = 'doughnut';
                
                if(hasData) {
                    chartConfig = createChart(
                        currentDisplayType,
                        Object.keys(statusCounts),
                        Object.values(statusCounts),
                        Object.keys(statusCounts).map(status => colorMaps.status[status] || themeColors.border)
                    );
                }
                break;
            }

            default: {
                hasData = false;
                summary = config.component.endsWith('Link') ? null : html`<p>No dashboard summary available for this module.</p>`;
            }
        }
        
        return { summary, chartConfig, hasData, initialChartType, availableChartTypes };

    }, [config, data, theme, chartType, themeColors, colorMaps]);
    
    useEffect(() => {
        setChartType(initialChartType);
    }, [initialChartType]);
    
    // For link components, which don't have charts
    if (config.component === 'ExternalLink') {
        return html`
            <div className="dashboard-card-metrics">
                <p className="dashboard-metric-summary">
                    <strong>External Resource:</strong> ${data.description || 'No description available'}
                </p>
                <div style=${{ marginTop: '1rem' }}>
                    <button 
                        className="btn" 
                        onClick=${() => window.open(data.url, '_blank', 'noopener,noreferrer')}
                        disabled=${!data.url}
                        style=${{ width: '100%' }}
                    >
                        Open Resource
                    </button>
                </div>
            </div>
        `;
    }

    if (config.component === 'InternalLink') {
        const handleNavigate = () => {
            if (data.targetModule) {
                const event = new CustomEvent('navigate-to-module', { 
                    detail: { moduleKey: data.targetModule } 
                });
                window.dispatchEvent(event);
            }
        };

        return html`
            <div className="dashboard-card-metrics">
                <p className="dashboard-metric-summary">
                    <strong>Quick Access:</strong> ${data.description || 'No description available'}
                </p>
                <div style=${{ marginTop: '1rem' }}>
                    <button 
                        className="btn" 
                        onClick=${handleNavigate}
                        disabled=${!data.targetModule}
                        style=${{ width: '100%' }}
                    >
                        Navigate to ${data.targetModule || 'Module'}
                    </button>
                </div>
            </div>
        `;
    }

    const chartProps = {
        availableTypes: availableChartTypes,
        currentType: chartType,
        onTypeChange: setChartType,
        moduleKey: config.storageKey,
    };

    return renderMetricsWithChart(summary, chartConfig, theme, hasData, chartProps);
};