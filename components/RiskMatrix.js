import React from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);

const RiskItem = ({ risk }) => {
    return html`
        <div 
            className="risk-matrix-item" 
            title=${`${risk.description}\nMitigation: ${risk.mitigation || 'N/A'}`}
        >
            ${risk.id.slice(-4)}
        </div>
    `;
}

export const RiskMatrix = ({ data }) => {
    const { risks = [], likelihoodLevels = [], severityLevels = [] } = data;

    const matrix = severityLevels.map(() => likelihoodLevels.map(() => []));
    
    risks.forEach(risk => {
        const sevIndex = severityLevels.indexOf(risk.severity);
        const likeIndex = likelihoodLevels.indexOf(risk.likelihood);
        if (sevIndex !== -1 && likeIndex !== -1) {
            matrix[sevIndex][likeIndex].push(risk);
        }
    });

    const getRiskLevel = (sevIndex, likeIndex) => {
        const score = (sevIndex + 1) * (likeIndex + 1);
        if (score > 15) return 'risk-extreme';
        if (score > 9) return 'risk-high';
        if (score > 4) return 'risk-medium';
        return 'risk-low';
    };

    return html`
        <div className="risk-matrix-container">
            <table className="risk-matrix-table">
                <caption>Risk Assessment Matrix - Drag and drop not implemented</caption>
                <thead>
                    <tr>
                        <th className="header-severity-axis">Severity ⟶</th>
                        ${severityLevels.map(level => html`<th key=${level} className="header-severity">${level}</th>`)}
                    </tr>
                </thead>
                <tbody>
                    ${likelihoodLevels.map((level, likeIndex) => html`
                        <tr key=${level}>
                            <th className="header-likelihood">${level}</th>
                            ${severityLevels.map((sev, sevIndex) => html`
                                <td 
                                    key=${sev} 
                                    className=${`risk-cell ${getRiskLevel(sevIndex, likeIndex)}`}
                                >
                                    <div className="risk-cell-content">
                                        ${matrix[sevIndex][likeIndex].map(risk => html`
                                            <${RiskItem} key=${risk.id} risk=${risk} />
                                        `)}
                                    </div>
                                </td>
                            `)}
                        </tr>
                    `)}
                </tbody>
            </table>
            <div className="likelihood-axis-label">Likelihood ⟶</div>
        </div>
    `;
};