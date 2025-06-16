// Audit/Assessment form section
export const AuditAssessmentSection = {
    create() {
        return `
            <fieldset data-section-id="audit-assessment">
                <legend>Audit/Assessment</legend>

                <div class="form-section-two-column">
                    <div class="form-group">
                        <label for="audit-date">Audit/Assessment Date:</label>
                        <input type="date" id="audit-date" name="audit-date">
                    </div>

                    <div class="form-group">
                        <label for="audit-number">Audit/Assessment Number:</label>
                        <input type="text" id="audit-number" name="audit-number">
                    </div>

                    <div class="form-group">
                        <label for="auditing-body">Auditing Body/Company:</label>
                        <input type="text" id="auditing-body" name="auditing-body">
                    </div>

                    <div class="form-group">
                        <label for="auditor-names">Auditor Name(s):</label>
                        <input type="text" id="auditor-names" name="auditor-names">
                    </div>
                </div>

                <div class="form-group">
                    <label>Audit/Assessment Type:</label>
                    <div>
                        <input type="radio" id="audit-type-initial" name="audit-type" value="initial">
                        <label for="audit-type-initial">Initial</label>

                        <input type="radio" id="audit-type-surveillance" name="audit-type" value="surveillance">
                        <label for="audit-type-surveillance">Surveillance</label>

                        <input type="radio" id="audit-type-closing" name="audit-type" value="closing">
                        <label for="audit-type-closing">Closing</label>

                        <input type="radio" id="audit-type-other" name="audit-type" value="other">
                        <label for="audit-type-other">Other</label>
                    </div>
                </div>

                <div class="form-section-two-column">
                    <div class="form-group">
                        <label for="audit-scope">Scope of Audit/Assessment:</label>
                        <textarea id="audit-scope" name="audit-scope" rows="4" placeholder="Describe the scope of the audit/assessment..."></textarea>
                    </div>

                    <div class="form-group">
                        <label for="audit-notes">Notes/Explanation on Outcome:</label>
                        <textarea id="audit-notes" name="audit-notes" rows="4" placeholder="Provide details if outcome is Fail, Non-conformities, or Other..."></textarea>
                    </div>
                </div>

                <div class="form-group">
                    <label>Outcome/Result:</label>
                    <div>
                        <input type="radio" id="audit-result-pass" name="audit-result" value="pass">
                        <label for="audit-result-pass">Pass</label>

                        <input type="radio" id="audit-result-fail" name="audit-result" value="fail">
                        <label for="audit-result-fail">Fail</label>

                        <input type="radio" id="audit-result-minor" name="audit-result" value="minor-nc">
                        <label for="audit-result-minor">Minor Non-conformities</label>

                        <input type="radio" id="audit-result-major" name="audit-result" value="major-nc">
                        <label for="audit-result-major">Major Non-conformities</label>

                        <input type="radio" id="audit-result-other" name="audit-result" value="other">
                        <label for="audit-result-other">Other</label>
                    </div>
                </div>
            </fieldset>
        `;
    }
};