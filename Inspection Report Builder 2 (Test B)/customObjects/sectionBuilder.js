// Section builder functionality for custom inspection sections
export const SectionBuilder = {
    sectionCounter: 0,
    inspectionItemCounter: 0,

    addCustomSection() {
        this.sectionCounter++;
        const container = document.getElementById('custom-object-builder');
        const sectionHtml = `
            <div class="custom-section" data-section-id="${this.sectionCounter}">
                <div class="section-controls">
                    <input type="text" name="custom-section-title-${this.sectionCounter}" placeholder="Section Title (e.g., Valve Inspection, Custom Audit)" class="section-title">
                    <button type="button" class="add-inspection-item" data-section-id="${this.sectionCounter}">Add Inspection Item</button>
                    <button type="button" class="remove-section">Remove Section</button>
                </div>
                <div class="section-fields" data-section="${this.sectionCounter}">
                    <div class="inspection-table-preview">
                        <h5>Inspection Items:</h5>
                        <div class="inspection-items-container" data-section="${this.sectionCounter}"></div>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', sectionHtml);
    },

    addInspectionItem(sectionId) {
        this.inspectionItemCounter++;
        const container = document.querySelector(`.inspection-items-container[data-section="${sectionId}"]`);
        const itemHtml = `
            <div class="inspection-item" data-item-id="${this.inspectionItemCounter}" data-section-id="${sectionId}">
                <div class="item-controls">
                    <input type="text" name="inspection-item-text-${this.inspectionItemCounter}" placeholder="Inspection item (e.g., Quantity, Serial Number Matches Certs)" class="item-text">
                    <input type="text" name="inspection-item-guidance-${this.inspectionItemCounter}" placeholder="Guidance (e.g., MRC Global PO, Visual only)" class="item-guidance">
                    <button type="button" class="remove-inspection-item">Remove</button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', itemHtml);
    },

    removeSection(button) {
        const section = button.closest('.custom-section');
        section.remove();
    },

    removeInspectionItem(button) {
        const item = button.closest('.inspection-item');
        item.remove();
    },

    generateCustomInspectionSection(section) {
        let html = `
            <table class="inspection-table five-col">
                <thead>
                    <tr>
                        <th>${section.title}</th>
                        <th>Pass</th>
                        <th>Fail</th>
                        <th>N/A</th>
                        <th>Guidance</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="section-header">
                        <td colspan="5">${section.title}</td>
                    </tr>
        `;

        section.inspectionItems.forEach(item => {
            const safeItemName = item.text.toLowerCase().replace(/[^a-z0-9]/g, '-');
            html += `
                <tr>
                    <td>${item.text}</td>
                    <td><input type="checkbox" name="custom-${section.id}-${item.id}-pass"></td>
                    <td><input type="checkbox" name="custom-${section.id}-${item.id}-fail"></td>
                    <td><input type="checkbox" name="custom-${section.id}-${item.id}-na"></td>
                    <td>${item.guidance}</td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;

        return html;
    }
};