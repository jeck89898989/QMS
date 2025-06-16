// Main script file with form functionality and table initialization
import { TextHighlighter } from './textHighlighter.js';
import { FormInitializer } from './formInitializer.js';
import { FormStorage } from './formStorage.js';
import { SectionVisibilityManager } from './sectionVisibilityManager.js';
import { PrintManager } from './printManager.js';
import { DocumentExporter } from './documentExporter.js';
import { DBManager } from './dbManager.js';

// Theme definitions
const themes = {
    'default': {
        primaryColor: '#2c3e50',
        secondaryColor: '#34495e',
        accentColor: '#7f8c8d',
        lightAccent: '#95a6a6',
        formBg: '#f5f5f5',
        fieldsetBg: '#fafafa',
        legendBg: '#f0f0f0',
        legendText: '#333',
        tableHeaderBg: '#f0f0f0',
        tableEvenRow: '#f9f9f9',
        tableHover: '#f0f0f0',
        borderColor: '#ddd',
        textColor: '#333',
        inputBg: 'white',
        inputBorder: '#ccc',
        inputFocus: '#333'
    },
    'corporate-blue': {
        primaryColor: '#1e3a8a',
        secondaryColor: '#1e40af',
        accentColor: '#3b82f6',
        lightAccent: '#60a5fa',
        formBg: '#f1f5f9',
        fieldsetBg: '#f8fafc',
        legendBg: '#e0f2fe',
        legendText: '#1e293b',
        tableHeaderBg: '#e0f2fe',
        tableEvenRow: '#f0f9ff',
        tableHover: '#e0f2fe',
        borderColor: '#cbd5e1',
        textColor: '#1e293b',
        inputBg: 'white',
        inputBorder: '#94a3b8',
        inputFocus: '#1e3a8a'
    },
    'forest-green': {
        primaryColor: '#14532d',
        secondaryColor: '#166534',
        accentColor: '#15803d',
        lightAccent: '#22c55e',
        formBg: '#f0fdf4',
        fieldsetBg: '#f7fee7',
        legendBg: '#dcfce7',
        legendText: '#1f2937',
        tableHeaderBg: '#dcfce7',
        tableEvenRow: '#f0fdf4',
        tableHover: '#dcfce7',
        borderColor: '#bbf7d0',
        textColor: '#1f2937',
        inputBg: 'white',
        inputBorder: '#9ca3af',
        inputFocus: '#14532d'
    },
    'burgundy-wine': {
        primaryColor: '#7c2d12',
        secondaryColor: '#92400e',
        accentColor: '#b45309',
        lightAccent: '#d97706',
        formBg: '#fef7f0',
        fieldsetBg: '#fffbeb',
        legendBg: '#fed7aa',
        legendText: '#1f2937',
        tableHeaderBg: '#fed7aa',
        tableEvenRow: '#fef3c7',
        tableHover: '#fed7aa',
        borderColor: '#fde68a',
        textColor: '#1f2937',
        inputBg: 'white',
        inputBorder: '#d1d5db',
        inputFocus: '#7c2d12'
    },
    'slate-gray': {
        primaryColor: '#374151',
        secondaryColor: '#4b5563',
        accentColor: '#6b7280',
        lightAccent: '#9ca3af',
        formBg: '#f8fafc',
        fieldsetBg: '#f1f5f9',
        legendBg: '#e2e8f0',
        legendText: '#1e293b',
        tableHeaderBg: '#e2e8f0',
        tableEvenRow: '#f1f5f9',
        tableHover: '#e2e8f0',
        borderColor: '#cbd5e1',
        textColor: '#1e293b',
        inputBg: 'white',
        inputBorder: '#94a3b8',
        inputFocus: '#374151'
    },
    'navy-gold': {
        primaryColor: '#1e3a8a',
        secondaryColor: '#1e40af',
        accentColor: '#d97706',
        lightAccent: '#f59e0b',
        formBg: '#fffbeb',
        fieldsetBg: '#fefce8',
        legendBg: '#fef3c7',
        legendText: '#1e293b',
        tableHeaderBg: '#fef3c7',
        tableEvenRow: '#fffbeb',
        tableHover: '#fef3c7',
        borderColor: '#fde68a',
        textColor: '#1e293b',
        inputBg: 'white',
        inputBorder: '#d1d5db',
        inputFocus: '#1e3a8a'
    },
    'charcoal-orange': {
        primaryColor: '#1f2937',
        secondaryColor: '#374151',
        accentColor: '#ea580c',
        lightAccent: '#f97316',
        formBg: '#fff7ed',
        fieldsetBg: '#ffedd5',
        legendBg: '#fed7aa',
        legendText: '#1f2937',
        tableHeaderBg: '#fed7aa',
        tableEvenRow: '#ffedd5',
        tableHover: '#fed7aa',
        borderColor: '#fdba74',
        textColor: '#1f2937',
        inputBg: 'white',
        inputBorder: '#d1d5db',
        inputFocus: '#1f2937'
    },
    'teal-silver': {
        primaryColor: '#0f766e',
        secondaryColor: '#0d9488',
        accentColor: '#14b8a6',
        lightAccent: '#5eead4',
        formBg: '#f0fdfa',
        fieldsetBg: '#ccfbf1',
        legendBg: '#99f6e4',
        legendText: '#1f2937',
        tableHeaderBg: '#99f6e4',
        tableEvenRow: '#ccfbf1',
        tableHover: '#99f6e4',
        borderColor: '#5eead4',
        textColor: '#1f2937',
        inputBg: 'white',
        inputBorder: '#9ca3af',
        inputFocus: '#0f766e'
    },
    'purple-cream': {
        primaryColor: '#581c87',
        secondaryColor: '#6b21a8',
        accentColor: '#7c3aed',
        lightAccent: '#a855f7',
        formBg: '#faf5ff',
        fieldsetBg: '#f3e8ff',
        legendBg: '#e9d5ff',
        legendText: '#1f2937',
        tableHeaderBg: '#e9d5ff',
        tableEvenRow: '#f3e8ff',
        tableHover: '#e9d5ff',
        borderColor: '#d8b4fe',
        textColor: '#1f2937',
        inputBg: 'white',
        inputBorder: '#d1d5db',
        inputFocus: '#581c87'
    },
    'brown-tan': {
        primaryColor: '#78350f',
        secondaryColor: '#92400e',
        accentColor: '#a16207',
        lightAccent: '#ca8a04',
        formBg: '#fffbeb',
        fieldsetBg: '#fef3c7',
        legendBg: '#fde68a',
        legendText: '#1f2937',
        tableHeaderBg: '#fde68a',
        tableEvenRow: '#fef3c7',
        tableHover: '#fde68a',
        borderColor: '#facc15',
        textColor: '#1f2937',
        inputBg: 'white',
        inputBorder: '#d1d5db',
        inputFocus: '#78350f'
    },
    'midnight-blue': {
        primaryColor: '#1e1b4b',
        secondaryColor: '#312e81',
        accentColor: '#3730a3',
        lightAccent: '#4c1d95',
        formBg: '#f8fafc',
        fieldsetBg: '#f1f5f9',
        legendBg: '#e0e7ff',
        legendText: '#1e293b',
        tableHeaderBg: '#e0e7ff',
        tableEvenRow: '#f1f5f9',
        tableHover: '#e0e7ff',
        borderColor: '#c7d2fe',
        textColor: '#1e293b',
        inputBg: 'white',
        inputBorder: '#94a3b8',
        inputFocus: '#1e1b4b'
    },
    'olive-beige': {
        primaryColor: '#365314',
        secondaryColor: '#4d7c0f',
        accentColor: '#65a30d',
        lightAccent: '#84cc16',
        formBg: '#fefce8',
        fieldsetBg: '#f7fee7',
        legendBg: '#ecfccb',
        legendText: '#1f2937',
        tableHeaderBg: '#ecfccb',
        tableEvenRow: '#f7fee7',
        tableHover: '#ecfccb',
        borderColor: '#d9f99d',
        textColor: '#1f2937',
        inputBg: 'white',
        inputBorder: '#d1d5db',
        inputFocus: '#365314'
    },
    'crimson-gray': {
        primaryColor: '#991b1b',
        secondaryColor: '#b91c1c',
        accentColor: '#dc2626',
        lightAccent: '#ef4444',
        formBg: '#fef2f2',
        fieldsetBg: '#fee2e2',
        legendBg: '#fecaca',
        legendText: '#1f2937',
        tableHeaderBg: '#fecaca',
        tableEvenRow: '#fee2e2',
        tableHover: '#fecaca',
        borderColor: '#fca5a5',
        textColor: '#1f2937',
        inputBg: 'white',
        inputBorder: '#d1d5db',
        inputFocus: '#991b1b'
    },
    'emerald-ivory': {
        primaryColor: '#047857',
        secondaryColor: '#059669',
        accentColor: '#10b981',
        lightAccent: '#34d399',
        formBg: '#ecfdf5',
        fieldsetBg: '#d1fae5',
        legendBg: '#a7f3d0',
        legendText: '#1f2937',
        tableHeaderBg: '#a7f3d0',
        tableEvenRow: '#d1fae5',
        tableHover: '#a7f3d0',
        borderColor: '#6ee7b7',
        textColor: '#1f2937',
        inputBg: 'white',
        inputBorder: '#9ca3af',
        inputFocus: '#047857'
    },
    'steel-blue': {
        primaryColor: '#0f172a',
        secondaryColor: '#1e293b',
        accentColor: '#334155',
        lightAccent: '#475569',
        formBg: '#f8fafc',
        fieldsetBg: '#f1f5f9',
        legendBg: '#e2e8f0',
        legendText: '#1e293b',
        tableHeaderBg: '#e2e8f0',
        tableEvenRow: '#f1f5f9',
        tableHover: '#e2e8f0',
        borderColor: '#cbd5e1',
        textColor: '#1e293b',
        inputBg: 'white',
        inputBorder: '#94a3b8',
        inputFocus: '#0f172a'
    },
    'copper-cream': {
        primaryColor: '#9a3412',
        secondaryColor: '#c2410c',
        accentColor: '#ea580c',
        lightAccent: '#f97316',
        formBg: '#fff7ed',
        fieldsetBg: '#ffedd5',
        legendBg: '#fed7aa',
        legendText: '#1f2937',
        tableHeaderBg: '#fed7aa',
        tableEvenRow: '#ffedd5',
        tableHover: '#fed7aa',
        borderColor: '#fdba74',
        textColor: '#1f2937',
        inputBg: 'white',
        inputBorder: '#d1d5db',
        inputFocus: '#9a3412'
    },
    'black-white': {
        primaryColor: '#000000',
        secondaryColor: '#333333',
        accentColor: '#666666',
        lightAccent: '#999999',
        formBg: '#ffffff',
        fieldsetBg: '#ffffff',
        legendBg: 'transparent',
        legendText: '#000000',
        tableHeaderBg: '#f5f5f5',
        tableEvenRow: '#fafafa',
        tableHover: '#f0f0f0',
        borderColor: '#cccccc',
        textColor: '#000000',
        inputBg: '#ffffff',
        inputBorder: '#999999',
        inputFocus: '#000000'
    },
    'no-color': {
        primaryColor: '#808080',
        secondaryColor: '#707070',
        accentColor: '#606060',
        lightAccent: '#909090',
        formBg: '#ffffff',
        fieldsetBg: '#ffffff',
        legendBg: 'transparent',
        legendText: '#404040',
        tableHeaderBg: '#f8f8f8',
        tableEvenRow: '#fcfcfc',
        tableHover: '#f0f0f0',
        borderColor: '#d0d0d0',
        textColor: '#404040',
        inputBg: '#ffffff',
        inputBorder: '#b0b0b0',
        inputFocus: '#606060'
    }
};

// Layout definitions
const layouts = {
    'default': {
        bodyMargin: '8.4vw',
        formMaxWidth: '100%',
        formPadding: '30px',
        fieldsetMargin: '20px',
        fieldsetPadding: '15px',
        legendFontSize: '1.2em',
        containerClass: 'layout-default'
    },
    'compact': {
        bodyMargin: '3.5vw',
        formMaxWidth: '95%',
        formPadding: '20px',
        fieldsetMargin: '15px',
        fieldsetPadding: '12px',
        legendFontSize: '1.1em',
        containerClass: 'layout-compact'
    },
    'wide-screen': {
        bodyMargin: '1.4vw',
        formMaxWidth: '98%',
        formPadding: '25px',
        fieldsetMargin: '18px',
        fieldsetPadding: '14px',
        legendFontSize: '1.15em',
        containerClass: 'layout-wide-screen'
    },
    'narrow': {
        bodyMargin: '14vw',
        formMaxWidth: '60%',
        formPadding: '35px',
        fieldsetMargin: '25px',
        fieldsetPadding: '18px',
        legendFontSize: '1.25em',
        containerClass: 'layout-narrow'
    },
    'minimal': {
        bodyMargin: '5.6vw',
        formMaxWidth: '90%',
        formPadding: '15px',
        fieldsetMargin: '10px',
        fieldsetPadding: '10px',
        legendFontSize: '1em',
        containerClass: 'layout-minimal'
    },
    'tabular': {
        bodyMargin: '2vw',
        formMaxWidth: '100%',
        formPadding: '10px',
        fieldsetMargin: '5px',
        fieldsetPadding: '8px',
        legendFontSize: '1em',
        containerClass: 'layout-tabular'
    }
};

function applyTheme(themeName) {
    let theme = themes[themeName];
    
    // If it's a custom theme, load from localStorage
    if (!theme) {
        const customThemes = JSON.parse(localStorage.getItem('custom_themes') || '{}');
        theme = customThemes[themeName];
    }
    
    if (!theme) return;
    
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
        const cssVar = '--' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
        root.style.setProperty(cssVar, value);
    });
    
    // Save theme preference
    localStorage.setItem('form_theme', themeName);
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('form_theme');
    if (savedTheme && themes[savedTheme]) {
        applyTheme(savedTheme);
        const select = document.getElementById('form-style-select');
        if (select) {
            select.value = savedTheme;
        }
    }
    
    // Load custom themes into dropdown
    loadCustomThemesIntoDropdown();
    
    // Load saved heading changes
    setTimeout(() => loadSavedHeadingChanges(), 100);
}

function loadCustomThemesIntoDropdown() {
    const customThemes = JSON.parse(localStorage.getItem('custom_themes') || '{}');
    const select = document.getElementById('form-style-select');
    if (!select) return;
    
    // Remove existing custom theme options
    const existingCustomOptions = select.querySelectorAll('option[data-custom="true"]');
    existingCustomOptions.forEach(option => option.remove());
    
    // Remove existing "Create Custom Theme" option
    const createOption = select.querySelector('option[value="create-custom"]');
    if (createOption) createOption.remove();
    
    // Add custom themes
    Object.keys(customThemes).forEach(themeName => {
        const option = document.createElement('option');
        option.value = themeName;
        option.textContent = themeName;
        option.setAttribute('data-custom', 'true');
        select.appendChild(option);
    });
    
    // Add "Create Custom Theme" option at the end
    const createCustomOption = document.createElement('option');
    createCustomOption.value = 'create-custom';
    createCustomOption.textContent = 'Create Custom Theme...';
    select.appendChild(createCustomOption);
}

function showCustomThemeModal() {
    const modal = document.getElementById('custom-theme-modal');
    const colorsGrid = document.getElementById('theme-colors-grid');
    const nameInput = document.getElementById('custom-theme-name');
    
    // Reset form
    nameInput.value = '';
    
    // Generate color pickers for all theme properties
    const themeProperties = [
        { key: 'primaryColor', label: 'Primary Color', default: '#2c3e50' },
        { key: 'secondaryColor', label: 'Secondary Color', default: '#34495e' },
        { key: 'accentColor', label: 'Accent Color', default: '#7f8c8d' },
        { key: 'lightAccent', label: 'Light Accent', default: '#95a6a6' },
        { key: 'formBg', label: 'Form Background', default: '#f5f5f5' },
        { key: 'fieldsetBg', label: 'Section Background', default: '#fafafa' },
        { key: 'legendBg', label: 'Legend Background', default: '#f0f0f0' },
        { key: 'legendText', label: 'Legend Text', default: '#333333' },
        { key: 'tableHeaderBg', label: 'Table Header Background', default: '#f0f0f0' },
        { key: 'tableEvenRow', label: 'Table Even Row', default: '#f9f9f9' },
        { key: 'tableHover', label: 'Table Hover', default: '#f0f0f0' },
        { key: 'borderColor', label: 'Border Color', default: '#dddddd' },
        { key: 'textColor', label: 'Text Color', default: '#333333' },
        { key: 'inputBg', label: 'Input Background', default: '#ffffff' },
        { key: 'inputBorder', label: 'Input Border', default: '#cccccc' },
        { key: 'inputFocus', label: 'Input Focus', default: '#333333' }
    ];
    
    colorsGrid.innerHTML = '';
    themeProperties.forEach(prop => {
        const colorItem = document.createElement('div');
        colorItem.className = 'theme-color-item';
        colorItem.innerHTML = `
            <span class="theme-color-label">${prop.label}</span>
            <input type="color" class="theme-color-input" data-property="${prop.key}" value="${prop.default}">
        `;
        colorsGrid.appendChild(colorItem);
    });
    
    // Add event listeners for real-time preview
    colorsGrid.addEventListener('input', updateThemePreview);
    
    modal.classList.add('show');
    
    // Set up modal controls
    setupCustomThemeModalControls();
}

function updateThemePreview() {
    const colorInputs = document.querySelectorAll('.theme-color-input');
    const root = document.documentElement;
    
    colorInputs.forEach(input => {
        const property = input.dataset.property;
        const cssVar = '--' + property.replace(/([A-Z])/g, '-$1').toLowerCase();
        root.style.setProperty(cssVar, input.value);
    });
}

function setupCustomThemeModalControls() {
    const modal = document.getElementById('custom-theme-modal');
    const closeBtn = document.getElementById('close-custom-theme-modal');
    const saveBtn = document.getElementById('save-custom-theme');
    const cancelBtn = document.getElementById('cancel-custom-theme');
    
    const closeModal = () => {
        modal.classList.remove('show');
        // Reset theme to current saved theme
        loadSavedTheme();
        // Reset dropdown
        const select = document.getElementById('form-style-select');
        const currentTheme = localStorage.getItem('form_theme') || 'default';
        if (select) select.value = currentTheme;
    };
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    saveBtn.addEventListener('click', () => {
        const nameInput = document.getElementById('custom-theme-name');
        const themeName = nameInput.value.trim();
        
        if (!themeName) {
            alert('Please enter a theme name.');
            return;
        }
        
        // Collect all color values
        const colorInputs = document.querySelectorAll('.theme-color-input');
        const customTheme = {};
        
        colorInputs.forEach(input => {
            const property = input.dataset.property;
            customTheme[property] = input.value;
        });
        
        // Save custom theme
        const customThemes = JSON.parse(localStorage.getItem('custom_themes') || '{}');
        customThemes[themeName] = customTheme;
        localStorage.setItem('custom_themes', JSON.stringify(customThemes));
        
        // Add to themes object
        themes[themeName] = customTheme;
        
        // Apply the new theme
        applyTheme(themeName);
        
        // Update dropdown
        loadCustomThemesIntoDropdown();
        
        // Set dropdown to new theme
        const select = document.getElementById('form-style-select');
        if (select) select.value = themeName;
        
        // Close modal
        modal.classList.remove('show');
        
        alert(`Theme "${themeName}" saved successfully!`);
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function applyLayout(layoutName) {
    const layout = layouts[layoutName];
    if (!layout) return;
    
    const root = document.documentElement;
    const body = document.body;
    const form = document.querySelector('form');
    
    // Remove existing layout classes
    Object.values(layouts).forEach(l => {
        body.classList.remove(l.containerClass);
    });
    
    // Add new layout class
    body.classList.add(layout.containerClass);
    
    // Apply layout properties
    Object.entries(layout).forEach(([key, value]) => {
        if (key === 'containerClass') return;
        const cssVar = '--layout-' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
        root.style.setProperty(cssVar, value);
    });
    
    // Save layout preference
    localStorage.setItem('form_layout', layoutName);
}

function loadSavedLayout() {
    const savedLayout = localStorage.getItem('form_layout');
    if (savedLayout && layouts[savedLayout]) {
        applyLayout(savedLayout);
        const select = document.getElementById('form-layout-select');
        if (select) {
            select.value = savedLayout;
        }
    }
}

// Initialize all tables and functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize form structure and functionality
    await FormInitializer.initializeForm();

    // Initialize text highlighter
    TextHighlighter.init();

    // Initialize section visibility manager
    SectionVisibilityManager.init();

    // Initialize print manager
    PrintManager.init();

    // Initialize document exporter
    DocumentExporter.init();

    // Initialize legend color picker
    initializeLegendColorPicker();

    // Initialize editable headings
    initializeEditableHeadings();

    // Initialize download manager
    initializeDownloadManager();

    // Initialize section reordering
    initializeSectionReordering();

    // Initialize item details table toggle
    const toggleItemsBtn = document.getElementById('toggle-additional-items');
    if (toggleItemsBtn) {
        toggleItemsBtn.addEventListener('click', function() {
            const additionalItems = document.querySelectorAll('.item-details-table .additional-item');
            const isHidden = additionalItems[0]?.classList.contains('hidden');
            
            additionalItems.forEach(item => {
                item.classList.toggle('hidden');
            });
            
            this.textContent = isHidden ? 
                'Hide Additional Items (11-30)' : 
                'Show Additional Items (11-30)';
        });
    }

    // Initialize document reference table toggle
    const toggleDocsBtn = document.getElementById('toggle-additional-docs');
    if (toggleDocsBtn) {
        toggleDocsBtn.addEventListener('click', function() {
            const additionalDocs = document.querySelectorAll('.document-table .additional-item');
            const isHidden = additionalDocs[0]?.classList.contains('hidden');
            
            additionalDocs.forEach(item => {
                item.classList.toggle('hidden');
            });
            
            this.textContent = isHidden ? 
                'Hide Additional Document Rows (2-20)' : 
                'Show Additional Document Rows (2-20)';
        });
    }

    // Load saved theme
    loadSavedTheme();

    // Load saved layout
    loadSavedLayout();

    // Initialize template creator controls
    setupTemplateCreatorControls();

    // Load custom templates into dropdown
    loadCustomTemplatesIntoDropdown();

    // Template selector functionality
    const templateSelect = document.getElementById('template-select');
    if (templateSelect) {
        templateSelect.addEventListener('change', (e) => {
            if (e.target.value === 'create-new-template') {
                showTemplateCreator();
                // Reset dropdown to previous value
                e.target.value = localStorage.getItem('current_template') || 'master-view';
            } else {
                applyTemplate(e.target.value);
            }
        });
    }

    // Template editing functionality
    const editTemplateBtn = document.getElementById('edit-template-btn');
    if (editTemplateBtn) {
        editTemplateBtn.addEventListener('click', () => {
            showTemplateManager();
        });
    }

    // Theme selector functionality
    const themeSelect = document.getElementById('form-style-select');
    if (themeSelect) {
        themeSelect.addEventListener('change', (e) => {
            if (e.target.value === 'create-custom') {
                showCustomThemeModal();
            } else {
                applyTheme(e.target.value);
            }
        });
    }

    // Layout selector functionality
    const layoutSelect = document.getElementById('form-layout-select');
    if (layoutSelect) {
        layoutSelect.addEventListener('change', (e) => {
            applyLayout(e.target.value);
        });
    }

    // Sidebar functionality
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const refreshBtn = document.getElementById('refresh-form-btn');
    const exportBtn = document.getElementById('export-json-btn');
    const importBtn = document.getElementById('import-json-btn');
    const exportSettingsBtn = document.getElementById('export-settings-btn');
    const importSettingsBtn = document.getElementById('import-settings-btn');
    const exportDocxBtn = document.getElementById('export-docx-btn');
    const exportXlsxBtn = document.getElementById('export-xlsx-btn');
    const exportPdfBtn = document.getElementById('export-pdf-btn');

    function toggleSidebar() {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    }

    if (hamburgerMenu && sidebar && overlay) {
        hamburgerMenu.addEventListener('click', toggleSidebar);
        overlay.addEventListener('click', toggleSidebar);
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to refresh the form? This will clear all saved data and cannot be undone.')) {
                // Clear all saved data from localStorage
                localStorage.clear();
                // Reload the page
                location.reload();
            }
        });
    }

    if (exportBtn) {
        exportBtn.addEventListener('click', async () => {
            await FormStorage.exportToJSON();
        });
    }

    if (importBtn) {
        importBtn.addEventListener('click', () => {
            FormStorage.importFromJSON();
        });
    }

    if (exportSettingsBtn) {
        exportSettingsBtn.addEventListener('click', () => {
            exportAllSettings();
        });
    }

    if (importSettingsBtn) {
        importSettingsBtn.addEventListener('click', () => {
            importAllSettings();
        });
    }

    if (exportDocxBtn) {
        exportDocxBtn.addEventListener('click', async () => {
            await DocumentExporter.exportToDocx();
        });
    }

    if (exportXlsxBtn) {
        exportXlsxBtn.addEventListener('click', async () => {
            await DocumentExporter.exportToXlsx();
        });
    }

    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', () => {
            exportToPDF();
        });
    }
});

function setupFormFunctionality(formElement) {
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
    formElement.addEventListener('keydown', handleAutoExpandingInputs);
    
    // Add ctrl+click to clear radio buttons
    let previouslyCheckedRadioOnMousedown = null;
}

function handleAutoExpandingInputs(e) {
    if (e.key === 'Enter' && e.target.type === 'text' && !e.shiftKey) {
        e.preventDefault();
        convertInputToTextarea(e.target);
    }
}

function convertInputToTextarea(input) {
    // Don't convert if it's already a textarea or in a table cell that shouldn't expand
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
    setupAutoResize(textarea);
}

function setupAutoResize(textarea) {
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

function initializeLegendColorPicker() {
    // Load saved legend colors
    loadSavedLegendColors();
    
    // Add click event listeners to all legends
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'LEGEND' && !e.target.classList.contains('editing')) {
            e.stopPropagation();
            showLegendColorPicker(e.target, e);
        } else {
            // Hide any open color pickers when clicking elsewhere
            hideLegendColorPicker();
        }
    });
}

function initializeEditableHeadings() {
    // Make all text elements editable on click
    document.addEventListener('click', (e) => {
        const target = e.target;
        
        // Check if target is any text element
        if ((target.matches('h1, h2, h3, h4, h5, h6, legend, .title-block h1, .modal-header h2, .sidebar-header h2, p, span, div, label, td, th, li, a, button') || 
             target.textContent.trim().length > 0) &&
            !target.classList.contains('editing') && 
            !target.closest('.no-edit') &&
            !target.matches('input, textarea, select, .close-button, .hamburger-menu, .pagination-btn, .sidebar-btn, .btn-action, .theme-btn, .download-btn') &&
            !target.closest('input, textarea, select, button:not(.editable-text)') &&
            target.textContent.trim().length > 0 &&
            !target.querySelector('input, textarea, select, button')) {
            
            // Don't edit if clicking on interactive elements
            if (target.tagName === 'BUTTON' || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
                return;
            }
            
            // Don't edit if the element contains form controls
            if (target.querySelector('input, textarea, select, button')) {
                return;
            }
            
            makeElementEditable(target);
        }
    });
}

function makeElementEditable(element) {
    if (element.classList.contains('editing')) return;
    
    // Don't edit empty elements or elements with only whitespace
    if (!element.textContent || element.textContent.trim().length === 0) return;
    
    // Don't edit if element contains child elements with form controls
    if (element.querySelector('input, textarea, select, button')) return;
    
    element.classList.add('editing');
    const originalText = element.textContent;
    const originalStyles = {
        padding: element.style.padding || '4px 8px',
        border: element.style.border || '2px dashed #007bff',
        backgroundColor: element.style.backgroundColor || '#f8f9fa',
        outline: element.style.outline || 'none'
    };
    
    // Apply editing styles
    Object.assign(element.style, originalStyles);
    element.contentEditable = true;
    element.focus();
    
    // Select all text
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    
    const finishEditing = () => {
        element.classList.remove('editing');
        element.contentEditable = false;
        
        // Reset styles
        element.style.padding = '';
        element.style.border = '';
        element.style.backgroundColor = '';
        element.style.outline = '';
        
        // Save the change
        saveEditableTextChange(element, originalText, element.textContent);
    };
    
    const cancelEditing = () => {
        element.textContent = originalText;
        finishEditing();
    };
    
    // Handle keyboard events
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            finishEditing();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            cancelEditing();
        }
    };
    
    // Handle blur event
    const handleBlur = () => {
        setTimeout(() => {
            if (element.classList.contains('editing')) {
                finishEditing();
            }
        }, 100);
    };
    
    element.addEventListener('keydown', handleKeyDown);
    element.addEventListener('blur', handleBlur);
    
    // Clean up event listeners when editing is done
    const cleanup = () => {
        element.removeEventListener('keydown', handleKeyDown);
        element.removeEventListener('blur', handleBlur);
    };
    
    element.addEventListener('blur', cleanup, { once: true });
}

function saveEditableTextChange(element, originalText, newText) {
    if (originalText === newText) return;
    
    // Save text changes to localStorage
    const textChanges = JSON.parse(localStorage.getItem('text_changes') || '{}');
    const elementId = element.id || generateElementId(element);
    
    if (!element.id) {
        element.id = elementId;
    }
    
    textChanges[elementId] = {
        originalText: originalText,
        newText: newText,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('text_changes', JSON.stringify(textChanges));
}

function saveEditableHeadingChange(element, originalText, newText) {
    // Use the same function as text changes for consistency
    saveEditableTextChange(element, originalText, newText);
}

function generateElementId(element) {
    // Generate a unique ID based on element type and position
    const tagName = element.tagName.toLowerCase();
    const parent = element.parentElement;
    const parentId = parent ? parent.id || parent.className : 'root';
    const siblings = parent ? Array.from(parent.children).filter(el => el.tagName === element.tagName) : [];
    const index = siblings.indexOf(element);
    
    return `editable-${tagName}-${parentId}-${index}-${Date.now()}`;
}

function loadSavedHeadingChanges() {
    // Load both heading changes and text changes
    const headingChanges = JSON.parse(localStorage.getItem('heading_changes') || '{}');
    const textChanges = JSON.parse(localStorage.getItem('text_changes') || '{}');
    
    // Apply heading changes
    Object.entries(headingChanges).forEach(([elementId, change]) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = change.newText;
        }
    });
    
    // Apply text changes
    Object.entries(textChanges).forEach(([elementId, change]) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = change.newText;
        }
    });
}

function initializeDownloadManager() {
    // Create download manager modal
    createDownloadManagerModal();
    
    // Override all download functions to use the download manager
    overrideDownloadFunctions();
}

function createDownloadManagerModal() {
    const modal = document.createElement('div');
    modal.id = 'download-manager-modal';
    modal.className = 'modal no-print no-edit';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Download Settings</h2>
                <button id="close-download-modal" class="close-button">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="download-filename">Filename:</label>
                    <input type="text" id="download-filename" class="download-input" placeholder="Enter filename...">
                </div>
                <div class="form-group">
                    <label for="download-location">Download Location:</label>
                    <input type="text" id="download-location" class="download-input" placeholder="Default Downloads folder" readonly>
                    <button type="button" id="choose-download-location" class="download-btn">Choose Folder</button>
                    <small>Note: Directory selection is supported on modern browsers. The browser may still override the location based on your settings.</small>
                </div>
                <div class="download-preview">
                    <strong>Full path preview:</strong>
                    <div id="download-path-preview">Downloads/filename.ext</div>
                </div>
            </div>
            <div class="modal-footer">
                <button id="download-confirm-btn" class="download-btn download-btn-primary">Download</button>
                <button id="download-cancel-btn" class="download-btn download-btn-secondary">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);

    // Add event listeners
    const closeBtn = modal.querySelector('#close-download-modal');
    const cancelBtn = modal.querySelector('#download-cancel-btn');
    const filenameInput = modal.querySelector('#download-filename');
    const locationInput = modal.querySelector('#download-location');
    const chooseLocationBtn = modal.querySelector('#choose-download-location');
    const confirmBtn = modal.querySelector('#download-confirm-btn');
    const pathPreview = modal.querySelector('#download-path-preview');
    
    const closeModal = () => {
        modal.classList.remove('show');
        window.pendingDownload = null;
    };
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Update preview when filename changes
    filenameInput.addEventListener('input', updateDownloadPreview);
    locationInput.addEventListener('input', updateDownloadPreview);
    
    // Choose location button with directory picker support
    chooseLocationBtn.addEventListener('click', async () => {
        try {
            // Check if File System Access API is supported
            if ('showDirectoryPicker' in window) {
                const directoryHandle = await window.showDirectoryPicker();
                locationInput.value = directoryHandle.name;
                window.selectedDirectoryHandle = directoryHandle;
                updateDownloadPreview();
            } else {
                // Fallback for browsers that don't support directory picker
                const customLocation = prompt('Enter preferred download folder path (browser may override this):');
                if (customLocation) {
                    locationInput.value = customLocation;
                    updateDownloadPreview();
                }
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error selecting directory:', error);
                // Fallback to prompt
                const customLocation = prompt('Enter preferred download folder path (browser may override this):');
                if (customLocation) {
                    locationInput.value = customLocation;
                    updateDownloadPreview();
                }
            }
        }
    });
    
    // Confirm download
    confirmBtn.addEventListener('click', async () => {
        if (window.pendingDownload && filenameInput.value.trim()) {
            const finalFilename = filenameInput.value.trim();
            
            // Save user preferences
            localStorage.setItem('download_preferences', JSON.stringify({
                lastLocation: locationInput.value,
                lastFilename: finalFilename
            }));
            
            // Execute the download with directory handle if available
            if (window.selectedDirectoryHandle && 'showDirectoryPicker' in window) {
                await executeDownloadToDirectory(window.pendingDownload.blob, finalFilename, window.selectedDirectoryHandle);
            } else {
                executeDownload(window.pendingDownload.blob, finalFilename, window.pendingDownload.type);
            }
            closeModal();
        }
    });
    
    function updateDownloadPreview() {
        const filename = filenameInput.value.trim() || 'filename';
        const location = locationInput.value.trim() || 'Downloads';
        pathPreview.textContent = `${location}/${filename}`;
    }
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

async function executeDownloadToDirectory(blob, filename, directoryHandle) {
    try {
        const fileHandle = await directoryHandle.getFileHandle(filename, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        
        // Show success message
        const indicator = document.createElement('div');
        indicator.className = 'save-indicator';
        indicator.textContent = `Saved to ${directoryHandle.name}/${filename}`;
        indicator.style.background = 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)';
        document.body.appendChild(indicator);
        indicator.classList.add('show');
        setTimeout(() => {
            indicator.classList.remove('show');
            setTimeout(() => document.body.removeChild(indicator), 300);
        }, 3000);
    } catch (error) {
        console.error('Error saving to directory:', error);
        // Fallback to regular download
        executeDownload(blob, filename, 'document');
    }
}

function showDownloadManager(blob, defaultFilename, fileType) {
    const modal = document.getElementById('download-manager-modal');
    const filenameInput = modal.querySelector('#download-filename');
    const locationInput = modal.querySelector('#download-location');
    
    // Load saved preferences
    const preferences = JSON.parse(localStorage.getItem('download_preferences') || '{}');
    
    // Set default values
    filenameInput.value = defaultFilename;
    locationInput.value = preferences.lastLocation || 'Downloads';
    
    // Store pending download
    window.pendingDownload = { blob, type: fileType };
    
    // Clear any previous directory handle
    window.selectedDirectoryHandle = null;
    
    // Update preview
    const pathPreview = modal.querySelector('#download-path-preview');
    pathPreview.textContent = `${locationInput.value}/${defaultFilename}`;
    
    // Show modal
    modal.classList.add('show');
    
    // Focus filename input
    setTimeout(() => {
        filenameInput.focus();
        filenameInput.select();
    }, 100);
}

function executeDownload(blob, filename, fileType) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.position = 'absolute';
    link.style.left = '-9999px';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function overrideDownloadFunctions() {
    // Store original download function
    const originalDownloadFile = DocumentExporter.downloadFile;
    
    // Override DocumentExporter.downloadFile
    DocumentExporter.downloadFile = function(blob, filename) {
        showDownloadManager(blob, filename, 'document');
    };
    
    // Override FormStorage.exportToJSON
    const originalExportToJSON = FormStorage.exportToJSON;
    FormStorage.exportToJSON = async function() {
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
        
        showDownloadManager(blob, defaultFilename, 'json');
    };
    
    // Override exportAllSettings function
    window.originalExportAllSettings = exportAllSettings;
    window.exportAllSettings = function() {
        const customThemes = JSON.parse(localStorage.getItem('custom_themes') || '{}');
        
        const settings = {
            theme: localStorage.getItem('form_theme') || 'default',
            layout: localStorage.getItem('form_layout') || 'default',
            sectionVisibility: JSON.parse(localStorage.getItem('form_section_visibility') || '{}'),
            legendColors: JSON.parse(localStorage.getItem('legend_colors') || '{}'),
            formData: JSON.parse(localStorage.getItem('inspection_report_form_data') || '{}'),
            customObjects: JSON.parse(localStorage.getItem('custom_objects') || '[]'),
            customThemes: customThemes,
            headingChanges: JSON.parse(localStorage.getItem('heading_changes') || '{}'),
            textChanges: JSON.parse(localStorage.getItem('text_changes') || '{}'),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const dataStr = JSON.stringify(settings, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const defaultFilename = `form_settings_${new Date().toISOString().split('T')[0]}.json`;
        
        showDownloadManager(blob, defaultFilename, 'settings');
    };
}

function hideLegendColorPicker() {
    const existingPicker = document.getElementById('legend-color-picker');
    if (existingPicker) {
        existingPicker.remove();
    }
}

function showLegendColorPicker(legend, event) {
    hideLegendColorPicker();
    
    const picker = document.createElement('div');
    picker.id = 'legend-color-picker';
    picker.className = 'legend-color-picker show';
    picker.style.position = 'absolute';
    picker.style.left = event.pageX + 'px';
    picker.style.top = event.pageY + 'px';
    
    const currentColor = rgbToHex(legend.style.backgroundColor) || '#2c3e50';
    
    picker.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
            <input type="color" id="legend-color-input" value="${currentColor}" style="width: 50px; height: 30px;">
            <span>Choose color</span>
        </div>
        <div style="display: flex; gap: 5px;">
            <button id="apply-legend-color" style="padding: 5px 10px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;">Apply</button>
            <button id="reset-legend-color" style="padding: 5px 10px; background: #6c757d; color: white; border: none; border-radius: 3px; cursor: pointer;">Reset</button>
            <button id="cancel-legend-color" style="padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer;">Cancel</button>
        </div>
    `;
    
    document.body.appendChild(picker);
    
    // Add event listeners
    document.getElementById('apply-legend-color').addEventListener('click', () => {
        const newColor = document.getElementById('legend-color-input').value;
        legend.style.backgroundColor = newColor;
        saveLegendColor(legend, newColor);
        hideLegendColorPicker();
    });
    
    document.getElementById('reset-legend-color').addEventListener('click', () => {
        legend.style.backgroundColor = '';
        removeSavedLegendColor(legend);
        hideLegendColorPicker();
    });
    
    document.getElementById('cancel-legend-color').addEventListener('click', () => {
        hideLegendColorPicker();
    });
    
    // Auto-close when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closePickerOnOutsideClick(e) {
            if (!picker.contains(e.target) && e.target !== legend) {
                hideLegendColorPicker();
                document.removeEventListener('click', closePickerOnOutsideClick);
            }
        });
    }, 100);
}

function saveLegendColor(legend, color) {
    const sectionId = legend.closest('fieldset')?.dataset.sectionId;
    if (!sectionId) return;
    
    const savedColors = JSON.parse(localStorage.getItem('legend_colors') || '{}');
    savedColors[sectionId] = color;
    localStorage.setItem('legend_colors', JSON.stringify(savedColors));
}

function removeSavedLegendColor(legend) {
    const sectionId = legend.closest('fieldset')?.dataset.sectionId;
    if (!sectionId) return;
    
    const savedColors = JSON.parse(localStorage.getItem('legend_colors') || '{}');
    delete savedColors[sectionId];
    localStorage.setItem('legend_colors', JSON.stringify(savedColors));
}

function loadSavedLegendColors() {
    const savedColors = JSON.parse(localStorage.getItem('legend_colors') || '{}');
    
    Object.entries(savedColors).forEach(([sectionId, color]) => {
        const fieldset = document.querySelector(`fieldset[data-section-id="${sectionId}"]`);
        const legend = fieldset?.querySelector('legend');
        if (legend) {
            legend.style.backgroundColor = color;
        }
    });
}

function rgbToHex(rgb) {
    if (!rgb || rgb === 'transparent') return null;
    
    // Handle hex colors that are already in hex format
    if (rgb.startsWith('#')) return rgb;
    
    // Handle rgb() format
    const result = rgb.match(/\d+/g);
    if (!result || result.length < 3) return null;
    
    return "#" + ((1 << 24) + (parseInt(result[0]) << 16) + (parseInt(result[1]) << 8) + parseInt(result[2])).toString(16).slice(1);
}

function exportToPDF() {
    // Create a custom print style for PDF export
    const printStyles = `
        @media print {
            body { margin: 1.5cm; background: white; color: black; font-size: 10pt; }
            form { max-width: 100%; margin: 0; padding: 0; border: none; box-shadow: none; }
            .no-print, #hamburger-menu, .sidebar, .overlay, .save-indicator, .context-menu { display: none !important; }
            fieldset { page-break-inside: avoid; border-color: #999; }
            legend { background: #f0f0f0 !important; color: #000 !important; }
            textarea { resize: none; }
            table { page-break-inside: auto; }
            tr { page-break-inside: avoid; page-break-after: auto; }
            thead { display: table-header-group; }
            tfoot { display: table-footer-group; }
            legend, table th, .section-header td, tr:nth-child(even) td, tfoot td, .partial-total, #weekly-total-time, #weekly-total-km {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
        }
    `;
    
    const styleEl = document.createElement('style');
    styleEl.id = 'pdf-export-styles';
    styleEl.innerHTML = printStyles;
    document.head.appendChild(styleEl);
    
    // Close sidebar before printing
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    
    setTimeout(() => {
        window.print();
        
        // Cleanup after print dialog
        setTimeout(() => {
            document.head.removeChild(styleEl);
        }, 1000);
    }, 200);
}

function applyTemplate(templateName) {
    switch (templateName) {
        case 'master-view':
            // Show all sections for Master View
            const sections = document.querySelectorAll('#inspection-form > fieldset');
            sections.forEach(section => {
                const sectionId = section.dataset.sectionId;
                if (sectionId) {
                    section.style.display = '';
                }
            });
            saveAllSectionsState(true);
            localStorage.setItem('current_template', 'master-view');
            break;
        case 'create-custom-inspection':
            // Hide all sections except Custom Inspection Builder
            const allSections = document.querySelectorAll('#inspection-form > fieldset');
            allSections.forEach(section => {
                const sectionId = section.dataset.sectionId;
                if (sectionId) {
                    if (sectionId === 'custom-inspection-builder') {
                        section.style.display = '';
                    } else {
                        section.style.display = 'none';
                    }
                }
            });
            
            // Save the visibility state
            const customInspectionState = {};
            allSections.forEach(section => {
                const sectionId = section.dataset.sectionId;
                if (sectionId) {
                    customInspectionState[sectionId] = sectionId === 'custom-inspection-builder';
                }
            });
            localStorage.setItem('form_section_visibility', JSON.stringify(customInspectionState));
            localStorage.setItem('current_template', 'create-custom-inspection');
            break;
        case 'image-attachments':
            // Hide all sections except Image Attachments
            const imageSections = document.querySelectorAll('#inspection-form > fieldset');
            imageSections.forEach(section => {
                const sectionId = section.dataset.sectionId;
                if (sectionId) {
                    if (sectionId === 'image-attachments') {
                        section.style.display = '';
                    } else {
                        section.style.display = 'none';
                    }
                }
            });
            
            // Save the visibility state
            const imageAttachmentsState = {};
            imageSections.forEach(section => {
                const sectionId = section.dataset.sectionId;
                if (sectionId) {
                    imageAttachmentsState[sectionId] = sectionId === 'image-attachments';
                }
            });
            localStorage.setItem('form_section_visibility', JSON.stringify(imageAttachmentsState));
            localStorage.setItem('current_template', 'image-attachments');
            break;
        case 'iso-checklist':
            // Hide all sections except ISO 9001:2015 Audit Checklist
            const isoSections = document.querySelectorAll('#inspection-form > fieldset');
            isoSections.forEach(section => {
                const sectionId = section.dataset.sectionId;
                if (sectionId) {
                    if (sectionId === 'iso9001-audit') {
                        section.style.display = '';
                    } else {
                        section.style.display = 'none';
                    }
                }
            });
            
            // Save the visibility state
            const isoChecklistState = {};
            isoSections.forEach(section => {
                const sectionId = section.dataset.sectionId;
                if (sectionId) {
                    isoChecklistState[sectionId] = sectionId === 'iso9001-audit';
                }
            });
            localStorage.setItem('form_section_visibility', JSON.stringify(isoChecklistState));
            localStorage.setItem('current_template', 'iso-checklist');
            break;
        case 'aml':
            // Hide all sections except Approved Manufacturers List
            const amlSections = document.querySelectorAll('#inspection-form > fieldset');
            amlSections.forEach(section => {
                const sectionId = section.dataset.sectionId;
                if (sectionId) {
                    if (sectionId === 'approved-manufacturers') {
                        section.style.display = '';
                    } else {
                        section.style.display = 'none';
                    }
                }
            });
            
            // Save the visibility state
            const amlState = {};
            amlSections.forEach(section => {
                const sectionId = section.dataset.sectionId;
                if (sectionId) {
                    amlState[sectionId] = sectionId === 'approved-manufacturers';
                }
            });
            localStorage.setItem('form_section_visibility', JSON.stringify(amlState));
            localStorage.setItem('current_template', 'aml');
            break;
        case 'international-audit':
            // Show only specific sections for International Audit Form
            const internationalAuditSections = document.querySelectorAll('#inspection-form > fieldset');
            const allowedSections = [
                'basic-info',
                'contact-info', 
                'order-info',
                'time-breakdown',
                'contact-table',
                'purpose-summary',
                'inspection-results',
                'item-details',
                'valves-inspection',
                'actuator-inspection',
                'ancillaries-inspection',
                'spools-inspection',
                'other-visual-inspection',
                'document-reference',
                'additional-docs',
                'calibration',
                'signatures',
                'image-attachments'
            ];
            
            internationalAuditSections.forEach(section => {
                const sectionId = section.dataset.sectionId;
                if (sectionId) {
                    if (allowedSections.includes(sectionId)) {
                        section.style.display = '';
                    } else {
                        section.style.display = 'none';
                    }
                }
            });
            
            // Save the visibility state
            const internationalAuditState = {};
            internationalAuditSections.forEach(section => {
                const sectionId = section.dataset.sectionId;
                if (sectionId) {
                    internationalAuditState[sectionId] = allowedSections.includes(sectionId);
                }
            });
            localStorage.setItem('form_section_visibility', JSON.stringify(internationalAuditState));
            localStorage.setItem('current_template', 'international-audit');
            break;
        default:
            // Handle custom templates
            if (templateName.startsWith('custom-')) {
                const templateId = templateName.replace('custom-', '');
                applyCustomTemplate(templateId);
            }
            break;
    }
}

function saveAllSectionsState(isVisible) {
    const sections = document.querySelectorAll('#inspection-form > fieldset');
    const state = {};
    sections.forEach(section => {
        const sectionId = section.dataset.sectionId;
        if (sectionId) {
            state[sectionId] = isVisible;
        }
    });
    localStorage.setItem('form_section_visibility', JSON.stringify(state));
}

function exportAllSettings() {
    const customThemes = JSON.parse(localStorage.getItem('custom_themes') || '{}');
    
    const settings = {
        theme: localStorage.getItem('form_theme') || 'default',
        layout: localStorage.getItem('form_layout') || 'default',
        sectionVisibility: JSON.parse(localStorage.getItem('form_section_visibility') || '{}'),
        legendColors: JSON.parse(localStorage.getItem('legend_colors') || '{}'),
        formData: JSON.parse(localStorage.getItem('inspection_report_form_data') || '{}'),
        customObjects: JSON.parse(localStorage.getItem('custom_objects') || '[]'),
        customThemes: customThemes,
        headingChanges: JSON.parse(localStorage.getItem('heading_changes') || '{}'),
        textChanges: JSON.parse(localStorage.getItem('text_changes') || '{}'),
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `form_settings_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function importAllSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const settings = JSON.parse(e.target.result);
                    
                    // Import all settings
                    if (settings.theme) {
                        localStorage.setItem('form_theme', settings.theme);
                    }
                    if (settings.layout) {
                        localStorage.setItem('form_layout', settings.layout);
                    }
                    if (settings.sectionVisibility) {
                        localStorage.setItem('form_section_visibility', JSON.stringify(settings.sectionVisibility));
                    }
                    if (settings.legendColors) {
                        localStorage.setItem('legend_colors', JSON.stringify(settings.legendColors));
                    }
                    if (settings.formData) {
                        localStorage.setItem('inspection_report_form_data', JSON.stringify(settings.formData));
                    }
                    if (settings.customObjects) {
                        localStorage.setItem('custom_objects', JSON.stringify(settings.customObjects));
                    }
                    if (settings.customThemes) {
                        localStorage.setItem('custom_themes', JSON.stringify(settings.customThemes));
                        // Add custom themes to the themes object
                        Object.assign(themes, settings.customThemes);
                    }
                    if (settings.headingChanges) {
                        localStorage.setItem('heading_changes', JSON.stringify(settings.headingChanges));
                    }
                    if (settings.textChanges) {
                        localStorage.setItem('text_changes', JSON.stringify(settings.textChanges));
                    }
                    
                    alert('Settings imported successfully. The page will reload to apply all settings.');
                    location.reload();
                } catch (error) {
                    alert('Error importing settings: ' + error.message);
                }
            };
            reader.readAsText(file);
        }
    };
    
    input.click();
}

function showTemplateCreator(existingTemplate = null) {
    const modal = document.getElementById('template-creator-modal');
    const nameInput = document.getElementById('template-name-input');
    const descriptionInput = document.getElementById('template-description-input');
    const sectionChecklist = document.getElementById('template-section-checklist');
    
    // Reset or populate form
    if (existingTemplate) {
        nameInput.value = existingTemplate.name;
        descriptionInput.value = existingTemplate.description || '';
        document.getElementById('save-template-btn').textContent = 'Update Template';
        document.getElementById('save-template-btn').dataset.templateId = existingTemplate.id;
    } else {
        nameInput.value = '';
        descriptionInput.value = '';
        document.getElementById('save-template-btn').textContent = 'Save Template';
        delete document.getElementById('save-template-btn').dataset.templateId;
    }
    
    // Populate section checklist
    const sections = document.querySelectorAll('#inspection-form > fieldset');
    let checklistHtml = '';
    
    sections.forEach(section => {
        const sectionId = section.dataset.sectionId;
        const legend = section.querySelector('legend');
        const title = legend ? legend.textContent.trim() : `Section ${sectionId}`;
        const isChecked = existingTemplate ? 
            existingTemplate.sections.includes(sectionId) : 
            section.style.display !== 'none';
        
        if (sectionId) {
            checklistHtml += `
                <div class="template-section-item">
                    <label>
                        <input type="checkbox" data-section-id="${sectionId}" ${isChecked ? 'checked' : ''}>
                        ${title}
                    </label>
                </div>
            `;
        }
    });
    
    sectionChecklist.innerHTML = checklistHtml;
    modal.classList.add('show');
    nameInput.focus();
}

function showTemplateManager() {
    const modal = document.getElementById('template-manager-modal');
    const templatesList = document.getElementById('custom-templates-list');
    
    const customTemplates = JSON.parse(localStorage.getItem('custom_templates') || '{}');
    
    if (Object.keys(customTemplates).length === 0) {
        templatesList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No custom templates found. Create your first template using the "Create New Template" option.</p>';
    } else {
        let html = '';
        Object.entries(customTemplates).forEach(([templateId, template]) => {
            html += `
                <div class="template-item" style="border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 4px; background: white;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div style="flex: 1;">
                            <h5 style="margin: 0 0 5px 0; color: #333;">${template.name}</h5>
                            ${template.description ? `<p style="margin: 0 0 10px 0; color: #666; font-size: 0.9em;">${template.description}</p>` : ''}
                            <small style="color: #999;">Created: ${new Date(template.created).toLocaleDateString()} | ${template.sections.length} sections</small>
                        </div>
                        <div style="display: flex; gap: 5px; margin-left: 15px;">
                            <button type="button" class="template-action-btn edit-template-btn" data-template-id="${templateId}" style="padding: 5px 10px; font-size: 11px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;">Edit</button>
                            <button type="button" class="template-action-btn delete-template-btn" data-template-id="${templateId}" style="padding: 5px 10px; font-size: 11px; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer;">Delete</button>
                        </div>
                    </div>
                </div>
            `;
        });
        templatesList.innerHTML = html;
        
        // Add event listeners for template actions
        templatesList.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-template-btn')) {
                const templateId = e.target.dataset.templateId;
                const template = customTemplates[templateId];
                modal.classList.remove('show');
                showTemplateCreator({...template, id: templateId});
            } else if (e.target.classList.contains('delete-template-btn')) {
                const templateId = e.target.dataset.templateId;
                const template = customTemplates[templateId];
                if (confirm(`Are you sure you want to delete the template "${template.name}"? This action cannot be undone.`)) {
                    deleteCustomTemplate(templateId);
                    showTemplateManager(); // Refresh the list
                }
            }
        });
    }
    
    modal.classList.add('show');
}

function setupTemplateCreatorControls() {
    const modal = document.getElementById('template-creator-modal');
    const managerModal = document.getElementById('template-manager-modal');
    const closeCreatorBtn = document.getElementById('close-template-creator');
    const closeManagerBtn = document.getElementById('close-template-manager');
    const closeManagerBtnFooter = document.getElementById('close-template-manager-btn');
    const saveBtn = document.getElementById('save-template-btn');
    const cancelBtn = document.getElementById('cancel-template-btn');
    
    const closeCreatorModal = () => {
        modal.classList.remove('show');
    };
    
    const closeManagerModal = () => {
        managerModal.classList.remove('show');
    };
    
    closeCreatorBtn.addEventListener('click', closeCreatorModal);
    cancelBtn.addEventListener('click', closeCreatorModal);
    closeManagerBtn.addEventListener('click', closeManagerModal);
    closeManagerBtnFooter.addEventListener('click', closeManagerModal);
    
    saveBtn.addEventListener('click', () => {
        const nameInput = document.getElementById('template-name-input');
        const descriptionInput = document.getElementById('template-description-input');
        const templateName = nameInput.value.trim();
        
        if (!templateName) {
            alert('Please enter a template name.');
            nameInput.focus();
            return;
        }
        
        // Check for duplicate names (excluding current template if editing)
        const customTemplates = JSON.parse(localStorage.getItem('custom_templates') || '{}');
        const isEditing = saveBtn.dataset.templateId;
        const isDuplicate = Object.values(customTemplates).some(template => 
            template.name.toLowerCase() === templateName.toLowerCase() && 
            (!isEditing || template.id !== saveBtn.dataset.templateId)
        );
        
        if (isDuplicate) {
            alert('A template with this name already exists. Please choose a different name.');
            nameInput.focus();
            return;
        }
        
        // Collect selected sections
        const checkboxes = document.querySelectorAll('#template-section-checklist input[type="checkbox"]');
        const selectedSections = [];
        
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedSections.push(checkbox.dataset.sectionId);
            }
        });
        
        if (selectedSections.length === 0) {
            alert('Please select at least one section for the template.');
            return;
        }
        
        // Save or update template
        const templateId = isEditing ? saveBtn.dataset.templateId : Date.now().toString();
        const template = {
            id: templateId,
            name: templateName,
            description: descriptionInput.value.trim(),
            sections: selectedSections,
            created: isEditing ? customTemplates[templateId].created : new Date().toISOString(),
            updated: new Date().toISOString()
        };
        
        customTemplates[templateId] = template;
        localStorage.setItem('custom_templates', JSON.stringify(customTemplates));
        
        // Update template dropdown
        loadCustomTemplatesIntoDropdown();
        
        // Apply the template
        applyCustomTemplate(templateId);
        
        // Close modal
        closeCreatorModal();
        
        alert(`Template "${templateName}" ${isEditing ? 'updated' : 'saved'} successfully!`);
    });
    
    // Close modals when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeCreatorModal();
        }
    });
    
    managerModal.addEventListener('click', (e) => {
        if (e.target === managerModal) {
            closeManagerModal();
        }
    });
}

function loadCustomTemplatesIntoDropdown() {
    const customTemplates = JSON.parse(localStorage.getItem('custom_templates') || '{}');
    const select = document.getElementById('template-select');
    if (!select) return;
    
    // Remove existing custom template options
    const existingCustomOptions = select.querySelectorAll('option[data-custom-template="true"]');
    existingCustomOptions.forEach(option => option.remove());
    
    // Remove existing "Create New Template" option
    const createOption = select.querySelector('option[value="create-new-template"]');
    if (createOption) createOption.remove();
    
    // Add custom templates
    Object.entries(customTemplates).forEach(([templateId, template]) => {
        const option = document.createElement('option');
        option.value = `custom-${templateId}`;
        option.textContent = template.name;
        option.setAttribute('data-custom-template', 'true');
        select.appendChild(option);
    });
    
    // Re-add "Create New Template" option at the end
    const createNewOption = document.createElement('option');
    createNewOption.value = 'create-new-template';
    createNewOption.textContent = 'Create New Template...';
    select.appendChild(createNewOption);
}

function deleteCustomTemplate(templateId) {
    const customTemplates = JSON.parse(localStorage.getItem('custom_templates') || '{}');
    delete customTemplates[templateId];
    localStorage.setItem('custom_templates', JSON.stringify(customTemplates));
    
    // Update dropdown
    loadCustomTemplatesIntoDropdown();
    
    // If the deleted template was currently active, switch to master view
    const currentTemplate = localStorage.getItem('current_template');
    if (currentTemplate === `custom-${templateId}`) {
        applyTemplate('master-view');
    }
}

function applyCustomTemplate(templateId) {
    const customTemplates = JSON.parse(localStorage.getItem('custom_templates') || '{}');
    const template = customTemplates[templateId];
    
    if (!template) return;
    
    // Hide all sections first
    const sections = document.querySelectorAll('#inspection-form > fieldset');
    sections.forEach(section => {
        const sectionId = section.dataset.sectionId;
        if (sectionId) {
            section.style.display = 'none';
        }
    });
    
    // Show selected sections
    template.sections.forEach(sectionId => {
        const section = document.querySelector(`fieldset[data-section-id="${sectionId}"]`);
        if (section) {
            section.style.display = '';
        }
    });
    
    // Save visibility state
    const state = {};
    sections.forEach(section => {
        const sectionId = section.dataset.sectionId;
        if (sectionId) {
            state[sectionId] = template.sections.includes(sectionId);
        }
    });
    localStorage.setItem('form_section_visibility', JSON.stringify(state));
    
    // Update template selector
    const select = document.getElementById('template-select');
    if (select) {
        select.value = `custom-${templateId}`;
    }
    
    // Save current template
    localStorage.setItem('current_template', `custom-${templateId}`);
}

function initializeSectionReordering() {
    const form = document.getElementById('inspection-form');
    let draggedElement = null;
    let placeholder = null;

    // Add draggable attributes to all fieldsets
    const fieldsets = form.querySelectorAll('fieldset[data-section-id]');
    fieldsets.forEach(fieldset => {
        fieldset.draggable = true;
        const legend = fieldset.querySelector('legend');
        if (legend) {
            legend.style.cursor = 'move';
            legend.title = 'Click and drag to reorder this section';
        }
    });

    // Create placeholder element
    function createPlaceholder() {
        const div = document.createElement('div');
        div.className = 'section-reorder-placeholder';
        div.style.cssText = `
            height: 60px;
            margin: 10px 0;
            border: 2px dashed var(--primary-color);
            background: rgba(49, 130, 206, 0.1);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary-color);
            font-weight: 600;
            font-size: 14px;
        `;
        div.textContent = 'Drop section here';
        return div;
    }

    // Drag start
    form.addEventListener('dragstart', (e) => {
        if (e.target.matches('fieldset[data-section-id]') || e.target.closest('fieldset[data-section-id]')) {
            draggedElement = e.target.matches('fieldset[data-section-id]') ? 
                e.target : e.target.closest('fieldset[data-section-id]');
            
            draggedElement.style.opacity = '0.5';
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', draggedElement.innerHTML);
            
            // Create and store placeholder
            placeholder = createPlaceholder();
        }
    });

    // Drag over
    form.addEventListener('dragover', (e) => {
        if (!draggedElement) return;
        
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        const afterElement = getDragAfterElement(form, e.clientY);
        if (afterElement == null) {
            form.appendChild(placeholder);
        } else {
            form.insertBefore(placeholder, afterElement);
        }
    });

    // Drag enter
    form.addEventListener('dragenter', (e) => {
        if (!draggedElement) return;
        e.preventDefault();
    });

    // Drop
    form.addEventListener('drop', (e) => {
        if (!draggedElement) return;
        
        e.preventDefault();
        
        // Insert dragged element at placeholder position
        if (placeholder.parentNode) {
            placeholder.parentNode.insertBefore(draggedElement, placeholder);
            placeholder.remove();
        }
        
        // Reset opacity
        draggedElement.style.opacity = '';
        
        // Save new order
        saveSectionOrder();
        
        // Show success indicator
        showSectionReorderIndicator();
        
        draggedElement = null;
        placeholder = null;
    });

    // Drag end
    form.addEventListener('dragend', (e) => {
        if (draggedElement) {
            draggedElement.style.opacity = '';
            if (placeholder && placeholder.parentNode) {
                placeholder.remove();
            }
            draggedElement = null;
            placeholder = null;
        }
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('fieldset[data-section-id]:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function saveSectionOrder() {
        const fieldsets = form.querySelectorAll('fieldset[data-section-id]');
        const order = [];
        fieldsets.forEach((fieldset, index) => {
            order.push({
                sectionId: fieldset.dataset.sectionId,
                position: index
            });
        });
        localStorage.setItem('section_order', JSON.stringify(order));
    }

    function showSectionReorderIndicator() {
        let indicator = document.querySelector('.section-reorder-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'section-reorder-indicator';
            indicator.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
                color: white;
                padding: 12px 16px;
                font-size: 12px;
                font-weight: 600;
                opacity: 0;
                transition: all 0.3s ease;
                z-index: 1000;
                border: none;
                border-radius: 6px;
                box-shadow: var(--shadow-md);
                text-transform: uppercase;
                letter-spacing: 0.5px;
            `;
            indicator.textContent = 'Section Order Saved';
            document.body.appendChild(indicator);
        }
        
        indicator.style.opacity = '1';
        setTimeout(() => {
            indicator.style.opacity = '0';
        }, 2000);
    }

    // Load saved section order on initialization
    loadSavedSectionOrder();

    function loadSavedSectionOrder() {
        const savedOrder = localStorage.getItem('section_order');
        if (!savedOrder) return;
        
        try {
            const order = JSON.parse(savedOrder);
            const fieldsets = form.querySelectorAll('fieldset[data-section-id]');
            
            // Create a map of current fieldsets
            const fieldsetsMap = new Map();
            fieldsets.forEach(fieldset => {
                fieldsetsMap.set(fieldset.dataset.sectionId, fieldset);
            });
            
            // Remove all fieldsets from form
            fieldsets.forEach(fieldset => fieldset.remove());
            
            // Re-add them in saved order
            order.forEach(item => {
                const fieldset = fieldsetsMap.get(item.sectionId);
                if (fieldset) {
                    form.appendChild(fieldset);
                }
            });
            
            // Add any fieldsets that weren't in the saved order (new sections)
            fieldsetsMap.forEach((fieldset, sectionId) => {
                if (!order.find(item => item.sectionId === sectionId)) {
                    form.appendChild(fieldset);
                }
            });
            
        } catch (error) {
            console.error('Error loading section order:', error);
            localStorage.removeItem('section_order');
        }
    }
}