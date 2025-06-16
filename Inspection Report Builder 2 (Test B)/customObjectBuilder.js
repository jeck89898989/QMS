// Main custom object builder - refactored to use smaller modules
import { ObjectManager } from './customObjects/objectManager.js';
import { FieldBuilder } from './customObjects/fieldBuilder.js';
import { SectionBuilder } from './customObjects/sectionBuilder.js';
import { CustomUI } from './customObjects/customUI.js';

export const CustomObjectBuilder = {
    currentObjectId: null,
    fieldCounter: 0,
    sectionCounter: 0,
    inspectionItemCounter: 0,

    init() {
        document.addEventListener('click', this.handleButtonClicks.bind(this));
        ObjectManager.loadSavedObjects();
    },

    handleButtonClicks(event) {
        const target = event.target;
        
        if (target.id === 'add-custom-field') {
            FieldBuilder.addCustomField();
        } else if (target.id === 'add-custom-section') {
            SectionBuilder.addCustomSection();
        } else if (target.id === 'add-inspection-item') {
            SectionBuilder.addInspectionItem(target.dataset.sectionId);
        } else if (target.id === 'save-custom-object') {
            ObjectManager.saveCustomObject();
        } else if (target.id === 'load-custom-object') {
            // Method intentionally left blank; handled via load buttons
        } else if (target.classList.contains('remove-field')) {
            FieldBuilder.removeField(target);
        } else if (target.classList.contains('remove-section')) {
            SectionBuilder.removeSection(target);
        } else if (target.classList.contains('remove-inspection-item')) {
            SectionBuilder.removeInspectionItem(target);
        } else if (target.classList.contains('load-object-btn')) {
            ObjectManager.loadCustomObject(target.dataset.objectId);
        } else if (target.classList.contains('delete-object-btn')) {
            ObjectManager.deleteCustomObject(target.dataset.objectId);
        }
    },

    clearBuilder() {
        CustomUI.clearBuilder();
        this.fieldCounter = 0;
        this.sectionCounter = 0;
        this.inspectionItemCounter = 0;

        // Remove preview if it exists
        let oldPreview = document.getElementById('custom-fields-preview');
        if (oldPreview) oldPreview.remove();
    },

    generateCustomInspectionSection(section) {
        return SectionBuilder.generateCustomInspectionSection(section);
    },

    // When you insert a custom inspection plan, also show its custom object fields at the top
    insertCustomSectionsIntoForm() {
        const objects = JSON.parse(localStorage.getItem('custom_objects') || '[]');
        const inspectionPlans = objects.filter(obj => obj.type === 'inspection-plan');
        
        inspectionPlans.forEach(plan => {
            const container = document.createElement('fieldset');
            container.dataset.sectionId = `custom-${plan.id}`;
            container.innerHTML = `
                <legend>${plan.title}</legend>
                <p>${plan.description}</p>
            `;

            // If this inspection plan has fields, render those as a dynamic mini-form
            if (plan.fields && plan.fields.length > 0) {
                const fieldsDiv = document.createElement('div');
                fieldsDiv.style.marginBottom = '10px';
                plan.fields.forEach(field => {
                    const fieldWrapper = document.createElement('div');
                    fieldWrapper.className = 'custom-preview-field';

                    // Label
                    const label = document.createElement('label');
                    label.textContent = field.label + ': ';
                    label.style.fontWeight = "600";
                    label.htmlFor = 'planfield-' + plan.id + '-' + field.id;

                    // Field input by type
                    let input;
                    if (field.type === 'text' || !field.type) {
                        input = document.createElement('input');
                        input.type = 'text';
                        input.id = 'planfield-' + plan.id + '-' + field.id;
                        input.name = `plan-${plan.id}-customfield-${field.id}`;
                    } else if (field.type === 'textarea') {
                        input = document.createElement('textarea');
                        input.id = 'planfield-' + plan.id + '-' + field.id;
                        input.name = `plan-${plan.id}-customfield-${field.id}`;
                        input.rows = 2;
                    } else if (field.type === 'number') {
                        input = document.createElement('input');
                        input.type = 'number';
                        input.id = 'planfield-' + plan.id + '-' + field.id;
                        input.name = `plan-${plan.id}-customfield-${field.id}`;
                    } else if (field.type === 'date') {
                        input = document.createElement('input');
                        input.type = 'date';
                        input.id = 'planfield-' + plan.id + '-' + field.id;
                        input.name = `plan-${plan.id}-customfield-${field.id}`;
                    } else if (field.type === 'checkbox') {
                        input = document.createElement('div');
                        field.options.forEach(opt => {
                            const boxId = `planfield-${plan.id}-${field.id}-${opt}`;
                            const box = document.createElement('input');
                            box.type = 'checkbox';
                            box.id = boxId;
                            box.name = `plan-${plan.id}-customfield-${field.id}`;
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
                            const radioId = `planfield-${plan.id}-${field.id}-${opt}`;
                            const radio = document.createElement('input');
                            radio.type = 'radio';
                            radio.id = radioId;
                            radio.name = `plan-${plan.id}-customfield-${field.id}`;
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
                        input.id = `planfield-${plan.id}-${field.id}`;
                        input.name = `plan-${plan.id}-customfield-${field.id}`;
                        field.options.forEach(opt => {
                            const option = document.createElement('option');
                            option.value = opt;
                            option.textContent = opt;
                            input.appendChild(option);
                        });
                    }

                    fieldWrapper.appendChild(label);
                    if (input) fieldWrapper.appendChild(input);
                    fieldsDiv.appendChild(fieldWrapper);
                });
                container.insertBefore(fieldsDiv, container.children[1]); // Insert after legend
            }

            plan.sections.forEach(section => {
                const sectionDiv = document.createElement('div');
                sectionDiv.innerHTML = this.generateCustomInspectionSection(section);
                container.appendChild(sectionDiv);
            });

            // Insert before the signatures section
            const legends = document.querySelectorAll('fieldset legend');
            let signaturesSection = null;
            legends.forEach(legend => {
                if ((legend.textContent || legend.innerText).includes('Signatures')) {
                    signaturesSection = legend.parentElement;
                }
            });
            
            if (signaturesSection) {
                signaturesSection.parentNode.insertBefore(container, signaturesSection);
            } else {
                document.getElementById('inspection-form').appendChild(container);
            }
        });
    }
};