// Extended Audit Checklist form section
export const ExtendedAuditSection = {
    create() {
        return `
            <fieldset data-section-id="extended-audit">
                <legend>Extended Audit Checklist</legend>
                <div class="extended-audit-description">
                    <p>Comprehensive audit checklist with 20 configurable audit points. Use this section for detailed process audits, compliance checks, and systematic evaluations.</p>
                </div>
                <div class="extended-audit-table-wrapper">
                    <div id="extended-audit-container"></div>
                </div>
            </fieldset>
        `;
    }
};

