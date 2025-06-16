// Approved Manufacturers List form section
export const ApprovedManufacturersSection = {
    create() {
        return `
            <fieldset data-section-id="approved-manufacturers">
                <legend>Approved Manufacturers List</legend>
                <div class="approved-manufacturers-description">
                    <p>Comprehensive list of approved manufacturers with detailed information including capabilities, approval status, and audit history.</p>
                </div>
                <div class="approved-manufacturers-controls">
                    <button type="button" id="add-manufacturer-btn" class="btn-add-manufacturer">Add Manufacturer</button>
                    <button type="button" id="import-manufacturers-csv-btn" class="btn-import-csv">Import from CSV</button>
                    <input type="file" id="manufacturers-csv-input" accept=".csv" style="display: none;">
                    <button type="button" id="export-manufacturers-csv-btn" class="btn-export-csv">Export to CSV</button>
                </div>
                <div id="approved-manufacturers-container">
                    </div>
                </div>
            </fieldset>
        `;
    }
};

