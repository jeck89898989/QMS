// Create Objects form section for custom inspection plans and audit checklists
export const CreateObjectsSection = {
    create() {
        return `
            <fieldset class="no-print" data-section-id="create-objects">
                <legend>Create Custom Objects</legend>
                <div class="form-group">
                    <label>Custom Object Type:</label>
                    <div>
                        <input type="radio" id="create-inspection-plan" name="create-object-type" value="inspection-plan">
                        <label for="create-inspection-plan">Inspection Plan</label>

                        <input type="radio" id="create-audit-checklist" name="create-object-type" value="audit-checklist">
                        <label for="create-audit-checklist">Audit Checklist</label>
                    </div>
                </div>

                <div class="form-section-two-column">
                    <div class="form-group">
                        <label for="custom-object-title">Object Title:</label>
                        <input type="text" id="custom-object-title" name="custom-object-title" placeholder="Enter title for your custom object">
                    </div>
                    <div class="form-group">
                        <label for="custom-object-description">Description:</label>
                        <textarea id="custom-object-description" name="custom-object-description" rows="3" placeholder="Enter description"></textarea>
                    </div>
                </div>

                <div class="form-group">
                    <button type="button" id="add-custom-field" class="btn-add-field">Add Field</button>
                    <button type="button" id="add-custom-section" class="btn-add-section">Add Section</button>
                    <button type="button" id="save-custom-object" class="btn-save-object">Save Custom Object</button>
                    <button type="button" id="load-custom-object" class="btn-load-object">Load Custom Object</button>
                </div>

                <div id="custom-object-builder"></div>
                <div id="saved-custom-objects"></div>
            </fieldset>
        `;
    }
};