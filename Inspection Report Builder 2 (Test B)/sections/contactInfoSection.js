// Contact Information form section
export const ContactInfoSection = {
    create() {
        return `
            <fieldset data-section-id="contact-info">
                <legend>Contact Information</legend>

                <div class="form-section-three-column">
                    <div class="form-group">
                        <label for="contact-person">Contact Person:</label>
                        <input type="text" id="contact-person" name="contact-person">
                    </div>

                    <div class="form-group">
                        <label for="inspection-location">Inspection Location:</label>
                        <input type="text" id="inspection-location" name="inspection-location">
                    </div>

                    <div class="form-group">
                        <label for="tel-no">Tel No.:</label>
                        <input type="text" id="tel-no" name="tel-no">
                    </div>
                </div>

                <div class="form-group">
                    <label>Type of Inspection:</label>
                    <div>
                        <input type="radio" id="type-interim" name="type-of-inspection" value="interim">
                        <label for="type-interim">Interim</label>

                        <input type="radio" id="type-final" name="type-of-inspection" value="final">
                        <label for="type-final">Final</label>

                        <input type="radio" id="type-other" name="type-of-inspection" value="other">
                        <label for="type-other">Other</label>
                    </div>
                </div>

                <div class="form-group">
                    <label>Result of Inspection:</label>
                    <div>
                        <input type="radio" id="result-accepted" name="result-of-inspection" value="accepted">
                        <label for="result-accepted">Accepted</label>

                        <input type="radio" id="result-hold" name="result-of-inspection" value="hold">
                        <label for="result-hold">Hold</label>

                        <input type="radio" id="result-rejected" name="result-of-inspection" value="rejected">
                        <label for="result-rejected">Rejected</label>

                        <input type="radio" id="result-other" name="result-of-inspection" value="other">
                        <label for="result-other">Other</label>
                    </div>
                </div>

                <div class="form-group">
                    <label>Order Status:</label>
                    <div>
                        <input type="radio" id="status-whole" name="order-status" value="whole">
                        <label for="status-whole">Whole</label>

                        <input type="radio" id="status-part" name="order-status" value="part">
                        <label for="status-part">Part</label>

                        <input type="radio" id="status-balance" name="order-status" value="balance">
                        <label for="status-balance">Balance</label>
                    </div>
                </div>
            </fieldset>
        `;
    }
};