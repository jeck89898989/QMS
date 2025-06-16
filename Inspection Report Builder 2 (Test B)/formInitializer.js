// Form initialization and setup functionality
import { TableTemplates } from './templates.js';
import { InspectionTables } from './inspectionTables.js';
import { ValvesTableAssembler } from './valvesTableAssembler.js';
import { DocumentTables } from './documentTables.js';
import { ISO9001Tables } from './iso9001Tables.js';
import { FormBuilder } from './formBuilder.js';
import { CustomObjectBuilder } from './customObjectBuilder.js';
import { InspectionBuilder } from './customObjects/inspectionBuilder.js';
import { SignaturesSection } from './sections/signaturesSection.js';
import { CreateObjectsSection } from './sections/createObjectsSection.js';
import { FormStorage } from './formStorage.js';
import { TimeBreakdown } from './timeBreakdown.js';
import { ImageManager } from './imageManager.js';
import { ExtendedAuditTable } from './extendedAuditTable.js';
import { ApprovedManufacturersList } from './approvedManufacturersList.js';

export const FormInitializer = {
    
    async initializeForm() {
        // Build the complete form structure
        const form = document.getElementById('inspection-form');
        form.innerHTML = FormBuilder.buildCompleteForm();

        // Generate all tables
        this.generateTables();
        
        // Initialize components
        CustomObjectBuilder.init();
        InspectionBuilder.init();
        ApprovedManufacturersList.init();
        await ImageManager.init();
        
        // Insert custom inspection sections
        CustomObjectBuilder.insertCustomSectionsIntoForm();
        
        // Setup form functionality
        this.setupFormFunctionality(form);
    },

    generateTables() {
        document.getElementById('time-breakdown-container').innerHTML = TableTemplates.createTimeBreakdownTable();
        document.getElementById('contact-table-container').innerHTML = TableTemplates.createContactTable();
        document.getElementById('item-details-container').innerHTML = TableTemplates.createItemDetailsTable();
        document.getElementById('inspection-results-container').innerHTML = TableTemplates.createInspectionResultsTable();
        document.getElementById('calibration-container').innerHTML = TableTemplates.createCalibrationTable();
        
        // Generate inspection tables
        document.getElementById('valves-inspection-container').innerHTML = ValvesTableAssembler.createCompleteValvesTable();
        document.getElementById('actuator-inspection-container').innerHTML = InspectionTables.createActuatorInspectionTable();
        document.getElementById('ancillaries-inspection-container').innerHTML = InspectionTables.createAncillariesInspectionTable();
        document.getElementById('spools-inspection-container').innerHTML = InspectionTables.createSpoolsInspectionTable();
        document.getElementById('gas-products-inspection-container').innerHTML = InspectionTables.createGasProductsInspectionTable();
        document.getElementById('pipe-inspection-container').innerHTML = InspectionTables.createPipeInspectionTable();
        document.getElementById('gauges-fittings-inspection-container').innerHTML = InspectionTables.createGaugesFittingsInspectionTable();
        document.getElementById('generic-visual-inspection-container').innerHTML = InspectionTables.createGenericVisualInspectionTable();
        document.getElementById('other-visual-inspection-container').innerHTML = InspectionTables.createOtherVisualInspectionTable();
        
        // Generate document tables
        document.getElementById('document-reference-container').innerHTML = DocumentTables.createDocumentReferenceTable();
        document.getElementById('additional-docs-container').innerHTML = DocumentTables.createAdditionalDocsTable();
        
        // Generate ISO 9001 table
        document.getElementById('iso9001-audit-container').innerHTML = ISO9001Tables.createISO9001AuditTable();
        
        // Generate Extended Audit table
        document.getElementById('extended-audit-table-container').innerHTML = ExtendedAuditTable.createExtendedAuditTable();
        
        // Initialize Extended Audit table controls
        this.initializeExtendedAuditControls();
        
        // Initialize Approved Manufacturers List controls
        this.initializeApprovedManufacturersControls();
    },

    initializeExtendedAuditControls() {
        const container = document.getElementById('extended-audit-table-container');
        let tableCounter = 1;

        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-audit-table-btn')) {
                tableCounter++;
                const newTableHtml = ExtendedAuditTable.createAdditionalAuditTable(tableCounter);
                container.insertAdjacentHTML('beforeend', newTableHtml);
                
                // Show remove buttons for all tables except the first one
                this.updateRemoveButtonVisibility(container);
                
                // Trigger form save
                FormStorage.saveFormData();
            } else if (e.target.classList.contains('remove-audit-table-btn')) {
                const tableContainer = e.target.closest('.extended-audit-table-container');
                if (tableContainer) {
                    tableContainer.remove();
                    
                    // Update remove button visibility
                    this.updateRemoveButtonVisibility(container);
                    
                    // Trigger form save
                    FormStorage.saveFormData();
                }
            } else if (e.target.classList.contains('import-csv-btn')) {
                const tableContainer = e.target.closest('.extended-audit-table-container');
                const fileInput = tableContainer.querySelector('.csv-file-input');
                fileInput.click();
            }
        });

        // Handle CSV file import
        container.addEventListener('change', (e) => {
            if (e.target.classList.contains('csv-file-input')) {
                const file = e.target.files[0];
                if (file && file.type === 'text/csv') {
                    this.importCSVData(file, e.target);
                } else {
                    alert('Please select a valid CSV file.');
                }
                // Reset file input
                e.target.value = '';
            }
        });
    },

    initializeApprovedManufacturersControls() {
        const container = document.getElementById('approved-manufacturers-container');
        if (!container) return;

        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-manufacturer-table-btn')) {
                ApprovedManufacturersList.addManufacturerTable();
            } else if (e.target.classList.contains('remove-manufacturer-btn')) {
                ApprovedManufacturersList.removeManufacturer(e.target);
            }
        });
    },

    importCSVData(file, fileInput) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csv = e.target.result;
                const lines = csv.split('\n');
                
                if (lines.length < 2) {
                    alert('CSV file must contain at least a header row and one data row.');
                    return;
                }

                // Parse header to find column indices
                const header = lines[0].split(',').map(col => col.trim().toLowerCase());
                const processIndex = header.indexOf('process');
                const referenceIndex = header.indexOf('reference#') !== -1 ? header.indexOf('reference#') : header.indexOf('reference');
                const clauseIndex = header.indexOf('clause title') !== -1 ? header.indexOf('clause title') : header.indexOf('clause');
                const questionNumIndex = header.indexOf('question#') !== -1 ? header.indexOf('question#') : header.indexOf('question number');
                const questionIndex = header.indexOf('question');

                if (processIndex === -1 || referenceIndex === -1 || clauseIndex === -1 || questionNumIndex === -1 || questionIndex === -1) {
                    alert('CSV must contain columns: Process, Reference#, Clause Title, Question#, Question');
                    return;
                }

                // Get the table container and index
                const tableContainer = fileInput.closest('.extended-audit-table-container');
                const tableIndex = tableContainer.dataset.tableIndex;

                // Parse data rows and populate fields
                for (let i = 1; i < lines.length && i <= 1; i++) { // Only import first data row for each table
                    const row = lines[i].split(',').map(col => col.trim());
                    
                    if (row.length < Math.max(processIndex, referenceIndex, clauseIndex, questionNumIndex, questionIndex) + 1) {
                        continue; // Skip incomplete rows
                    }

                    // Populate the fields
                    const processField = tableContainer.querySelector(`[name="ext-audit-process-${tableIndex}"]`);
                    const referenceField = tableContainer.querySelector(`[name="ext-audit-ref-${tableIndex}"]`);
                    const clauseField = tableContainer.querySelector(`[name="ext-audit-clause-${tableIndex}"]`);
                    const questionNumField = tableContainer.querySelector(`[name="ext-audit-qnum-${tableIndex}"]`);
                    const questionField = tableContainer.querySelector(`[name="ext-audit-question-${tableIndex}"]`);

                    if (processField) processField.value = row[processIndex] || '';
                    if (referenceField) referenceField.value = row[referenceIndex] || '';
                    if (clauseField) clauseField.value = row[clauseIndex] || '';
                    if (questionNumField) questionNumField.value = row[questionNumIndex] || '';
                    if (questionField) questionField.value = row[questionIndex] || '';
                }

                // If there are more data rows, create additional tables
                if (lines.length > 2) {
                    const container = document.getElementById('extended-audit-table-container');
                    let currentTableCounter = parseInt(tableIndex);
                    
                    for (let i = 2; i < lines.length; i++) {
                        const row = lines[i].split(',').map(col => col.trim());
                        
                        if (row.length < Math.max(processIndex, referenceIndex, clauseIndex, questionNumIndex, questionIndex) + 1) {
                            continue; // Skip incomplete rows
                        }

                        // Create new table
                        currentTableCounter++;
                        const newTableHtml = ExtendedAuditTable.createAdditionalAuditTable(currentTableCounter);
                        container.insertAdjacentHTML('beforeend', newTableHtml);

                        // Populate the new table
                        const newTableContainer = container.querySelector(`[data-table-index="${currentTableCounter}"]`);
                        const processField = newTableContainer.querySelector(`[name="ext-audit-process-${currentTableCounter}"]`);
                        const referenceField = newTableContainer.querySelector(`[name="ext-audit-ref-${currentTableCounter}"]`);
                        const clauseField = newTableContainer.querySelector(`[name="ext-audit-clause-${currentTableCounter}"]`);
                        const questionNumField = newTableContainer.querySelector(`[name="ext-audit-qnum-${currentTableCounter}"]`);
                        const questionField = newTableContainer.querySelector(`[name="ext-audit-question-${currentTableCounter}"]`);

                        if (processField) processField.value = row[processIndex] || '';
                        if (referenceField) referenceField.value = row[referenceIndex] || '';
                        if (clauseField) clauseField.value = row[clauseIndex] || '';
                        if (questionNumField) questionNumField.value = row[questionNumIndex] || '';
                        if (questionField) questionField.value = row[questionIndex] || '';
                    }

                    // Update remove button visibility
                    this.updateRemoveButtonVisibility(container);
                }

                // Trigger form save
                FormStorage.saveFormData();
                
                alert(`Successfully imported ${Math.min(lines.length - 1, lines.length - 1)} audit items from CSV.`);
                
            } catch (error) {
                console.error('Error parsing CSV:', error);
                alert('Error parsing CSV file. Please check the file format.');
            }
        };
        
        reader.readAsText(file);
    },

    updateRemoveButtonVisibility(container) {
        const tableContainers = container.querySelectorAll('.extended-audit-table-container');
        tableContainers.forEach((tableContainer, index) => {
            const removeBtn = tableContainer.querySelector('.remove-audit-table-btn');
            if (removeBtn) {
                // Show remove button for all tables except the first one
                removeBtn.style.display = index === 0 ? 'none' : 'inline-block';
            }
        });
    },

    setupFormFunctionality(formElement) {
        // Load saved form data
        FormStorage.loadFormData();
        
        // Create debounced save function
        const debouncedSave = FormStorage.debounce(() => {
            FormStorage.saveFormData();
        }, 500);
        
        // Add event listeners for all form inputs
        formElement.addEventListener('input', debouncedSave);
        formElement.addEventListener('change', debouncedSave);
        
        // Add auto-expanding input functionality
        formElement.addEventListener('keydown', this.handleAutoExpandingInputs);
        
        // Add ctrl+click to clear radio buttons
        let previouslyCheckedRadioOnMousedown = null;

        // On mousedown, check if the target is an already checked radio button.
        // If so, store a reference to it.
        formElement.addEventListener('mousedown', e => {
            if (e.target.matches('input[type="radio"]') && e.target.checked) {
                previouslyCheckedRadioOnMousedown = e.target;
            } else {
                previouslyCheckedRadioOnMousedown = null;
            }
        });

        // On click, if ctrl is held and the target is a radio, check against our stored reference.
        formElement.addEventListener('click', e => {
            if (e.ctrlKey && e.target.matches('input[type="radio"]')) {
                // If the clicked radio is the same one that was already checked on mousedown,
                // it means the user is ctrl+clicking an active radio button.
                if (e.target === previouslyCheckedRadioOnMousedown) {
                    // Uncheck it.
                    e.target.checked = false;
                    // Manually dispatch a 'change' event so that form saving logic is triggered.
                    e.target.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        });
        
        // Initialize time breakdown calculations
        TimeBreakdown.initialize();

        // Initialize calibration table toggle
        this.initializeCalibrationTableToggle();
    },

    initializeCalibrationTableToggle() {
        const toggleCalibrationBtn = document.getElementById('toggle-additional-calibration');
        if (toggleCalibrationBtn) {
            toggleCalibrationBtn.addEventListener('click', function() {
                const additionalItems = document.querySelectorAll('.calibration-table .additional-item');
                const isHidden = additionalItems[0]?.classList.contains('hidden');
                
                additionalItems.forEach(item => {
                    item.classList.toggle('hidden');
                });
                
                this.textContent = isHidden ? 
                    'Hide Additional Calibration Rows (11-30)' : 
                    'Show Additional Calibration Rows (11-30)';
            });
        }
    },

    handleAutoExpandingInputs(e) {
        if (e.key === 'Enter' && e.target.type === 'text' && !e.shiftKey) {
            e.preventDefault();
            FormInitializer.convertInputToTextarea(e.target);
        }
    },

    convertInputToTextarea(input) {
        // Don't convert if it's already a textarea
        if (input.tagName === 'TEXTAREA') return;
        
        // Create new textarea
        const textarea = document.createElement('textarea');
        
        // Copy all attributes and properties
        textarea.value = input.value + '\n'; // Add newline where Enter was pressed
        textarea.name = input.name;
        textarea.id = input.id;
        textarea.className = input.className;
        textarea.placeholder = input.placeholder;
        textarea.required = input.required;
        textarea.disabled = input.disabled;
        textarea.readOnly = input.readOnly;
        
        // Set initial height and enable auto-resize
        textarea.style.minHeight = '60px';
        textarea.style.resize = 'vertical';
        textarea.style.overflow = 'hidden';
        textarea.rows = 2;
        
        // Replace input with textarea
        input.parentNode.replaceChild(textarea, input);
        
        // Focus and position cursor at end
        textarea.focus();
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        
        // Add auto-resize functionality
        this.setupAutoResize(textarea);
    },

    setupAutoResize(textarea) {
        const adjustHeight = () => {
            textarea.style.height = 'auto';
            textarea.style.height = Math.max(60, textarea.scrollHeight) + 'px';
        };
        
        textarea.addEventListener('input', adjustHeight);
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                setTimeout(adjustHeight, 0);
            }
        });
        
        // Initial adjustment
        adjustHeight();
    }
};