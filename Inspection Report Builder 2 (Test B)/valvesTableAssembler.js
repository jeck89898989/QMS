// Assembles complete valve inspection table from individual sections
import { ValvesInspectionTable } from './valvesInspectionTable.js';
// Import other valve table sections (coating, heat codes, visual dimensions, documentation)
import { ValvesCoatingTable } from './valvesCoatingTable.js';
import { ValvesHeatCodesTable } from './valvesHeatCodesTable.js';
import { ValvesVisualDimensionsTable } from './valvesVisualDimensionsTable.js';
import { ValvesDocumentationTable } from './valvesDocumentationTable.js';

export const ValvesTableAssembler = {
    
    createCompleteValvesTable() {
        return `
            <table class="inspection-table five-col">
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
                    ${ValvesInspectionTable.createGeneralChecksSection()}
                    ${ValvesInspectionTable.createNamePlateSection()}
                    ${ValvesCoatingTable.createCoatingSystemSection()}
                    ${ValvesHeatCodesTable.createHeatCodesSection()}
                    ${ValvesVisualDimensionsTable.createVisualDimensionsSection()}
                    ${ValvesDocumentationTable.createDocumentationChecksSection()}
                </tbody>
            </table>
        `;
    }
};