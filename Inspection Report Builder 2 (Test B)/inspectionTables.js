// Inspection table templates for different product types
export const InspectionTables = {
    
    createActuatorInspectionTable() {
        return `
            <table class="inspection-table five-col">
                <thead>
                    <tr>
                        <th>Actuator</th>
                        <th>Pass</th>
                        <th>Fail</th>
                        <th>N/A</th>
                        <th>Guidance</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="section-header">
                        <td colspan="5">General Checks</td>
                    </tr>
                    <tr>
                        <td>Quantity</td>
                        <td><input type="checkbox" name="actuator-gen-qty-pass"></td>
                        <td><input type="checkbox" name="actuator-gen-qty-fail"></td>
                        <td><input type="checkbox" name="actuator-gen-qty-na"></td>
                        <td>MRC Global PO</td>
                    </tr>
                    <tr>
                        <td>Actuator Type Correct</td>
                        <td><input type="checkbox" name="actuator-gen-type-pass"></td>
                        <td><input type="checkbox" name="actuator-gen-type-fail"></td>
                        <td><input type="checkbox" name="actuator-gen-type-na"></td>
                        <td>MESC / MRC Global PO</td>
                    </tr>
                    <tr>
                        <td>Visual Inspection</td>
                        <td><input type="checkbox" name="actuator-gen-visual-pass"></td>
                        <td><input type="checkbox" name="actuator-gen-visual-fail"></td>
                        <td><input type="checkbox" name="actuator-gen-visual-na"></td>
                        <td>Visual only</td>
                    </tr>
                </tbody>
            </table>
        `;
    },

    createAncillariesInspectionTable() {
        return `
            <table class="inspection-table five-col">
                <thead>
                    <tr>
                        <th>Ancillaries</th>
                        <th>Pass</th>
                        <th>Fail</th>
                        <th>N/A</th>
                        <th>Guidance</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="section-header">
                        <td colspan="5">General Checks</td>
                    </tr>
                    <tr>
                        <td>Quantity</td>
                        <td><input type="checkbox" name="ancillaries-gen-qty-pass"></td>
                        <td><input type="checkbox" name="ancillaries-gen-qty-fail"></td>
                        <td><input type="checkbox" name="ancillaries-gen-qty-na"></td>
                        <td>MRC Global PO</td>
                    </tr>
                    <tr>
                        <td>Type Correct</td>
                        <td><input type="checkbox" name="ancillaries-gen-type-pass"></td>
                        <td><input type="checkbox" name="ancillaries-gen-type-fail"></td>
                        <td><input type="checkbox" name="ancillaries-gen-type-na"></td>
                        <td>MESC / MRC Global PO</td>
                    </tr>
                </tbody>
            </table>
        `;
    },

    createSpoolsInspectionTable() {
        return `
            <table class="inspection-table five-col">
                <thead>
                    <tr>
                        <th>Spools / Framework</th>
                        <th>Pass</th>
                        <th>Fail</th>
                        <th>N/A</th>
                        <th>Guidance</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="section-header">
                        <td colspan="5">General Checks</td>
                    </tr>
                    <tr>
                        <td>Quantity</td>
                        <td><input type="checkbox" name="spools-gen-qty-pass"></td>
                        <td><input type="checkbox" name="spools-gen-qty-fail"></td>
                        <td><input type="checkbox" name="spools-gen-qty-na"></td>
                        <td>MRC Global PO</td>
                    </tr>
                    <tr>
                        <td>Dimensions Correct</td>
                        <td><input type="checkbox" name="spools-gen-dimensions-pass"></td>
                        <td><input type="checkbox" name="spools-gen-dimensions-fail"></td>
                        <td><input type="checkbox" name="spools-gen-dimensions-na"></td>
                        <td>Drawing comparison</td>
                    </tr>
                </tbody>
            </table>
        `;
    },

    createGasProductsInspectionTable() {
        return `
            <table class="inspection-table five-col">
                <thead>
                    <tr>
                        <th>Gas Products</th>
                        <th>Pass</th>
                        <th>Fail</th>
                        <th>N/A</th>
                        <th>Guidance</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="section-header">
                        <td colspan="5">General Checks</td>
                    </tr>
                    <tr>
                        <td>Quantity</td>
                        <td><input type="checkbox" name="gas-gen-qty-pass"></td>
                        <td><input type="checkbox" name="gas-gen-qty-fail"></td>
                        <td><input type="checkbox" name="gas-gen-qty-na"></td>
                        <td>MRC Global PO</td>
                    </tr>
                    <tr>
                        <td>Product Type Correct</td>
                        <td><input type="checkbox" name="gas-gen-type-pass"></td>
                        <td><input type="checkbox" name="gas-gen-type-fail"></td>
                        <td><input type="checkbox" name="gas-gen-type-na"></td>
                        <td>MESC / MRC Global PO</td>
                    </tr>
                </tbody>
            </table>
        `;
    },

    createPipeInspectionTable() {
        return `
            <table class="inspection-table five-col">
                <thead>
                    <tr>
                        <th>Pipe</th>
                        <th>Pass</th>
                        <th>Fail</th>
                        <th>N/A</th>
                        <th>Guidance</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="section-header">
                        <td colspan="5">General Checks</td>
                    </tr>
                    <tr>
                        <td>Quantity</td>
                        <td><input type="checkbox" name="pipe-gen-qty-pass"></td>
                        <td><input type="checkbox" name="pipe-gen-qty-fail"></td>
                        <td><input type="checkbox" name="pipe-gen-qty-na"></td>
                        <td>MRC Global PO</td>
                    </tr>
                    <tr>
                        <td>Size Correct</td>
                        <td><input type="checkbox" name="pipe-gen-size-pass"></td>
                        <td><input type="checkbox" name="pipe-gen-size-fail"></td>
                        <td><input type="checkbox" name="pipe-gen-size-na"></td>
                        <td>MESC / MRC Global PO</td>
                    </tr>
                    <tr>
                        <td>Wall Thickness</td>
                        <td><input type="checkbox" name="pipe-gen-thickness-pass"></td>
                        <td><input type="checkbox" name="pipe-gen-thickness-fail"></td>
                        <td><input type="checkbox" name="pipe-gen-thickness-na"></td>
                        <td>Measurement / Specification</td>
                    </tr>
                </tbody>
            </table>
        `;
    },

    createGaugesFittingsInspectionTable() {
        return `
            <table class="inspection-table five-col">
                <thead>
                    <tr>
                        <th>Gauges, Fittings and Flanges</th>
                        <th>Pass</th>
                        <th>Fail</th>
                        <th>N/A</th>
                        <th>Guidance</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="section-header">
                        <td colspan="5">General Checks</td>
                    </tr>
                    <tr>
                        <td>Quantity</td>
                        <td><input type="checkbox" name="gauges-gen-qty-pass"></td>
                        <td><input type="checkbox" name="gauges-gen-qty-fail"></td>
                        <td><input type="checkbox" name="gauges-gen-qty-na"></td>
                        <td>MRC Global PO</td>
                    </tr>
                    <tr>
                        <td>Type Correct</td>
                        <td><input type="checkbox" name="gauges-gen-type-pass"></td>
                        <td><input type="checkbox" name="gauges-gen-type-fail"></td>
                        <td><input type="checkbox" name="gauges-gen-type-na"></td>
                        <td>MESC / MRC Global PO</td>
                    </tr>
                    <tr>
                        <td>Pressure Rating</td>
                        <td><input type="checkbox" name="gauges-gen-pressure-pass"></td>
                        <td><input type="checkbox" name="gauges-gen-pressure-fail"></td>
                        <td><input type="checkbox" name="gauges-gen-pressure-na"></td>
                        <td>Specification comparison</td>
                    </tr>
                </tbody>
            </table>
        `;
    },

    createGenericVisualInspectionTable() {
        return `
            <table class="inspection-table five-col">
                <thead>
                    <tr>
                        <th>Generic Visual Inspection</th>
                        <th>Pass</th>
                        <th>Fail</th>
                        <th>N/A</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>General Visual Condition</td>
                        <td><input type="checkbox" name="generic-visual-condition-pass"></td>
                        <td><input type="checkbox" name="generic-visual-condition-fail"></td>
                        <td><input type="checkbox" name="generic-visual-condition-na"></td>
                        <td><input type="text" name="generic-visual-condition-notes"></td>
                    </tr>
                    <tr>
                        <td>Surface Finish</td>
                        <td><input type="checkbox" name="generic-surface-finish-pass"></td>
                        <td><input type="checkbox" name="generic-surface-finish-fail"></td>
                        <td><input type="checkbox" name="generic-surface-finish-na"></td>
                        <td><input type="text" name="generic-surface-finish-notes"></td>
                    </tr>
                    <tr>
                        <td>No Damage</td>
                        <td><input type="checkbox" name="generic-no-damage-pass"></td>
                        <td><input type="checkbox" name="generic-no-damage-fail"></td>
                        <td><input type="checkbox" name="generic-no-damage-na"></td>
                        <td><input type="text" name="generic-no-damage-notes"></td>
                    </tr>
                </tbody>
            </table>
        `;
    },

    createOtherVisualInspectionTable() {
        return `
            <table class="inspection-table five-col">
                <thead>
                    <tr>
                        <th>Other Visual Inspection Item</th>
                        <th>Pass</th>
                        <th>Fail</th>
                        <th>N/A</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
        ` + 
        Array.from({length: 10}, (_, i) => `
                    <tr>
                        <td><input type="text" name="other-visual-item-${i+1}" placeholder="Enter inspection item"></td>
                        <td><input type="checkbox" name="other-visual-${i+1}-pass"></td>
                        <td><input type="checkbox" name="other-visual-${i+1}-fail"></td>
                        <td><input type="checkbox" name="other-visual-${i+1}-na"></td>
                        <td><input type="text" name="other-visual-${i+1}-notes"></td>
                    </tr>
        `).join('') + `
                </tbody>
            </table>
        `;
    }
};