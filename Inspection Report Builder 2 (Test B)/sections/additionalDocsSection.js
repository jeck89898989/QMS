// Additional Documents & Information form section
export const AdditionalDocsSection = {
    create() {
        return `
            <fieldset data-section-id="additional-docs">
                <legend>Additional Documents & Information</legend>
                <div id="additional-docs-container"></div>

                <div class="form-section-two-column">
                    <div class="form-group">
                        <label for="logistics-info">Logistics Information:</label>
                        <textarea id="logistics-info" name="logistics-info" rows="4"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="transportation-link">Link Transportation:</label>
                        <textarea id="transportation-link" name="transportation-link" rows="4"></textarea>
                    </div>

                    <div class="form-group">
                        <label for="preventative-remedial">Preventative/Remedial activities summary:</label>
                        <textarea id="preventative-remedial" name="preventative-remedial" rows="4"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="facility-notes">Facility:</label>
                        <textarea id="facility-notes" name="facility-notes" rows="4"></textarea>
                    </div>

                    <div class="form-group">
                        <label for="safety-notes">Safety:</label>
                        <textarea id="safety-notes" name="safety-notes" rows="4"></textarea>
                    </div>
                </div>
            </fieldset>
        `;
    }
};