// Table template generators for the inspection form
import { InspectionResultsData } from './inspectionResultsData.js';

export const TableTemplates = {
    
    createTimeBreakdownTable() {
        return `
            <table class="time-breakdown-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>M</th>
                        <th>T</th>
                        <th>W</th>
                        <th>TH</th>
                        <th>F</th>
                        <th>Partial Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr data-row-type="time">
                        <td>Inspection Time</td>
                        <td><input type="number" value="0" min="0" class="daily-input" data-day="m" data-row="inspection"></td>
                        <td><input type="number" value="0" min="0" class="daily-input" data-day="t" data-row="inspection"></td>
                        <td><input type="number" value="0" min="0" class="daily-input" data-day="w" data-row="inspection"></td>
                        <td><input type="number" value="0" min="0" class="daily-input" data-day="th" data-row="inspection"></td>
                        <td><input type="number" value="0" min="0" class="daily-input" data-day="f" data-row="inspection"></td>
                        <td><span class="partial-total" data-row="inspection">0</span> Hours</td>
                    </tr>
                     <tr data-row-type="time">
                        <td>Reporting Time</td>
                        <td><input type="number" value="0" min="0" class="daily-input" data-day="m" data-row="reporting"></td>
                        <td><input type="number" value="0" min="0" class="daily-input" data-day="t" data-row="reporting"></td>
                        <td><input type="number" value="0" min="0" class="daily-input" data-day="w" data-row="reporting"></td>
                        <td><input type="number" value="0" min="0" class="daily-input" data-day="th" data-row="reporting"></td>
                        <td><input type="number" value="0" min="0" class="daily-input" data-day="f" data-row="reporting"></td>
                        <td><span class="partial-total" data-row="reporting">0</span> Hours</td>
                    </tr>
                     <tr data-row-type="time">
                        <td>Travel Time</td>
                        <td><input type="number" value="0" min="0" class="daily-input" data-day="m" data-row="travel-time"></td>
                        <td><input type="number" value="0" min="0" class="daily-input" data-day="t" data-row="travel-time"></td>
                        <td><input type="number" value="0" min="0" class="daily-input" data-day="w" data-row="travel-time"></td>
                        <td><input type="number" value="0" min="0" class="daily-input" data-day="th" data-row="travel-time"></td>
                        <td><input type="number" value="0" min="0" class="daily-input" data-day="f" data-row="travel-time"></td>
                        <td><span class="partial-total" data-row="travel-time">0</span> Hours</td>
                    </tr>
                     <tr data-row-type="km">
                        <td>Travel Km</td>
                        <td><input type="number" value="0" min="0" class="daily-input" data-day="m" data-row="travel-km"></td>
                        <td><input type="number" value="0" min="0" class="daily-input" data-day="t" data-row="travel-km"></td>
                        <td><input type="number" value="0" min="0" class="daily-input" data-day="w" data-row="travel-km"></td>
                        <td><input type="number" value="0" min="0" class="daily-input" data-day="th" data-row="travel-km"></td>
                        <td><input type="number" value="0" min="0" class="daily-input" data-day="f" data-row="travel-km"></td>
                        <td><span class="partial-total" data-row="travel-km">0</span> Km</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="6">Weekly Total Time</td>
                        <td><span id="weekly-total-time">0</span> Hours</td>
                    </tr>
                    <tr>
                        <td colspan="6">Weekly Total Km</td>
                        <td><span id="weekly-total-km">0</span> Km</td>
                    </tr>
                </tfoot>
            </table>
        `;
    },

    createContactTable() {
        let html = `
            <table class="contact-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Affiliation</th>
                        <th>Position</th>
                        <th>Tel.</th>
                        <th>e-mail</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        // Changed from 20 to 10 rows
        for (let i = 1; i <= 10; i++) {
            html += `
                <tr>
                    <td><input type="text" name="contact-name-${i}"></td>
                    <td><input type="text" name="contact-affiliation-${i}"></td>
                    <td><input type="text" name="contact-position-${i}"></td>
                    <td><input type="text" name="contact-tel-${i}"></td>
                    <td><input type="text" name="contact-email-${i}"></td>
                </tr>
            `;
        }
        
        html += `
                </tbody>
            </table>
        `;
        
        return html;
    },

    createItemDetailsTable() {
        let html = `
            <table class="item-details-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>PO N°</th>
                        <th>Supplier job</th>
                        <th>Item N°</th>
                        <th>MESC/TAG</th>
                        <th>Description<br>(Size, description, material, class...)</th>
                        <th>Order Q.ty</th>
                        <th>Inspt. Q.ty</th>
                        <th>Heat N°/Code N°</th>
                        <th>Body/Bonnet/Closure</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        for (let i = 1; i <= 30; i++) {
            html += `
                <tr class="${i > 10 ? 'additional-item hidden' : ''}">
                    <td>Item ${i}</td>
                    <td><input type="text" name="item-po-${i}"></td>
                    <td><input type="text" name="item-supplier-job-${i}"></td>
                    <td><input type="text" name="item-number-${i}"></td>
                    <td><input type="text" name="item-mesc-tag-${i}"></td>
                    <td><input type="text" name="item-description-${i}" placeholder="Size, description, material, class..."></td>
                    <td><input type="number" name="item-order-qty-${i}" min="0"></td>
                    <td><input type="number" name="item-inspt-qty-${i}" min="0"></td>
                    <td><input type="text" name="item-heat-code-${i}"></td>
                    <td><input type="text" name="item-body-bonnet-closure-${i}"></td>
                </tr>
            `;
        }
        
        html += `
                </tbody>
            </table>
            <div class="table-controls">
                <button type="button" id="toggle-additional-items" class="table-control-btn">
                    Show Additional Items (11-30)
                </button>
            </div>
        `;
        
        return html;
    },

    createInspectionResultsTable() {
        const results = InspectionResultsData.getResultsData();
        const halfLength = Math.ceil(results.length / 2);
        const firstHalf = results.slice(0, halfLength);
        const secondHalf = results.slice(halfLength);

        let html = `
            <div class="inspection-results-tables-container">
                <div class="inspection-results-table-left">
                    <table class="inspection-results-table">
                        <thead>
                            <tr>
                                <th>Tick x</th>
                                <th>Description</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        firstHalf.forEach((result, index) => {
            html += `
                <tr>
                    <td><input type="checkbox" name="${result.name}"></td>
                    <td>${result.desc}</td>
                    <td><input type="text" name="insp-notes-${index + 1}"></td>
                </tr>
            `;
        });
        
        html += `
                        </tbody>
                    </table>
                </div>
                
                <div class="inspection-results-table-right">
                    <table class="inspection-results-table">
                        <thead>
                            <tr>
                                <th>Tick x</th>
                                <th>Description</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        secondHalf.forEach((result, index) => {
            html += `
                <tr>
                    <td><input type="checkbox" name="${result.name}"></td>
                    <td>${result.desc}</td>
                    <td><input type="text" name="insp-notes-${halfLength + index + 1}"></td>
                </tr>
            `;
        });
        
        html += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        return html;
    },

    createCalibrationTable() {
        let html = `
            <table class="calibration-table">
                <thead>
                    <tr>
                        <th>Parameter</th>
                        <th>Serial N°</th>
                        <th>Cal. Value</th>
                        <th>Accepted Value</th>
                        <th>Certificate N°</th>
                        <th>Next Cal. Due</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        for (let i = 1; i <= 30; i++) {
            html += `
                <tr class="${i > 10 ? 'additional-item hidden' : ''}">
                    <td><input type="text" name="cal-param-${i}"></td>
                    <td><input type="text" name="cal-serial-${i}"></td>
                    <td><input type="text" name="cal-calvalue-${i}"></td>
                    <td><input type="text" name="cal-acceptedvalue-${i}"></td>
                    <td><input type="text" name="cal-certno-${i}"></td>
                    <td><input type="text" name="cal-nextdue-${i}"></td>
                </tr>
            `;
        }
        
        html += `
                </tbody>
            </table>
            <div class="table-controls">
                <button type="button" id="toggle-additional-calibration" class="table-control-btn">
                    Show Additional Calibration Rows (11-30)
                </button>
            </div>
        `;
        
        return html;
    },

    createDocumentReferenceTable() {
        const standardDocs = [
            /* ...existing standard docs array... */
        ];

        let html = `
            <table class="document-table">
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>Document N° / Date</th>
                        <th>Title</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        // Add standard documents
        standardDocs.forEach(doc => {
            html += `
                <tr>
                    <td><input type="checkbox" name="${doc.id}"></td>
                    <td>${doc.number}</td>
                    <td>${doc.title}</td>
                </tr>
            `;
        });
        
        // Add first custom document row
        html += `
            <tr>
                <td><input type="checkbox" name="custom-doc-select-1"></td>
                <td><input type="text" name="custom-doc-number-date-1" placeholder="Enter Document N° / Date"></td>
                <td><input type="text" name="custom-doc-title-1" placeholder="Enter Title"></td>
            </tr>
        `;

        // Add remaining 19 custom document rows (hidden by default)
        for (let i = 2; i <= 20; i++) {
            html += `
                <tr class="additional-item hidden">
                    <td><input type="checkbox" name="custom-doc-select-${i}"></td>
                    <td><input type="text" name="custom-doc-number-date-${i}" placeholder="Enter Document N° / Date"></td>
                    <td><input type="text" name="custom-doc-title-${i}" placeholder="Enter Title"></td>
                </tr>
            `;
        }
        
        html += `
                </tbody>
            </table>
            <div class="table-controls">
                <button type="button" id="toggle-additional-docs" class="table-control-btn">
                    Show Additional Document Rows (2-20)
                </button>
            </div>
        `;
        
        return html;
    }
};