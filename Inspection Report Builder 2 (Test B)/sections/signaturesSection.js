// Signatures form section
export const SignaturesSection = {
    create() {
        return `
            <fieldset data-section-id="signatures">
                <legend>Signatures</legend>
                <div class="form-section-two-column">
                    <div class="form-group">
                        <label for="inspector-signature">Inspector Signature:</label>
                        <input type="text" id="inspector-signature" name="inspector-signature" placeholder="Type Inspector name here">
                    </div>
                    <div class="form-group">
                        <label for="supplier-signature">Supplier:</label>
                        <input type="text" id="supplier-signature" name="supplier-signature" placeholder="Type Supplier name here">
                    </div>
                </div>
            </fieldset>
        `;
    }
};