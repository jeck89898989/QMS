// ISO 9001:2015 audit checklist table templates
export const ISO9001Tables = {
    
    createISO9001AuditTable() {
        const auditItems = [
            {
                clause: "4.1 / 4.2",
                question: "Has the organization determined external and internal issues and the needs/expectations of interested parties relevant to the QMS (linking to Process Approach, RBT)?",
                name: "iso9001-4-context-issues"
            },
            {
                clause: "4.3",
                question: "Is the scope of the QMS defined, documented, and available?",
                name: "iso9001-4-scope"
            },
            {
                clause: "4.4",
                question: "Are the processes needed for the QMS established, implemented, maintained, and continually improved, including their inputs, outputs, sequence, interaction, resources, responsibilities, risks, and performance indicators (Process-Based Approach, PDCA, RBT, Continual Improvement)?",
                name: "iso9001-4-processes"
            },
            {
                clause: "5.1",
                question: "Does top management demonstrate leadership and commitment to the QMS, including promoting the Process-Based Approach, RBT, and Continual Improvement?",
                name: "iso9001-5-leadership-commit"
            },
            {
                clause: "5.2",
                question: "Is a quality policy established, implemented, maintained, communicated, and available to interested parties?",
                name: "iso9001-5-policy"
            },
            {
                clause: "5.3",
                question: "Are organizational roles, responsibilities, and authorities for relevant roles assigned, communicated, and understood?",
                name: "iso9001-5-roles"
            },
            {
                clause: "6.1",
                question: "Has the organization planned actions to address risks and opportunities identified in Clause 4.1 and 4.2, integrated these into QMS processes, and evaluated their effectiveness (Risk-Based Thinking)?",
                name: "iso9001-6-risks-ops"
            },
            {
                clause: "6.2",
                question: "Are quality objectives established for relevant functions, levels, and processes, consistent with the quality policy, measurable, monitored, communicated, and updated? Has planning been done to achieve them (linking to PDCA's Plan)?",
                name: "iso9001-6-objectives"
            },
            {
                clause: "6.3",
                question: "Are changes to the QMS planned systematically (linking to PDCA's Plan)?",
                name: "iso9001-6-changes"
            },
            {
                clause: "7.1",
                question: "Has the organization determined and provided the necessary resources for the QMS (people, infrastructure, environment, monitoring/measuring resources, organizational knowledge)?",
                name: "iso9001-7-resources"
            },
            {
                clause: "7.2 / 7.3",
                question: "Is competence determined, training provided, and the effectiveness evaluated? Are persons doing work under the organization's control aware of the quality policy, objectives, their contribution, and the implications of not conforming?",
                name: "iso9001-7-comp-aware"
            },
            {
                clause: "7.4",
                question: "Are internal and external communications relevant to the QMS planned and controlled?",
                name: "iso9001-7-communication"
            },
            {
                clause: "7.5",
                question: "Is documented information required by ISO 9001 and the QMS maintained and retained? Is it properly controlled for availability, suitability, protection, distribution, access, retrieval, use, storage, preservation, change control, and retention/disposition?",
                name: "iso9001-7-docinfo"
            },
            {
                clause: "8.1",
                question: "Is operational planning and control implemented to meet requirements, considering risks and opportunities, and controlling planned changes? (linking to PDCA's Do)",
                name: "iso9001-8-op-plan"
            },
            {
                clause: "8.2",
                question: "Are requirements for products and services determined, including communication with customers?",
                name: "iso9001-8-reqs"
            },
            {
                clause: "8.3",
                question: "Is a design and development process established and controlled, including planning, inputs, controls (reviews, verification, validation), outputs, and changes?",
                name: "iso9001-8-design"
            },
            {
                clause: "8.4",
                question: "Are externally provided processes, products, and services controlled to ensure they meet requirements, based on evaluation, selection, monitoring performance, and re-evaluation of external providers?",
                name: "iso9001-8-extproviders"
            },
            {
                clause: "8.5",
                question: "Is production and service provision controlled, including controlled conditions, validation, prevention of human error, and preservation? Are post-delivery activities addressed? Is control of changes managed?",
                name: "iso9001-8-prod-serv"
            },
            {
                clause: "8.6",
                question: "Are products and services released only after planned arrangements are satisfied, with traceability to the authorizing person?",
                name: "iso9001-8-release"
            },
            {
                clause: "8.7",
                question: "Are nonconforming outputs identified and controlled to prevent their unintended use or delivery? Are actions taken appropriate to the nonconformity?",
                name: "iso9001-8-nonconform"
            },
            {
                clause: "9.1",
                question: "Are monitoring, measurement, analysis, and evaluation planned and performed? Is customer satisfaction monitored? Is the analysis and evaluation of data used to assess QMS performance and effectiveness? (linking to PDCA's Check)",
                name: "iso9001-9-monitor-meas"
            },
            {
                clause: "9.2",
                question: "Are internal audits conducted at planned intervals to determine if the QMS conforms to requirements and is effectively implemented and maintained?",
                name: "iso9001-9-internalaudits"
            },
            {
                clause: "9.3",
                question: "Does top management review the QMS at planned intervals to ensure its continuing suitability, adequacy, and effectiveness, including opportunities for improvement? (linking to Continual Improvement, PDCA's Check)",
                name: "iso9001-9-managementreview"
            },
            {
                clause: "10.1 / 10.2",
                question: "Is improvement (Continual Improvement) planned and implemented? When a nonconformity occurs, are actions taken to control and correct it, deal with the consequences, evaluate the need for action to eliminate causes (prevent recurrence, RBT), implement action, review effectiveness, and update risks/opportunities? (linking to PDCA's Act)",
                name: "iso9001-10-nonconformity"
            },
            {
                clause: "10.3",
                question: "Does the organization continually improve the suitability, adequacy, and effectiveness of the QMS (Continual Improvement)?",
                name: "iso9001-10-continualimprovement"
            }
        ];

        let html = `
            <table class="inspection-table six-col">
                <thead>
                    <tr>
                        <th>Clause</th>
                        <th>Checklist Item / Question</th>
                        <th>Pass</th>
                        <th>Fail</th>
                        <th>N/A</th>
                        <th>Notes / Evidence / Findings</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="section-header">
                        <td colspan="6">Clause 4: Context of the Organization</td>
                    </tr>
        `;
        
        auditItems.forEach(item => {
            html += `
                <tr>
                    <td>${item.clause}</td>
                    <td>${item.question}</td>
                    <td><input type="checkbox" name="${item.name}-pass"></td>
                    <td><input type="checkbox" name="${item.name}-fail"></td>
                    <td><input type="checkbox" name="${item.name}-na"></td>
                    <td><input type="text" name="${item.name}-notes"></td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
        `;
        
        return html;
    }
};