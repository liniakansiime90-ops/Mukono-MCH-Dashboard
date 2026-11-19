
/* LESSON 14: Export aggregated MCH indicators */

(function () {

    const button = document.getElementById("download-csv");

    if (!button) {
        console.error("Download button not found.");
        return;
    }

    function sum(records, column) {
        return records.reduce(
            (total, record) => total + Number(record[column]),
            0
        );
    }

    function csvCell(value) {
        const text = String(value);

        // Prevent text from being interpreted as an Excel formula
        const safeText = /^[\s]*[=+\-@]/.test(text)
            ? "'" + text
            : text;

        return '"' + safeText.replace(/"/g, '""') + '"';
    }

    function makeReport(records, facility, month) {

        const indicators = [
            ["ANC4+ Coverage",
                sum(records, "anc4_visits"),
                sum(records, "expected_pregnancies")],

            ["Facility Delivery Coverage",
                sum(records, "facility_deliveries"),
                sum(records, "expected_births")],

            ["Penta 3 Coverage",
                sum(records, "penta3_doses"),
                sum(records, "estimated_infants")],

            ["Penta Dropout Rate",
                sum(records, "penta1_doses") -
                sum(records, "penta3_doses"),
                sum(records, "penta1_doses")],

            ["PNC Within 48 Hours",
                sum(records, "timely_pnc"),
                sum(records, "facility_deliveries")],

            ["Low Birth Weight",
                sum(records, "low_birth_weight"),
                sum(records, "live_births_weighed")]
        ];

        const rows = [
            ["Report", "Mukono MCH Indicator Summary"],
            ["Data Type", "Synthetic academic demonstration data"],
            ["Facility", facility],
            ["Reporting Month", month],
            [],
            ["Indicator", "Numerator", "Denominator", "Percentage"]
        ];

        indicators.forEach(indicator => {

            const [name, numerator, denominator] = indicator;

            const percentage = denominator > 0
                ? (numerator / denominator * 100).toFixed(1) + "%"
                : "N/A";

            rows.push([
                name,
                numerator,
                denominator,
                percentage
            ]);
        });

        return rows.map(row =>
            row.map(csvCell).join(",")
        ).join("\r\n");
    }

    function safeFilename(value) {
        return value.replace(/[^a-zA-Z0-9_-]/g, "_");
    }

    button.addEventListener("click", function () {

        const records = window.mchExportRecords;

        if (!Array.isArray(records)) {
            alert("Dashboard data is not ready for export.");
            return;
        }

        const facility =
            document.getElementById("facility-filter").value;

        const month =
            document.getElementById("month-filter").value;

        const selectedRecords = records.filter(record => {
            const facilityMatches =
                facility === "all" || record.facility === facility;

            const monthMatches =
                month === "all" || record.month === month;

            return facilityMatches && monthMatches;
        });

        if (selectedRecords.length === 0) {
            alert("No records found for the selected filters.");
            return;
        }

        const csv = makeReport(
            selectedRecords,
            facility === "all" ? "All selected facilities" : facility,
            month === "all" ? "All available months" : month
        );

        const blob = new Blob(
            ["\uFEFF" + csv],
            { type: "text/csv;charset=utf-8;" }
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;

        link.download =
            "MCH_Indicators_" +
            safeFilename(facility) + "_" +
            safeFilename(month) + ".csv";

        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => URL.revokeObjectURL(url), 1000);

    });

})();
