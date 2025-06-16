// Dedicated module for valve inspection table template
export const ValvesInspectionTable = {
    
    createValvesInspectionTable() {
        return `
            <table class="inspection-table">
                <thead>
                    <tr>
                        <th>Valves</th>
                        <th>Pass</th>
                        <th>Fail</th>
                        <th>N/A</th>
                        <th>Guidance</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.createGeneralChecksSection()}
                    ${this.createNamePlateSection()}
                </tbody>
            </table>
        `;
    },

    createGeneralChecksSection() {
        return `
            <tr class="section-header">
                <td colspan="5">General Checks</td>
            </tr>
            <tr>
                <td>Quantity</td>
                <td><input type="checkbox" name="valves-gen-qty-pass"></td>
                <td><input type="checkbox" name="valves-gen-qty-fail"></td>
                <td><input type="checkbox" name="valves-gen-qty-na"></td>
                <td>MRC Global PO</td>
            </tr>
             <tr>
                <td>Valve Size Correct</td>
                <td><input type="checkbox" name="valves-gen-size-pass"></td>
                <td><input type="checkbox" name="valves-gen-size-fail"></td>
                <td><input type="checkbox" name="valves-gen-size-na"></td>
                <td>MESC / MRC Global PO</td>
            </tr>
             <tr>
                <td>Valve Class Correct</td>
                <td><input type="checkbox" name="valves-gen-class-pass"></td>
                <td><input type="checkbox" name="valves-gen-class-fail"></td>
                <td><input type="checkbox" name="valves-gen-class-na"></td>
                <td>MESC / MRC Global PO</td>
            </tr>
             <tr>
                <td>Valve Type Correct</td>
                <td><input type="checkbox" name="valves-gen-type-pass"></td>
                <td><input type="checkbox" name="valves-gen-type-fail"></td>
                <td><input type="checkbox" name="valves-gen-type-na"></td>
                <td>MESC / MRC Global PO</td>
            </tr>
             <tr>
                <td>MESC Number Correct</td>
                <td><input type="checkbox" name="valves-gen-mesc-pass"></td>
                <td><input type="checkbox" name="valves-gen-mesc-fail"></td>
                <td><input type="checkbox" name="valves-gen-mesc-na"></td>
                <td>MESC / MRC Global PO</td>
            </tr>
        `;
    },

    createNamePlateSection() {
        return `
            <tr class="section-header">
                <td colspan="5">Name Plate</td>
            </tr>
             <tr>
                <td>Serial Number Matches Certs</td>
                <td><input type="checkbox" name="valves-name-serial-pass"></td>
                <td><input type="checkbox" name="valves-name-serial-fail"></td>
                <td><input type="checkbox" name="valves-name-serial-na"></td>
                <td>Certs comparison</td>
            </tr>
             <tr>
                <td>CE Marking for valves >1"</td>
                <td><input type="checkbox" name="valves-name-ce-pass"></td>
                <td><input type="checkbox" name="valves-name-ce-fail"></td>
                <td><input type="checkbox" name="valves-name-ce-na"></td>
                <td>Visual only</td>
            </tr>
             <tr>
                <td>Part Number Correct</td>
                <td><input type="checkbox" name="valves-name-part-pass"></td>
                <td><input type="checkbox" name="valves-name-part-fail"></td>
                <td><input type="checkbox" name="valves-name-part-na"></td>
                <td>MRC Global PO</td>
            </tr>
             <tr>
                <td>Appropriately / Permanently Attached</td>
                <td><input type="checkbox" name="valves-name-attached-pass"></td>
                <td><input type="checkbox" name="valves-name-attached-fail"></td>
                <td><input type="checkbox" name="valves-name-attached-na"></td>
                <td>Visual only</td>
            </tr>
        `;
    }
};