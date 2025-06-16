// Container sections for tables and complex components
export const ContainerSections = {
    
    createTimeBreakdownSection() {
        return `
            <fieldset data-section-id="time-breakdown">
                <legend>Time Breakdown</legend>
                <div id="time-breakdown-container"></div>
            </fieldset>
        `;
    },

    createContactTableSection() {
        return `
            <fieldset data-section-id="contact-table">
                <legend>Contact Information Table</legend>
                <div id="contact-table-container"></div>
            </fieldset>
        `;
    },

    createItemDetailsSection() {
        return `
            <fieldset data-section-id="item-details">
                <legend>Item Details</legend>
                <div id="item-details-container"></div>
            </fieldset>
        `;
    },

    createInspectionSections() {
        return `
            <fieldset data-section-id="valves-inspection">
                <legend>Valves Inspection</legend>
                <div id="valves-inspection-container"></div>
            </fieldset>

            <fieldset data-section-id="actuator-inspection">
                <legend>Actuator Inspection</legend>
                <div id="actuator-inspection-container"></div>
            </fieldset>

            <fieldset data-section-id="ancillaries-inspection">
                <legend>Ancillaries Inspection</legend>
                <div id="ancillaries-inspection-container"></div>
            </fieldset>

            <fieldset data-section-id="spools-inspection">
                <legend>Spools / Framework Inspection</legend>
                <div id="spools-inspection-container"></div>
            </fieldset>

            <fieldset data-section-id="gas-products-inspection">
                <legend>Gas Products Inspection</legend>
                <div id="gas-products-inspection-container"></div>
            </fieldset>

            <fieldset data-section-id="pipe-inspection">
                <legend>Pipe Inspection</legend>
                <div id="pipe-inspection-container"></div>
            </fieldset>

            <fieldset data-section-id="gauges-fittings-inspection">
                <legend>Gauges, Fittings and Flange Inspection</legend>
                <div id="gauges-fittings-inspection-container"></div>
            </fieldset>

            <fieldset data-section-id="generic-visual-inspection">
                <legend>Generic Visual Inspection</legend>
                <div id="generic-visual-inspection-container"></div>
            </fieldset>

            <fieldset data-section-id="other-visual-inspection">
                <legend>Other Visual Inspection Notes</legend>
                <div id="other-visual-inspection-container"></div>
            </fieldset>

            <fieldset data-section-id="custom-inspection-builder">
                <legend>Custom Inspection Builder</legend>
                <div id="custom-inspection-builder-container">
                    <div class="inspection-builder-controls">
                        <button type="button" id="add-inspection-type-btn" class="btn-add-inspection">Add Inspection Type</button>
                        <button type="button" id="save-inspection-builder-btn" class="btn-save-inspection">Save Inspection Setup</button>
                        <button type="button" id="load-inspection-builder-btn" class="btn-load-inspection">Load Inspection Setup</button>
                        <button type="button" id="save-inspection-file-btn" class="btn-save-inspection">Save as File</button>
                        <button type="button" id="load-inspection-file-btn" class="btn-load-inspection">Load from File</button>
                        <button type="button" id="clear-inspection-builder-btn" class="btn-clear-inspection">Clear All</button>
                    </div>
                    <div id="inspection-types-container"></div>
                    <div id="inspection-preview-container"></div>
                </div>
            </fieldset>
        `;
    },

    createDocumentSection() {
        return `
            <fieldset data-section-id="document-reference">
                <legend>Document Reference</legend>
                <div id="document-reference-container"></div>
            </fieldset>
        `;
    },

    createISO9001Section() {
        return `
            <fieldset data-section-id="iso9001-audit">
                <legend>ISO 9001:2015 Audit Checklist</legend>
                <p>This checklist covers requirements from ISO 9001:2015 clauses 4-10, emphasizing the Process-Based Approach, Risk-Based Thinking (RBT), the Plan-Do-Check-Act (PDCA) cycle, and Continual Improvement.</p>
                <div id="iso9001-audit-container"></div>
            </fieldset>
        `;
    },

    createExtendedAuditTableSection() {
        return `
            <fieldset data-section-id="extended-audit-table">
                <legend>Extended Audit Checklist Table</legend>
                <div class="extended-audit-table-wrapper">
                    <div id="extended-audit-table-container"></div>
                </div>
            </fieldset>
        `;
    }
};