// Approved Manufacturers List functionality
export const ApprovedManufacturersList = {
    manufacturerCounter: 0,
    currentPage: 1,
    vendorsPerPage: 5,
    totalVendors: 0,
    
    init() {
        document.addEventListener('click', this.handleButtonClicks.bind(this));
        this.createInitialTable();
        this.setupPaginationControls();
    },

    handleButtonClicks(event) {
        const target = event.target;
        
        if (target.id === 'add-manufacturer-btn') {
            this.addManufacturerTable();
        } else if (target.id === 'import-manufacturers-csv-btn') {
            this.importFromCSV();
        } else if (target.id === 'export-manufacturers-csv-btn') {
            this.exportToCSV();
        } else if (target.classList.contains('remove-manufacturer-btn')) {
            this.removeManufacturer(target);
        } else if (target.id === 'prev-vendors-btn') {
            this.previousPage();
        } else if (target.id === 'next-vendors-btn') {
            this.nextPage();
        } else if (target.id === 'vendors-per-page-select') {
            this.changeVendorsPerPage();
        }
    },

    createInitialTable() {
        const container = document.getElementById('approved-manufacturers-container');
        if (!container) return;
        
        this.manufacturerCounter = 1;
        this.totalVendors = 1;
        container.innerHTML = this.createPaginationHeader() + this.createManufacturerTable(1);
        this.updateRemoveButtonVisibility();
        this.updatePaginationControls();
    },

    createPaginationHeader() {
        return `
            <div class="manufacturer-pagination-controls">
                <div class="pagination-info">
                    <label for="vendors-per-page-select">Vendors per page:</label>
                    <select id="vendors-per-page-select">
                        <option value="1">1</option>
                        <option value="3">3</option>
                        <option value="5" selected>5</option>
                        <option value="10">10</option>
                        <option value="all">All</option>
                    </select>
                </div>
                <div class="pagination-nav">
                    <button type="button" id="prev-vendors-btn" class="pagination-btn" title="Previous Vendors">‹</button>
                    <span id="pagination-status">Page 1 of 1</span>
                    <button type="button" id="next-vendors-btn" class="pagination-btn" title="Next Vendors">›</button>
                </div>
            </div>
            <div id="manufacturers-display-container">
        `;
    },

    createManufacturerTable(index) {
        return `
            <div class="manufacturer-table-container" data-manufacturer-index="${index}">
                <div class="manufacturer-table-wrapper">
                    <table class="manufacturer-table">
                        <thead>
                            <tr>
                                <th>Field</th>
                                <th>Manufacturer ${index}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Manufacturer</strong></td>
                                <td><input type="text" name="mfg-name-${index}" placeholder="Manufacturer name"></td>
                            </tr>
                            <tr>
                                <td><strong>Manufacturer Alt Name 1</strong></td>
                                <td><input type="text" name="mfg-alt-name1-${index}" placeholder="Alternative name 1"></td>
                            </tr>
                            <tr>
                                <td><strong>Manufacturer Alt Name 2</strong></td>
                                <td><input type="text" name="mfg-alt-name2-${index}" placeholder="Alternative name 2"></td>
                            </tr>
                            <tr>
                                <td><strong>Material Group</strong></td>
                                <td><input type="text" name="mfg-material-group-${index}" placeholder="Material group"></td>
                            </tr>
                            <tr>
                                <td><strong>Material Description</strong></td>
                                <td><textarea name="mfg-material-desc-${index}" rows="2" placeholder="Material description"></textarea></td>
                            </tr>
                            <tr>
                                <td><strong>MFG Approval Status</strong></td>
                                <td><select name="mfg-approval-status-${index}">
                                    <option value="">Select Status</option>
                                    <option value="approved">Approved</option>
                                    <option value="conditional">Conditional</option>
                                    <option value="pending">Pending</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="suspended">Suspended</option>
                                </select></td>
                            </tr>
                            <tr>
                                <td><strong>Region</strong></td>
                                <td><input type="text" name="mfg-region-${index}" placeholder="Region"></td>
                            </tr>
                            <tr>
                                <td><strong>Company</strong></td>
                                <td><input type="text" name="mfg-company-${index}" placeholder="Company"></td>
                            </tr>
                            <tr>
                                <td><strong>Brand</strong></td>
                                <td><input type="text" name="mfg-brand-${index}" placeholder="Brand"></td>
                            </tr>
                            <tr>
                                <td><strong>Facility</strong></td>
                                <td><input type="text" name="mfg-facility-${index}" placeholder="Facility name"></td>
                            </tr>
                            <tr>
                                <td><strong>Country</strong></td>
                                <td><input type="text" name="mfg-country-${index}" placeholder="Country"></td>
                            </tr>
                            <tr>
                                <td><strong>Location</strong></td>
                                <td><input type="text" name="mfg-location-${index}" placeholder="Location/Address"></td>
                            </tr>
                            <tr>
                                <td><strong>Capabilities</strong></td>
                                <td><textarea name="mfg-capabilities-${index}" rows="3" placeholder="Manufacturing capabilities"></textarea></td>
                            </tr>
                            <tr>
                                <td><strong>Last Audit Date</strong></td>
                                <td><input type="date" name="mfg-last-audit-${index}"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="manufacturer-controls">
                    <button type="button" class="add-manufacturer-table-btn" title="Add Manufacturer">+</button>
                    <button type="button" class="remove-manufacturer-btn" title="Remove Manufacturer">-</button>
                </div>
            </div>
        `;
    },

    addManufacturerTable() {
        const container = document.getElementById('manufacturers-display-container');
        this.manufacturerCounter++;
        this.totalVendors++;
        
        const newTableHtml = this.createManufacturerTable(this.manufacturerCounter);
        container.insertAdjacentHTML('beforeend', newTableHtml);
        
        this.updateRemoveButtonVisibility();
        this.updatePaginationControls();
        this.applyPagination();
    },

    removeManufacturer(button) {
        const tableContainer = button.closest('.manufacturer-table-container');
        if (tableContainer) {
            tableContainer.remove();
            this.totalVendors--;
            this.updateRemoveButtonVisibility();
            this.updatePaginationControls();
            this.applyPagination();
        }
    },

    setupPaginationControls() {
        const vendorsPerPageSelect = document.getElementById('vendors-per-page-select');
        if (vendorsPerPageSelect) {
            vendorsPerPageSelect.addEventListener('change', () => this.changeVendorsPerPage());
        }
    },

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.applyPagination();
            this.updatePaginationControls();
        }
    },

    nextPage() {
        const totalPages = this.getTotalPages();
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.applyPagination();
            this.updatePaginationControls();
        }
    },

    changeVendorsPerPage() {
        const select = document.getElementById('vendors-per-page-select');
        this.vendorsPerPage = select.value === 'all' ? 'all' : parseInt(select.value);
        this.currentPage = 1;
        this.applyPagination();
        this.updatePaginationControls();
    },

    getTotalPages() {
        if (this.vendorsPerPage === 'all') return 1;
        return Math.ceil(this.totalVendors / this.vendorsPerPage);
    },

    applyPagination() {
        const container = document.getElementById('manufacturers-display-container');
        if (!container) return;

        const tables = container.querySelectorAll('.manufacturer-table-container');
        
        if (this.vendorsPerPage === 'all') {
            // Show all tables
            tables.forEach(table => {
                table.style.display = 'block';
            });
        } else {
            // Calculate which tables to show
            const startIndex = (this.currentPage - 1) * this.vendorsPerPage;
            const endIndex = startIndex + this.vendorsPerPage;

            tables.forEach((table, index) => {
                if (index >= startIndex && index < endIndex) {
                    table.style.display = 'block';
                } else {
                    table.style.display = 'none';
                }
            });
        }
    },

    updatePaginationControls() {
        const prevBtn = document.getElementById('prev-vendors-btn');
        const nextBtn = document.getElementById('next-vendors-btn');
        const statusSpan = document.getElementById('pagination-status');

        if (!prevBtn || !nextBtn || !statusSpan) return;

        const totalPages = this.getTotalPages();
        
        // Update button states
        prevBtn.disabled = this.currentPage <= 1;
        nextBtn.disabled = this.currentPage >= totalPages;
        
        // Update status text
        if (this.vendorsPerPage === 'all') {
            statusSpan.textContent = `Showing all ${this.totalVendors} vendors`;
        } else {
            const startVendor = (this.currentPage - 1) * this.vendorsPerPage + 1;
            const endVendor = Math.min(this.currentPage * this.vendorsPerPage, this.totalVendors);
            statusSpan.textContent = `Page ${this.currentPage} of ${totalPages} (${startVendor}-${endVendor} of ${this.totalVendors})`;
        }
    },

    updateRemoveButtonVisibility() {
        const container = document.getElementById('manufacturers-display-container');
        const tableContainers = container.querySelectorAll('.manufacturer-table-container');
        
        tableContainers.forEach((tableContainer, index) => {
            const removeBtn = tableContainer.querySelector('.remove-manufacturer-btn');
            if (removeBtn) {
                removeBtn.style.display = index === 0 ? 'none' : 'inline-block';
            }
        });
    },

    importFromCSV() {
        const fileInput = document.getElementById('manufacturers-csv-input');
        fileInput.click();
        
        fileInput.onchange = (event) => {
            const file = event.target.files[0];
            if (file && file.type === 'text/csv') {
                this.processCSVFile(file);
            } else {
                alert('Please select a valid CSV file.');
            }
            fileInput.value = '';
        };
    },

    processCSVFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csv = e.target.result;
                const lines = csv.split('\n');
                
                if (lines.length < 2) {
                    alert('CSV file must contain at least a header row and one data row.');
                    return;
                }

                // Parse header
                const header = lines[0].split(',').map(col => col.trim().toLowerCase());
                
                // Clear existing manufacturers except the first one
                const container = document.getElementById('manufacturers-display-container');
                const existingTables = container.querySelectorAll('.manufacturer-table-container');
                for (let i = 1; i < existingTables.length; i++) {
                    existingTables[i].remove();
                }

                // Reset counter
                this.manufacturerCounter = 0;
                this.totalVendors = 0;

                // Parse data rows
                for (let i = 1; i < lines.length; i++) {
                    const row = lines[i].split(',').map(col => col.trim());
                    if (row.length < 2) continue; // Skip empty rows

                    this.manufacturerCounter++;
                    this.totalVendors++;
                    
                    if (this.manufacturerCounter === 1) {
                        // Use the existing first table
                        this.populateManufacturerData(1, header, row);
                    } else {
                        // Create new table
                        const newTableHtml = this.createManufacturerTable(this.manufacturerCounter);
                        container.insertAdjacentHTML('beforeend', newTableHtml);
                        this.populateManufacturerData(this.manufacturerCounter, header, row);
                    }
                }

                this.currentPage = 1;
                this.updateRemoveButtonVisibility();
                this.updatePaginationControls();
                this.applyPagination();
                alert(`Successfully imported ${this.manufacturerCounter} manufacturers from CSV.`);
                
            } catch (error) {
                console.error('Error parsing CSV:', error);
                alert('Error parsing CSV file. Please check the file format.');
            }
        };
        
        reader.readAsText(file);
    },

    populateManufacturerData(index, header, row) {
        const fieldMapping = {
            'manufacturer': `mfg-name-${index}`,
            'manufacturer alt name 1': `mfg-alt-name1-${index}`,
            'manufacturer alt name 2': `mfg-alt-name2-${index}`,
            'material group': `mfg-material-group-${index}`,
            'material description': `mfg-material-desc-${index}`,
            'mfg approval status': `mfg-approval-status-${index}`,
            'region': `mfg-region-${index}`,
            'company': `mfg-company-${index}`,
            'brand': `mfg-brand-${index}`,
            'facility': `mfg-facility-${index}`,
            'country': `mfg-country-${index}`,
            'location': `mfg-location-${index}`,
            'capabilities': `mfg-capabilities-${index}`,
            'last audit date': `mfg-last-audit-${index}`
        };

        header.forEach((columnName, columnIndex) => {
            const fieldName = fieldMapping[columnName];
            if (fieldName && row[columnIndex]) {
                const field = document.querySelector(`[name="${fieldName}"]`);
                if (field) {
                    field.value = row[columnIndex];
                }
            }
        });
    },

    exportToCSV() {
        const container = document.getElementById('manufacturers-display-container');
        const tableContainers = container.querySelectorAll('.manufacturer-table-container');
        
        if (tableContainers.length === 0) {
            alert('No manufacturer data to export.');
            return;
        }

        // CSV header
        const csvData = [];
        const header = [
            'Manufacturer', 'Manufacturer Alt Name 1', 'Manufacturer Alt Name 2', 
            'Material Group', 'Material Description', 'MFG Approval Status',
            'Region', 'Company', 'Brand', 'Facility', 'Country', 'Location',
            'Capabilities', 'Last Audit Date'
        ];
        csvData.push(header.join(','));

        // Export data for each manufacturer
        tableContainers.forEach((container, index) => {
            const manufacturerIndex = index + 1;
            const row = [
                this.getFieldValue(`mfg-name-${manufacturerIndex}`),
                this.getFieldValue(`mfg-alt-name1-${manufacturerIndex}`),
                this.getFieldValue(`mfg-alt-name2-${manufacturerIndex}`),
                this.getFieldValue(`mfg-material-group-${manufacturerIndex}`),
                this.getFieldValue(`mfg-material-desc-${manufacturerIndex}`),
                this.getFieldValue(`mfg-approval-status-${manufacturerIndex}`),
                this.getFieldValue(`mfg-region-${manufacturerIndex}`),
                this.getFieldValue(`mfg-company-${manufacturerIndex}`),
                this.getFieldValue(`mfg-brand-${manufacturerIndex}`),
                this.getFieldValue(`mfg-facility-${manufacturerIndex}`),
                this.getFieldValue(`mfg-country-${manufacturerIndex}`),
                this.getFieldValue(`mfg-location-${manufacturerIndex}`),
                this.getFieldValue(`mfg-capabilities-${manufacturerIndex}`),
                this.getFieldValue(`mfg-last-audit-${manufacturerIndex}`)
            ];
            csvData.push(row.map(value => `"${value.replace(/"/g, '""')}"`).join(','));
        });

        // Create blob and use download manager
        const csvContent = csvData.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const defaultFilename = `approved_manufacturers_${new Date().toISOString().split('T')[0]}.csv`;
        
        if (window.showDownloadManager) {
            window.showDownloadManager(blob, defaultFilename, 'csv');
        } else {
            // Fallback to direct download
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', defaultFilename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    },

    getFieldValue(fieldName) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        return field ? field.value || '' : '';
    }
};