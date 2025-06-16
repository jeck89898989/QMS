// Time breakdown calculation functionality for the time tracking table
export const TimeBreakdown = {
    
    initialize() {
        const dailyInputs = document.querySelectorAll('.daily-input');
        const weeklyTotalTimeSpan = document.getElementById('weekly-total-time');
        const weeklyTotalKmSpan = document.getElementById('weekly-total-km');

        function updateRowTotals(rowName) {
            const rowInputs = document.querySelectorAll(`.daily-input[data-row="${rowName}"]`);
            let partialTotal = 0;
            rowInputs.forEach(input => {
                partialTotal += parseFloat(input.value) || 0;
            });
            const partialTotalSpan = document.querySelector(`.partial-total[data-row="${rowName}"]`);
            if (partialTotalSpan) {
                partialTotalSpan.textContent = partialTotal.toFixed(1);
            }
            return partialTotal;
        }

        function updateWeeklyTotals() {
            const inspectionTotal = parseFloat(document.querySelector('.partial-total[data-row="inspection"]')?.textContent) || 0;
            const reportingTotal  = parseFloat(document.querySelector('.partial-total[data-row="reporting"]')?.textContent) || 0;
            const travelTimeTotal = parseFloat(document.querySelector('.partial-total[data-row="travel-time"]')?.textContent) || 0;
            const travelKmTotal   = parseFloat(document.querySelector('.partial-total[data-row="travel-km"]')?.textContent) || 0;

            if (weeklyTotalTimeSpan) {
                weeklyTotalTimeSpan.textContent = (inspectionTotal + reportingTotal + travelTimeTotal).toFixed(1);
            }
            if (weeklyTotalKmSpan) {
                weeklyTotalKmSpan.textContent = travelKmTotal.toFixed(1);
            }
        }

        // Add event listeners for time breakdown calculations
        dailyInputs.forEach(input => {
            input.addEventListener('input', (event) => {
                const rowName = event.target.dataset.row;
                updateRowTotals(rowName);
                updateWeeklyTotals();
            });
        });

        // Initial calculation
        ['inspection','reporting','travel-time','travel-km'].forEach(row => {
            updateRowTotals(row);
        });
        updateWeeklyTotals();
    }
};