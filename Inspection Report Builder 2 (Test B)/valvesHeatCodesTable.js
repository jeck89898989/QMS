// Valve heat codes inspection table
export const ValvesHeatCodesTable = {
    
    createHeatCodesSection() {
        return `
            <tr class="section-header">
                <td colspan="5">Heat Codes</td>
            </tr>
             <tr>
                <td>Heat Codes Visible on Pressure Retaining Parts</td>
                <td><input type="checkbox" name="valves-heat-visible-pass"></td>
                <td><input type="checkbox" name="valves-heat-visible-fail"></td>
                <td><input type="checkbox" name="valves-heat-visible-na"></td>
                <td>Visual only</td>
            </tr>
             <tr>
                <td>Heat Codes Match Certificates</td>
                <td><input type="checkbox" name="valves-heat-match-pass"></td>
                <td><input type="checkbox" name="valves-heat-match-fail"></td>
                <td><input type="checkbox" name="valves-heat-match-na"></td>
                <td>Certs comparison</td>
            </tr>
        `;
    }
};