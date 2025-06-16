// Basic Information form section
export const BasicInfoSection = {
    create() {
        return `
            <fieldset data-section-id="basic-info">
                <legend>Basic Information</legend>

                <div class="form-section-four-column">
                    <div class="form-group">
                        <label for="ir-issued-date">IR Issued Date:</label>
                        <input type="date" id="ir-issued-date" name="ir-issued-date">
                    </div>

                    <div class="form-group">
                        <label for="reference-order">Reference Order/Project:</label>
                        <input type="text" id="reference-order" name="reference-order">
                    </div>

                    <div class="form-group">
                        <label for="report-number">Report Number:</label>
                        <input type="text" id="report-number" name="report-number">
                    </div>

                    <div class="form-group">
                        <label for="ir-revision">IR Revision:</label>
                        <input type="text" id="ir-revision" name="ir-revision">
                    </div>

                    <div class="form-group">
                        <label for="manufacturer">Manufacturer:</label>
                        <input type="text" id="manufacturer" name="manufacturer">
                    </div>

                    <div class="form-group">
                        <label for="supplier">Supplier/SubSupplier:</label>
                        <input type="text" id="supplier" name="supplier">
                    </div>

                    <div class="form-group">
                        <label for="mrc-client">MRC Global Client:</label>
                        <input type="text" id="mrc-client" name="mrc-client">
                    </div>

                    <div class="form-group">
                        <label for="supplier-job-no">Supplier Job No.:</label>
                        <input type="text" id="supplier-job-no" name="supplier-job-no">
                    </div>
                </div>
            </fieldset>
        `;
    }
};