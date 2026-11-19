# Mukono MCH Dashboard — Data Sources and Definitions

## Data provenance

1. `mch_data.csv` — 18 SYNTHETIC monthly aggregate service records, January–March 2026, six selected facility names supplied for the academic prototype. Values were generated for teaching and do not represent actual facility or district performance.
2. `facility_reference.csv` — SYNTHETIC reference table for six facility names, with facility level inferred from the names supplied and **invented DEMO identifiers**. Facility names and levels have NOT been independently verified. DEMO codes are not official facility codes.
3. `indicator_thresholds.csv` — SIX ILLUSTRATIVE monitoring thresholds invented for demonstrating dashboard comparisons. These are NOT Uganda Ministry of Health or WHO targets. Threshold comparisons are educational only.

**Important:** These are three CSV datasets, but all three share demonstration provenance. They should NOT yet be claimed as three independently sourced datasets for the lecturer's requirement. Add and cite an independently sourced public reference dataset and an appropriately sourced third dataset (for example documented public web or campaign metrics), or confirm acceptable alternatives with the lecturer.

## Indicator definitions used in the prototype

- ANC4+ coverage = `anc4_visits / expected_pregnancies * 100`. ANC4+ is an older monitoring measure; WHO recommends eight antenatal contacts. The numerator is a simplified aggregate proxy and requires a consistent reporting definition.
- Facility delivery coverage = `facility_deliveries / expected_births * 100`.
- Penta 3 coverage = `penta3_doses / estimated_infants * 100`.
- Penta dropout rate = `(penta1_doses - penta3_doses) / penta1_doses * 100`. This is an aggregate proxy, not a longitudinal follow-up of individual children.
- PNC within 48 hours = `timely_pnc / facility_deliveries * 100`. This is a project-specific proxy; it does not measure all births in the catchment area.
- Low birth weight proportion = `low_birth_weight / live_births_weighed * 100`.

Percentages for 'All Available Months' pool monthly numerators and denominators; they are not unique-person measures. Denominators below 30 are flagged in Lesson 13 comparisons. Some values may exceed 100% in real-world reporting and should be investigated, not silently truncated.

## Data quality and limitations

Lesson 13 checks required columns, non-negative integer service values, valid reporting-month format, duplicate facility-month keys, reference matches, valid threshold definitions, and low-birth-weight counts not exceeding babies weighed. These checks do not establish clinical validity, accuracy, completeness, timeliness, or official reporting consistency. CSV parsing assumes simple comma-separated values without quoted commas; a production system should use a robust parser.

No identifiable patient data are used. All data and thresholds are for classroom demonstration only. Before public deployment, implement authenticated role-based access, secure back-end validation, HTTPS/HSTS, and documented governance.
