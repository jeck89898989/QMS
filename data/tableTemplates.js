// Table Templates for QMS Modules
// This file contains default data templates for all table-based components

export const TABLE_TEMPLATES = {
    // Document Version Control Templates
    documentControl: [
        { 
            id: 'doc-1', 
            documentName: 'Quality Manual', 
            version: '3.2', 
            status: 'Approved', 
            documentType: 'Manual', 
            author: 'Quality Manager', 
            dateCreated: '2023-01-15', 
            dateModified: '2024-03-10', 
            approvalDate: '2024-03-15', 
            nextReviewDate: '2025-03-15', 
            changeSummary: 'Updated section 4.1 to align with new organizational chart', 
            filePath: '/docs/quality/QM-v3.2.pdf', 
            notes: 'Distributed to all department heads' 
        },
        { 
            id: 'doc-2', 
            documentName: 'Calibration Procedure', 
            version: '2.1', 
            status: 'Under Review', 
            documentType: 'Procedure', 
            author: 'Lab Supervisor', 
            dateCreated: '2023-06-01', 
            dateModified: '2024-05-20', 
            approvalDate: '', 
            nextReviewDate: '2024-07-01', 
            changeSummary: 'Added new equipment calibration requirements', 
            filePath: '/docs/procedures/CAL-PROC-v2.1.docx', 
            notes: 'Pending technical review by Engineering' 
        },
        { 
            id: 'doc-3', 
            documentName: 'Supplier Evaluation Form', 
            version: '1.5', 
            status: 'Approved', 
            documentType: 'Form', 
            author: 'Procurement Lead', 
            dateCreated: '2022-10-12', 
            dateModified: '2024-01-08', 
            approvalDate: '2024-01-15', 
            nextReviewDate: '2025-01-15', 
            changeSummary: 'Added environmental compliance criteria', 
            filePath: '/docs/forms/SUPP-EVAL-v1.5.xlsx', 
            notes: '' 
        }
    ],

    // Corrective Action Request Templates
    correctiveActionRequest: [
        { 
            id: 'car-1', 
            description: 'Audit finding A-123 requires action', 
            status: 'Open', 
            assignedTo: 'Peter Pan', 
            dueDate: '2024-07-15', 
            correctiveAction: '', 
            notes: 'Related to supplier audit #55' 
        },
        { 
            id: 'car-2', 
            description: 'Customer complaint about product finish', 
            status: 'In Progress', 
            assignedTo: 'Wendy Darling', 
            dueDate: '2024-06-30', 
            correctiveAction: 'Reviewing polishing process parameters.', 
            notes: '' 
        },
        { 
            id: 'car-3', 
            description: 'Late delivery from vendor XYZ', 
            status: 'Pending Verification', 
            assignedTo: 'Captain Hook', 
            dueDate: '2024-05-20', 
            correctiveAction: 'Alternate shipping route established and tested.', 
            notes: 'First shipment with new route arrived on time.' 
        }
    ],

    // Action Item Templates
    actionItems: [
        { 
            id: 'ai-1', 
            title: 'Update quality manual section 4.2', 
            description: 'Revise document control procedures per new ISO requirements', 
            assignedTo: 'Alice Johnson', 
            priority: 'High', 
            status: 'Open', 
            dueDate: '2024-07-20', 
            category: 'Documentation', 
            completedDate: '', 
            notes: 'Coordinate with legal team for compliance review' 
        },
        { 
            id: 'ai-2', 
            title: 'Calibrate measurement equipment', 
            description: 'Annual calibration of precision measuring tools in Lab C', 
            assignedTo: 'Bob Smith', 
            priority: 'Medium', 
            status: 'In Progress', 
            dueDate: '2024-06-25', 
            category: 'Maintenance', 
            completedDate: '', 
            notes: 'Waiting for external calibration service appointment' 
        },
        { 
            id: 'ai-3', 
            title: 'Conduct supplier training session', 
            description: 'Training on new quality requirements for key suppliers', 
            assignedTo: 'Carol Brown', 
            priority: 'Medium', 
            status: 'Completed', 
            dueDate: '2024-05-30', 
            category: 'Training', 
            completedDate: '2024-05-28', 
            notes: 'All 12 key suppliers attended. Follow-up assessments scheduled.' 
        }
    ],

    // Audit Findings Templates
    auditFindings: [
        { 
            id: 'af-1', 
            finding: 'Procedure for document control not consistently followed.', 
            auditType: 'Internal Process Audit', 
            department: 'Engineering', 
            severity: 'Major', 
            status: 'Open', 
            carId: 'car-4', 
            dateFound: '2024-05-10', 
            notes: 'See audit report IA-2024-03 for details.' 
        },
        { 
            id: 'af-2', 
            finding: 'Calibration records for calipers in lab B are expired.', 
            auditType: 'Internal Process Audit', 
            department: 'Quality Lab', 
            severity: 'Minor', 
            status: 'In Progress', 
            carId: 'car-5', 
            dateFound: '2024-05-12', 
            notes: 'CAR has been issued.' 
        },
        { 
            id: 'af-3', 
            finding: 'Supplier XYZ has not provided material traceability certificates for last 3 shipments.', 
            auditType: 'Supplier Audit', 
            department: 'Procurement', 
            severity: 'Critical', 
            status: 'Open', 
            carId: '', 
            dateFound: '2024-04-28', 
            notes: 'Immediate action required.' 
        }
    ],

    // Approved Manufacturer Templates
    approvedManufacturers: [
        { 
            id: 'mfg-1668113261783', 
            name: 'Global Components Inc.', 
            approvalStatus: 'Approved', 
            materials: 'Valves, Flanges', 
            region: 'North America', 
            country: 'USA', 
            location: 'Houston, TX', 
            capabilities: 'Casting, Forging', 
            lastAuditDate: '2023-05-15', 
            notes: 'Excellent performance in last audit.' 
        },
        { 
            id: 'mfg-1668113261784', 
            name: 'Euro-Spec Forgings', 
            approvalStatus: 'Probationary', 
            materials: 'Fittings', 
            region: 'Europe', 
            country: 'Germany', 
            location: 'Düsseldorf', 
            capabilities: 'Precision Forging', 
            lastAuditDate: '2023-09-01', 
            notes: 'New supplier, requires follow-up on corrective actions.' 
        },
        { 
            id: 'mfg-1668113261785', 
            name: 'Asia Pacific Metals', 
            approvalStatus: 'Approved', 
            materials: 'Pipes, Tubing', 
            region: 'APAC', 
            country: 'South Korea', 
            location: 'Busan', 
            capabilities: 'Extrusion, Welding', 
            lastAuditDate: '2022-11-20', 
            notes: '' 
        }
    ],

    // QC Test Results Templates
    qcTestResults: [
        { 
            id: 'qc-1', 
            sampleId: 'S-2024-001', 
            testDate: '2024-05-15', 
            product: 'Steel Pipe DN100', 
            testParameter: 'Tensile Strength', 
            specificationLimit: '≥415 MPa', 
            actualResult: '425 MPa', 
            status: 'Pass', 
            operator: 'Jane Smith', 
            equipment: 'Universal Testing Machine UTM-200', 
            notes: 'Test completed per ASTM A106 standard' 
        },
        { 
            id: 'qc-2', 
            sampleId: 'S-2024-002', 
            testDate: '2024-05-16', 
            product: 'Carbon Steel Flange', 
            testParameter: 'Chemical Composition', 
            specificationLimit: 'C ≤0.25%', 
            actualResult: 'C 0.23%', 
            status: 'Pass', 
            operator: 'Bob Johnson', 
            equipment: 'Optical Emission Spectrometer OES-300', 
            notes: 'Meets ASTM A105 requirements' 
        },
        { 
            id: 'qc-3', 
            sampleId: 'S-2024-003', 
            testDate: '2024-05-17', 
            product: 'Stainless Steel Valve', 
            testParameter: 'Hardness Test', 
            specificationLimit: '150-200 HV', 
            actualResult: '145 HV', 
            status: 'Fail', 
            operator: 'Alice Brown', 
            equipment: 'Vickers Hardness Tester VHT-100', 
            notes: 'Below specification limit. CAR raised.' 
        },
        { 
            id: 'qc-4', 
            sampleId: 'S-2024-004', 
            testDate: '2024-05-18', 
            product: 'Alloy Steel Fitting', 
            testParameter: 'Dimensional Check', 
            specificationLimit: '±0.5mm', 
            actualResult: '0.3mm', 
            status: 'Pass', 
            operator: 'Mike Wilson', 
            equipment: 'CMM Coordinate Measuring Machine', 
            notes: 'All dimensions within tolerance' 
        }
    ],

    // Change Request Templates
    changeRequests: [
        { 
            id: 'cr-1', 
            requestTitle: 'Update Quality Manual Section 4.2', 
            description: 'Update document control procedures to align with new ISO requirements', 
            requestor: 'Quality Manager', 
            dateSubmitted: '2024-05-20', 
            status: 'Under Review', 
            priority: 'High', 
            impactAnalysis: 'Will affect all document control processes. Training required for all staff.', 
            businessJustification: 'Required for ISO compliance and certification maintenance.', 
            approvalHistory: 'Submitted for technical review - Quality Committee', 
            implementationDate: '2024-07-15', 
            notes: 'Coordination with IT department required for system updates' 
        },
        { 
            id: 'cr-2', 
            requestTitle: 'New Supplier Evaluation Process', 
            description: 'Implement enhanced supplier evaluation criteria including environmental compliance', 
            requestor: 'Procurement Lead', 
            dateSubmitted: '2024-05-18', 
            status: 'Approved', 
            priority: 'Medium', 
            impactAnalysis: 'Will extend supplier qualification timeline by 2-3 weeks. Additional resources needed for environmental assessments.', 
            businessJustification: 'Improves supply chain sustainability and reduces compliance risks.', 
            approvalHistory: 'Approved by Management Review Committee on 2024-05-25', 
            implementationDate: '2024-08-01', 
            notes: 'Training materials being developed for procurement team' 
        },
        { 
            id: 'cr-3', 
            requestTitle: 'Calibration Schedule Optimization', 
            description: 'Revise calibration intervals for precision measuring equipment based on historical data', 
            requestor: 'Lab Supervisor', 
            dateSubmitted: '2024-05-10', 
            status: 'Implemented', 
            priority: 'Low', 
            impactAnalysis: 'Reduced calibration frequency for stable equipment. Cost savings of ~$5000/year.', 
            businessJustification: 'Data-driven approach to optimize maintenance costs while maintaining accuracy.', 
            approvalHistory: 'Approved by Technical Committee on 2024-05-15. Implemented on 2024-06-01.', 
            implementationDate: '2024-06-01', 
            notes: 'Monitoring performance for first 6 months to validate changes' 
        }
    ],

    // Preventive Action Request Templates
    preventiveActionRequests: [
        { 
            id: 'par-1', 
            title: 'Equipment Maintenance Schedule Review', 
            description: 'Review and update preventive maintenance schedules for critical production equipment to prevent failures', 
            status: 'Open', 
            priority: 'High', 
            assignedTo: 'Maintenance Manager', 
            dueDate: '2024-08-15', 
            rootCauseAnalysis: 'Analysis of recent equipment downtime shows maintenance intervals may be inadequate for high-usage equipment.', 
            preventiveActionPlan: 'Implement condition-based monitoring and adjust maintenance frequencies based on actual usage patterns.', 
            implementationDate: '', 
            effectivenessVerification: '', 
            notes: 'Coordinate with production planning to minimize disruption' 
        },
        { 
            id: 'par-2', 
            title: 'Supplier Quality Training Program', 
            description: 'Develop comprehensive training program for suppliers to prevent quality issues before they occur', 
            status: 'In Progress', 
            priority: 'Medium', 
            assignedTo: 'Quality Engineer', 
            dueDate: '2024-07-30', 
            rootCauseAnalysis: 'Trend analysis shows recurring quality issues from suppliers lacking adequate quality systems understanding.', 
            preventiveActionPlan: 'Create standardized training modules covering quality requirements, inspection procedures, and documentation standards.', 
            implementationDate: '', 
            effectivenessVerification: 'Monitor supplier quality metrics for 6 months post-training', 
            notes: 'Pilot program with top 5 suppliers first' 
        },
        { 
            id: 'par-3', 
            title: 'Document Control System Enhancement', 
            description: 'Upgrade document management system to prevent obsolete document usage', 
            status: 'Implemented', 
            priority: 'Medium', 
            assignedTo: 'Document Controller', 
            dueDate: '2024-06-01', 
            rootCauseAnalysis: 'Several instances of obsolete procedures being used due to inadequate version control and notification systems.', 
            preventiveActionPlan: 'Implement automated notifications for document updates and enhanced access controls to prevent obsolete document access.', 
            implementationDate: '2024-05-25', 
            effectivenessVerification: 'No obsolete document incidents in past 3 months. System usage compliance at 98%.', 
            notes: 'Training completed for all staff. System performance excellent.' 
        }
    ],

    // Internal Audit Scheduler Templates
    internalAuditScheduler: [
        { 
            id: 'ias-1', 
            auditTitle: 'Q1 Engineering Process Audit', 
            auditType: 'Process', 
            department: 'Engineering', 
            leadAuditor: 'John Doe', 
            auditTeam: 'Jane Smith, Peter Jones', 
            scheduledStartDate: '2024-07-25', 
            scheduledEndDate: '2024-07-26', 
            status: 'Planned', 
            notes: 'Focus on new design control process.' 
        },
        { 
            id: 'ias-2', 
            auditTitle: 'Annual ISO 9001 Surveillance Audit Prep', 
            auditType: 'System', 
            department: 'All', 
            leadAuditor: 'Alice Johnson', 
            auditTeam: 'Bob Smith', 
            scheduledStartDate: '2024-08-10', 
            scheduledEndDate: '2024-08-12', 
            status: 'Planned', 
            notes: '' 
        },
        { 
            id: 'ias-3', 
            auditTitle: 'Supplier XYZ On-site Audit', 
            auditType: 'Supplier', 
            department: 'Procurement', 
            leadAuditor: 'Carol Brown', 
            auditTeam: '', 
            scheduledStartDate: '2024-06-20', 
            scheduledEndDate: '2024-06-20', 
            status: 'Completed', 
            notes: 'Audit report filed under SR-XYZ-2024-01.' 
        },
        { 
            id: 'ias-4', 
            auditTitle: 'Production Line 3 Welding Process Audit', 
            auditType: 'Process', 
            department: 'Production', 
            leadAuditor: 'John Doe', 
            auditTeam: 'Mike Wilson', 
            scheduledStartDate: '2024-07-05', 
            scheduledEndDate: '2024-07-05', 
            status: 'In Progress', 
            notes: 'Day 1 of 1 completed, report pending.' 
        }
    ],

    // Supplier Scorecard Templates
    supplierScorecards: [
        { 
            id: 'sc-1', 
            supplierName: 'Global Components Inc.', 
            period: '2024-Q2', 
            onTimeDelivery: 98.5, 
            qualityAcceptance: 99.8, 
            carResponseTime: 5, 
            overallScore: '99.28', 
            notes: 'Top performer.' 
        },
        { 
            id: 'sc-2', 
            supplierName: 'Euro-Spec Forgings', 
            period: '2024-Q2', 
            onTimeDelivery: 92.0, 
            qualityAcceptance: 95.5, 
            carResponseTime: 12, 
            overallScore: '94.10', 
            notes: 'Quality issues on batch #E456.' 
        },
        { 
            id: 'sc-3', 
            supplierName: 'Asia Pacific Metals', 
            period: '2024-Q2', 
            onTimeDelivery: 100, 
            qualityAcceptance: 98.0, 
            carResponseTime: 7, 
            overallScore: '98.80', 
            notes: '' 
        }
    ],

    // Training Records Templates
    trainingRecords: [
        { 
            id: 'tr-1', 
            employeeName: 'John Doe', 
            courseTitle: 'ISO 9001:2015 Awareness', 
            trainingDate: '2024-01-15', 
            expirationDate: '2026-01-14', 
            status: 'Completed', 
            trainer: 'QMS Academy', 
            certificatePath: '/certs/jd-iso.pdf', 
            notes: 'Scored 95% on assessment.' 
        },
        { 
            id: 'tr-2', 
            employeeName: 'Jane Smith', 
            courseTitle: 'Internal Auditor Training', 
            trainingDate: '2023-09-01', 
            expirationDate: '2025-08-31', 
            status: 'Completed', 
            trainer: 'Internal (John Doe)', 
            certificatePath: '/certs/js-ia.pdf', 
            notes: '' 
        },
        { 
            id: 'tr-3', 
            employeeName: 'Peter Jones', 
            courseTitle: 'Forklift Operation Safety', 
            trainingDate: '2024-06-10', 
            expirationDate: '2027-06-09', 
            status: 'Completed', 
            trainer: 'Safety First Inc.', 
            certificatePath: '/certs/pj-forklift.pdf', 
            notes: 'Practical exam passed.' 
        },
        { 
            id: 'tr-4', 
            employeeName: 'Alice Johnson', 
            courseTitle: 'Advanced Welding Techniques', 
            trainingDate: '2024-07-25', 
            expirationDate: '', 
            status: 'Scheduled', 
            trainer: 'Welders Guild', 
            certificatePath: '', 
            notes: 'Scheduled for next month.' 
        }
    ]
};

// Helper function to get template data by component type
export const getTemplateData = (templateKey) => {
    return TABLE_TEMPLATES[templateKey] || [];
};

// Helper function to get all available template keys
export const getAvailableTemplates = () => {
    return Object.keys(TABLE_TEMPLATES);
};