// Main form builder that assembles all sections
import { FormSections } from './formSectionRegistry.js';

export const FormBuilder = {
    
    buildCompleteForm() {
        const formHTML = [
            FormSections.createBasicInformationSection(),
            FormSections.createContactInformationSection(),
            FormSections.createOrderInformationSection(),
            FormSections.createTimeBreakdownSection(),
            FormSections.createContactTableSection(),
            FormSections.createItemDetailsSection(),
            FormSections.createPurposeAndSummarySection(),
            FormSections.createInspectionResultsSection(),
            FormSections.createInspectionSections(),
            FormSections.createDocumentSection(),
            FormSections.createAdditionalDocsSection(),
            FormSections.createCalibrationSection(),
            FormSections.createCertificatesSection(),
            FormSections.createAuditAssessmentSection(),
            FormSections.createISO9001Section(),
            FormSections.createExtendedAuditSection(),
            FormSections.createExtendedAuditTableSection(),
            FormSections.createApprovedManufacturersSection(),
            FormSections.createImageAttachmentsSection(),
            FormSections.createSignaturesSection(),
            FormSections.createCreateObjectsSection()
        ].join('');

        return formHTML;
    }
};