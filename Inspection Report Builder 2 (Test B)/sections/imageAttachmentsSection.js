// Image Attachments form section
export const ImageAttachmentsSection = {
    create() {
        return `
            <fieldset data-section-id="image-attachments">
                <legend>Image Attachments</legend>
                <div id="image-attachments-controls">
                    <button type="button" id="zip-images-btn" class="btn-action">Zip All Images</button>
                    <button type="button" id="delete-all-images-btn" class="btn-action btn-danger">Delete All Images</button>
                    <div class="image-display-control">
                        <label for="images-per-row">Images per row:</label>
                        <select id="images-per-row">
                            <option value="auto" selected>Auto</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>
                    </div>
                </div>
                <div id="image-upload-container">
                    <div id="image-drop-zone" class="drop-zone">
                        <p>Drag & drop images here, or click to select files.</p>
                        <input type="file" id="image-upload-input" multiple accept="image/png, image/jpeg, image/jpg">
                    </div>
                    <div class="upload-notes">
                        <small>You can upload multiple PNG or JPG files. Images are saved in your browser and will persist between sessions. They are not included in the JSON export, but can be downloaded as a zip file.</small>
                    </div>
                    <div id="image-previews" class="image-previews-container">
                        <!-- Image previews will be generated here -->
                    </div>
                </div>
            </fieldset>
        `;
    }
};