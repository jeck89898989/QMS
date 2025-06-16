export const CHECKLIST_TEMPLATES = {
    sales: {
        name: 'Standard Sales Process Checklist',
        items: [
            { text: "Have customer requirements been fully identified and documented?", reference: "ISO 9001: 8.2.2" },
            { text: "Has the contract or order been reviewed for feasibility?", reference: "ISO 9001: 8.2.3" },
            { text: "Are records of the contract review maintained?", reference: "ISO 9001: 8.2.3.2" },
            { text: "Have any changes to the contract been communicated and agreed upon?", reference: "ISO 9001: 8.2.4" }
        ]
    },
    purchasing: {
        name: 'Supplier Evaluation Checklist',
        items: [
            { text: "Is there a defined process for evaluating and selecting suppliers?", reference: "ISO 9001: 8.4.1" },
            { text: "Are criteria for supplier selection, evaluation, and re-evaluation established?", reference: "ISO 9001: 8.4.1" },
            { text: "Are records of supplier evaluations maintained?", reference: "ISO 9001: 8.4.1" },
            { text: "Is the type and extent of control applied to suppliers defined?", reference: "ISO 9001: 8.4.2" },
        ]
    },
    receiving: {
        name: 'Incoming Goods Inspection Checklist',
        items: [
            { text: "Are incoming materials verified against purchasing information?", reference: "ISO 9001: 8.4.3" },
            { text: "Are goods inspected or otherwise verified as conforming to specified requirements?", reference: "ISO 9001: 8.6.2" },
            { text: "Is the identification and traceability of incoming materials maintained?", reference: "ISO 9001: 8.5.2" },
            { text: "Are non-conforming materials identified and segregated?", reference: "ISO 9001: 8.7" },
        ]
    },
    preDelivery: {
        name: 'Pre-Delivery Activities Checklist',
        items: [
            { text: "Have all planned final inspection activities been completed?", reference: "ISO 9001: 8.6" },
            { text: "Is product preservation ensured during internal processing and delivery?", reference: "ISO 9001: 8.5.4" },
            { text: "Are post-delivery activities (e.g., warranty, maintenance) requirements determined and met?", reference: "ISO 9001: 8.5.5" },
            { text: "Is the release of product and service authorized and documented?", reference: "ISO 9001: 8.6" },
        ]
    },
    pdca: {
        name: 'PDCA Cycle Checklist',
        items: [
            { text: "PLAN: Establish objectives and processes necessary to deliver results.", reference: "PDCA" },
            { text: "DO: Implement the planned processes.", reference: "PDCA" },
            { text: "CHECK: Monitor and measure processes and products against policies, objectives, and report the results.", reference: "PDCA" },
            { text: "ACT: Take actions to continually improve process performance.", reference: "PDCA" },
        ]
    },
    eightD: {
        name: '8D Problem Solving Checklist',
        items: [
            { text: "D1: Establish the Team", reference: "8D" },
            { text: "D2: Describe the Problem", reference: "8D" },
            { text: "D3: Implement and Verify Interim Containment Actions", reference: "8D" },
            { text: "D4: Define and Verify Root Cause and Escape Point", reference: "8D" },
            { text: "D5: Choose and Verify Permanent Corrective Actions (PCAs)", reference: "8D" },
            { text: "D6: Implement and Validate PCAs", reference: "8D" },
            { text: "D7: Prevent Recurrence", reference: "8D" },
            { text: "D8: Congratulate the Team", reference: "8D" },
        ]
    },
    internalAudit: {
        name: 'General Internal Audit Checklist',
        items: [
             { text: "Are quality objectives established and communicated?", reference: "ISO 9001: 6.2" },
             { text: "Is the Quality Policy available, understood, and applied?", reference: "ISO 9001: 5.2" },
             { text: "Are processes for the QMS defined and documented?", reference: "ISO 9001: 4.4" },
             { text: "Are records of management reviews maintained?", reference: "ISO 9001: 9.3" },
        ]
    },
    productInspection: {
        name: 'Final Product Inspection Checklist',
        items: [
            { text: "Do visual characteristics meet specifications (color, finish, etc.)?", reference: "WI-INSP-001" },
            { text: "Are all dimensions within tolerance as per drawing?", reference: "DRW-12345" },
            { text: "Is packaging and labeling correct?", reference: "SPEC-PKG-002" },
            { text: "Have all required functional tests been performed and passed?", reference: "TP-FUNC-003" },
            { text: "Is all required documentation present (certificates, manuals)?", reference: "QAP-004" },
        ]
    }
};

// Add standard checklist fields to all template items
Object.values(CHECKLIST_TEMPLATES).forEach(template => {
    template.items = template.items.map((item, index) => ({
        id: `template-item-${index}`, // This is a placeholder ID and will be replaced on generation
        completed: false,
        comments: "",
        actions: "",
        status: "not-started",
        ...item,
    }));
});