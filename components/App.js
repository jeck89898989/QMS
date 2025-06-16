import React from 'react';
import ReactDOM from 'react-dom/client';
import htm from 'htm';
import * as XLSX from 'xlsx';
import { LOCAL_STORAGE_THEME_KEY, LOCAL_STORAGE_MODULES_KEY } from '../constants.js';
import { APP_CONFIG, MODULE_GROUPS, getAllModules } from '../data/appConfig.js';
import { SunIcon, MoonIcon, CogIcon, PlusIcon, MenuIcon, ImportIcon, DownloadIcon, CloseIcon, ChevronDownIcon } from './Icons.js';
import { DashboardView } from './DashboardView.js';
import { ChecklistWrapper } from './ChecklistWrapper.js';
import { AdminSidebar } from './AdminSidebar.js';
import { RiskAssessment } from './RiskAssessment.js';
import { ApprovedManufacturerList } from './ApprovedManufacturerList.js';
import { CorrectiveActionRequest } from './CorrectiveActionRequest.js';
import { AuditFindingsList } from './AuditFindingsList.js';
import { ActionItemList } from './ActionItemList.js';
import { DocumentVersionControl } from './DocumentVersionControl.js';
import { QcTestResultsList } from './QcTestResultsList.js';
import { ChangeRequestForm } from './ChangeRequestForm.js';
import { PreventiveActionRequest } from './PreventiveActionRequest.js';
import { InternalAuditScheduler } from './InternalAuditScheduler.js';
import { ChecklistGenerator } from './ChecklistGenerator.js';
import { SupplierScorecard } from './SupplierScorecard.js';
import { ControlChart } from './ControlChart.js';
import { TrainingRecords } from './TrainingRecords.js';
import { ExternalLink } from './ExternalLink.js';
import { InternalLink } from './InternalLink.js';
import { NotificationGenerator } from './NotificationGenerator.js';

const html = htm.bind(React.createElement);
const { useState, useEffect, useMemo, useRef } = React;

const COMPONENT_MAP = {
    ChecklistWrapper,
    RiskAssessment,
    ApprovedManufacturerList,
    CorrectiveActionRequest,
    AuditFindingsList,
    ActionItemList,
    DocumentVersionControl,
    QcTestResultsList,
    ChangeRequestForm,
    PreventiveActionRequest,
    InternalAuditScheduler,
    ChecklistGenerator,
    SupplierScorecard,
    ControlChart,
    TrainingRecords,
    ExternalLink,
    InternalLink,
    NotificationGenerator
};

// Define the grouping structure for all modules - now imported from appConfig
const GROUPS = MODULE_GROUPS;

/**
 * A reusable dropdown component for the main navigation bar.
 */
const NavDropdown = ({ group, enabledModules, activeTab, setActiveTab, allModules }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const groupModules = useMemo(() => group.modules.filter(key => enabledModules.includes(key)), [group, enabledModules]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (groupModules.length === 0) return null;

    const isActive = groupModules.includes(activeTab);

    const handleButtonClick = () => {
        if (groupModules.length === 1) {
            setActiveTab(groupModules[0]);
        } else {
            setIsOpen(prev => !prev);
        }
    };

    return html`
        <div className="nav-dropdown" ref=${dropdownRef}>
            <button
                className=${`nav-button ${isActive ? 'active' : ''}`}
                onClick=${handleButtonClick}
                aria-haspopup="true"
                aria-expanded=${isOpen}
            >
                <span className="nav-button-text">${group.title}</span>
                ${groupModules.length > 1 ? html`
                    <span className=${`nav-arrow ${isOpen ? 'open' : ''}`}>
                        <${ChevronDownIcon} />
                    </span>
                ` : ''}
            </button>
            ${groupModules.length > 1 && html`
                <div className=${`nav-dropdown-content ${isOpen ? 'open' : ''}`}>
                    ${groupModules.map(key => {
                        const config = allModules[key];
                        if (!config) return null;
                        return html`
                            <button
                                key=${key}
                                className="nav-dropdown-item"
                                aria-current=${activeTab === key ? 'page' : undefined}
                                onClick=${() => { setActiveTab(key); setIsOpen(false); }}
                            >${config.title}</button>
                        `;
                    })}
                </div>
            `}
        </div>
    `;
};

/**
 * FloatingActionButton Component
 * Provides quick access to common actions for the current module
 */
const FloatingActionButton = ({ activeTab, appConfig, onQuickAction }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const fabRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (fabRef.current && !fabRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Don't show FAB on dashboard
    if (activeTab === 'dashboard') return null;

    const config = appConfig[activeTab];
    if (!config) return null;

    const canAdd = ['ChecklistWrapper', 'ChecklistGenerator', 'RiskAssessment', 'ApprovedManufacturerList', 
                    'CorrectiveActionRequest', 'AuditFindingsList', 'ActionItemList', 'DocumentVersionControl',
                    'QcTestResultsList', 'ChangeRequestForm', 'PreventiveActionRequest', 'InternalAuditScheduler',
                    'SupplierScorecard', 'ControlChart', 'TrainingRecords'].includes(config.component);

    if (!canAdd) return null;

    const getAddLabel = () => {
        switch (config.component) {
            case 'ChecklistWrapper':
            case 'ChecklistGenerator':
                return 'Add Checklist Item';
            case 'RiskAssessment':
                return 'Add Risk';
            case 'ApprovedManufacturerList':
                return 'Add Manufacturer';
            case 'CorrectiveActionRequest':
                return 'Add CAR';
            case 'AuditFindingsList':
                return 'Add Finding';
            case 'ActionItemList':
                return 'Add Action Item';
            case 'DocumentVersionControl':
                return 'Add Document';
            case 'QcTestResultsList':
                return 'Add Test Result';
            case 'ChangeRequestForm':
                return 'Add Change Request';
            case 'PreventiveActionRequest':
                return 'Add PAR';
            case 'InternalAuditScheduler':
                return 'Add Audit';
            case 'SupplierScorecard':
                return 'Add Scorecard';
            case 'ControlChart':
                return 'Add Data Point';
            case 'TrainingRecords':
                return 'Add Training Record';
            default:
                return 'Add Item';
        }
    };

    return html`
        <div className="fab-container" ref=${fabRef}>
            ${isMenuOpen && html`
                <div className="fab-menu open">
                    <button className="fab-menu-item" onClick=${() => { onQuickAction('add'); setIsMenuOpen(false); }}>
                        <${PlusIcon} />
                        ${getAddLabel()}
                    </button>
                    <button className="fab-menu-item" onClick=${() => { onQuickAction('import'); setIsMenuOpen(false); }}>
                        <${ImportIcon} />
                        Import Data
                    </button>
                    <button className="fab-menu-item" onClick=${() => { onQuickAction('export'); setIsMenuOpen(false); }}>
                        <${DownloadIcon} />
                        Export Data
                    </button>
                </div>
            `}
            <button 
                className="fab"
                onClick=${() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Quick actions menu"
                title="Quick actions"
            >
                ${isMenuOpen ? html`<${CloseIcon} />` : html`<${MenuIcon} />`}
            </button>
        </div>
    `;
};

/**
 * Global Search Component
 */
const GlobalSearch = ({ isOpen, onClose, dashboardData, setActiveTab }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const searchInputRef = useRef(null);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }

        const results = [];
        const term = searchTerm.toLowerCase();

        Object.entries(dashboardData).forEach(([moduleKey, moduleData]) => {
            const config = moduleData.config;
            const data = moduleData.data;

            if (!Array.isArray(data)) {
                if (data.risks) {
                    // Risk assessment data
                    data.risks.forEach(item => {
                        if (item.description?.toLowerCase().includes(term) || 
                            item.mitigation?.toLowerCase().includes(term)) {
                            results.push({
                                type: 'Risk',
                                module: config.title,
                                moduleKey,
                                title: item.description,
                                subtitle: `${item.severity} - ${item.likelihood}`,
                                item
                            });
                        }
                    });
                }
                return;
            }

            data.forEach(item => {
                let matches = false;
                let title = '';
                let subtitle = '';

                // Check different item types and their searchable fields
                if (item.text && item.text.toLowerCase().includes(term)) {
                    // Checklist items
                    matches = true;
                    title = item.text;
                    subtitle = `Status: ${item.status}`;
                } else if (item.title && item.title.toLowerCase().includes(term)) {
                    // Action items, PARs, Change requests
                    matches = true;
                    title = item.title;
                    subtitle = item.assignedTo ? `Assigned to: ${item.assignedTo}` : `Status: ${item.status}`;
                } else if (item.finding && item.finding.toLowerCase().includes(term)) {
                    // Audit findings
                    matches = true;
                    title = item.finding;
                    subtitle = `${item.severity} - ${item.department}`;
                } else if (item.description && item.description.toLowerCase().includes(term)) {
                    // CARs
                    matches = true;
                    title = item.description;
                    subtitle = `Status: ${item.status}`;
                } else if (item.name && item.name.toLowerCase().includes(term)) {
                    // Manufacturers
                    matches = true;
                    title = item.name;
                    subtitle = `Status: ${item.approvalStatus}`;
                } else if (item.supplierName && item.supplierName.toLowerCase().includes(term)) {
                    // Supplier scorecards
                    matches = true;
                    title = item.supplierName;
                    subtitle = `Score: ${item.overallScore}`;
                } else if (item.documentName && item.documentName.toLowerCase().includes(term)) {
                    // Documents
                    matches = true;
                    title = item.documentName;
                    subtitle = `v${item.version} - ${item.status}`;
                } else if (item.sampleId && item.sampleId.toLowerCase().includes(term)) {
                    // QC Test results
                    matches = true;
                    title = item.sampleId;
                    subtitle = `${item.product} - ${item.status}`;
                } else if (item.employeeName && item.employeeName.toLowerCase().includes(term)) {
                    // Training records
                    matches = true;
                    title = `${item.employeeName} - ${item.courseTitle}`;
                    subtitle = `Status: ${item.status}`;
                } else if (item.auditTitle && item.auditTitle.toLowerCase().includes(term)) {
                    // Audit scheduler
                    matches = true;
                    title = item.auditTitle;
                    subtitle = `${item.department} - ${item.status}`;
                } else if (item.requestTitle && item.requestTitle.toLowerCase().includes(term)) {
                    // Change requests
                    matches = true;
                    title = item.requestTitle;
                    subtitle = `${item.requestor} - ${item.status}`;
                }

                if (matches) {
                    results.push({
                        type: getItemType(config.component),
                        module: config.title,
                        moduleKey,
                        title: title.length > 60 ? title.substring(0, 60) + '...' : title,
                        subtitle,
                        item
                    });
                }
            });
        });

        setSearchResults(results.slice(0, 20)); // Limit to 20 results
    }, [searchTerm, dashboardData]);

    const getItemType = (component) => {
        switch (component) {
            case 'ChecklistWrapper':
            case 'ChecklistGenerator':
                return 'Checklist Item';
            case 'ActionItemList':
                return 'Action Item';
            case 'CorrectiveActionRequest':
                return 'CAR';
            case 'PreventiveActionRequest':
                return 'PAR';
            case 'AuditFindingsList':
                return 'Finding';
            case 'ApprovedManufacturerList':
                return 'Manufacturer';
            case 'SupplierScorecard':
                return 'Scorecard';
            case 'DocumentVersionControl':
                return 'Document';
            case 'QcTestResultsList':
                return 'Test Result';
            case 'TrainingRecords':
                return 'Training';
            case 'InternalAuditScheduler':
                return 'Audit';
            case 'ChangeRequestForm':
                return 'Change Request';
            default:
                return 'Item';
        }
    };

    const handleResultClick = (result) => {
        setActiveTab(result.moduleKey);
        onClose();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return html`
        <div className="search-overlay" onClick=${onClose}>
            <div className="search-modal" onClick=${e => e.stopPropagation()}>
                <div className="search-input-container">
                    <input
                        ref=${searchInputRef}
                        type="text"
                        className="search-input"
                        placeholder="Search across all modules... (ESC to close)"
                        value=${searchTerm}
                        onInput=${e => setSearchTerm(e.target.value)}
                        onKeyDown=${handleKeyDown}
                    />
                </div>
                <div className="search-results">
                    ${searchResults.length === 0 && searchTerm.trim() ? html`
                        <div className="search-no-results">No results found for "${searchTerm}"</div>
                    ` : ''}
                    ${searchResults.map((result, index) => html`
                        <div
                            key=${index}
                            className="search-result-item"
                            onClick=${() => handleResultClick(result)}
                        >
                            <div className="search-result-header">
                                <span className="search-result-type">${result.type}</span>
                                <span className="search-result-module">${result.module}</span>
                            </div>
                            <div className="search-result-title">${result.title}</div>
                            <div className="search-result-subtitle">${result.subtitle}</div>
                        </div>
                    `)}
                </div>
                ${searchTerm.trim() === '' ? html`
                    <div className="search-help">
                        <p>Search across all your QMS data:</p>
                        <ul>
                            <li>Action items, CARs, and PARs</li>
                            <li>Audit findings and checklists</li>
                            <li>Documents and training records</li>
                            <li>Manufacturers and suppliers</li>
                            <li>Test results and more...</li>
                        </ul>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
};

/**
 * Keyboard Shortcuts Help Component
 */
const ShortcutsHelp = ({ isOpen, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            const handleKeyDown = (e) => {
                if (e.key === 'Escape') {
                    onClose();
                }
            };
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const shortcuts = [
        { key: 'Ctrl/⌘ + K', description: 'Global search across all modules' },
        { key: 'Ctrl/⌘ + N', description: 'Add new item to current module' },
        { key: 'Ctrl/⌘ + E', description: 'Export data from current module' },
        { key: 'Ctrl/⌘ + I', description: 'Import data to current module' },
        { key: 'Ctrl/⌘ + ,', description: 'Open settings' },
        { key: 'Ctrl/⌘ + ?', description: 'Show this help' },
        { key: 'F1', description: 'Show this help' },
        { key: 'Escape', description: 'Close modals and overlays' },
        { key: 'Tab', description: 'Navigate between form fields' },
        { key: 'Enter', description: 'Submit forms or save changes' },
    ];

    return html`
        <div className="shortcuts-overlay" onClick=${onClose}>
            <div className="shortcuts-modal" onClick=${e => e.stopPropagation()}>
                <div className="shortcuts-header">
                    <h3>Keyboard Shortcuts</h3>
                    <button
                        className="close-shortcuts-btn"
                        onClick=${onClose}
                        aria-label="Close shortcuts help"
                    >
                        <${CloseIcon} />
                    </button>
                </div>
                <div className="shortcuts-content">
                    <p>Use these keyboard shortcuts to navigate and interact with the QMS more efficiently:</p>
                    <div className="shortcuts-grid">
                        ${shortcuts.map((shortcut, index) => html`
                            <div key=${index} className="shortcut-item">
                                <kbd className="shortcut-key">${shortcut.key}</kbd>
                                <span className="shortcut-description">${shortcut.description}</span>
                            </div>
                        `)}
                    </div>
                    <div className="shortcuts-footer">
                        <p><strong>Tip:</strong> Most shortcuts work context-sensitively based on your current module.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
};

/**
 * Main App Component
 * Manages the overall application layout, theme, and renders the component showcase.
 */
export const App = () => {
    const [theme, setTheme] = useState(() => localStorage.getItem(LOCAL_STORAGE_THEME_KEY) || 'light');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [dashboardData, setDashboardData] = useState({});
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isSearchOpen, setSearchOpen] = useState(false);
    const [isShortcutsHelpOpen, setShortcutsHelpOpen] = useState(false);
    const [allModules, setAllModules] = useState(getAllModules()); // Use getAllModules instead of APP_CONFIG
    const moreMenuRef = useRef(null);
    
    const [enabledModules, setEnabledModules] = useState(() => {
        try {
            const storedModules = localStorage.getItem(LOCAL_STORAGE_MODULES_KEY);
            return storedModules ? JSON.parse(storedModules) : [];
        } catch (e) {
            console.error('Failed to parse enabled modules from localStorage', e);
            return [];
        }
    });

    // Refresh modules when they change
    useEffect(() => {
        const refreshModules = () => {
            const updatedModules = getAllModules();
            setAllModules(updatedModules);
        };
        
        // Listen for custom module changes
        window.addEventListener('storage', refreshModules);
        return () => window.removeEventListener('storage', refreshModules);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
    }, [theme]);
    
    useEffect(() => {
        try {
            localStorage.setItem(LOCAL_STORAGE_MODULES_KEY, JSON.stringify(enabledModules));
        } catch (e) {
            console.error('Failed to save enabled modules to localStorage', e);
        }
    }, [enabledModules]);

    // Close "More" dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
                setMoreMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [moreMenuRef]);

    // Load all module data for the dashboard summary
    useEffect(() => {
        const allData = {};
        for (const key of enabledModules) {
            const config = allModules[key]; // Use allModules instead of APP_CONFIG
            if (!config) continue;

            try {
                const storedData = localStorage.getItem(config.storageKey);
                allData[key] = {
                    config,
                    data: storedData ? JSON.parse(storedData) : config.initialData,
                };
            } catch (error) {
                console.error(`Failed to load data for ${key}`, error);
                allData[key] = { config, data: config.initialData };
            }
        }
        setDashboardData(allData);
    }, [enabledModules, allModules]); // Add allModules as dependency

    // Add event listener for internal navigation
    useEffect(() => {
        const handleInternalNavigation = (event) => {
            const { moduleKey } = event.detail;
            if (enabledModules.includes(moduleKey)) {
                setActiveTab(moduleKey);
            } else {
                alert(`Module "${moduleKey}" is not enabled. Please enable it in settings first.`);
            }
        };

        window.addEventListener('navigate-to-module', handleInternalNavigation);
        return () => window.removeEventListener('navigate-to-module', handleInternalNavigation);
    }, [enabledModules]);

    // Global keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ctrl+K or Cmd+K to open search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(true);
            }
            // Ctrl+? or F1 to show shortcuts help
            if (((e.ctrlKey || e.metaKey) && e.key === '/') || e.key === 'F1') {
                e.preventDefault();
                setShortcutsHelpOpen(true);
            }
            // Escape to close any open modals
            if (e.key === 'Escape') {
                setSearchOpen(false);
                setShortcutsHelpOpen(false);
            }
            // Ctrl+N or Cmd+N to add new item (if on a module page)
            if ((e.ctrlKey || e.metaKey) && e.key === 'n' && activeTab !== 'dashboard') {
                e.preventDefault();
                handleQuickAction('add');
            }
            // Ctrl+E or Cmd+E to export
            if ((e.ctrlKey || e.metaKey) && e.key === 'e' && activeTab !== 'dashboard') {
                e.preventDefault();
                handleQuickAction('export');
            }
            // Ctrl+I or Cmd+I to import
            if ((e.ctrlKey || e.metaKey) && e.key === 'i' && activeTab !== 'dashboard') {
                e.preventDefault();
                handleQuickAction('import');
            }
            // Ctrl+, or Cmd+, to open settings
            if ((e.ctrlKey || e.metaKey) && e.key === ',') {
                e.preventDefault();
                setSidebarOpen(true);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [activeTab]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const handleToggleModule = (moduleKey) => {
        setEnabledModules(prev => {
            const newEnabled = prev.includes(moduleKey)
                ? prev.filter(k => k !== moduleKey)
                : [...prev, moduleKey];
            
            // If the active tab is being disabled, switch to dashboard
            if (activeTab === moduleKey && !newEnabled.includes(moduleKey)) {
                setActiveTab('dashboard');
            }
            return newEnabled;
        });
        
        // Refresh modules list to pick up any new custom modules
        setAllModules(getAllModules());
    };
    
    const handleDashboardExport = (moduleKey) => {
        const config = allModules[moduleKey]; // Use allModules instead of APP_CONFIG
        if (!config) return;

        try {
            const storedData = localStorage.getItem(config.storageKey);
            const data = storedData ? JSON.parse(storedData) : config.initialData;
            let dataToExport = [];
            let sheetName = "Export";

            if (!data) {
                 alert('No data to export.');
                 return;
            }

            switch (config.component) {
                case 'ChecklistWrapper':
                    sheetName = "Checklist";
                    const hasReference = data.length > 0 && data.some(i => i.hasOwnProperty('reference'));
                    dataToExport = data.map(item => {
                        const base = { id: item.id, text: item.text };
                        if (hasReference) base.reference = item.reference;
                        return { ...base, completed: item.completed, status: item.status, comments: item.comments, actions: item.actions };
                    });
                    break;
                case 'RiskAssessment':
                    sheetName = "Risks";
                    dataToExport = data.risks ? data.risks.map(r => ({ id: r.id, description: r.description, severity: r.severity, likelihood: r.likelihood, mitigation: r.mitigation })) : [];
                    break;
                case 'ApprovedManufacturerList':
                    sheetName = "Manufacturers";
                    dataToExport = data;
                    break;
                case 'CorrectiveActionRequest':
                    sheetName = "CARs";
                    dataToExport = data;
                    break;
                case 'AuditFindingsList':
                    sheetName = "AuditFindings";
                    dataToExport = data;
                    break;
                case 'DocumentVersionControl':
                    sheetName = "Documents";
                    dataToExport = data;
                    break;
                case 'QcTestResultsList':
                    sheetName = "QC_Results";
                    dataToExport = data;
                    break;
                case 'ChangeRequestForm':
                    sheetName = "ChangeRequests";
                    dataToExport = data;
                    break;
                case 'PreventiveActionRequest':
                    sheetName = "PARs";
                    dataToExport = data;
                    break;
                case 'InternalAuditScheduler':
                    sheetName = "AuditSchedules";
                    dataToExport = data;
                    break;
                case 'SupplierScorecard':
                    sheetName = "SupplierScorecards";
                    dataToExport = data;
                    break;
                case 'ControlChart':
                    sheetName = "ControlChartData";
                    dataToExport = data.dataPoints ? data.dataPoints.map((value, index) => ({ process: data.processName, sample: index + 1, value })) : [];
                    break;
                case 'TrainingRecords':
                    sheetName = "TrainingRecords";
                    dataToExport = data;
                    break;
                default:
                    console.warn(`Dashboard export not implemented for component type: ${config.component}`);
                    return;
            }

            if (!dataToExport || dataToExport.length === 0) {
                alert('No data to export.');
                return;
            }

            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
            XLSX.writeFile(workbook, `${config.title}-Summary.xlsx`);

        } catch (error) {
            console.error(`Failed to export data for ${moduleKey}`, error);
            alert('An error occurred during export.');
        }
    };
    
    const handleQuickAction = (action) => {
        // Trigger the action by finding and clicking the appropriate button
        // This is a simple implementation that finds buttons by their text content
        const buttons = document.querySelectorAll('button');
        
        switch (action) {
            case 'add':
                const addButtons = Array.from(buttons).find(btn => 
                    btn.textContent.includes('Add') && 
                    !btn.textContent.includes('Import') && 
                    !btn.className.includes('fab')
                );
                if (addButtons) addButtons.click();
                break;
            case 'import':
                const importButton = Array.from(buttons).find(btn => btn.textContent === 'Import');
                if (importButton) importButton.click();
                break;
            case 'export':
                const exportButtons = Array.from(buttons).filter(btn => 
                    btn.textContent.includes('JSON') || 
                    btn.textContent.includes('CSV') || 
                    btn.textContent.includes('XLSX')
                );
                if (exportButtons.length > 0) exportButtons[0].click(); // Default to first export option
                break;
        }
    };

    const renderActiveTab = () => {
        if (activeTab === 'dashboard') {
            return html`<${DashboardView} dashboardData=${dashboardData} setActiveTab=${setActiveTab} onExport=${handleDashboardExport} theme=${theme} />`;
        }
        const config = allModules[activeTab]; // Use allModules instead of APP_CONFIG
        if (config && enabledModules.includes(activeTab)) {
            const Component = COMPONENT_MAP[config.component];
            if (Component) {
                return html`
                    <${Component}
                        key=${activeTab}
                        title=${config.title}
                        storageKey=${config.storageKey}
                        initialData=${config.initialData}
                        theme=${theme}
                    />
                `;
            }
        }
        return html`<p>Select a view from the navigation, or enable it in the settings.</p>`;
    };
    
    const visibleModules = useMemo(() => {
        return Object.keys(allModules).filter(key => enabledModules.includes(key)); // Use allModules
    }, [enabledModules, allModules]);

    const MAX_PRIMARY_TABS = 3;
    const primaryTabs = visibleModules.slice(0, MAX_PRIMARY_TABS);
    const dropdownTabs = visibleModules.slice(MAX_PRIMARY_TABS);
    const isDropdownActive = dropdownTabs.includes(activeTab);

    return html`
        <div className=${`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <${AdminSidebar} 
                isOpen=${isSidebarOpen}
                onClose=${() => setSidebarOpen(false)}
                appConfig=${allModules}
                enabledModules=${enabledModules}
                onToggleModule=${handleToggleModule}
                groups=${GROUPS}
            />
            <header className="app-header">
                <h1>MRC Global QMS v0.1</h1>
                <div className="header-controls">
                    <button
                        className="theme-toggle search-toggle"
                        onClick=${() => setSearchOpen(true)}
                        aria-label="Search (Ctrl+K)"
                        title="Search (Ctrl+K)"
                    >
                        🔍
                    </button>
                    <button
                        className="theme-toggle"
                        onClick=${() => setSidebarOpen(true)}
                        aria-label="Open settings"
                    >
                        <${CogIcon} />
                    </button>
                    <button
                        className="theme-toggle"
                        onClick=${toggleTheme}
                        aria-label=${`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        ${theme === 'light' ? html`<${MoonIcon} />` : html`<${SunIcon} />`}
                    </button>
                </div>
            </header>
            <nav className="app-nav">
                 <button
                    className="nav-button"
                    aria-current=${activeTab === 'dashboard' ? 'page' : undefined}
                    onClick=${() => setActiveTab('dashboard')}
                >Dashboard</button>
                ${Object.values(GROUPS).map(group => html`
                    <${NavDropdown}
                        key=${group.title}
                        group=${group}
                        enabledModules=${enabledModules}
                        activeTab=${activeTab}
                        setActiveTab=${setActiveTab}
                        allModules=${allModules}
                    />
                `)}
            </nav>
            <main id="main-content">
                ${renderActiveTab()}
            </main>
            <${GlobalSearch}
                isOpen=${isSearchOpen}
                onClose=${() => setSearchOpen(false)}
                dashboardData=${dashboardData}
                setActiveTab=${setActiveTab}
            />
            <${ShortcutsHelp}
                isOpen=${isShortcutsHelpOpen}
                onClose=${() => setShortcutsHelpOpen(false)}
            />
            <${FloatingActionButton} 
                activeTab=${activeTab} 
                appConfig=${APP_CONFIG} 
                onQuickAction=${handleQuickAction}
            />
        </div>
    `;
};