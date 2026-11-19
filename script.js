
/* Mukono District MCH Dashboard
   Lesson 9: Interactive health facility filtering
   Synthetic demonstration data only
*/

let allRecords = [];
const dashboardCharts = {};
let monthlyTrendChart = null;
// Calculate a percentage safely
function calculatePercentage(numerator, denominator) {
    if (denominator <= 0) {
        return null;
    }

    return (numerator / denominator) * 100;
}

// Display a percentage in an HTML card
function displayIndicator(elementId, value) {
    const element = document.getElementById(elementId);

    if (!element) {
        console.error("Missing element:", elementId);
        return;
    }

    if (value === null || !Number.isFinite(value)) {
        element.textContent = "N/A";
    } else {
        element.textContent = value.toFixed(1) + "%";
    }
}

// Add numbers from the selected facility records
function total(records, columnName) {
    return records.reduce((sum, record) => {
        return sum + record[columnName];
    }, 0);
}

// Calculate and display all six indicators
function updateDashboard(records) {
    const ancCoverage = calculatePercentage(
        total(records, "anc4_visits"),
        total(records, "expected_pregnancies")
    );

    const deliveryCoverage = calculatePercentage(
        total(records, "facility_deliveries"),
        total(records, "expected_births")
    );

    const penta3Coverage = calculatePercentage(
        total(records, "penta3_doses"),
        total(records, "estimated_infants")
    );

    const pentaDropout = calculatePercentage(
        total(records, "penta1_doses") -
        total(records, "penta3_doses"),
        total(records, "penta1_doses")
    );

    const pncCoverage = calculatePercentage(
        total(records, "timely_pnc"),
        total(records, "facility_deliveries")
    );

    const lowBirthWeightRate = calculatePercentage(
        total(records, "low_birth_weight"),
        total(records, "live_births_weighed")
    );

    displayIndicator("anc-value", ancCoverage);
    displayIndicator("delivery-value", deliveryCoverage);
    displayIndicator("penta3-value", penta3Coverage);
    displayIndicator("dropout-value", pentaDropout);
    displayIndicator("pnc-value", pncCoverage);
    displayIndicator("lbw-value", lowBirthWeightRate);
    drawCharts(records);
}

// LESSON 12: MONTHLY TRENDS

function calculateIndicator(records, indicator) {
    if (indicator === "anc") {
        return calculatePercentage(
            total(records, "anc4_visits"),
            total(records, "expected_pregnancies")
        );
    }

    if (indicator === "delivery") {
        return calculatePercentage(
            total(records, "facility_deliveries"),
            total(records, "expected_births")
        );
    }

    if (indicator === "penta3") {
        return calculatePercentage(
            total(records, "penta3_doses"),
            total(records, "estimated_infants")
        );
    }

    if (indicator === "dropout") {
        return calculatePercentage(
            total(records, "penta1_doses") -
            total(records, "penta3_doses"),
            total(records, "penta1_doses")
        );
    }

    if (indicator === "pnc") {
        return calculatePercentage(
            total(records, "timely_pnc"),
            total(records, "facility_deliveries")
        );
    }

    if (indicator === "lbw") {
        return calculatePercentage(
            total(records, "low_birth_weight"),
            total(records, "live_births_weighed")
        );
    }

    return null;
}


// Draw a trend chart for the selected facility

function drawMonthlyTrend() {
    if (typeof Chart === "undefined") {
        console.error("Chart.js is unavailable.");
        return;
    }

    const facilityFilter =
        document.getElementById("facility-filter");

    const indicatorFilter =
        document.getElementById("trend-indicator");

    const canvas =
        document.getElementById("trend-chart");

    if (!facilityFilter || !indicatorFilter || !canvas) {
        console.error("Missing trend chart elements.");
        return;
    }

    const selectedFacility = facilityFilter.value;
    const selectedIndicator = indicatorFilter.value;

    // Keep all months for trend comparison
    const facilityRecords = allRecords.filter(record => {
        return selectedFacility === "all" ||
               record.facility === selectedFacility;
    });

    const months = [
        ...new Set(facilityRecords.map(record => record.month))
    ].sort();

    const values = months.map(month => {
        const monthlyRecords = facilityRecords.filter(record => {
            return record.month === month;
        });

        return calculateIndicator(
            monthlyRecords,
            selectedIndicator
        );
    });

    const labels = months.map(month => {
        const [year, monthNumber] = month.split("-");

        return new Date(
            Number(year),
            Number(monthNumber) - 1,
            1
        ).toLocaleString("en", {
            month: "short",
            year: "numeric"
        });
    });

    const indicatorName =
        indicatorFilter.options[indicatorFilter.selectedIndex].text;

    if (monthlyTrendChart) {
        monthlyTrendChart.destroy();
    }

    monthlyTrendChart = new Chart(canvas, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: indicatorName,
                data: values,
                borderColor: "#155e75",
                backgroundColor: "rgba(21,94,117,0.12)",
                borderWidth: 3,
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0.2,
                fill: true,
                spanGaps: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;

                            return value === null
                                ? "N/A"
                                : value.toFixed(1) + "%";
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Percentage (%)"
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: "Reporting Month"
                    }
                }
            }
        }
    });
}


// LESSON 12: BASIC DATA QUALITY CHECKS

function checkDataQuality(records) {
    const issues = [];
    const expectedColumns = [
        "anc4_visits",
        "expected_pregnancies",
        "facility_deliveries",
        "expected_births",
        "penta1_doses",
        "penta3_doses",
        "estimated_infants",
        "timely_pnc",
        "low_birth_weight",
        "live_births_weighed"
    ];

    const seen = new Set();

    records.forEach((record, index) => {
        const row = index + 2;

        if (!record.facility || !record.month) {
            issues.push("Missing facility or month at row " + row);
        }

        const key = record.facility + "|" + record.month;

        if (seen.has(key)) {
            issues.push("Duplicate facility-month at row " + row);
        }
        seen.add(key);

        expectedColumns.forEach(column => {
            const value = record[column];

            if (!Number.isFinite(value) || value < 0) {
                issues.push("Invalid " + column + " at row " + row);
            }
        });

        if (record.penta3_doses > record.penta1_doses) {
            issues.push("Penta 3 exceeds Penta 1 at row " + row);
        }

        if (record.timely_pnc > record.facility_deliveries) {
            issues.push("PNC exceeds facility deliveries at row " + row);
        }

        if (record.low_birth_weight > record.live_births_weighed) {
            issues.push("Low birth weight exceeds babies weighed at row " + row);
        }
    });

    const summary = document.getElementById("quality-summary");

    if (!summary) {
        return;
    }

    if (issues.length === 0) {
        summary.textContent =
            records.length +
            " records checked. No issues detected by the basic checks.";
    } else {
        summary.textContent =
            issues.length +
            " potential data quality issue(s) detected. See browser console.";

        console.warn("Data quality issues:", issues);
    }
}

// Load CSV data
async function loadHealthData() {
    try {
        const response = await fetch("mch_data.csv");

        if (!response.ok) {
            throw new Error("Could not load mch_data.csv");
        }

        const csvText = await response.text();
        const lines = csvText.trim().split(/\r?\n/);
        const headers = lines[0].split(",").map(h => h.trim());

        // Convert CSV rows into JavaScript objects
        allRecords = lines.slice(1).map(line => {
            const values = line.split(",");
            const record = {};

            headers.forEach((header, index) => {
                const value = values[index].trim();

                if (header === "facility" || header === "month") {
                    record[header] = value;
                } else {
                    record[header] = Number(value);

                    if (!Number.isFinite(record[header])) {
                        throw new Error("Invalid number in " + header);
                    }
                }
            });

            return record;
        });

        // Find the facility dropdown
        const facilityFilter =
            document.getElementById("facility-filter");

        if (!facilityFilter) {
            throw new Error("Facility filter not found in HTML");
        }

        // Get unique facility names from the CSV
        const facilityNames = [
            ...new Set(allRecords.map(record => record.facility))
        ];

        // Add each facility to the dropdown
        facilityNames.forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            facilityFilter.appendChild(option);
        });

        
// LESSON 11: FACILITY AND MONTH FILTERING

const monthFilter = document.getElementById("month-filter");

if (!monthFilter) {
    throw new Error("Month filter not found in HTML");
}

// Get unique months from the CSV
const months = [
    ...new Set(allRecords.map(record => record.month))
].sort();

// Add months to the dropdown
months.forEach(month => {
    const option = document.createElement("option");
    option.value = month;

    const [year, monthNumber] = month.split("-");

    const monthName = new Date(
        Number(year),
        Number(monthNumber) - 1,
        1
    ).toLocaleString("en", { month: "long", year: "numeric" });

    option.textContent = monthName;
    monthFilter.appendChild(option);
});

// Update all dashboard indicators and charts
function applyFilters() {
    const selectedFacility = facilityFilter.value;
    const selectedMonth = monthFilter.value;

    const filteredRecords = allRecords.filter(record => {
        const facilityMatches =
            selectedFacility === "all" ||
            record.facility === selectedFacility;

        const monthMatches =
            selectedMonth === "all" ||
            record.month === selectedMonth;

        return facilityMatches && monthMatches;
    });

    updateDashboard(filteredRecords);
    drawMonthlyTrend();
}

// Respond when either dropdown changes

facilityFilter.addEventListener("change", applyFilters);
monthFilter.addEventListener("change", applyFilters);

// Redraw the trend when the indicator changes
document.getElementById("trend-indicator")
    .addEventListener("change", drawMonthlyTrend);

// Check the complete dataset
checkDataQuality(allRecords);

// Display the dashboard
applyFilters();



// Lesson 14: Make loaded records available for CSV export
window.mchExportRecords = allRecords;

        console.log("Dashboard loaded successfully!");
        console.log("Number of records:", allRecords.length);

    } catch (error) {
        console.error("Dashboard error:", error);
        alert("Could not load dashboard data. Check the console.");
    }
}

// Start the dashboard
loadHealthData();

// LESSON 10: DRAW SIX HEALTH INDICATOR CHARTS

function drawCharts(records) {

    if (typeof Chart === "undefined") {
        console.error("Chart.js did not load.");
        return;
    }

    // Group records by facility
    const facilityNames = [
        ...new Set(records.map(record => record.facility))
    ];

    const chartDefinitions = [
        {
            id: "anc-chart",
            label: "ANC4+ Coverage",
            numerator: "anc4_visits",
            denominator: "expected_pregnancies"
        },
        {
            id: "delivery-chart",
            label: "Facility Delivery Coverage",
            numerator: "facility_deliveries",
            denominator: "expected_births"
        },
        {
            id: "penta3-chart",
            label: "Penta 3 Coverage",
            numerator: "penta3_doses",
            denominator: "estimated_infants"
        },
        {
            id: "dropout-chart",
            label: "Penta Dropout Rate",
            numerator: "dropout",
            denominator: "penta1_doses"
        },
        {
            id: "pnc-chart",
            label: "PNC Within 48 Hours",
            numerator: "timely_pnc",
            denominator: "facility_deliveries"
        },
        {
            id: "lbw-chart",
            label: "Low Birth Weight",
            numerator: "low_birth_weight",
            denominator: "live_births_weighed"
        }
    ];

    chartDefinitions.forEach(definition => {

        const values = facilityNames.map(facilityName => {

            const facilityRecords = records.filter(record => {
                return record.facility === facilityName;
            });

            let numerator;

            if (definition.numerator === "dropout") {
                numerator =
                    total(facilityRecords, "penta1_doses") -
                    total(facilityRecords, "penta3_doses");
            } else {
                numerator = total(
                    facilityRecords,
                    definition.numerator
                );
            }

            const denominator = total(
                facilityRecords,
                definition.denominator
            );

            return calculatePercentage(numerator, denominator);
        });

        const canvas = document.getElementById(definition.id);

        if (!canvas) {
            console.error("Missing chart canvas:", definition.id);
            return;
        }

        // Remove an existing chart before drawing a new one
        if (dashboardCharts[definition.id]) {
            dashboardCharts[definition.id].destroy();
        }

        dashboardCharts[definition.id] = new Chart(canvas, {
            type: "bar",
            data: {
                labels: facilityNames,
                datasets: [{
                    label: definition.label,
                    data: values,
                    backgroundColor: "#155e75",
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.y;
                                return value === null
                                    ? "N/A"
                                    : value.toFixed(1) + "%";
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Percentage (%)"
                        }
                    },
                    x: {
                        ticks: {
                            maxRotation: 60,
                            minRotation: 30
                        }
                    }
                }
            }
        });
    });
}
