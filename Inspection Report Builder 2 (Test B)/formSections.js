// Form section generators for the inspection report
// Refactored to use individual section modules

// removed createBasicInformationSection() {}
// removed createContactInformationSection() {}
// removed createOrderInformationSection() {}
// removed createPurposeAndSummarySection() {}
// removed createInspectionResultsSection() {}
// removed createCertificatesSection() {}
// removed createAuditAssessmentSection() {}
// removed createAdditionalDocsSection() {}
// removed createCalibrationSection() {}
// removed createTimeBreakdownSection() {}
// removed createContactTableSection() {}
// removed createItemDetailsSection() {}
// removed createInspectionSections() {}
// removed createDocumentSection() {}
// removed createISO9001Section() {}

// Re-export all sections from the registry
export { FormSections } from './formSectionRegistry.js';