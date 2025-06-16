// Extended Audit Checklist table template
export const ExtendedAuditTable = {
    
    createExtendedAuditTable() {
        return `
            <div class="extended-audit-table-container" data-table-index="1">
                <div class="extended-audit-import-controls">
                    <button type="button" class="import-csv-btn" title="Import from CSV">Import CSV</button>
                    <input type="file" class="csv-file-input" accept=".csv" style="display: none;">
                </div>
                <table class="extended-audit-table">
                    <thead>
                        <tr>
                            <th>Field</th>
                            <th>Item 1</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Process</strong></td>
                            <td><input type="text" name="ext-audit-process-1" placeholder="Process name"></td>
                        </tr>
                        <tr>
                            <td><strong>Reference#</strong></td>
                            <td><input type="text" name="ext-audit-ref-1" placeholder="Reference"></td>
                        </tr>
                        <tr>
                            <td><strong>Clause Title</strong></td>
                            <td><input type="text" name="ext-audit-clause-1" placeholder="Clause title"></td>
                        </tr>
                        <tr>
                            <td><strong>Question#</strong></td>
                            <td><input type="text" name="ext-audit-qnum-1" placeholder="Q#"></td>
                        </tr>
                        <tr>
                            <td><strong>Question</strong></td>
                            <td><textarea name="ext-audit-question-1" rows="2" placeholder="Enter audit question"></textarea></td>
                        </tr>
                        <tr>
                            <td><strong>Audit Result</strong></td>
                            <td><select name="ext-audit-result-1">
                                <option value="">Select Result</option>
                                <option value="pass">Pass</option>
                                <option value="fail">Fail</option>
                                <option value="partial">Partial</option>
                                <option value="na">N/A</option>
                            </select></td>
                        </tr>
                        <tr>
                            <td><strong>Recommended Actions</strong></td>
                            <td><textarea name="ext-audit-actions-1" rows="2" placeholder="Recommended actions"></textarea></td>
                        </tr>
                        <tr>
                            <td><strong>Audit Evidence and Notes</strong></td>
                            <td><textarea name="ext-audit-evidence-1" rows="2" placeholder="Evidence and notes"></textarea></td>
                        </tr>
                        <tr>
                            <td><strong>Conforms</strong></td>
                            <td><input type="text" name="ext-audit-conforms-1" placeholder="✓"></td>
                        </tr>
                        <tr>
                            <td><strong>Minor NC</strong></td>
                            <td><input type="text" name="ext-audit-minor-nc-1" placeholder="✓"></td>
                        </tr>
                        <tr>
                            <td><strong>Major NC</strong></td>
                            <td><input type="text" name="ext-audit-major-nc-1" placeholder="✓"></td>
                        </tr>
                        <tr>
                            <td><strong>OFI</strong></td>
                            <td><input type="text" name="ext-audit-ofi-1" placeholder="✓"></td>
                        </tr>
                        <tr>
                            <td><strong>Score</strong></td>
                            <td><input type="number" name="ext-audit-score-1" min="0" max="100" placeholder="Score"></td>
                        </tr>
                        <tr>
                            <td><strong>Possible Root-cause</strong></td>
                            <td><textarea name="ext-audit-rootcause-1" rows="2" placeholder="Possible root cause"></textarea></td>
                        </tr>
                        <tr>
                            <td><strong>Corrective Actions</strong></td>
                            <td><textarea name="ext-audit-corrective-1" rows="2" placeholder="Corrective actions"></textarea></td>
                        </tr>
                        <tr>
                            <td><strong>Next Review Date</strong></td>
                            <td><input type="date" name="ext-audit-review-date-1"></td>
                        </tr>
                    </tbody>
                </table>
                <div class="extended-audit-controls">
                    <button type="button" class="add-audit-table-btn" title="Add Audit Table">+</button>
                    <button type="button" class="remove-audit-table-btn" title="Remove Audit Table" style="display: none;">-</button>
                </div>
            </div>
        `;
    },

    createAdditionalAuditTable(tableIndex) {
        return `
            <div class="extended-audit-table-container" data-table-index="${tableIndex}">
                <div class="extended-audit-import-controls">
                    <button type="button" class="import-csv-btn" title="Import from CSV">Import CSV</button>
                    <input type="file" class="csv-file-input" accept=".csv" style="display: none;">
                </div>
                <table class="extended-audit-table">
                    <thead>
                        <tr>
                            <th>Field</th>
                            <th>Item ${tableIndex}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Process</strong></td>
                            <td><input type="text" name="ext-audit-process-${tableIndex}" placeholder="Process name"></td>
                        </tr>
                        <tr>
                            <td><strong>Reference#</strong></td>
                            <td><input type="text" name="ext-audit-ref-${tableIndex}" placeholder="Reference"></td>
                        </tr>
                        <tr>
                            <td><strong>Clause Title</strong></td>
                            <td><input type="text" name="ext-audit-clause-${tableIndex}" placeholder="Clause title"></td>
                        </tr>
                        <tr>
                            <td><strong>Question#</strong></td>
                            <td><input type="text" name="ext-audit-qnum-${tableIndex}" placeholder="Q#"></td>
                        </tr>
                        <tr>
                            <td><strong>Question</strong></td>
                            <td><textarea name="ext-audit-question-${tableIndex}" rows="2" placeholder="Enter audit question"></textarea></td>
                        </tr>
                        <tr>
                            <td><strong>Audit Result</strong></td>
                            <td><select name="ext-audit-result-${tableIndex}">
                                <option value="">Select Result</option>
                                <option value="pass">Pass</option>
                                <option value="fail">Fail</option>
                                <option value="partial">Partial</option>
                                <option value="na">N/A</option>
                            </select></td>
                        </tr>
                        <tr>
                            <td><strong>Recommended Actions</strong></td>
                            <td><textarea name="ext-audit-actions-${tableIndex}" rows="2" placeholder="Recommended actions"></textarea></td>
                        </tr>
                        <tr>
                            <td><strong>Audit Evidence and Notes</strong></td>
                            <td><textarea name="ext-audit-evidence-${tableIndex}" rows="2" placeholder="Evidence and notes"></textarea></td>
                        </tr>
                        <tr>
                            <td><strong>Conforms</strong></td>
                            <td><input type="text" name="ext-audit-conforms-${tableIndex}" placeholder="✓"></td>
                        </tr>
                        <tr>
                            <td><strong>Minor NC</strong></td>
                            <td><input type="text" name="ext-audit-minor-nc-${tableIndex}" placeholder="✓"></td>
                        </tr>
                        <tr>
                            <td><strong>Major NC</strong></td>
                            <td><input type="text" name="ext-audit-major-nc-${tableIndex}" placeholder="✓"></td>
                        </tr>
                        <tr>
                            <td><strong>OFI</strong></td>
                            <td><input type="text" name="ext-audit-ofi-${tableIndex}" placeholder="✓"></td>
                        </tr>
                        <tr>
                            <td><strong>Score</strong></td>
                            <td><input type="number" name="ext-audit-score-${tableIndex}" min="0" max="100" placeholder="Score"></td>
                        </tr>
                        <tr>
                            <td><strong>Possible Root-cause</strong></td>
                            <td><textarea name="ext-audit-rootcause-${tableIndex}" rows="2" placeholder="Possible root cause"></textarea></td>
                        </tr>
                        <tr>
                            <td><strong>Corrective Actions</strong></td>
                            <td><textarea name="ext-audit-corrective-${tableIndex}" rows="2" placeholder="Corrective actions"></textarea></td>
                        </tr>
                        <tr>
                            <td><strong>Next Review Date</strong></td>
                            <td><input type="date" name="ext-audit-review-date-${tableIndex}"></td>
                        </tr>
                    </tbody>
                </table>
                <div class="extended-audit-controls">
                    <button type="button" class="add-audit-table-btn" title="Add Audit Table">+</button>
                    <button type="button" class="remove-audit-table-btn" title="Remove Audit Table">-</button>
                </div>
            </div>
        `;
    }
};