// Module Groups Definition
export const MODULE_GROUPS = {
    core: {
        title: "Core QMS",
        modules: ['documentControl', 'changeRequests', 'actionItems', 'trainingRecords']
    },
    audits: {
        title: "Audit Management",
        modules: ['internalAuditScheduler', 'auditFindings', 'internal', 'supplier', 'advancedAudit', 'auditChecklistGenerator']
    },
    capa: {
        title: "CAPA",
        modules: ['car', 'par', 'eightDChecklist']
    },
    suppliers: {
        title: "Supplier Management",
        modules: ['aml', 'supplierScorecard', 'purchasingChecklist']
    },
    risk: {
        title: "Risk Management",
        modules: ['risk', 'notificationGenerator']
    },
    qc: {
        title: "Quality Control",
        modules: ['qcTestResults', 'controlChart', 'inspectionChecklistGenerator', 'receivingChecklist', 'inspectionReportBuilder1', 'inspectionReportBuilder2']
    },
    processChecklists: {
        title: "Process Checklists",
        modules: ['salesChecklist', 'preDeliveryChecklist', 'pdcaChecklist']
    },
    externalResources: {
        title: "External Resources",
        modules: ['iso9001Standard', 'fda510k', 'asqHandbook', 'sixSigmaTools', 'leanManagement']
    },
    internalLinks: {
        title: "Internal Navigation",
        modules: ['quickAccessCAR', 'quickAccessAudit', 'quickAccessDoc', 'quickAccessRisk', 'quickAccessTraining']
    }
};

// Import template data helper
import { getTemplateData } from './tableTemplates.js';

// Core QMS Modules
const CORE_QMS_MODULES = {
    documentControl: {
        title: "Document Version Control",
        component: 'DocumentVersionControl',
        storageKey: "qms-document-control",
        category: "core",
        description: "Comprehensive document lifecycle management system for controlling document versions, approvals, and reviews. Features include version tracking, approval workflows, automated review scheduling, and change history documentation. Purpose: Ensure document integrity and compliance with ISO standards. Scope: All controlled documents including policies, procedures, work instructions, and forms.",
        initialData: getTemplateData('documentControl')
    },
    changeRequests: {
        title: "Change Request Form",
        component: 'ChangeRequestForm',
        storageKey: "qms-change-requests",
        category: "core",
        description: "Structured change management system for controlling modifications to processes, procedures, and systems. Features include impact analysis, business justification tracking, approval history, and implementation planning. Purpose: Ensure controlled and systematic approach to organizational changes. Scope: Process changes, procedure updates, system modifications, and organizational restructuring.",
        initialData: getTemplateData('changeRequests')
    },
    actionItems: {
        title: "Action Item List",
        component: 'ActionItemList',
        storageKey: "qms-action-items",
        category: "core",
        description: "Task management system with priority-based assignment and due date tracking. Features include priority levels, status progression, category organization, and overdue notifications. Purpose: Ensure systematic follow-up and completion of improvement actions and tasks. Scope: Quality improvement tasks, audit follow-ups, corrective actions, and general assignments.",
        initialData: getTemplateData('actionItems')
    },
    trainingRecords: {
        title: "Training Records",
        component: "TrainingRecords",
        storageKey: "qms-training-records",
        category: "core",
        description: "Employee training and certification tracking system with expiration management. Features include certification expiry alerts, trainer documentation, course categorization, and compliance tracking. Purpose: Maintain competency records and ensure regulatory compliance. Scope: All employee training including quality training, safety certifications, job-specific skills, and regulatory requirements.",
        initialData: getTemplateData('trainingRecords')
    }
};

// Audit Management Modules
const AUDIT_MODULES = {
    internalAuditScheduler: {
        title: "Internal Audit Scheduler",
        component: 'InternalAuditScheduler',
        storageKey: "qms-audit-scheduler",
        category: "audits",
        description: "Comprehensive audit planning and scheduling system for managing internal audits. Features include team assignment, resource planning, audit calendar, and status tracking. Purpose: Ensure systematic and planned approach to internal auditing activities. Scope: Process audits, system audits, department audits, and compliance verification activities.",
        initialData: getTemplateData('internalAuditScheduler')
    },
    auditFindings: {
        title: "Audit Findings",
        component: 'AuditFindingsList',
        storageKey: "qms-audit-findings",
        category: "audits",
        description: "Audit findings management system with severity classification and CAR linkage. Features include severity levels (minor, major, critical), department categorization, status tracking, and corrective action request integration. Purpose: Systematically document and track audit findings to closure. Scope: Internal audit findings, external audit findings, customer audit results, and regulatory inspection findings.",
        initialData: getTemplateData('auditFindings')
    },
    internal: {
        title: "Internal Process Audit",
        component: 'ChecklistWrapper',
        storageKey: "qms-checklist-internal",
        category: "audits",
        description: "Interactive checklist system for conducting internal process audits. Features include completion tracking, evidence documentation, corrective action notes, and status progression. Purpose: Standardize internal audit procedures and ensure consistent audit execution. Scope: Quality management system processes, operational procedures, and compliance verification.",
        initialData: [
            { id: 'ia-1', text: "Are quality objectives established and communicated?", completed: false, comments: "", actions: "", status: "not-started" },
            { id: 'ia-2', text: "Is the Quality Policy available, understood, and applied?", completed: false, comments: "", actions: "", status: "not-started" },
            { id: 'ia-3', text: "Are processes for the QMS defined and documented?", completed: true, comments: "Process maps are available on the intranet.", actions: "N/A", status: "completed" },
            { id: 'ia-4', text: "Are records of management reviews maintained?", completed: false, comments: "Last review meeting minutes need to be uploaded.", actions: "Follow up with management team.", status: "in-progress" },
        ]
    },
    supplier: {
        title: "Supplier Audit",
        component: 'ChecklistWrapper',
        storageKey: "qms-checklist-supplier",
        category: "audits",
        description: "Supplier evaluation and audit checklist system for vendor qualification and monitoring. Features include supplier capability assessment, compliance verification, and performance evaluation. Purpose: Ensure supplier quality and compliance with specifications. Scope: New supplier qualification, periodic supplier audits, and supplier performance monitoring.",
        initialData: [
            { id: 'sa-1', text: "Does the supplier have a documented quality management system?", completed: false, comments: "", actions: "", status: "not-started" },
            { id: 'sa-2', text: "Are supplier's calibration records for equipment up to date?", completed: false, comments: "", actions: "", status: "not-started" },
        ]
    },
    advancedAudit: {
        title: "Advanced Audit",
        component: 'ChecklistWrapper',
        storageKey: "qms-checklist-advanced",
        category: "audits",
        description: "Advanced audit checklist with ISO standard references for comprehensive system audits. Features include standard references, detailed compliance verification, and regulatory alignment. Purpose: Conduct thorough audits aligned with international standards. Scope: ISO 9001 compliance audits, certification preparation, and advanced quality system verification.",
        initialData: [
            { id: 'aa-1', text: "Is there a process for determining and providing necessary resources?", completed: false, comments: "", actions: "", status: "not-started", reference: "ISO 9001: 7.1" },
            { id: 'aa-2', text: "Are monitoring and measuring resources suitable and maintained?", completed: false, comments: "", actions: "", status: "not-started", reference: "ISO 9001: 7.1.5" },
        ]
    },
    auditChecklistGenerator: {
        title: "Audit Checklist Generator",
        component: 'ChecklistGenerator',
        storageKey: "qms-checklist-audit-generator",
        category: "audits",
        description: "Template-based audit checklist generator for creating standardized audit procedures. Features include predefined templates, customizable checklists, and template library management. Purpose: Standardize audit procedures and ensure consistent audit coverage. Scope: Various audit types including process audits, system audits, and compliance checks using industry-standard templates.",
        initialData: []
    }
};

// CAPA Modules
const CAPA_MODULES = {
    car: {
        title: "Corrective Action Requests",
        component: 'CorrectiveActionRequest',
        storageKey: "qms-car-tracker",
        category: "capa",
        description: "Corrective Action Request management system for addressing non-conformities and deficiencies. Features include root cause analysis, corrective action planning, implementation tracking, and effectiveness verification. Purpose: Systematically address and prevent recurrence of quality issues. Scope: Product non-conformities, process deviations, customer complaints, and audit findings requiring corrective action.",
        initialData: getTemplateData('correctiveActionRequest')
    },
    par: {
        title: "Preventive Action Requests",
        component: 'PreventiveActionRequest',
        storageKey: "qms-par-tracker",
        category: "capa",
        description: "Preventive Action Request system for proactive quality improvement and risk mitigation. Features include trend analysis, preventive action planning, implementation monitoring, and effectiveness assessment. Purpose: Prevent potential non-conformities and improve process capability. Scope: Process improvements, risk mitigation, trend prevention, and proactive quality enhancements.",
        initialData: getTemplateData('preventiveActionRequests')
    },
    eightDChecklist: {
        title: "8D Checklist",
        component: 'ChecklistGenerator',
        storageKey: "qms-checklist-8d",
        category: "capa",
        description: "Eight Disciplines (8D) problem-solving methodology checklist for systematic issue resolution. Features include structured problem-solving steps, team formation guidance, and root cause analysis framework. Purpose: Provide structured approach to complex problem solving and permanent corrective action. Scope: Customer complaints, process failures, quality issues, and systematic problem-solving initiatives.",
        initialData: []
    }
};

// Supplier Management Modules
const SUPPLIER_MODULES = {
    aml: {
        title: "Approved Manufacturer List",
        component: 'ApprovedManufacturerList',
        storageKey: "qms-aml",
        category: "suppliers",
        description: "Comprehensive supplier qualification and management system for maintaining approved vendor registry. Features include approval status tracking, capability documentation, audit history, and performance monitoring. Purpose: Maintain qualified supplier base and ensure supply chain quality. Scope: All suppliers providing materials, components, services, and subcontracted processes.",
        initialData: getTemplateData('approvedManufacturers')
    },
    supplierScorecard: {
        title: "Supplier Quality Scorecard",
        component: "SupplierScorecard",
        storageKey: "qms-supplier-scorecard",
        category: "suppliers",
        description: "Automated supplier performance evaluation system with weighted scoring metrics. Features include on-time delivery tracking, quality acceptance rates, CAR response time monitoring, and overall performance scoring. Purpose: Objectively evaluate and compare supplier performance. Scope: Regular supplier performance assessment, vendor selection criteria, and supplier development programs.",
        initialData: getTemplateData('supplierScorecards')
    },
    purchasingChecklist: {
        title: "Purchasing Checklist",
        component: 'ChecklistGenerator',
        storageKey: "qms-checklist-purchasing",
        category: "suppliers",
        description: "Standardized purchasing process checklist for supplier evaluation and procurement activities. Features include supplier assessment criteria, purchase order verification, and quality requirements validation. Purpose: Ensure consistent purchasing practices and supplier compliance. Scope: New supplier evaluation, purchase order processing, and supplier quality requirements verification.",
        initialData: []
    }
};

// Risk Management Modules
const RISK_MODULES = {
    risk: {
        title: "Risk Assessment",
        component: 'RiskAssessment',
        storageKey: "qms-risk-assessment",
        category: "risk",
        description: "Comprehensive risk management system with probability-impact matrix visualization and mitigation planning. Features include risk categorization, likelihood and severity assessment, mitigation strategy documentation, and visual risk matrix display. Purpose: Identify, assess, and manage organizational risks systematically. Scope: Operational risks, quality risks, regulatory compliance risks, and strategic business risks.",
        initialData: {
            risks: [
                { id: `risk-${Date.now()}-1`, description: 'Server failure due to hardware malfunction', likelihood: 'Possible', severity: 'Major', mitigation: 'Implement redundant servers and daily backups.'},
                { id: `risk-${Date.now()}-2`, description: 'Data breach from external attack', likelihood: 'Unlikely', severity: 'Catastrophic', mitigation: 'Strengthen firewall, use multi-factor authentication, conduct regular security audits.'},
                { id: `risk-${Date.now()}-3`, description: 'Supplier fails to deliver critical components', likelihood: 'Possible', severity: 'Moderate', mitigation: 'Qualify alternative suppliers.'}
            ],
            likelihoodLevels: ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost Certain'],
            severityLevels: ['Insignificant', 'Minor', 'Moderate', 'Major', 'Catastrophic'],
        }
    },
    notificationGenerator: {
        title: "Notification Generator",
        component: 'NotificationGenerator',
        storageKey: "qms-notification-generator",
        category: "risk",
        description: "Generate and manage mass communications for product advisories, recalls, and other notifications. Supports mail merge with customer data to create personalized letters with control numbers.",
        initialData: {
            notificationType: 'Advisory',
            title: 'Product Advisory Notice: [Product Name]',
            body: 'Dear [Customer Name],\n\nWe are writing to inform you about a product advisory regarding [Product Name] with lot number [Lot Number].\n\nPlease do not hesitate to contact us with any questions.\n\nSincerely,\nThe Quality Team',
            logoUrl: '',
            imageUrl: '',
            recipients: 'Customer Name,Product Name,Lot Number,Address,Email\nJohn Doe,Model X,L1234,"123 Main St, Anytown",john.doe@example.com\nJane Smith,Model Y,L5678,"456 Oak Ave, Otherville",jane.smith@example.com',
            controlNumberPrefix: 'ADV',
            lastControlNumber: 0,
        }
    }
};

// Quality Control Modules
const QC_MODULES = {
    qcTestResults: {
        title: "QC Test Results",
        component: 'QcTestResultsList',
        storageKey: "qms-qc-test-results",
        category: "qc",
        description: "Quality control test results management system for tracking inspection and testing activities. Features include test parameter specification, actual result recording, pass/fail determination, and operator/equipment tracking. Purpose: Document and track quality control testing for product compliance. Scope: Incoming inspection, in-process testing, final inspection, and laboratory test results.",
        initialData: getTemplateData('qcTestResults')
    },
    controlChart: {
        title: "Control Chart",
        component: "ControlChart",
        storageKey: "qms-control-chart",
        category: "qc",
        description: "Statistical process control chart system for monitoring process performance and detecting variations. Features include automatic control limit calculation, out-of-control point detection, and trend analysis. Purpose: Monitor process stability and detect special cause variations. Scope: Critical process parameters, measurement data, and process capability monitoring.",
        initialData: {
            processName: "Shaft Diameter (mm)",
            dataPoints: [10.02, 10.01, 9.98, 10.00, 9.99, 10.03, 10.01, 9.97, 9.99, 10.00, 10.01, 10.04, 9.98, 9.99, 10.02]
        }
    },
    inspectionChecklistGenerator: {
        title: "Inspection Checklist Generator",
        component: 'ChecklistGenerator',
        storageKey: "qms-checklist-inspection-generator",
        category: "qc",
        description: "Template-based inspection checklist generator for standardizing inspection procedures. Features include predefined inspection templates, customizable check points, and inspection criteria documentation. Purpose: Standardize inspection processes and ensure consistent quality verification. Scope: Incoming inspection, in-process inspection, final inspection, and equipment inspection procedures.",
        initialData: []
    },
    receivingChecklist: {
        title: "Receiving Checklist",
        component: 'ChecklistGenerator',
        storageKey: "qms-checklist-receiving",
        category: "qc",
        description: "Incoming goods inspection checklist for verifying received materials and products. Features include material verification, packaging inspection, documentation review, and acceptance criteria. Purpose: Ensure received materials meet specifications and requirements. Scope: Raw materials, purchased components, subcontracted items, and customer-supplied materials.",
        initialData: []
    },
    inspectionReportBuilder1: {
        title: "Inspection Report Builder 1 (Test A)",
        component: 'ExternalLink',
        storageKey: "qms-external-inspection-report-1",
        category: "qc",
        description: "Advanced inspection report builder for Test A procedures and documentation. Features include automated report generation, customizable templates, and compliance verification. Purpose: Generate comprehensive inspection reports for Test A procedures. Scope: Specialized testing procedures, regulatory compliance reporting, and detailed inspection documentation.",
        initialData: {
            url: 'https://example.com/inspection-report-builder-test-a',
            description: 'Advanced inspection report builder for Test A procedures and documentation'
        }
    },
    inspectionReportBuilder2: {
        title: "Inspection Report Builder 2 (Test B)",
        component: 'ExternalLink',
        storageKey: "qms-external-inspection-report-2",
        category: "qc",
        description: "Advanced inspection report builder for Test B procedures and documentation. Features include automated report generation, customizable templates, and compliance verification. Purpose: Generate comprehensive inspection reports for Test B procedures. Scope: Specialized testing procedures, regulatory compliance reporting, and detailed inspection documentation.",
        initialData: {
            url: 'https://example.com/inspection-report-builder-test-b',
            description: 'Advanced inspection report builder for Test B procedures and documentation'
        }
    }
};

// Process Checklist Modules
const PROCESS_CHECKLIST_MODULES = {
    salesChecklist: {
        title: "Sales Checklist",
        component: 'ChecklistGenerator',
        storageKey: "qms-checklist-sales",
        category: "processChecklists",
        description: "Sales process checklist for ensuring consistent customer engagement and contract management. Features include customer requirement verification, contract review procedures, and order processing validation. Purpose: Standardize sales processes and ensure customer requirements are properly captured. Scope: Customer inquiries, quotation preparation, contract review, and order processing activities.",
        initialData: []
    },
    preDeliveryChecklist: {
        title: "Pre-Delivery Checklist",
        component: 'ChecklistGenerator',
        storageKey: "qms-checklist-pre-delivery",
        category: "processChecklists",
        description: "Pre-delivery verification checklist ensuring product readiness and customer satisfaction. Features include final inspection verification, packaging validation, documentation completion, and delivery preparation. Purpose: Ensure products meet specifications before delivery to customers. Scope: Final product inspection, packaging verification, shipping documentation, and delivery preparation.",
        initialData: []
    },
    pdcaChecklist: {
        title: "PDCA Checklist",
        component: 'ChecklistGenerator',
        storageKey: "qms-checklist-pdca",
        category: "processChecklists",
        description: "Plan-Do-Check-Act cycle checklist for systematic process improvement and problem-solving. Features include structured improvement methodology, progress tracking, and effectiveness evaluation. Purpose: Guide systematic improvement activities using PDCA methodology. Scope: Process improvements, quality initiatives, corrective actions, and continuous improvement projects.",
        initialData: []
    }
};

// External Resources Modules
const EXTERNAL_RESOURCES_MODULES = {
    iso9001Standard: {
        title: "ISO 9001:2015 Standard",
        component: 'ExternalLink',
        storageKey: "qms-external-iso9001",
        category: "externalResources",
        description: "Official ISO 9001:2015 Quality Management Systems standard information and resources. Features include standard requirements, implementation guidance, and certification information. Purpose: Provide access to official ISO 9001 standard and related resources. Scope: Quality management system requirements, implementation guidance, and certification preparation materials.",
        initialData: {
            url: 'https://www.iso.org/iso-9001-quality-management.html',
            description: 'Official ISO 9001:2015 Quality Management Systems standard information and resources'
        }
    },
    fda510k: {
        title: "FDA 510(k) Guidance",
        component: 'ExternalLink',
        storageKey: "qms-external-fda510k",
        category: "externalResources",
        description: "FDA guidance documents for 510(k) premarket notification submissions and medical device regulations. Features include regulatory requirements, submission procedures, and compliance guidance. Purpose: Support medical device regulatory compliance and 510(k) submissions. Scope: Medical device regulations, premarket notifications, and FDA compliance requirements.",
        initialData: {
            url: 'https://www.fda.gov/medical-devices/premarket-submissions/premarket-notification-510k',
            description: 'FDA guidance documents for 510(k) premarket notification submissions'
        }
    },
    asqHandbook: {
        title: "ASQ Quality Handbook",
        component: 'ExternalLink',
        storageKey: "qms-external-asq",
        category: "externalResources",
        description: "American Society for Quality resources and handbook materials for quality professionals. Features include quality tools, best practices, and professional development resources. Purpose: Access comprehensive quality management resources and tools. Scope: Quality management tools, best practices, training materials, and professional development resources.",
        initialData: {
            url: 'https://asq.org/quality-resources',
            description: 'American Society for Quality resources and handbook materials'
        }
    },
    sixSigmaTools: {
        title: "Six Sigma Tools",
        component: 'ExternalLink',
        storageKey: "qms-external-sixsigma",
        category: "externalResources",
        description: "Six Sigma methodology tools and templates for process improvement and statistical analysis. Features include DMAIC tools, statistical templates, and improvement methodologies. Purpose: Support Six Sigma process improvement initiatives. Scope: Process improvement projects, statistical analysis, and Six Sigma methodology implementation.",
        initialData: {
            url: 'https://www.isixsigma.com/tools-templates/',
            description: 'Six Sigma methodology tools and templates for process improvement'
        }
    },
    leanManagement: {
        title: "Lean Management Resources",
        component: 'ExternalLink',
        storageKey: "qms-external-lean",
        category: "externalResources",
        description: "Lean Enterprise Institute resources for lean management and continuous improvement methodologies. Features include lean tools, implementation guides, and best practices. Purpose: Support lean management implementation and continuous improvement. Scope: Lean tools, waste elimination, value stream mapping, and continuous improvement methodologies.",
        initialData: {
            url: 'https://www.lean.org/explore-lean/',
            description: 'Lean Enterprise Institute resources for lean management and continuous improvement'
        }
    }
};

// External Resources Storage
const EXTERNAL_RESOURCES_STORAGE_KEY = 'qms-external-resources';
const INTERNAL_LINKS_STORAGE_KEY = 'qms-internal-links';

// Load external resources from localStorage
const loadExternalResources = () => {
    try {
        const stored = localStorage.getItem(EXTERNAL_RESOURCES_STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch (error) {
        console.error('Failed to load external resources', error);
        return {};
    }
};

// Save external resources to localStorage
export const saveExternalResources = (externalResources) => {
    try {
        localStorage.setItem(EXTERNAL_RESOURCES_STORAGE_KEY, JSON.stringify(externalResources));
    } catch (error) {
        console.error('Failed to save external resources', error);
    }
};

// Load internal links from localStorage
const loadInternalLinks = () => {
    try {
        const stored = localStorage.getItem(INTERNAL_LINKS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch (error) {
        console.error('Failed to load internal links', error);
        return {};
    }
};

// Save internal links to localStorage
export const saveInternalLinks = (internalLinks) => {
    try {
        localStorage.setItem(INTERNAL_LINKS_STORAGE_KEY, JSON.stringify(internalLinks));
    } catch (error) {
        console.error('Failed to save internal links', error);
    }
};

// Create a new external resource
export const createExternalResource = (resourceData) => {
    const externalResources = loadExternalResources();
    const resourceKey = `external_${resourceData.key}`;
    
    // Check if resource key already exists
    if (externalResources[resourceKey] || EXTERNAL_RESOURCES_MODULES[resourceKey]) {
        throw new Error('A resource with this key already exists');
    }

    const newResource = {
        title: resourceData.title,
        component: 'ExternalLink',
        storageKey: `qms-external-${resourceData.key}`,
        category: 'externalResources',
        initialData: {
            url: resourceData.url,
            description: resourceData.description
        },
        isDynamic: true,
        createdDate: new Date().toISOString()
    };

    externalResources[resourceKey] = newResource;
    saveExternalResources(externalResources);
    
    // Also save the initial data to the module's storage
    localStorage.setItem(newResource.storageKey, JSON.stringify(newResource.initialData));
    
    return { resourceKey, resource: newResource };
};

// Get all external resources (static + dynamic)
export const getAllExternalResources = () => {
    return { ...EXTERNAL_RESOURCES_MODULES, ...loadExternalResources() };
};

// Get all internal links (static + dynamic)
export const getAllInternalLinks = () => {
    return { ...INTERNAL_LINKS_MODULES, ...loadInternalLinks() };
};

// Delete an external resource
export const deleteExternalResource = (resourceKey) => {
    const externalResources = loadExternalResources();
    if (externalResources[resourceKey]) {
        // Clear the resource's data from localStorage
        const resourceConfig = externalResources[resourceKey];
        if (resourceConfig.storageKey) {
            localStorage.removeItem(resourceConfig.storageKey);
        }
        delete externalResources[resourceKey];
        saveExternalResources(externalResources);
        return true;
    }
    return false;
};

// Internal Links Modules
const INTERNAL_LINKS_MODULES = {
    quickAccessCAR: {
        title: "Quick Access: CARs",
        component: 'InternalLink',
        storageKey: "qms-internal-car",
        category: "internalLinks",
        description: "Quick access navigation to Corrective Action Requests for immediate review and action. Features include direct module navigation and quick access functionality. Purpose: Provide rapid access to critical CAR management functions. Scope: Direct navigation to CAR tracking and management for urgent quality issues and corrective actions.",
        initialData: {
            targetModule: 'car',
            description: 'Quick access to Corrective Action Requests for immediate review and action'
        }
    },
    quickAccessAudit: {
        title: "Quick Access: Audits",
        component: 'InternalLink',
        storageKey: "qms-internal-audit",
        category: "internalLinks",
        description: "Direct navigation to internal audit scheduling and management system. Features include quick access to audit planning and scheduling functions. Purpose: Provide rapid access to audit management activities. Scope: Direct navigation to audit scheduling, planning, and management for internal audit coordination.",
        initialData: {
            targetModule: 'internalAuditScheduler',
            description: 'Direct navigation to internal audit scheduling and management'
        }
    },
    quickAccessDoc: {
        title: "Quick Access: Documents",
        component: 'InternalLink',
        storageKey: "qms-internal-doc",
        category: "internalLinks",
        description: "Fast access to document version control and management system. Features include quick navigation to document control functions. Purpose: Provide rapid access to document management activities. Scope: Direct navigation to document version control, approval workflows, and document management tasks.",
        initialData: {
            targetModule: 'documentControl',
            description: 'Fast access to document version control and management system'
        }
    },
    quickAccessRisk: {
        title: "Quick Access: Risk Assessment",
        component: 'InternalLink',
        storageKey: "qms-internal-risk",
        category: "internalLinks",
        description: "Quick navigation to risk assessment matrix and management tools. Features include direct access to risk management functions. Purpose: Provide rapid access to risk management activities. Scope: Direct navigation to risk assessment, mitigation planning, and risk monitoring functions.",
        initialData: {
            targetModule: 'risk',
            description: 'Quick navigation to risk assessment matrix and management tools'
        }
    },
    quickAccessTraining: {
        title: "Quick Access: Training",
        component: 'InternalLink',
        storageKey: "qms-internal-training",
        category: "internalLinks",
        description: "Direct access to training records and certification tracking system. Features include quick navigation to training management functions. Purpose: Provide rapid access to training record management. Scope: Direct navigation to training records, certification tracking, and competency management functions.",
        initialData: {
            targetModule: 'trainingRecords',
            description: 'Direct access to training records and certification tracking'
        }
    }
};

// Special/Empty Modules
const SPECIAL_MODULES = {
    empty: {
        title: "Empty Checklist Example",
        component: 'ChecklistWrapper',
        storageKey: "qms-checklist-empty",
        category: "examples",
        description: "Empty checklist template for demonstration and testing purposes. Features include basic checklist functionality without predefined content. Purpose: Provide example template for custom checklist creation. Scope: Template and example for creating custom checklists and understanding system functionality.",
        initialData: []
    }
};

// Custom Modules Storage
const CUSTOM_MODULES_STORAGE_KEY = 'qms-custom-modules';

// Load custom modules from localStorage
const loadCustomModules = () => {
    try {
        const stored = localStorage.getItem(CUSTOM_MODULES_STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch (error) {
        console.error('Failed to load custom modules', error);
        return {};
    }
};

// Save custom modules to localStorage
export const saveCustomModules = (customModules) => {
    try {
        localStorage.setItem(CUSTOM_MODULES_STORAGE_KEY, JSON.stringify(customModules));
    } catch (error) {
        console.error('Failed to save custom modules', error);
    }
};

// Available component types for custom modules
export const AVAILABLE_COMPONENT_TYPES = {
    'ChecklistWrapper': {
        name: 'Checklist',
        description: 'Interactive checklist with completion tracking',
        defaultData: [],
        dataTemplate: {
            id: 'item-{timestamp}',
            text: 'Sample checklist item',
            completed: false,
            comments: '',
            actions: '',
            status: 'not-started'
        }
    },
    'ManufacturerTable': {
        name: 'Table (Manufacturer Style)',
        description: 'Table for managing manufacturers/suppliers',
        defaultData: [],
        dataTemplate: {
            id: 'item-{timestamp}',
            name: 'New Item',
            status: 'Active',
            notes: ''
        }
    },
    'ActionItemList': {
        name: 'Action Items',
        description: 'Task management with priorities and due dates',
        defaultData: [],
        dataTemplate: {
            id: 'item-{timestamp}',
            title: 'New Action Item',
            description: '',
            assignedTo: '',
            priority: 'Medium',
            status: 'Open',
            dueDate: '',
            category: '',
            completedDate: '',
            notes: ''
        }
    },
    'DocumentVersionControl': {
        name: 'Document Management',
        description: 'Document version control and tracking',
        defaultData: [],
        dataTemplate: {
            id: 'doc-{timestamp}',
            documentName: 'New Document',
            version: '1.0',
            status: 'Draft',
            documentType: '',
            author: '',
            dateCreated: '{today}',
            dateModified: '{today}',
            approvalDate: '',
            nextReviewDate: '',
            changeSummary: '',
            filePath: '',
            notes: ''
        }
    },
    'RiskAssessment': {
        name: 'Risk Assessment',
        description: 'Risk matrix and assessment tool',
        defaultData: {
            risks: [],
            likelihoodLevels: ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost Certain'],
            severityLevels: ['Insignificant', 'Minor', 'Moderate', 'Major', 'Catastrophic']
        },
        dataTemplate: {
            id: 'risk-{timestamp}',
            description: 'New risk',
            severity: 'Minor',
            likelihood: 'Possible',
            mitigation: ''
        }
    },
    'ExternalLink': {
        name: 'External Link',
        description: 'Link to external websites or resources',
        defaultData: {
            url: 'https://example.com',
            description: 'External resource description'
        },
        dataTemplate: {
            url: 'https://example.com',
            description: 'External resource description'
        }
    },
    'InternalLink': {
        name: 'Internal Link',
        description: 'Navigation link to other modules within the application',
        defaultData: {
            targetModule: '',
            description: 'Internal navigation description'
        },
        dataTemplate: {
            targetModule: '',
            description: 'Internal navigation description'
        }
    }
};

// Create a new custom module
export const createCustomModule = (moduleData) => {
    const customModules = loadCustomModules();
    const moduleKey = `custom_${moduleData.key}`;
    
    const componentType = AVAILABLE_COMPONENT_TYPES[moduleData.componentType];
    if (!componentType) {
        throw new Error('Invalid component type');
    }

    // Check if module key already exists
    if (customModules[moduleKey] || APP_CONFIG[moduleKey]) {
        throw new Error('A module with this key already exists');
    }

    const newModule = {
        title: moduleData.title,
        component: moduleData.componentType,
        storageKey: `qms-custom-${moduleData.key}`,
        category: moduleData.category || 'custom',
        initialData: componentType.defaultData,
        isCustom: true,
        createdDate: new Date().toISOString(),
        description: moduleData.description || '',
        fields: moduleData.fields || []
    };

    customModules[moduleKey] = newModule;
    saveCustomModules(customModules);
    
    return { moduleKey, module: newModule };
};

// Get all custom modules
export const getCustomModules = () => {
    return loadCustomModules();
};

// Delete a custom module
export const deleteCustomModule = (moduleKey) => {
    const customModules = loadCustomModules();
    delete customModules[moduleKey];
    saveCustomModules(customModules);
    
    // Also clear the module's data from localStorage
    const moduleConfig = customModules[moduleKey];
    if (moduleConfig && moduleConfig.storageKey) {
        localStorage.removeItem(moduleConfig.storageKey);
    }
};

// Delete all custom modules
export const deleteAllCustomModules = () => {
    const customModules = loadCustomModules();
    const moduleKeys = Object.keys(customModules);
    
    // Clear all custom module data from localStorage
    moduleKeys.forEach(moduleKey => {
        const moduleConfig = customModules[moduleKey];
        if (moduleConfig && moduleConfig.storageKey) {
            localStorage.removeItem(moduleConfig.storageKey);
        }
    });
    
    // Clear the custom modules storage
    localStorage.removeItem(CUSTOM_MODULES_STORAGE_KEY);
    
    return moduleKeys.length;
};

// Export custom modules
export const exportCustomModules = () => {
    const customModules = loadCustomModules();
    const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        modules: customModules
    };
    return JSON.stringify(exportData, null, 2);
};

// Import custom modules
export const importCustomModules = (jsonData) => {
    try {
        const importData = JSON.parse(jsonData);
        if (!importData.modules) {
            throw new Error('Invalid import format');
        }
        
        const customModules = loadCustomModules();
        Object.assign(customModules, importData.modules);
        saveCustomModules(customModules);
        
        return Object.keys(importData.modules);
    } catch (error) {
        throw new Error(`Failed to import modules: ${error.message}`);
    }
};

// Combined Configuration Export (now includes dynamic resources)
export const getAllModules = () => {
    const customModules = getCustomModules();
    const externalResources = getAllExternalResources();
    const internalLinks = getAllInternalLinks();
    
    return { 
        ...CORE_QMS_MODULES,
        ...AUDIT_MODULES,
        ...CAPA_MODULES,
        ...SUPPLIER_MODULES,
        ...RISK_MODULES,
        ...QC_MODULES,
        ...PROCESS_CHECKLIST_MODULES,
        ...SPECIAL_MODULES,
        ...externalResources,
        ...internalLinks,
        ...customModules 
    };
};

// Combined Configuration Export
export const APP_CONFIG = {
    ...CORE_QMS_MODULES,
    ...AUDIT_MODULES,
    ...CAPA_MODULES,
    ...SUPPLIER_MODULES,
    ...RISK_MODULES,
    ...QC_MODULES,
    ...PROCESS_CHECKLIST_MODULES,
    ...EXTERNAL_RESOURCES_MODULES,
    ...INTERNAL_LINKS_MODULES,
    ...SPECIAL_MODULES
};

// Helper Functions
export const getModulesByCategory = (category) => {
    return Object.entries(APP_CONFIG)
        .filter(([key, config]) => config.category === category)
        .reduce((acc, [key, config]) => {
            acc[key] = config;
            return acc;
        }, {});
};

export const getAllCategories = () => {
    const categories = new Set();
    Object.values(APP_CONFIG).forEach(config => {
        if (config.category) categories.add(config.category);
    });
    return Array.from(categories);
};

export const getModuleConfig = (moduleKey) => {
    return APP_CONFIG[moduleKey] || null;
};