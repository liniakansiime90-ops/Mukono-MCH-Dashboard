// Lesson 13: Integration of three demonstration CSV datasets.
// The datasets are not yet three independent external sources.
(async function () {
    const status = document.getElementById("integration-status");
    const context = document.getElementById("facility-context");
    const tableBody = document.getElementById("threshold-results");
    const facilityFilter = document.getElementById("facility-filter");
    const monthFilter = document.getElementById("month-filter");

    
if (!status || !context || !tableBody || !facilityFilter || !monthFilter) {
    console.error("Lesson 13: Missing HTML elements.", {
        "integration-status": Boolean(status),
        "facility-context": Boolean(context),
        "threshold-results": Boolean(tableBody),
        "facility-filter": Boolean(facilityFilter),
        "month-filter": Boolean(monthFilter)
    });
    return;
}


    async function readCSV(filename) {
        const response = await fetch(filename);
        if (!response.ok) throw new Error("Cannot load " + filename);
        const text = (await response.text()).trim();
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
        if (lines.length < 2) throw new Error(filename + " has no data rows");
        const headers = lines[0].split(",").map(value => value.trim());
        return lines.slice(1).map((line, index) => {
            const values = line.split(",").map(value => value.trim());
            if (values.length !== headers.length) {
                throw new Error(filename + ": wrong number of fields on line " + (index + 2));
            }
            return Object.fromEntries(headers.map((header, i) => [header, values[i]]));
        });
    }

    function sum(records, column) {
        return records.reduce((total, record) => total + record[column], 0);
    }

    function indicatorResult(records, code) {
        const definitions = {
            anc: ["anc4_visits", "expected_pregnancies"],
            delivery: ["facility_deliveries", "expected_births"],
            penta3: ["penta3_doses", "estimated_infants"],
            dropout: ["penta1_doses", "penta1_doses"],
            pnc: ["timely_pnc", "facility_deliveries"],
            lbw: ["low_birth_weight", "live_births_weighed"]
        };
        const [numeratorColumn, denominatorColumn] = definitions[code];
        const denominator = sum(records, denominatorColumn);
        let numerator = sum(records, numeratorColumn);
        if (code === "dropout") numerator -= sum(records, "penta3_doses");
        return {
            percentage: denominator > 0 ? 100 * numerator / denominator : null,
            denominator: denominator
        };
    }

    try {
        const [serviceRows, facilityRows, thresholdRows] = await Promise.all([
            readCSV("mch_data.csv"),
            readCSV("facility_reference.csv"),
            readCSV("indicator_thresholds.csv")
        ]);

        const problems = [];
        const numericColumns = [
            "anc4_visits", "expected_pregnancies", "facility_deliveries",
            "expected_births", "penta1_doses", "penta3_doses",
            "estimated_infants", "timely_pnc", "low_birth_weight",
            "live_births_weighed"
        ];
        const checkColumns = (rows, columns, file) => {
            columns.forEach(column => {
                if (!(column in rows[0])) problems.push(file + ": missing column " + column);
            });
        };
        checkColumns(serviceRows, ["facility", "month", ...numericColumns], "mch_data.csv");
        checkColumns(facilityRows, ["facility", "level", "demo_code"], "facility_reference.csv");
        checkColumns(thresholdRows, ["code", "label", "direction", "threshold"], "indicator_thresholds.csv");

        const serviceKeys = new Set();
        serviceRows.forEach((row, index) => {
            const line = index + 2;
            const key = row.facility + "|" + row.month;
            if (serviceKeys.has(key)) problems.push("Duplicate facility/month on line " + line);
            serviceKeys.add(key);
            if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(row.month)) {
                problems.push("Invalid month on line " + line);
            }
            numericColumns.forEach(column => {
                const raw = row[column];
                const number = Number(raw);
                if (raw === "" || !Number.isInteger(number) || number < 0) {
                    problems.push("Invalid " + column + " on line " + line);
                }
                row[column] = number;
            });
            if (row.low_birth_weight > row.live_births_weighed) {
                problems.push("Low birth weight exceeds babies weighed on line " + line);
            }
        });

        const facilityNames = new Set();
        facilityRows.forEach(row => {
            if (!row.facility || !row.level || !row.demo_code || facilityNames.has(row.facility)) {
                problems.push("Missing or duplicated facility reference: " + row.facility);
            }
            facilityNames.add(row.facility);
        });
        serviceRows.forEach(row => {
            if (!facilityNames.has(row.facility)) {
                problems.push("No facility reference for " + row.facility);
            }
        });

        const requiredCodes = new Set(["anc", "delivery", "penta3", "dropout", "pnc", "lbw"]);
        const seenCodes = new Set();
        thresholdRows.forEach(row => {
            const value = Number(row.threshold);
            if (!requiredCodes.has(row.code) || seenCodes.has(row.code) ||
                !["minimum", "maximum"].includes(row.direction) ||
                !Number.isFinite(value) || row.threshold === "" || value < 0 || value > 100) {
                problems.push("Invalid threshold: " + row.code);
            }
            seenCodes.add(row.code);
            row.threshold = value;
        });
        requiredCodes.forEach(code => {
            if (!seenCodes.has(code)) problems.push("Missing threshold for " + code);
        });

        if (problems.length > 0) {
            status.textContent = "Data validation found " + problems.length +
                " issue(s). See the browser console before interpreting results.";
            console.error("Lesson 13 validation issues:", problems);
            return;
        }

        status.textContent = "Loaded and checked: " + serviceRows.length +
            " service records, " + facilityRows.length + " facility reference rows and " +
            thresholdRows.length + " demonstration thresholds. No issues detected by these checks.";

        function renderComparison() {
            const selectedFacility = facilityFilter.value;
            const selectedMonth = monthFilter.value;
            const selectedRecords = serviceRows.filter(row =>
                (selectedFacility === "all" || row.facility === selectedFacility) &&
                (selectedMonth === "all" || row.month === selectedMonth)
            );
            const reference = facilityRows.find(row => row.facility === selectedFacility);
            context.textContent = reference
                ? reference.facility + " | Level: " + reference.level +
                  " | Synthetic reference code: " + reference.demo_code
                : "All six selected facilities (synthetic facility reference records).";

            tableBody.replaceChildren();
            thresholdRows.forEach(row => {
                const result = indicatorResult(selectedRecords, row.code);
                const meets = result.percentage !== null &&
                    (row.direction === "minimum"
                        ? result.percentage >= row.threshold
                        : result.percentage <= row.threshold);
                const cells = [
                    row.label,
                    result.percentage === null ? "N/A" : result.percentage.toFixed(1) + "%",
                    row.direction === "minimum" ? "At least " + row.threshold + "%"
                                                : "At most " + row.threshold + "%",
                    String(result.denominator),
                    result.percentage === null ? "No data" :
                        (result.denominator < 30 ? "Small denominator — review" :
                        (meets ? "Meets demo threshold" : "Needs review"))
                ];
                const tr = document.createElement("tr");
                cells.forEach(value => {
                    const td = document.createElement("td");
                    td.textContent = value;
                    tr.appendChild(td);
                });
                tableBody.appendChild(tr);
            });
        }

        facilityFilter.addEventListener("change", renderComparison);
        monthFilter.addEventListener("change", renderComparison);
        renderComparison();
    } catch (error) {
        console.error("Lesson 13 loading error:", error);
        status.textContent = "Could not load the reference datasets. Check filenames and Live Server.";
    }
})();
