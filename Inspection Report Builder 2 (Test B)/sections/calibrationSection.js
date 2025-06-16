// Calibration form section
export const CalibrationSection = {
    create() {
        return `
            <fieldset data-section-id="calibration">
                <legend>Calibration</legend>
                <div class="form-group">
                    <label for="calibration-description">Description of all measurement method or transfer standards and found value:</label>
                    <textarea id="calibration-description" name="calibration-description" rows="6"></textarea>
                </div>
                <div id="calibration-container"></div>
            </fieldset>
        `;
    }
};