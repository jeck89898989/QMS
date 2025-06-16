// Manages the visibility of form sections.
export const SectionVisibilityManager = {
    STORAGE_KEY: 'form_section_visibility',
    
    init() {
        const toggleSelect = document.getElementById('section-toggle-select');
        
        if (!toggleSelect) return;
        
        this.generateOptions();
        this.loadState();
        
        toggleSelect.addEventListener('change', (e) => {
            const selectedValue = e.target.value;
            if (selectedValue === 'show-all') {
                this.showAllSections();
            } else if (selectedValue === 'hide-all') {
                this.hideAllSections();
            } else if (selectedValue === 'custom') {
                this.showCustomModal();
            }
        });
    },
    
    generateOptions() {
        // Options are now in HTML, no need to generate dynamically
    },

    showAllSections() {
        const sections = document.querySelectorAll('#inspection-form > fieldset');
        sections.forEach(section => {
            const sectionId = section.dataset.sectionId;
            if (sectionId) {
                section.style.display = '';
            }
        });
        this.saveAllSectionsState(true);
    },

    hideAllSections() {
        const sections = document.querySelectorAll('#inspection-form > fieldset');
        sections.forEach(section => {
            const sectionId = section.dataset.sectionId;
            if (sectionId) {
                section.style.display = 'none';
            }
        });
        this.saveAllSectionsState(false);
    },

    showCustomModal() {
        // Create and show a modal for custom section selection
        const modal = document.createElement('div');
        modal.className = 'modal show no-edit';
        modal.id = 'section-visibility-modal';
        
        const sections = document.querySelectorAll('#inspection-form > fieldset');
        let checklistHtml = '';
        
        sections.forEach(section => {
            const sectionId = section.dataset.sectionId;
            const legend = section.querySelector('legend');
            const title = legend ? legend.textContent.trim() : `Section ${sectionId}`;
            const isVisible = section.style.display !== 'none';
            
            if (sectionId) {
                checklistHtml += `
                    <div class="section-toggle-item">
                        <label>
                            <input type="checkbox" data-section-id="${sectionId}" ${isVisible ? 'checked' : ''}>
                            ${title}
                        </label>
                    </div>
                `;
            }
        });

        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Show/Hide Sections</h2>
                    <button id="close-section-modal" class="close-button">&times;</button>
                </div>
                <div class="modal-body">
                    <div id="section-checklist-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 10px; max-height: 50vh; overflow-y: auto; background-color: #f9f9f9; border: 1px solid #eee; padding: 10px;">
                        ${checklistHtml}
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="apply-section-visibility" class="sidebar-btn">Apply Changes</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        const closeBtn = modal.querySelector('#close-section-modal');
        const applyBtn = modal.querySelector('#apply-section-visibility');

        closeBtn.addEventListener('click', () => this.closeCustomModal());
        applyBtn.addEventListener('click', () => this.applyCustomChanges());

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeCustomModal();
            }
        });
    },

    closeCustomModal() {
        const modal = document.getElementById('section-visibility-modal');
        if (modal) {
            modal.remove();
        }
        // Reset dropdown to default
        const select = document.getElementById('section-toggle-select');
        if (select) {
            select.value = '';
        }
    },

    applyCustomChanges() {
        const modal = document.getElementById('section-visibility-modal');
        const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
        
        checkboxes.forEach(checkbox => {
            const sectionId = checkbox.dataset.sectionId;
            this.toggleSection(sectionId, checkbox.checked);
        });
        
        this.saveState();
        this.closeCustomModal();
    },

    saveAllSectionsState(isVisible) {
        const sections = document.querySelectorAll('#inspection-form > fieldset');
        const state = {};
        sections.forEach(section => {
            const sectionId = section.dataset.sectionId;
            if (sectionId) {
                state[sectionId] = isVisible;
            }
        });
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    },
    
    toggleSection(sectionId, isVisible) {
        const section = document.querySelector(`fieldset[data-section-id="${sectionId}"]`);
        if (section) {
            section.style.display = isVisible ? '' : 'none';
        }
    },
    
    saveState() {
        const sections = document.querySelectorAll('#inspection-form > fieldset');
        const state = {};
        sections.forEach(section => {
            const sectionId = section.dataset.sectionId;
            if (sectionId) {
                state[sectionId] = section.style.display !== 'none';
            }
        });
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    },
    
    loadState() {
        const savedState = localStorage.getItem(this.STORAGE_KEY);
        if (!savedState) return;
        
        try {
            const state = JSON.parse(savedState);
            Object.entries(state).forEach(([sectionId, isVisible]) => {
                this.toggleSection(sectionId, isVisible);
            });
        } catch (e) {
            console.error('Error loading section visibility state:', e);
            localStorage.removeItem(this.STORAGE_KEY);
        }
    }
};