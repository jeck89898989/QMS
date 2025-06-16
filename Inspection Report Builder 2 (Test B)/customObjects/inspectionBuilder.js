// Custom inspection section builder
export const InspectionBuilder = {
    inspectionTypeCounter: 0,
    inspectionPointCounter: 0,
    
    init() {
        document.addEventListener('click', this.handleButtonClicks.bind(this));
        this.loadSavedInspections();
    },

    handleButtonClicks(event) {
        const target = event.target;
        
        if (target.id === 'add-inspection-type-btn') {
            this.addInspectionType();
        } else if (target.id === 'save-inspection-builder-btn') {
            this.saveInspectionBuilder();
        } else if (target.id === 'load-inspection-builder-btn') {
            this.loadInspectionBuilder();
        } else if (target.id === 'save-inspection-file-btn') {
            this.saveInspectionFile();
        } else if (target.id === 'load-inspection-file-btn') {
            this.loadInspectionFile();
        } else if (target.id === 'clear-inspection-builder-btn') {
            this.clearInspectionBuilder();
        } else if (target.classList.contains('add-inspection-point-btn')) {
            this.addInspectionPoint(target.dataset.typeId);
        } else if (target.classList.contains('remove-inspection-type-btn')) {
            this.removeInspectionType(target);
        } else if (target.classList.contains('remove-inspection-point-btn')) {
            this.removeInspectionPoint(target);
        } else if (target.classList.contains('generate-inspection-table-btn')) {
            this.generateInspectionTable();
        }
    },

    addInspectionType() {
        this.inspectionTypeCounter++;
        const container = document.getElementById('inspection-types-container');
        
        const typeDiv = document.createElement('div');
        typeDiv.className = 'inspection-type-builder';
        typeDiv.dataset.typeId = this.inspectionTypeCounter;
        
        typeDiv.innerHTML = `
            <div class="inspection-type-header">
                <input type="text" class="inspection-type-name" placeholder="Inspection Type (e.g., Valve Components, Safety Checks)" data-type-id="${this.inspectionTypeCounter}">
                <button type="button" class="add-inspection-point-btn" data-type-id="${this.inspectionTypeCounter}">Add Inspection Point</button>
                <button type="button" class="remove-inspection-type-btn">Remove Type</button>
            </div>
            <div class="inspection-points-container" data-type-id="${this.inspectionTypeCounter}"></div>
        `;
        
        container.appendChild(typeDiv);
    },

    addInspectionPoint(typeId) {
        this.inspectionPointCounter++;
        const container = document.querySelector(`.inspection-points-container[data-type-id="${typeId}"]`);
        
        const pointDiv = document.createElement('div');
        pointDiv.className = 'inspection-point-builder';
        pointDiv.dataset.pointId = this.inspectionPointCounter;
        
        pointDiv.innerHTML = `
            <div class="inspection-point-controls">
                <input type="text" class="inspection-point-name" placeholder="Inspection Point (e.g., Quantity, Serial Number Matches)" data-point-id="${this.inspectionPointCounter}">
                <input type="text" class="inspection-point-guidance" placeholder="Guidance/Comments (e.g., MRC Global PO, Visual only)" data-point-id="${this.inspectionPointCounter}">
                <button type="button" class="remove-inspection-point-btn">Remove</button>
            </div>
        `;
        
        container.appendChild(pointDiv);
    },

    removeInspectionType(button) {
        const typeDiv = button.closest('.inspection-type-builder');
        typeDiv.remove();
        this.updatePreview();
    },

    removeInspectionPoint(button) {
        const pointDiv = button.closest('.inspection-point-builder');
        pointDiv.remove();
        this.updatePreview();
    },

    generateInspectionTable() {
        const types = this.collectInspectionData();
        if (types.length === 0) {
            alert('Please add at least one inspection type with inspection points.');
            return;
        }

        let tableHtml = `
            <table class="inspection-table five-col">
                <thead>
                    <tr>
                        <th>Inspection Type</th>
                        <th>Pass</th>
                        <th>Fail</th>
                        <th>N/A</th>
                        <th>Guidance/Comments</th>
                    </tr>
                </thead>
                <tbody>
        `;

        types.forEach(type => {
            if (type.points.length > 0) {
                tableHtml += `
                    <tr class="section-header">
                        <td colspan="5">${type.name}</td>
                    </tr>
                `;

                type.points.forEach(point => {
                    const safePointName = point.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
                    tableHtml += `
                        <tr>
                            <td>${point.name}</td>
                            <td><input type="checkbox" name="custom-inspection-${type.id}-${point.id}-pass"></td>
                            <td><input type="checkbox" name="custom-inspection-${type.id}-${point.id}-fail"></td>
                            <td><input type="checkbox" name="custom-inspection-${type.id}-${point.id}-na"></td>
                            <td>${point.guidance}</td>
                        </tr>
                    `;
                });
            }
        });

        tableHtml += `
                </tbody>
            </table>
        `;

        const previewContainer = document.getElementById('inspection-preview-container');
        previewContainer.innerHTML = `
            <h4>Generated Inspection Table</h4>
            ${tableHtml}
            <div class="inspection-table-actions">
                <button type="button" class="generate-inspection-table-btn">Regenerate Table</button>
            </div>
        `;
    },

    collectInspectionData() {
        const types = [];
        const typeBuilders = document.querySelectorAll('.inspection-type-builder');
        
        typeBuilders.forEach(typeBuilder => {
            const typeId = typeBuilder.dataset.typeId;
            const typeName = typeBuilder.querySelector('.inspection-type-name').value.trim();
            
            if (typeName) {
                const points = [];
                const pointBuilders = typeBuilder.querySelectorAll('.inspection-point-builder');
                
                pointBuilders.forEach(pointBuilder => {
                    const pointId = pointBuilder.dataset.pointId;
                    const pointName = pointBuilder.querySelector('.inspection-point-name').value.trim();
                    const pointGuidance = pointBuilder.querySelector('.inspection-point-guidance').value.trim();
                    
                    if (pointName) {
                        points.push({
                            id: pointId,
                            name: pointName,
                            guidance: pointGuidance || 'Visual inspection'
                        });
                    }
                });
                
                types.push({
                    id: typeId,
                    name: typeName,
                    points: points
                });
            }
        });
        
        return types;
    },

    saveInspectionBuilder() {
        const types = this.collectInspectionData();
        if (types.length === 0) {
            alert('Please add at least one inspection type before saving.');
            return;
        }

        const inspectionData = {
            id: Date.now().toString(),
            types: types,
            created: new Date().toISOString()
        };

        const savedInspections = JSON.parse(localStorage.getItem('custom_inspections') || '[]');
        savedInspections.push(inspectionData);
        localStorage.setItem('custom_inspections', JSON.stringify(savedInspections));

        this.generateInspectionTable();
        alert('Inspection setup saved successfully!');
    },

    loadInspectionBuilder() {
        const savedInspections = JSON.parse(localStorage.getItem('custom_inspections') || '[]');
        if (savedInspections.length === 0) {
            alert('No saved inspection setups found.');
            return;
        }

        // For simplicity, load the most recent one
        const latestInspection = savedInspections[savedInspections.length - 1];
        this.clearInspectionBuilder();
        this.loadInspectionData(latestInspection);
    },

    loadInspectionData(inspectionData) {
        inspectionData.types.forEach(type => {
            this.addInspectionType();
            const typeInput = document.querySelector(`[data-type-id="${this.inspectionTypeCounter}"] .inspection-type-name`);
            typeInput.value = type.name;

            type.points.forEach(point => {
                this.addInspectionPoint(this.inspectionTypeCounter);
                const pointNameInput = document.querySelector(`[data-point-id="${this.inspectionPointCounter}"] .inspection-point-name`);
                const pointGuidanceInput = document.querySelector(`[data-point-id="${this.inspectionPointCounter}"] .inspection-point-guidance`);
                pointNameInput.value = point.name;
                pointGuidanceInput.value = point.guidance;
            });
        });

        this.generateInspectionTable();
    },

    clearInspectionBuilder() {
        document.getElementById('inspection-types-container').innerHTML = '';
        document.getElementById('inspection-preview-container').innerHTML = '';
        this.inspectionTypeCounter = 0;
        this.inspectionPointCounter = 0;
    },

    loadSavedInspections() {
        // Auto-load the most recent inspection if available
        const savedInspections = JSON.parse(localStorage.getItem('custom_inspections') || '[]');
        if (savedInspections.length > 0) {
            const latestInspection = savedInspections[savedInspections.length - 1];
            this.loadInspectionData(latestInspection);
        }
    },

    updatePreview() {
        // Currently a no-op, but could be used to update the preview dynamically
    },

    saveInspectionFile() {
        const types = this.collectInspectionData();
        if (types.length === 0) {
            alert('Please add at least one inspection type before saving.');
            return;
        }

        const inspectionData = {
            types: types,
            created: new Date().toISOString(),
            version: '1.0'
        };

        const dataStr = JSON.stringify(inspectionData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `inspection_setup_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        alert('Inspection setup exported successfully!');
    },

    loadInspectionFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const inspectionData = JSON.parse(e.target.result);
                        
                        if (!inspectionData.types) {
                            alert('Invalid inspection setup file format.');
                            return;
                        }
                        
                        this.clearInspectionBuilder();
                        this.loadInspectionData(inspectionData);
                        
                        alert('Inspection setup imported successfully!');
                    } catch (error) {
                        alert('Error importing inspection setup: ' + error.message);
                    }
                };
                reader.readAsText(file);
            }
        };
        
        input.click();
    }
};