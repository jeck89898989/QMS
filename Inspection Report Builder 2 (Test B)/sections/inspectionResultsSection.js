// Inspection Results form section
export const InspectionResultsSection = {
    create() {
        return `
            <fieldset data-section-id="inspection-results">
                <legend>Paragraph I - Results of Inspection</legend>
                <div class="form-group">
                    <label for="general-observations">General observations and summary of inspection results:</label>
                    <textarea id="general-observations" name="general-observations" rows="6" placeholder="Enter general observations and summary of inspection results..."></textarea>
                </div>

                <div id="inspection-results-container"></div>
            </fieldset>
        `;
    }
};