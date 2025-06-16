// Valve visual and dimensions inspection table
export const ValvesVisualDimensionsTable = {
    
    createVisualDimensionsSection() {
        return `
            <tr class="section-header">
                <td colspan="5">Visual / Dimensions</td>
            </tr>
             <tr>
                <td>Face to Face</td>
                <td><input type="checkbox" name="valves-visdim-facetoface-pass"></td>
                <td><input type="checkbox" name="valves-visdim-facetoface-fail"></td>
                <td><input type="checkbox" name="valves-visdim-facetoface-na"></td>
                <td>B16.10</td>
            </tr>
             <tr>
                <td>Joint Type</td>
                <td><input type="checkbox" name="valves-visdim-joint-pass"></td>
                <td><input type="checkbox" name="valves-visdim-joint-fail"></td>
                <td><input type="checkbox" name="valves-visdim-joint-na"></td>
                <td>MESC / MRC Global PO</td>
            </tr>
             <tr>
                <td>Raised Face / RTJ Correct Diameter</td>
                <td><input type="checkbox" name="valves-visdim-diameter-pass"></td>
                <td><input type="checkbox" name="valves-visdim-diameter-fail"></td>
                <td><input type="checkbox" name="valves-visdim-diameter-na"></td>
                <td>MESC / MRC Global PO / Ring (R) gauges</td>
            </tr>
             <tr>
                <td>Surface Condition</td>
                <td><input type="checkbox" name="valves-visdim-surface-pass"></td>
                <td><input type="checkbox" name="valves-visdim-surface-fail"></td>
                <td><input type="checkbox" name="valves-visdim-surface-na"></td>
                <td>Visual only</td>
            </tr>
             <tr>
                <td>Internal Cleanliness</td>
                <td><input type="checkbox" name="valves-visdim-cleanliness-pass"></td>
                <td><input type="checkbox" name="valves-visdim-cleanliness-fail"></td>
                <td><input type="checkbox" name="valves-visdim-cleanliness-na"></td>
                <td>Visual only</td>
            </tr>
             <tr>
                <td>Operational Check (if safe and possible)</td>
                <td><input type="checkbox" name="valves-visdim-operational-pass"></td>
                <td><input type="checkbox" name="valves-visdim-operational-fail"></td>
                <td><input type="checkbox" name="valves-visdim-operational-na"></td>
                <td>Visual only</td>
            </tr>
             <tr>
                <td>Number of Bolt Holes</td>
                <td><input type="checkbox" name="valves-visdim-boltholes-num-pass"></td>
                <td><input type="checkbox" name="valves-visdim-boltholes-num-fail"></td>
                <td><input type="checkbox" name="valves-visdim-boltholes-num-na"></td>
                <td>B16.5 Flanged fittings</td>
            </tr>
             <tr>
                <td>Bolt Hole Diameter</td>
                <td><input type="checkbox" name="valves-visdim-boltholes-dia-pass"></td>
                <td><input type="checkbox" name="valves-visdim-boltholes-dia-fail"></td>
                <td><input type="checkbox" name="valves-visdim-boltholes-dia-na"></td>
                <td>B16.5 Flanged fittings</td>
            </tr>
             <tr>
                <td>Bolt Hole PCD</td>
                <td><input type="checkbox" name="valves-visdim-boltholes-pcd-pass"></td>
                <td><input type="checkbox" name="valves-visdim-boltholes-pcd-fail"></td>
                <td><input type="checkbox" name="valves-visdim-boltholes-pcd-na"></td>
                <td>B16.5 Flanged fittings</td>
            </tr>
             <tr>
                <td>Bolt Hole Alignment (end to end / 2 or 3 piece valves)</td>
                <td><input type="checkbox" name="valves-visdim-boltholes-align-pass"></td>
                <td><input type="checkbox" name="valves-visdim-boltholes-align-fail"></td>
                <td><input type="checkbox" name="valves-visdim-boltholes-align-na"></td>
                <td>Visual only</td>
            </tr>
             <tr>
                <td>Flange Diameter</td>
                <td><input type="checkbox" name="valves-visdim-flange-dia-pass"></td>
                <td><input type="checkbox" name="valves-visdim-flange-dia-fail"></td>
                <td><input type="checkbox" name="valves-visdim-flange-dia-na"></td>
                <td>B16.5 Flanged fittings</td>
            </tr>
             <tr>
                <td>Flange Thickness</td>
                <td><input type="checkbox" name="valves-visdim-flange-thick-pass"></td>
                <td><input type="checkbox" name="valves-visdim-flange-thick-fail"></td>
                <td><input type="checkbox" name="valves-visdim-flange-thick-na"></td>
                <td>B16.5 Flanged fittings</td>
            </tr>
             <tr>
                <td>Bolt Markings</td>
                <td><input type="checkbox" name="valves-visdim-bolt-markings-pass"></td>
                <td><input type="checkbox" name="valves-visdim-bolt-markings-fail"></td>
                <td><input type="checkbox" name="valves-visdim-bolt-markings-na"></td>
                <td>MESC / Certs comparison</td>
            </tr>
             <tr>
                <td>Mounting Pad PCD / suitable for actuation</td>
                <td><input type="checkbox" name="valves-visdim-mountpad-pass"></td>
                <td><input type="checkbox" name="valves-visdim-mountpad-fail"></td>
                <td><input type="checkbox" name="valves-visdim-mountpad-na"></td>
                <td>Validate against mating piece, or drawing</td>
            </tr>
             <tr>
                <td>Suitable Flange Protection Provided</td>
                <td><input type="checkbox" name="valves-visdim-flange-prot-pass"></td>
                <td><input type="checkbox" name="valves-visdim-flange-prot-fail"></td>
                <td><input type="checkbox" name="valves-visdim-flange-prot-na"></td>
                <td>Visual only</td>
            </tr>
        `;
    }
};