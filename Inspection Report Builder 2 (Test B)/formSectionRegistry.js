// Central registry for all form sections
import { BasicInfoSection } from './sections/basicInfoSection.js';
import { ContactInfoSection } from './sections/contactInfoSection.js';
import { OrderInfoSection } from './sections/orderInfoSection.js';
import { PurposeSummarySection } from './sections/purposeSummarySection.js';
import { InspectionResultsSection } from './sections/inspectionResultsSection.js';
import { CertificatesSection } from './sections/certificatesSection.js';
import { AuditAssessmentSection } from './sections/auditAssessmentSection.js';
import { AdditionalDocsSection } from './sections/additionalDocsSection.js';
import { CalibrationSection } from './sections/calibrationSection.js';
import { ContainerSections } from './sections/containerSections.js';
import { SignaturesSection } from './sections/signaturesSection.js';
import { CreateObjectsSection } from './sections/createObjectsSection.js';
import { ImageAttachmentsSection } from './sections/imageAttachmentsSection.js';
import { ExtendedAuditSection } from './sections/extendedAuditSection.js';
import { ApprovedManufacturersSection } from './sections/approvedManufacturersSection.js';

export const FormSections = {
    createBasicInformationSection: BasicInfoSection.create,
    createContactInformationSection: ContactInfoSection.create,
    createOrderInformationSection: OrderInfoSection.create,
    createPurposeAndSummarySection: PurposeSummarySection.create,
    createInspectionResultsSection: InspectionResultsSection.create,
    createCertificatesSection: CertificatesSection.create,
    createAuditAssessmentSection: AuditAssessmentSection.create,
    createAdditionalDocsSection: AdditionalDocsSection.create,
    createCalibrationSection: CalibrationSection.create,
    createSignaturesSection: SignaturesSection.create,
    createCreateObjectsSection: CreateObjectsSection.create,
    createImageAttachmentsSection: ImageAttachmentsSection.create,
    createExtendedAuditSection: ExtendedAuditSection.create,
    createApprovedManufacturersSection: ApprovedManufacturersSection.create,
    createTimeBreakdownSection: ContainerSections.createTimeBreakdownSection,
    createContactTableSection: ContainerSections.createContactTableSection,
    createItemDetailsSection: ContainerSections.createItemDetailsSection,
    createInspectionSections: ContainerSections.createInspectionSections,
    createDocumentSection: ContainerSections.createDocumentSection,
    createISO9001Section: ContainerSections.createISO9001Section,
    createExtendedAuditTableSection: ContainerSections.createExtendedAuditTableSection
};

