// Field builder functionality for custom form fields
export const FieldBuilder = {
    fieldCounter: 0,

    addCustomField() {
        this.fieldCounter++;
        const container = document.getElementById('custom-object-builder');
        const fieldHtml = `
            <div class="custom-field" data-field-id="${this.fieldCounter}">
                <div class="field-controls">
                    <input type="text" name="custom-field-label-${this.fieldCounter}" placeholder="Field Label" class="field-label">
                    <select name="custom-field-type-${this.fieldCounter}" class="field-type">
                        <option value="text">Text Input</option>
                        <option value="textarea">Textarea</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="radio">Radio Button</option>
                        <option value="select">Dropdown</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                    </select>
                    <input type="text" name="custom-field-options-${this.fieldCounter}" placeholder="Options (comma-separated)" class="field-options" style="display:none;">
                    <button type="button" class="remove-field">Remove</button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', fieldHtml);

        // Add event listener for field type changes
        const typeSelect = container.querySelector(`[name="custom-field-type-${this.fieldCounter}"]`);
        const optionsInput = container.querySelector(`[name="custom-field-options-${this.fieldCounter}"]`);
        
        typeSelect.addEventListener('change', () => {
            if (['radio', 'select', 'checkbox'].includes(typeSelect.value)) {
                optionsInput.style.display = 'inline-block';
            } else {
                optionsInput.style.display = 'none';
            }
        });
    },

    removeField(button) {
        const field = button.closest('.custom-field');
        field.remove();
    }
};