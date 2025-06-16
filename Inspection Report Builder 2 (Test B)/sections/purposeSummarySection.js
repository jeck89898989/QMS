// Purpose and Summary form section
export const PurposeSummarySection = {
    create() {
        return `
            <fieldset data-section-id="purpose-summary">
                <legend>Purpose and Summary</legend>

                <div class="form-section-two-column">
                    <div class="form-group">
                        <label for="purpose-of-visit">PURPOSE OF VISIT:</label>
                        <textarea id="purpose-of-visit" name="purpose-of-visit" rows="6" placeholder="Describe the scope of visit, refer to PO numbers, type of material and inspection type (ITP step)"></textarea>
                    </div>

                    <div class="form-group">
                        <label for="summary">SUMMARY:</label>
                        <textarea id="summary" name="summary" rows="6" placeholder="Give inspection results in summary."></textarea>
                    </div>

                    <div class="form-group">
                        <label for="hse-feedback">HSE FEEDBACK FROM THE VENDOR:</label>
                        <textarea id="hse-feedback" name="hse-feedback" rows="6"></textarea>
                    </div>

                    <div class="form-group">
                        <label for="additional-notes">ADDITIONAL NOTES & COMMENTS:</label>
                        <textarea id="additional-notes" name="additional-notes" rows="6"></textarea>
                    </div>
                </div>
            </fieldset>
        `;
    }
};