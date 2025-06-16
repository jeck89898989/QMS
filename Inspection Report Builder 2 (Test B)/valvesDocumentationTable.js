// Valve documentation checks inspection table
export const ValvesDocumentationTable = {
    
    createDocumentationChecksSection() {
        return `
            <tr class="section-header">
                <td colspan="5">Documentation Checks</td>
            </tr>
             <tr>
                <td>PED / CE Declaration of Conformity (2014/68/EU)</td>
                <td><input type="checkbox" name="valves-doc-pedce-pass"></td>
                <td><input type="checkbox" name="valves-doc-pedce-fail"></td>
                <td><input type="checkbox" name="valves-doc-pedce-na"></td>
                <td>Traceable document</td>
            </tr>
             <tr>
                <td>FET Certificate (77/312 or 77/200)</td>
                <td><input type="checkbox" name="valves-doc-fet-pass"></td>
                <td><input type="checkbox" name="valves-doc-fet-fail"></td>
                <td><input type="checkbox" name="valves-doc-fet-na"></td>
                <td>Traceable document</td>
            </tr>
             <tr>
                <td>EN 10204 3.1</td>
                <td><input type="checkbox" name="valves-doc-en31-pass"></td>
                <td><input type="checkbox" name="valves-doc-en31-fail"></td>
                <td><input type="checkbox" name="valves-doc-en31-na"></td>
                <td>Traceable document</td>
            </tr>
             <tr>
                <td>Material Certification (3.1 etc.)</td>
                <td><input type="checkbox" name="valves-doc-material-pass"></td>
                <td><input type="checkbox" name="valves-doc-material-fail"></td>
                <td><input type="checkbox" name="valves-doc-material-na"></td>
                <td>Traceable document</td>
            </tr>
             <tr>
                <td>Hydrostatic Test (Extended Duration)</td>
                <td><input type="checkbox" name="valves-doc-hydro-pass"></td>
                <td><input type="checkbox" name="valves-doc-hydro-fail"></td>
                <td><input type="checkbox" name="valves-doc-hydro-na"></td>
                <td>Traceable document + Duration of test</td>
            </tr>
             <tr>
                <td>Corrosion Test on Stainless/Duplex</td>
                <td><input type="checkbox" name="valves-doc-corrosion-pass"></td>
                <td><input type="checkbox" name="valves-doc-corrosion-fail"></td>
                <td><input type="checkbox" name="valves-doc-corrosion-na"></td>
                <td>Traceable document</td>
            </tr>
             <tr>
                <td>Ferrite Content Certificate on Duplex</td>
                <td><input type="checkbox" name="valves-doc-ferrite-pass"></td>
                <td><input type="checkbox" name="valves-doc-ferrite-fail"></td>
                <td><input type="checkbox" name="valves-doc-ferrite-na"></td>
                <td>Traceable document</td>
            </tr>
             <tr>
                <td>Bolting Corrosion Test for B8, B8M, BM82</td>
                <td><input type="checkbox" name="valves-doc-bolting-corrosion-pass"></td>
                <td><input type="checkbox" name="valves-doc-bolting-corrosion-fail"></td>
                <td><input type="checkbox" name="valves-doc-bolting-corrosion-na"></td>
                <td>Traceable document</td>
            </tr>
             <tr>
                <td>IOM present</td>
                <td><input type="checkbox" name="valves-doc-iom-pass"></td>
                <td><input type="checkbox" name="valves-doc-iom-fail"></td>
                <td><input type="checkbox" name="valves-doc-iom-na"></td>
                <td>Correct for valve type</td>
            </tr>
             <tr>
                <td>Certificate Quality (Legibility etc.)</td>
                <td><input type="checkbox" name="valves-doc-cert-quality-pass"></td>
                <td><input type="checkbox" name="valves-doc-cert-quality-fail"></td>
                <td><input type="checkbox" name="valves-doc-cert-quality-na"></td>
                <td>Visual only</td>
            </tr>
             <tr>
                <td>Certificate Language (English required for 77-302 applicable orders)</td>
                <td><input type="checkbox" name="valves-doc-cert-lang-pass"></td>
                <td><input type="checkbox" name="valves-doc-cert-lang-fail"></td>
                <td><input type="checkbox" name="valves-doc-cert-lang-na"></td>
                <td>Visual only</td>
            </tr>
        `;
    }
};