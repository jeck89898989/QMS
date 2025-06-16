// Order Information form section
export const OrderInfoSection = {
    create() {
        return `
            <fieldset data-section-id="order-info">
                <legend>Order Information</legend>

                <div class="form-section-three-column">
                    <div class="form-group">
                        <label for="mrc-po-nos">MRC Global P.O No(s).:</label>
                        <input type="text" id="mrc-po-nos" name="mrc-po-nos" placeholder="Enter MRC Global PO number(s)">
                    </div>

                    <div class="form-group">
                        <label for="project-no-title">Project No./Title:</label>
                        <input type="text" id="project-no-title" name="project-no-title">
                    </div>

                    <div class="form-group">
                        <label for="mrc-client-order-no">MRC Global Client Order No.:</label>
                        <input type="text" id="mrc-client-order-no" name="mrc-client-order-no">
                    </div>
                </div>

                <div class="form-group">
                    <label>Surveillance points:</label>
                    <div>
                        <input type="checkbox" id="surveillance-h" name="surveillance-points" value="H">
                        <label for="surveillance-h">H</label>

                        <input type="checkbox" id="surveillance-w" name="surveillance-points" value="W">
                        <label for="surveillance-w">W</label>

                        <input type="checkbox" id="surveillance-r" name="surveillance-points" value="R">
                        <label for="surveillance-r">R</label>

                        <input type="checkbox" id="surveillance-m" name="surveillance-points" value="M">
                        <label for="surveillance-m">M</label>

                        <input type="checkbox" id="surveillance-other" name="surveillance-points" value="other">
                        <label for="surveillance-other">Other</label>
                    </div>
                </div>

                <div class="form-group">
                    <label>Report Type:</label>
                    <div>
                        <input type="radio" id="report-type-daily" name="report-type" value="daily">
                        <label for="report-type-daily">Daily</label>

                        <input type="radio" id="report-type-weekly" name="report-type" value="weekly">
                        <label for="report-type-weekly">Weekly</label>

                        <input type="radio" id="report-type-other" name="report-type" value="other">
                        <label for="report-type-other">Other</label>
                    </div>
                </div>

                <div class="form-section-three-column">
                    <div class="form-group">
                        <label for="supplier-delivery-date">Supplier Contractual Delivery Date:</label>
                        <input type="date" id="supplier-delivery-date" name="supplier-delivery-date">
                    </div>

                    <div class="form-group">
                        <label for="inspector-name">Inspector Name and Surname:</label>
                        <input type="text" id="inspector-name" name="inspector-name">
                    </div>

                    <div class="form-group">
                        <label for="mrc-stamp-no">MRC Global EUR stamp no.:</label>
                        <input type="text" id="mrc-stamp-no" name="mrc-stamp-no">
                    </div>
                </div>
            </fieldset>
        `;
    }
};