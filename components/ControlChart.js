import React from 'react';
import htm from 'htm';
import { DashboardChart } from './DashboardChart.js';
import { ControlChartControls } from './ControlChartControls.js';

const html = htm.bind(React.createElement);
const { useState, useEffect, useCallback, useMemo } = React;

// Helper to calculate statistics for an I-MR chart
const calculateIChartStats = (dataPoints) => {
    if (dataPoints.length < 2) {
        return { mean: 0, ucl: 0, lcl: 0, data: [], points: [] };
    }

    const mean = dataPoints.reduce((a, b) => a + b, 0) / dataPoints.length;
    
    // Moving Range (MR) calculation
    const movingRanges = [];
    for (let i = 1; i < dataPoints.length; i++) {
        movingRanges.push(Math.abs(dataPoints[i] - dataPoints[i - 1]));
    }
    const mrBar = movingRanges.reduce((a, b) => a + b, 0) / movingRanges.length;

    const ucl = mean + 2.66 * mrBar;
    const lcl = mean - 2.66 * mrBar;

    return {
        mean,
        ucl,
        lcl,
        data: dataPoints,
        points: dataPoints.map((point, index) => ({
            x: index + 1,
            y: point,
            isOutOfControl: point > ucl || point < lcl
        }))
    };
};


export const ControlChart = ({ title, storageKey, initialData, theme }) => {
    const [processData, setProcessData] = useState(initialData);
    
    useEffect(() => {
        try {
            const storedData = localStorage.getItem(storageKey);
            setProcessData(storedData ? JSON.parse(storedData) : initialData);
        } catch (error) {
            console.error("Failed to load control chart data", error);
            setProcessData(initialData);
        }
    }, [storageKey, initialData]);

    const persistData = (newData) => {
        setProcessData(newData);
        try {
            localStorage.setItem(storageKey, JSON.stringify(newData));
        } catch (error) {
            console.error("Failed to save control chart data", error);
        }
    };
    
    const stats = useMemo(() => calculateIChartStats(processData.dataPoints || []), [processData.dataPoints]);

    const handleAddPoint = useCallback((newPoint) => {
        const point = parseFloat(newPoint);
        if (!isNaN(point)) {
            const newDataPoints = [...processData.dataPoints, point];
            persistData({ ...processData, dataPoints: newDataPoints });
        }
    }, [processData]);

    const handleImport = useCallback((importedData) => {
        if (window.confirm('This will overwrite the current data. Are you sure?')) {
            if (importedData && Array.isArray(importedData.dataPoints)) {
                persistData(importedData);
            } else if (Array.isArray(importedData)) {
                // Handle CSV import which is just an array of objects with a 'value' key
                const numericData = importedData.map(d => parseFloat(d.value)).filter(v => !isNaN(v));
                 persistData({ ...processData, dataPoints: numericData });
            } else {
                alert('Invalid data format. Expected an object with "dataPoints" array or a CSV with a "value" column.');
            }
        }
    }, [processData]);

    const style = useMemo(() => getComputedStyle(document.documentElement), [theme]);
    const themeColors = useMemo(() => ({
        primary: style.getPropertyValue('--primary-color').trim(),
        accent: style.getPropertyValue('--accent-color').trim(),
        extremeRisk: '#dc3545',
        text: style.getPropertyValue('--text-color').trim(),
    }), [theme]);

    const chartConfig = useMemo(() => ({
        type: 'line',
        data: {
            labels: stats.points.map(p => p.x),
            datasets: [
                {
                    label: 'UCL',
                    data: Array(stats.points.length).fill(stats.ucl),
                    borderColor: themeColors.extremeRisk,
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false,
                },
                {
                    label: 'Center Line',
                    data: Array(stats.points.length).fill(stats.mean),
                    borderColor: themeColors.accent,
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false,
                },
                {
                    label: 'LCL',
                    data: Array(stats.points.length).fill(stats.lcl),
                    borderColor: themeColors.extremeRisk,
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: '+1', // Fill to previous dataset (Center Line)
                    backgroundColor: 'rgba(220, 53, 69, 0.05)',
                },
                {
                    label: processData.processName || 'Process Data',
                    data: stats.points.map(p => p.y),
                    borderColor: themeColors.primary,
                    pointBackgroundColor: stats.points.map(p => p.isOutOfControl ? themeColors.extremeRisk : themeColors.primary),
                    pointRadius: stats.points.map(p => p.isOutOfControl ? 6 : 4),
                    pointHoverRadius: 8,
                    tension: 0.1,
                    fill: false,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: `${processData.processName || 'Process Control Chart'}`
                },
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Measurement'
                    }
                },
                x: {
                     title: {
                        display: true,
                        text: 'Sample Number'
                    }
                }
            }
        }
    }), [stats, processData.processName, themeColors]);

    const outOfControlCount = stats.points.filter(p => p.isOutOfControl).length;

    return html`
        <div className="component-showcase">
            <h2>${title}</h2>
            <${ControlChartControls}
                onAddPoint=${handleAddPoint}
                onImport=${handleImport}
                onExport=${() => processData}
                title=${title}
            />
            <div className="control-chart-container">
                ${stats.data.length > 1 ? html`
                    <div className="control-chart-summary">
                        <span>Mean: ${stats.mean.toFixed(3)}</span>
                        <span>UCL: ${stats.ucl.toFixed(3)}</span>
                        <span>LCL: ${stats.lcl.toFixed(3)}</span>
                        <span>Out of Control: ${outOfControlCount}</span>
                    </div>
                    <${DashboardChart} chartConfig=${chartConfig} theme=${theme || 'light'} />
                ` : html`
                    <div className="empty-state">
                        <h4>Not Enough Data</h4>
                        <p>Add at least two data points to generate the control chart.</p>
                    </div>
                `}
            </div>
        </div>
    `;
};