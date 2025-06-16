// Valve coating system inspection table
export const ValvesCoatingTable = {
    
    createCoatingSystemSection() {
        return `
            <tr class="section-header">
                <td colspan="5">Coating System</td>
            </tr>
             <tr>
                <td>System Correct (Materials and NDFT)</td>
                <td><input type="checkbox" name="valves-coat-system-pass"></td>
                <td><input type="checkbox" name="valves-coat-system-fail"></td>
                <td><input type="checkbox" name="valves-coat-system-na"></td>
                <td>MRC Global PO / 77/310</td>
            </tr>
             <tr>
                <td>Colour Correct</td>
                <td><input type="checkbox" name="valves-coat-colour-pass"></td>
                <td><input type="checkbox" name="valves-coat-colour-fail"></td>
                <td><input type="checkbox" name="valves-coat-colour-na"></td>
                <td>MRC Global PO</td>
            </tr>
             <tr>
                <td>Coating Condition Acceptable</td>
                <td><input type="checkbox" name="valves-coat-cond-pass"></td>
                <td><input type="checkbox" name="valves-coat-cond-fail"></td>
                <td><input type="checkbox" name="valves-coat-cond-na"></td>
                <td>Visual only</td>
            </tr>
        `;
    }
};