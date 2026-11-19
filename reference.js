
/* Lesson 15: Load national and Mukono reference data */

console.log("LESSON 15 REFERENCE SCRIPT IS RUNNING");

async function loadReferenceData() {
    const container = document.getElementById("reference-cards");
    const status = document.getElementById("reference-status");

    if (!container || !status) {
        console.error("Reference section not found.");
        return;
    }

    try {
        const response = await fetch("uganda_health_reference.csv");

        if (!response.ok) {
            throw new Error("Reference CSV could not be loaded.");
        }

        const csv = await response.text();
        const lines = csv.trim().split(/\r?\n/);
        const headers = lines[0].split(",");

        const records = lines.slice(1).map(line => {
            const values = line.split(",");
            const record = {};

            headers.forEach((header, index) => {
                record[header.trim()] = (values[index] || "").trim();
            });

            return record;
        });

        container.innerHTML = "";

        records.forEach(record => {
            const card = document.createElement("div");
            card.className = "reference-card";

            const heading = document.createElement("h3");
            heading.textContent = record.indicator;

            const value = document.createElement("div");
            value.className = "reference-value";
            value.textContent = record.value +
                (record.unit === "percent"
                    ? "%"
                    : " " + record.unit);

            const area = document.createElement("p");
            area.textContent = record.area + " | " + record.period;

            const source = document.createElement("p");
            source.textContent = "Source: " + record.source;

            card.append(heading, value, area, source);
            container.appendChild(card);
        });

        status.textContent =
            records.length + " published reference indicators loaded.";

    } catch (error) {
        console.error(error);
        status.textContent = "Reference data could not be loaded.";
    }
}


if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadReferenceData);
} else {
    loadReferenceData();
}

