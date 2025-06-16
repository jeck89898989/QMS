// Document reference and additional document table templates
export const DocumentTables = {
    
    createDocumentReferenceTable() {
        const standardDocs = [
            { id: "doc-ref-77-200", number: "77-200 2020", title: "Valves in Low Temperature and Cryogenic Services" },
            { id: "doc-ref-77-302", number: "77-302 2020", title: "Valves General Requirements" },
            { id: "doc-ref-77-303", number: "77-303 2020", title: "Valves in Special Service" },
            { id: "doc-ref-77-312", number: "77-312 2020", title: "Fugitive Emission Production Testing" },
            { id: "doc-ref-77-101", number: "77-101 2020", title: "Technical Spec Gate Globe and Check Valves" },
            { id: "doc-ref-77-110", number: "77-110 2019", title: "Technical Spec Ball Valves" },
            { id: "doc-ref-api-6d", number: "API 6D - 2021", title: "Specification for Pipeline Valves" },
            { id: "doc-ref-api-6a", number: "API 6A - 2018", title: "Specification for Wellhead and Tree Equipment" },
            { id: "doc-ref-api-602", number: "API 602 - 2022", title: "Gate, Globe & Check Valves Size DN100 (NPS 4) and smaller" },
            { id: "doc-ref-api-598", number: "API 598 - 2023", title: "Valve Inspection and Testing" },
            { id: "doc-ref-api-607", number: "API 607 - 2022", title: "Fire Test for Quarter-turn Valves and Valves Non-metallic Seats" },
            { id: "doc-ref-ped", number: "PED 2014-68-UE", title: "Pressure Equipment Directive UE" },
            { id: "doc-ref-nace", number: "NACE MR075", title: "Materials for Valves for Resistance to Sulfide Stress Cracking" },
            { id: "doc-ref-en-iso-15761", number: "EN ISO 15761", title: "Steel Gate, Globe & Check Valves for Sizes DN 100 and Smaller" },
            { id: "doc-ref-en-iso-17292", number: "EN ISO 17292", title: "Metal Ball Valves for Petroleum, Petrochemical and Allied Industries" },
            { id: "doc-ref-en-iso-5208", number: "EN ISO 5208", title: "Industrial Valves - Pressure Testing of Metallic Valves" },
            { id: "doc-ref-iogp-s563", number: "IOGP S-563 12/2021", title: "MDS" },
            { id: "doc-ref-asme-b1634", number: "ASME B 16.34", title: "Valves-Flanged, Threaded and Welding End." },
            { id: "doc-ref-asme-b165", number: "ASME B 16.5", title: "Pipe Flanges and Flanged Fittings ½\" till 24\"." }
        ];

        let html = `
            <div class="document-tables-container">
                <div class="standard-documents-table">
                    <h4>Standard Documents</h4>
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
        
        html += `
                        </tbody>
                    </table>
                </div>
                
                <div class="custom-documents-table">
                    <h4>Custom Documents</h4>
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
                </div>
            </div>
        `;
        
        return html;
    },

    createAdditionalDocsTable() {
        return `
            <table class="additional-docs-table">
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>Document</th>
                        <th>Title</th>
                        <th>Approval Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input type="checkbox" name="add-doc-drawing-select"></td>
                        <td>General Assembled Drawings</td>
                        <td><input type="text" name="add-doc-drawing-title"></td>
                        <td><input type="text" name="add-doc-drawing-status"></td>
                    </tr>
                    <tr>
                        <td><input type="checkbox" name="add-doc-pressuretest-select"></td>
                        <td>Pressure Test Procedure</td>
                        <td><input type="text" name="add-doc-pressuretest-title"></td>
                        <td><input type="text" name="add-doc-pressuretest-status"></td>
                    </tr>
                    <tr>
                        <td><input type="checkbox" name="add-doc-fet-select"></td>
                        <td>Fugitive Emission Test Procedure - SPE 77/312</td>
                        <td><input type="text" name="add-doc-fet-title"></td>
                        <td><input type="text" name="add-doc-fet-status"></td>
                    </tr>
                    <tr>
                        <td><input type="checkbox" name="add-doc-lowtemp-select"></td>
                        <td>Low Temperature Procedure - SPE 77/200</td>
                        <td><input type="text" name="add-doc-lowtemp-title"></td>
                        <td><input type="text" name="add-doc-lowtemp-status"></td>
                    </tr>
                </tbody>
            </table>
        `;
    }
};