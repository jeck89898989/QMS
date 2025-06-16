// Object management functionality for custom objects
import { FieldBuilder } from './fieldBuilder.js';
import { SectionBuilder } from './sectionBuilder.js';
import { CustomUI } from './customUI.js';

export const ObjectManager = {
    
    saveCustomObject() {
        const objectType = document.querySelector('input[name="create-object-type"]:checked');
        const title = document.getElementById('custom-object-title').value;
        const description = document.getElementById('custom-object-description').value;

        if (!objectType || !title) {
            alert('Please select object type and enter a title');
            return;
        }

        const customObject = {
            id: Date.now().toString(),
            type: objectType.value,
            title: title,
            description: description,
            fields: this.collectFields(),
            sections: this.collectSections(),
            created: new Date().toISOString()
        };

        this.saveToStorage(customObject);
        this.displaySavedObjects();
        this.clearBuilder();
        alert('Custom object saved successfully!');
    },

    collectFields() {
        const fields = [];
        const fieldElements = document.querySelectorAll('.custom-field');
        
        fieldElements.forEach(fieldEl => {
            const fieldId = fieldEl.dataset.fieldId;
            const label = fieldEl.querySelector(`[name="custom-field-label-${fieldId}"]`).value;
            const type = fieldEl.querySelector(`[name="custom-field-type-${fieldId}"]`).value;
            const options = fieldEl.querySelector(`[name="custom-field-options-${fieldId}"]`).value;
            
            if (label) {
                fields.push({
                    id: fieldId,
                    label: label,
                    type: type,
                    options: options ? options.split(',').map(opt => opt.trim()) : []
                });
            }
        });
        
        return fields;
    },

    collectSections() {
        const sections = [];
        const sectionElements = document.querySelectorAll('.custom-section');
        
        sectionElements.forEach(sectionEl => {
            const sectionId = sectionEl.dataset.sectionId;
            const title = sectionEl.querySelector(`[name="custom-section-title-${sectionId}"]`).value;
            
            if (title) {
                const inspectionItems = this.collectInspectionItems(sectionId);
                sections.push({
                    id: sectionId,
                    title: title,
                    inspectionItems: inspectionItems
                });
            }
        });
        
        return sections;
    },

    collectInspectionItems(sectionId) {
        const items = [];
        const itemElements = document.querySelectorAll(`.inspection-item[data-section-id="${sectionId}"]`);
        
        itemElements.forEach(itemEl => {
            const itemId = itemEl.dataset.itemId;
            const text = itemEl.querySelector(`[name="inspection-item-text-${itemId}"]`).value;
            const guidance = itemEl.querySelector(`[name="inspection-item-guidance-${itemId}"]`).value;
            
            if (text) {
                items.push({
                    id: itemId,
                    text: text,
                    guidance: guidance || 'Visual inspection'
                });
            }
        });
        
        return items;
    },

    saveToStorage(customObject) {
        const existingObjects = JSON.parse(localStorage.getItem('custom_objects') || '[]');
        existingObjects.push(customObject);
        localStorage.setItem('custom_objects', JSON.stringify(existingObjects));
    },

    loadSavedObjects() {
        this.displaySavedObjects();
    },

    displaySavedObjects() {
        const container = document.getElementById('saved-custom-objects');
        const objects = JSON.parse(localStorage.getItem('custom_objects') || '[]');
        
        if (objects.length === 0) {
            container.innerHTML = '<p>No saved custom objects</p>';
            return;
        }

        let html = '<h4>Saved Custom Objects</h4><div class="saved-objects-list">';
        objects.forEach(obj => {
            html += `
                <div class="saved-object-item">
                    <div class="object-info">
                        <strong>${obj.title}</strong> (${obj.type})
                        <br><small>${obj.description}</small>
                        <br><small>Created: ${new Date(obj.created).toLocaleDateString()}</small>
                    </div>
                    <div class="object-actions">
                        <button type="button" class="load-object-btn" data-object-id="${obj.id}">Load</button>
                        <button type="button" class="delete-object-btn" data-object-id="${obj.id}">Delete</button>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    },

    loadCustomObject(objectId) {
        const objects = JSON.parse(localStorage.getItem('custom_objects') || '[]');
        const object = objects.find(obj => obj.id === objectId);
        
        if (!object) {
            alert('Object not found');
            return;
        }

        // Clear current builder
        this.clearBuilder();

        // Load object data
        document.getElementById('custom-object-title').value = object.title;
        document.getElementById('custom-object-description').value = object.description;
        document.querySelector(`input[name="create-object-type"][value="${object.type}"]`).checked = true;

        // Rebuild fields and sections
        this.rebuildObject(object);

        // After rebuilding, render field previews
        this.renderFieldPreview(object.fields);
    },

    renderFieldPreview(fields) {
        // Remove old preview if exists
        let oldPreview = document.getElementById('custom-fields-preview');
        if (oldPreview) oldPreview.remove();

        if (!fields || !fields.length) return;

        const preview = document.createElement('div');
        preview.id = 'custom-fields-preview';
        preview.innerHTML = '<h5>Fields Preview</h5><form id="custom-object-preview-form"></form>';

        const previewForm = preview.querySelector('form');

        fields.forEach(field => {
            const fieldDiv = document.createElement('div');
            fieldDiv.className = 'custom-preview-field';

            // Label
            const label = document.createElement('label');
            label.textContent = field.label + ': ';
            label.htmlFor = 'preview-' + field.id;

            // Field input by type
            let input;
            if (field.type === 'text' || !field.type) {
                input = document.createElement('input');
                input.type = 'text';
                input.id = 'preview-' + field.id;
                input.name = field.label;
            } else if (field.type === 'textarea') {
                input = document.createElement('textarea');
                input.id = 'preview-' + field.id;
                input.name = field.label;
                input.rows = 2;
            } else if (field.type === 'number') {
                input = document.createElement('input');
                input.type = 'number';
                input.id = 'preview-' + field.id;
                input.name = field.label;
            } else if (field.type === 'date') {
                input = document.createElement('input');
                input.type = 'date';
                input.id = 'preview-' + field.id;
                input.name = field.label;
            } else if (field.type === 'checkbox') {
                input = document.createElement('div');
                field.options.forEach(opt => {
                    const boxId = 'preview-' + field.id + '-' + opt;
                    const box = document.createElement('input');
                    box.type = 'checkbox';
                    box.id = boxId;
                    box.name = field.label;
                    box.value = opt;
                    const boxLabel = document.createElement('label');
                    boxLabel.htmlFor = boxId;
                    boxLabel.style.marginRight = '10px';
                    boxLabel.textContent = opt;
                    input.appendChild(box);
                    input.appendChild(boxLabel);
                });
            } else if (field.type === 'radio') {
                input = document.createElement('div');
                field.options.forEach(opt => {
                    const radioId = 'preview-' + field.id + '-' + opt;
                    const radio = document.createElement('input');
                    radio.type = 'radio';
                    radio.id = radioId;
                    radio.name = field.label;
                    radio.value = opt;
                    const radioLabel = document.createElement('label');
                    radioLabel.htmlFor = radioId;
                    radioLabel.style.marginRight = '10px';
                    radioLabel.textContent = opt;
                    input.appendChild(radio);
                    input.appendChild(radioLabel);
                });
            } else if (field.type === 'select') {
                input = document.createElement('select');
                input.id = 'preview-' + field.id;
                input.name = field.label;
                field.options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt;
                    option.textContent = opt;
                    input.appendChild(option);
                });
            }

            fieldDiv.appendChild(label);
            if (input) fieldDiv.appendChild(input);
            previewForm.appendChild(fieldDiv);
        });

        // Insert after the builder
        const builder = document.getElementById('custom-object-builder');
        builder.parentNode.insertBefore(preview, builder.nextSibling);
    },

    rebuildObject(object) {
        // Reset the counters so that new fields/sections get new IDs

        // Rebuild sections with inspection items
        object.sections.forEach(section => {
            SectionBuilder.addCustomSection();
            const sectionTitleElement = document.querySelector(`[name="custom-section-title-${section.id}"]`);
            if (sectionTitleElement) {
                sectionTitleElement.value = section.title;
            }

            // Rebuild inspection items for this section
            if (section.inspectionItems) {
                section.inspectionItems.forEach(item => {
                    SectionBuilder.addInspectionItem(section.id);
                    
                    const itemTextElement = document.querySelector(`[name="inspection-item-text-${item.id}"]`);
                    const itemGuidanceElement = document.querySelector(`[name="inspection-item-guidance-${item.id}"]`);
                    
                    if (itemTextElement) {
                        itemTextElement.value = item.text;
                    }
                    if (itemGuidanceElement) {
                        itemGuidanceElement.value = item.guidance;
                    }
                });
            }
        });

        // Rebuild fields
        object.fields.forEach(field => {
            FieldBuilder.addCustomField();
            const fieldLabelElement = document.querySelector(`[name="custom-field-label-${field.id}"]`);
            const fieldTypeElement = document.querySelector(`[name="custom-field-type-${field.id}"]`);
            const fieldOptionsElement = document.querySelector(`[name="custom-field-options-${field.id}"]`);
            
            if (fieldLabelElement) {
                fieldLabelElement.value = field.label;
            }
            if (fieldTypeElement) {
                fieldTypeElement.value = field.type;
            }
            if (fieldOptionsElement && field.options.length > 0) {
                fieldOptionsElement.value = field.options.join(', ');
                fieldOptionsElement.style.display = 'inline-block';
            }
        });
    },

    deleteCustomObject(objectId) {
        if (!confirm('Are you sure you want to delete this custom object?')) {
            return;
        }

        const objects = JSON.parse(localStorage.getItem('custom_objects') || '[]');
        const filteredObjects = objects.filter(obj => obj.id !== objectId);
        localStorage.setItem('custom_objects', JSON.stringify(filteredObjects));
        this.displaySavedObjects();
    },

    clearBuilder() {
        CustomUI.clearBuilder();
    }
};