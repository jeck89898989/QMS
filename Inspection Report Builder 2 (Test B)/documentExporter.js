// Document export functionality for DOCX and XLSX formats
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, HeadingLevel, WidthType } from 'docx';
import * as XLSX from 'xlsx';

export const DocumentExporter = {
    
    init() {
        // Initialize document exporter
    },

    async exportToDocx() {
        try {
            const formData = this.collectFormData();
            const doc = this.createDocxDocument(formData);
            
            const blob = await Packer.toBlob(doc);
            const defaultFilename = `inspection_report_${new Date().toISOString().split('T')[0]}.docx`;
            
            // Use the download manager instead of direct download
            if (window.showDownloadManager) {
                window.showDownloadManager(blob, defaultFilename, 'docx');
            } else {
                this.downloadFile(blob, defaultFilename);
            }
        } catch (error) {
            console.error('Error exporting to DOCX:', error);
            alert('Error exporting to DOCX: ' + error.message);
        }
    },

    async exportToXlsx() {
        try {
            const formData = this.collectFormData();
            const workbook = this.createXlsxWorkbook(formData);
            
            const blob = new Blob([XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            
            const defaultFilename = `inspection_report_${new Date().toISOString().split('T')[0]}.xlsx`;
            
            // Use the download manager instead of direct download
            if (window.showDownloadManager) {
                window.showDownloadManager(blob, defaultFilename, 'xlsx');
            } else {
                this.downloadFile(blob, defaultFilename);
            }
        } catch (error) {
            console.error('Error exporting to XLSX:', error);
            alert('Error exporting to XLSX: ' + error.message);
        }
    },

    collectFormData() {
        const formElement = document.getElementById('inspection-form');
        const formData = new FormData(formElement);
        const data = {};
        
        // Collect all form data
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }

        // Collect unchecked checkboxes and radio buttons
        const allInputs = document.querySelectorAll('input, textarea, select');
        allInputs.forEach(input => {
            if (input.type === 'checkbox' || input.type === 'radio') {
                if (!data.hasOwnProperty(input.name)) {
                    data[input.name] = input.checked ? input.value : '';
                }
            }
        });

        // Organize data by sections
        const sections = this.organizeDataBySections(data);
        return sections;
    },

    organizeDataBySections(data) {
        const sections = {};
        const fieldsets = document.querySelectorAll('fieldset[data-section-id]');
        
        fieldsets.forEach(fieldset => {
            const sectionId = fieldset.dataset.sectionId;
            const legend = fieldset.querySelector('legend');
            const sectionTitle = legend ? legend.textContent.trim() : sectionId;
            
            sections[sectionId] = {
                title: sectionTitle,
                fields: {},
                tables: []
            };

            // Collect form fields in this section
            const inputs = fieldset.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                if (input.name && data[input.name]) {
                    sections[sectionId].fields[input.name] = {
                        label: this.getFieldLabel(input),
                        value: data[input.name],
                        type: input.type
                    };
                }
            });

            // Collect table data in this section
            const tables = fieldset.querySelectorAll('table');
            tables.forEach((table, index) => {
                const tableData = this.extractTableData(table);
                if (tableData.rows.length > 0) {
                    sections[sectionId].tables.push(tableData);
                }
            });
        });

        return sections;
    },

    getFieldLabel(input) {
        const label = input.closest('.form-group')?.querySelector('label');
        if (label) {
            return label.textContent.trim().replace(':', '');
        }
        
        const previousLabel = input.previousElementSibling;
        if (previousLabel && previousLabel.tagName === 'LABEL') {
            return previousLabel.textContent.trim().replace(':', '');
        }
        
        return input.name || input.id || 'Unknown Field';
    },

    extractTableData(table) {
        const headers = [];
        const rows = [];
        
        // Extract headers
        const headerRow = table.querySelector('thead tr');
        if (headerRow) {
            headerRow.querySelectorAll('th').forEach(th => {
                headers.push(th.textContent.trim());
            });
        }

        // Extract data rows
        const bodyRows = table.querySelectorAll('tbody tr');
        bodyRows.forEach(row => {
            if (row.classList.contains('section-header')) {
                rows.push({
                    type: 'header',
                    data: [row.textContent.trim()]
                });
            } else {
                const rowData = [];
                row.querySelectorAll('td').forEach(td => {
                    const input = td.querySelector('input, textarea, select');
                    if (input) {
                        if (input.type === 'checkbox') {
                            rowData.push(input.checked ? '✓' : '');
                        } else {
                            rowData.push(input.value || '');
                        }
                    } else {
                        rowData.push(td.textContent.trim());
                    }
                });
                if (rowData.some(cell => cell !== '')) {
                    rows.push({
                        type: 'data',
                        data: rowData
                    });
                }
            }
        });

        return {
            headers,
            rows
        };
    },

    createDocxDocument(sections) {
        const children = [];
        
        // Add title
        children.push(
            new Paragraph({
                text: "Inspection Report Form",
                heading: HeadingLevel.TITLE,
                spacing: { after: 400 }
            })
        );

        // Add export date
        children.push(
            new Paragraph({
                text: `Generated on: ${new Date().toLocaleDateString()}`,
                spacing: { after: 400 }
            })
        );

        // Process each section
        Object.entries(sections).forEach(([sectionId, section]) => {
            // Skip if section is hidden
            const sectionElement = document.querySelector(`fieldset[data-section-id="${sectionId}"]`);
            if (sectionElement && sectionElement.style.display === 'none') {
                return;
            }

            // Section heading
            children.push(
                new Paragraph({
                    text: section.title,
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 400, after: 200 }
                })
            );

            // Add form fields
            Object.entries(section.fields).forEach(([fieldName, field]) => {
                if (field.value && field.value.toString().trim()) {
                    children.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `${field.label}: `,
                                    bold: true
                                }),
                                new TextRun({
                                    text: field.value.toString()
                                })
                            ],
                            spacing: { after: 200 }
                        })
                    );
                }
            });

            // Add tables
            section.tables.forEach(tableData => {
                if (tableData.headers.length > 0) {
                    const tableRows = [];
                    
                    // Add header row
                    if (tableData.headers.length > 0) {
                        tableRows.push(
                            new TableRow({
                                children: tableData.headers.map(header => 
                                    new TableCell({
                                        children: [new Paragraph({ text: header })],
                                        width: { size: 100 / tableData.headers.length, type: WidthType.PERCENTAGE }
                                    })
                                )
                            })
                        );
                    }

                    // Add data rows
                    tableData.rows.forEach(row => {
                        if (row.type === 'header') {
                            tableRows.push(
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [new Paragraph({ 
                                                text: row.data[0],
                                                heading: HeadingLevel.HEADING_3
                                            })],
                                            columnSpan: tableData.headers.length
                                        })
                                    ]
                                })
                            );
                        } else {
                            tableRows.push(
                                new TableRow({
                                    children: row.data.map(cell => 
                                        new TableCell({
                                            children: [new Paragraph({ text: cell.toString() })]
                                        })
                                    )
                                })
                            );
                        }
                    });

                    children.push(
                        new Table({
                            rows: tableRows,
                            width: { size: 100, type: WidthType.PERCENTAGE }
                        })
                    );
                    
                    children.push(new Paragraph({ text: "", spacing: { after: 400 } }));
                }
            });
        });

        return new Document({
            sections: [{
                children: children
            }]
        });
    },

    createXlsxWorkbook(sections) {
        const workbook = XLSX.utils.book_new();
        
        // Create summary sheet
        const summaryData = [
            ['Inspection Report Form'],
            ['Generated on:', new Date().toLocaleDateString()],
            [''],
            ['Section', 'Field Count', 'Table Count']
        ];

        Object.entries(sections).forEach(([sectionId, section]) => {
            const sectionElement = document.querySelector(`fieldset[data-section-id="${sectionId}"]`);
            if (sectionElement && sectionElement.style.display === 'none') {
                return;
            }
            
            summaryData.push([
                section.title,
                Object.keys(section.fields).length,
                section.tables.length
            ]);
        });

        const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

        // Create individual sheets for each section
        Object.entries(sections).forEach(([sectionId, section]) => {
            const sectionElement = document.querySelector(`fieldset[data-section-id="${sectionId}"]`);
            if (sectionElement && sectionElement.style.display === 'none') {
                return;
            }

            const sheetData = [];
            
            // Add section title
            sheetData.push([section.title]);
            sheetData.push([]);

            // Add form fields
            if (Object.keys(section.fields).length > 0) {
                sheetData.push(['Form Fields']);
                sheetData.push(['Field', 'Value']);
                
                Object.entries(section.fields).forEach(([fieldName, field]) => {
                    if (field.value && field.value.toString().trim()) {
                        sheetData.push([field.label, field.value.toString()]);
                    }
                });
                sheetData.push([]);
            }

            // Add tables
            section.tables.forEach((tableData, index) => {
                if (tableData.headers.length > 0) {
                    sheetData.push([`Table ${index + 1}`]);
                    sheetData.push(tableData.headers);
                    
                    tableData.rows.forEach(row => {
                        if (row.type === 'header') {
                            sheetData.push([row.data[0]]);
                        } else {
                            sheetData.push(row.data);
                        }
                    });
                    sheetData.push([]);
                }
            });

            const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
            const sheetName = section.title.replace(/[^\w\s]/gi, '').substring(0, 31);
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        });

        return workbook;
    },

    downloadFile(blob, filename) {
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
};