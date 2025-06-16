// Certificates form section
export const CertificatesSection = {
    create() {
        return `
            <fieldset data-section-id="certificates">
                <legend>Certificates</legend>
                <div class="form-group">
                    <label>MATERIALS TEST CERTIFICATES AND REPORTS</label>
                </div>
                <div class="form-section-two-column">
                    <div class="form-group">
                        <label for="certs-inline-explain">If NO, explain:</label>
                        <textarea id="certs-inline-explain" name="certs-inline-explain" rows="4"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Are all certificates in line report names, codes, etc.</label>
                        <div>
                            <input type="radio" id="certs-inline-yes" name="certs-inline" value="yes">
                            <label for="certs-inline-yes">YES</label>

                            <input type="radio" id="certs-inline-no" name="certs-inline" value="no">
                            <label for="certs-inline-no">NO</label>
                        </div>
                    </div>
                </div>
            </fieldset>
        `;
    }
};