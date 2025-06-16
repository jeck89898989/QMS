// Form storage functionality for saving/loading form data and import/export
import { DBManager } from './dbManager.js';

export const FormStorage = {
    STORAGE_KEY: 'inspection_report_form_data',
    CUSTOM_OBJECTS_KEY: 'custom_objects',
    
    saveFormData() {
        const formData = new FormData(document.querySelector('form'));
        const data = {};
        
        // Handle regular form inputs
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                // Handle multiple values (like checkboxes with same name)
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }
        
        // Handle unchecked checkboxes and radio buttons
        const allInputs = document.querySelectorAll('input, textarea, select');
        allInputs.forEach(input => {
            if (input.type === 'checkbox' || input.type === 'radio') {
                if (!data.hasOwnProperty(input.name)) {
                    data[input.name] = input.checked ? input.value : '';
                }
            }
        });

        // Save custom object builder data
        const customFields = this.collectCustomObjectData();
        data['custom_object_fields'] = customFields;
        
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        this.showSaveIndicator();
    },

    collectCustomObjectData() {
        const customData = {};
        
        // Collect custom field data
        const customFields = document.querySelectorAll('.custom-field input, .custom-field select, .custom-field textarea');
        customFields.forEach(field => {
            if (field.name) {
                customData[field.name] = field.value;
            }
        });

        // Collect custom section data
        const customSections = document.querySelectorAll('.custom-section input, .custom-section select, .custom-section textarea');
        customSections.forEach(field => {
            if (field.name) {
                customData[field.name] = field.value;
            }
        });

        return customData;
    },
    
    loadFormData() {
        const savedData = localStorage.getItem(this.STORAGE_KEY);
        if (!savedData) return;
        
        try {
            const data = JSON.parse(savedData);
            
            Object.entries(data).forEach(([name, value]) => {
                if (name === 'custom_object_fields') {
                    // Handle custom object fields separately
                    this.loadCustomObjectData(value);
                    return;
                }

                const elements = document.querySelectorAll(`[name="${name}"]`);
                
                elements.forEach(element => {
                    if (element.type === 'checkbox') {
                        if (Array.isArray(value)) {
                            element.checked = value.includes(element.value);
                        } else {
                            element.checked = value === element.value;
                        }
                    } else if (element.type === 'radio') {
                        element.checked = element.value === value;
                    } else {
                        element.value = value || '';
                    }
                });
            });
        } catch (error) {
            console.error('Error loading form data:', error);
        }
    },

    loadCustomObjectData(customData) {
        if (!customData || typeof customData !== 'object') return;

        Object.entries(customData).forEach(([name, value]) => {
            const element = document.querySelector(`[name="${name}"]`);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = value === element.value;
                } else if (element.type === 'radio') {
                    element.checked = element.value === value;
                } else {
                    element.value = value || '';
                }
            }
        });
    },
    
    async exportToJSON() {
        const data = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
        const customObjects = JSON.parse(localStorage.getItem(this.CUSTOM_OBJECTS_KEY) || '[]');
        
        // Get image metadata from IndexedDB
        const imagesFromDB = await DBManager.getAllData();
        const imageMetadata = imagesFromDB.map(img => ({
            filename: img.filename,
            comment: img.comment,
            order: img.order
        }));

        const exportData = {
            formData: data,
            customObjects: customObjects,
            imageAttachments: imageMetadata,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const defaultFilename = `inspection_report_${new Date().toISOString().split('T')[0]}.json`;
        
        // Use the download manager if available
        if (window.showDownloadManager) {
            window.showDownloadManager(blob, defaultFilename, 'json');
        } else {
            // Fallback to direct download
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', defaultFilename);
            linkElement.click();
        }
    },

    importFromJSON() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importData = JSON.parse(e.target.result);
                        
                        if (importData.formData) {
                            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(importData.formData));
                        }
                        if (importData.customObjects) {
                            localStorage.setItem(this.CUSTOM_OBJECTS_KEY, JSON.stringify(importData.customObjects));
                        }
                        
                        // We do not import image data as files are local.
                        // Reload the page to apply imported data
                        alert('Data imported successfully. Images were not imported and must be re-uploaded.');
                        location.reload();
                    } catch (error) {
                        alert('Error importing data: ' + error.message);
                    }
                };
                reader.readAsText(file);
            }
        };
        
        input.click();
    },
    
    showSaveIndicator() {
        let indicator = document.querySelector('.save-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'save-indicator';
            indicator.textContent = 'Saved';
            document.body.appendChild(indicator);
        }
        
        indicator.classList.add('show');
        setTimeout(() => {
            indicator.classList.remove('show');
        }, 1500);
    },
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};