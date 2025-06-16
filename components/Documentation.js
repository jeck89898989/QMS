import React from 'react';
import htm from 'htm';
import { MODULE_GROUPS, AVAILABLE_COMPONENT_TYPES } from '../data/appConfig.js';
import { CloseIcon } from './Icons.js';

const html = htm.bind(React.createElement);

export const Documentation = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const componentDescriptions = {
        'ChecklistWrapper': 'Interactive checklist component with completion tracking, comments, and corrective actions. Supports card and table views.',
        'DocumentVersionControl': 'Document management system with version control, approval tracking, and review scheduling.',
        'CorrectiveActionRequest': 'CAR (Corrective Action Request) management with status tracking, assignments, and due dates.',
        'AuditFindingsList': 'Audit findings tracker with severity levels, departments, and CAR linkage.',
        'ActionItemList': 'Task management system with priorities, assignments, categories, and completion tracking.',
        'QcTestResultsList': 'Quality control test results with pass/fail status, specifications, and equipment tracking.',
        'ChangeRequestForm': 'Change request management with approval workflows, impact analysis, and implementation tracking.',
        'PreventiveActionRequest': 'PAR (Preventive Action Request) system with root cause analysis and effectiveness verification.',
        'InternalAuditScheduler': 'Internal audit planning and scheduling with team assignments and status tracking.',
        'ChecklistGenerator': 'Template-based checklist generator with predefined industry-standard templates.',
        'SupplierScorecard': 'Supplier performance evaluation with automated scoring based on delivery and quality metrics.',
        'ControlChart': 'Statistical process control charts with automatic control limits and out-of-control detection.',
        'TrainingRecords': 'Employee training tracking with certification management and expiration alerts.',
        'ApprovedManufacturerList': 'Qualified manufacturer registry with approval status, capabilities, and audit tracking.',
        'RiskAssessment': 'Risk management with probability-impact matrix visualization and mitigation planning.',
        'ExternalLink': 'External resource links for integration with third-party tools and references.',
        'InternalLink': 'Quick navigation links between modules within the QMS application.'
    };

    const groupDescriptions = {
        'core': 'Essential QMS functions including document control, change management, action tracking, and training records.',
        'audits': 'Comprehensive audit management including scheduling, findings tracking, and various audit checklist types.',
        'capa': 'Corrective and Preventive Action (CAPA) system with CAR, PAR, and structured problem-solving approaches.',
        'suppliers': 'Supplier relationship management including qualification, performance tracking, and purchasing processes.',
        'risk': 'Risk assessment and management tools with matrix visualization and mitigation tracking.',
        'qc': 'Quality control and testing with statistical process control, inspection checklists, and test result tracking.',
        'processChecklists': 'Industry-specific process checklists for sales, delivery, and continuous improvement methodologies.',
        'externalResources': 'Links to external standards, guidelines, and regulatory resources.',
        'internalLinks': 'Quick access navigation shortcuts to frequently used modules within the system.'
    };

    return html`
        <div className="documentation-overlay" onClick=${onClose}>
            <div className="documentation-modal" onClick=${e => e.stopPropagation()}>
                <div className="documentation-header">
                    <h3>QMS Documentation & Reference</h3>
                    <button onClick=${onClose} className="close-btn" aria-label="Close documentation">
                        <${CloseIcon} />
                    </button>
                </div>
                
                <div className="documentation-content">
                    <div className="documentation-section">
                        <h4>Module Groups</h4>
                        <p>The QMS is organized into logical groups for better navigation and management:</p>
                        <div className="documentation-grid">
                            ${Object.entries(MODULE_GROUPS).map(([groupKey, group]) => html`
                                <div key=${groupKey} className="documentation-card">
                                    <h5>${group.title}</h5>
                                    <p className="group-description">${groupDescriptions[groupKey] || 'No description available.'}</p>
                                    <div className="module-list">
                                        <strong>Modules:</strong>
                                        <ul>
                                            ${group.modules.map(moduleKey => html`
                                                <li key=${moduleKey}>${moduleKey}</li>
                                            `)}
                                        </ul>
                                    </div>
                                </div>
                            `)}
                        </div>
                    </div>

                    <div className="documentation-section">
                        <h4>Component Types</h4>
                        <p>Available component types for creating custom modules:</p>
                        <div className="documentation-grid">
                            ${Object.entries(AVAILABLE_COMPONENT_TYPES).map(([componentKey, component]) => html`
                                <div key=${componentKey} className="documentation-card">
                                    <h5>${component.name}</h5>
                                    <p className="component-description">${component.description}</p>
                                    <div className="component-details">
                                        <strong>Use Cases:</strong>
                                        <p>${componentDescriptions[componentKey] || 'Versatile component for various QMS applications.'}</p>
                                    </div>
                                </div>
                            `)}
                        </div>
                    </div>

                    <div className="documentation-section">
                        <h4>Table Features</h4>
                        <p>All tables in the QMS include the following features:</p>
                        <div className="feature-list">
                            <div className="feature-item">
                                <h6>View Options</h6>
                                <ul>
                                    <li><strong>Dense:</strong> Compact view with minimal padding (default)</li>
                                    <li><strong>Compact:</strong> Slightly more padding than dense</li>
                                    <li><strong>Standard:</strong> Balanced spacing for comfortable viewing</li>
                                    <li><strong>Expanded:</strong> Maximum spacing for detailed work</li>
                                </ul>
                            </div>
                            <div className="feature-item">
                                <h6>Column Management</h6>
                                <ul>
                                    <li>Show/hide columns using the column visibility controls</li>
                                    <li>Drag column borders to resize width</li>
                                    <li>Click column headers to sort data (ascending/descending)</li>
                                </ul>
                            </div>
                            <div className="feature-item">
                                <h6>Data Operations</h6>
                                <ul>
                                    <li>Import data from JSON or CSV files</li>
                                    <li>Export to JSON, CSV, XLSX, PDF, or XML formats</li>
                                    <li>Filter data using the filter controls</li>
                                    <li>Inline editing with automatic saving</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="documentation-section">
                        <h4>Table Reference Guide</h4>
                        <p>Detailed reference for all table components in the QMS:</p>
                        <div className="documentation-grid">
                            <div className="documentation-card">
                                <h5>ManufacturerTable</h5>
                                <p className="component-description">Manages approved manufacturer/supplier data with approval status tracking.</p>
                                <div className="component-details">
                                    <strong>Columns:</strong>
                                    <ul>
                                        <li>Name, Approval Status, Materials, Region</li>
                                        <li>Country, Location, Capabilities</li>
                                        <li>Last Audit Date, Notes</li>
                                    </ul>
                                    <strong>Special Features:</strong>
                                    <ul>
                                        <li>Approval status dropdown with predefined options</li>
                                        <li>Date picker for audit tracking</li>
                                        <li>Auto-expanding text areas</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="documentation-card">
                                <h5>ActionItemTable</h5>
                                <p className="component-description">Task management with priorities, assignments, and due date tracking.</p>
                                <div className="component-details">
                                    <strong>Columns:</strong>
                                    <ul>
                                        <li>Title, Description, Assigned To</li>
                                        <li>Priority, Status, Due Date, Category</li>
                                        <li>Completed Date, Notes</li>
                                    </ul>
                                    <strong>Special Features:</strong>
                                    <ul>
                                        <li>Overdue item highlighting (red border)</li>
                                        <li>Priority and status dropdowns</li>
                                        <li>Date validation and formatting</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="documentation-card">
                                <h5>AuditFindingsTable</h5>
                                <p className="component-description">Tracks audit findings with severity levels and corrective action requests.</p>
                                <div className="component-details">
                                    <strong>Columns:</strong>
                                    <ul>
                                        <li>Finding, Audit Type, Department</li>
                                        <li>Severity, Status, CAR ID</li>
                                        <li>Date Found, Notes</li>
                                    </ul>
                                    <strong>Special Features:</strong>
                                    <ul>
                                        <li>Severity levels: Minor, Major, Critical</li>
                                        <li>CAR linking capability</li>
                                        <li>Department categorization</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="documentation-card">
                                <h5>DocumentTable</h5>
                                <p className="component-description">Document version control with approval workflows and review scheduling.</p>
                                <div className="component-details">
                                    <strong>Columns:</strong>
                                    <ul>
                                        <li>Document Name, Version, Status, Type</li>
                                        <li>Author, Date Created, Date Modified</li>
                                        <li>Approval Date, Next Review Date</li>
                                        <li>Change Summary, File Path, Notes</li>
                                    </ul>
                                    <strong>Special Features:</strong>
                                    <ul>
                                        <li>Version tracking with approval workflow</li>
                                        <li>Review date scheduling</li>
                                        <li>Document status management</li>
                                        <li>File path linking</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="documentation-card">
                                <h5>QcTestResultsTable</h5>
                                <p className="component-description">Quality control test results with pass/fail tracking and equipment records.</p>
                                <div className="component-details">
                                    <strong>Columns:</strong>
                                    <ul>
                                        <li>Sample ID, Test Date, Product</li>
                                        <li>Test Parameter, Specification Limit</li>
                                        <li>Actual Result, Status, Operator</li>
                                        <li>Equipment, Notes</li>
                                    </ul>
                                    <strong>Special Features:</strong>
                                    <ul>
                                        <li>Pass/Fail/Pending/Retest status options</li>
                                        <li>Specification vs actual result comparison</li>
                                        <li>Equipment and operator tracking</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="documentation-card">
                                <h5>TrainingRecordsTable</h5>
                                <p className="component-description">Employee training and certification tracking with expiration management.</p>
                                <div className="component-details">
                                    <strong>Columns:</strong>
                                    <ul>
                                        <li>Employee Name, Course Title</li>
                                        <li>Training Date, Expiration Date</li>
                                        <li>Status, Trainer, Certificate Path, Notes</li>
                                    </ul>
                                    <strong>Special Features:</strong>
                                    <ul>
                                        <li>Certification expiration tracking</li>
                                        <li>Training status management</li>
                                        <li>Certificate file path storage</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="documentation-card">
                                <h5>CarTable (Corrective Action Requests)</h5>
                                <p className="component-description">Corrective action request tracking with assignments and due dates.</p>
                                <div className="component-details">
                                    <strong>Columns:</strong>
                                    <ul>
                                        <li>Description, Status, Assigned To</li>
                                        <li>Due Date, Corrective Action, Notes</li>
                                    </ul>
                                    <strong>Special Features:</strong>
                                    <ul>
                                        <li>Status progression tracking</li>
                                        <li>Assignment and due date management</li>
                                        <li>Corrective action documentation</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="documentation-card">
                                <h5>ParTable (Preventive Action Requests)</h5>
                                <p className="component-description">Preventive action request management with root cause analysis and verification.</p>
                                <div className="component-details">
                                    <strong>Columns:</strong>
                                    <ul>
                                        <li>Title, Description, Status, Priority</li>
                                        <li>Assigned To, Due Date, Root Cause Analysis</li>
                                        <li>Preventive Action Plan, Implementation Date</li>
                                        <li>Effectiveness Verification, Notes</li>
                                    </ul>
                                    <strong>Special Features:</strong>
                                    <ul>
                                        <li>Comprehensive preventive action workflow</li>
                                        <li>Root cause analysis documentation</li>
                                        <li>Effectiveness verification tracking</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="documentation-card">
                                <h5>RiskTable</h5>
                                <p className="component-description">Risk assessment with severity and likelihood matrix management.</p>
                                <div className="component-details">
                                    <strong>Columns:</strong>
                                    <ul>
                                        <li>Description, Severity, Likelihood</li>
                                        <li>Mitigation Plan</li>
                                    </ul>
                                    <strong>Special Features:</strong>
                                    <ul>
                                        <li>Configurable severity and likelihood levels</li>
                                        <li>Risk matrix integration</li>
                                        <li>Mitigation planning and tracking</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="documentation-card">
                                <h5>SupplierScorecardTable</h5>
                                <p className="component-description">Supplier performance evaluation with automated scoring calculations.</p>
                                <div className="component-details">
                                    <strong>Columns:</strong>
                                    <ul>
                                        <li>Supplier Name, Period</li>
                                        <li>On-Time Delivery %, Quality Acceptance %</li>
                                        <li>CAR Response Time, Overall Score, Notes</li>
                                    </ul>
                                    <strong>Special Features:</strong>
                                    <ul>
                                        <li>Automatic score calculation (40% OTD, 60% Quality)</li>
                                        <li>Color-coded performance indicators</li>
                                        <li>Quarterly/periodic performance tracking</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="documentation-card">
                                <h5>AuditChecklistTable</h5>
                                <p className="component-description">Interactive audit checklist with completion tracking and references.</p>
                                <div className="component-details">
                                    <strong>Columns:</strong>
                                    <ul>
                                        <li>Done (checkbox), Checklist Item</li>
                                        <li>Reference (optional), Status</li>
                                        <li>Comments, Corrective Actions</li>
                                    </ul>
                                    <strong>Special Features:</strong>
                                    <ul>
                                        <li>Interactive checkboxes for completion</li>
                                        <li>Optional reference column for standards</li>
                                        <li>Status workflow management</li>
                                        <li>Inline editing capabilities</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="documentation-card">
                                <h5>InternalAuditSchedulerTable</h5>
                                <p className="component-description">Internal audit planning and scheduling with team assignments.</p>
                                <div className="component-details">
                                    <strong>Columns:</strong>
                                    <ul>
                                        <li>Audit Title, Type, Department/Area</li>
                                        <li>Lead Auditor, Audit Team</li>
                                        <li>Start Date, End Date, Status, Notes</li>
                                    </ul>
                                    <strong>Special Features:</strong>
                                    <ul>
                                        <li>Audit scheduling and resource planning</li>
                                        <li>Team assignment management</li>
                                        <li>Date range validation</li>
                                        <li>Status progression tracking</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="documentation-card">
                                <h5>ChangeRequestTable</h5>
                                <p className="component-description">Change request management with approval workflows and impact analysis.</p>
                                <div className="component-details">
                                    <strong>Columns:</strong>
                                    <ul>
                                        <li>Title, Description, Requestor</li>
                                        <li>Date Submitted, Status, Priority</li>
                                        <li>Impact Analysis, Business Justification</li>
                                        <li>Approval History, Implementation Date, Notes</li>
                                    </ul>
                                    <strong>Special Features:</strong>
                                    <ul>
                                        <li>Complete change management workflow</li>
                                        <li>Impact analysis documentation</li>
                                        <li>Approval history tracking</li>
                                        <li>Implementation planning</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="documentation-section">
                        <h4>Navigation & Shortcuts</h4>
                        <div className="shortcut-list">
                            <div className="shortcut-item">
                                <strong>Ctrl/⌘ + K:</strong> Global search across all modules
                            </div>
                            <div className="shortcut-item">
                                <strong>Ctrl/⌘ + N:</strong> Add new item to current module
                            </div>
                            <div className="shortcut-item">
                                <strong>Ctrl/⌘ + E:</strong> Export data from current module
                            </div>
                            <div className="shortcut-item">
                                <strong>Ctrl/⌘ + I:</strong> Import data to current module
                            </div>
                            <div className="shortcut-item">
                                <strong>Ctrl/⌘ + ,:</strong> Open settings/module management
                            </div>
                            <div className="shortcut-item">
                                <strong>F1 or Ctrl/⌘ + ?:</strong> Show keyboard shortcuts help
                            </div>
                        </div>
                    </div>

                    <div className="documentation-section">
                        <h4>Module Categories</h4>
                        <div className="category-descriptions">
                            <p><strong>Core QMS:</strong> Foundation modules for document control, change management, and basic quality system operations.</p>
                            <p><strong>Audit Management:</strong> Complete audit lifecycle from planning and scheduling to findings management and follow-up.</p>
                            <p><strong>CAPA:</strong> Corrective and Preventive Action system following industry best practices for problem resolution.</p>
                            <p><strong>Supplier Management:</strong> Comprehensive supplier lifecycle management from qualification to performance monitoring.</p>
                            <p><strong>Risk Management:</strong> Risk identification, assessment, and mitigation tracking with visual matrix representation.</p>
                            <p><strong>Quality Control:</strong> Testing, inspection, and statistical process control for product quality assurance.</p>
                            <p><strong>Process Checklists:</strong> Standardized procedures for critical business processes and methodologies.</p>
                        </div>
                    </div>

                    <div className="documentation-section">
                        <h4>Universal Table Operations</h4>
                        <div className="category-descriptions">
                            <p><strong>Data Import/Export:</strong> All tables support importing data from JSON and CSV files, and exporting to JSON, CSV, XLSX, PDF, and XML formats.</p>
                            <p><strong>Column Management:</strong> Users can show/hide any column, resize columns by dragging borders, and sort data by clicking column headers.</p>
                            <p><strong>View Modes:</strong> Four view density options are available: Dense (minimal padding), Compact, Standard (balanced), and Expanded (maximum spacing).</p>
                            <p><strong>Filtering:</strong> Most tables include filter controls to search and filter data by various criteria specific to each table type.</p>
                            <p><strong>Inline Editing:</strong> All table cells are editable directly within the table, with automatic saving to localStorage.</p>
                            <p><strong>Responsive Design:</strong> Tables are optimized for both desktop and mobile viewing with horizontal scrolling when necessary.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};