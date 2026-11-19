# Mukono Maternal and Child Health Monitoring Dashboard

## Project Overview

This project is an interactive, web-based maternal and child health (MCH) monitoring dashboard developed as an academic prototype for Mukono District, Uganda.

The dashboard demonstrates how health service data can be visualised to support monitoring, interpretation and decision-making at district and health facility levels.

**Important:** The facility-level data are synthetic and do not represent actual health facility performance.

## Dashboard Features

- Six maternal and child health indicators
- Interactive charts and trend visualisation
- Health facility and reporting-month filters
- Indicator threshold comparison
- Data quality checks
- National and district reference statistics
- Aggregated CSV data export
- Login authentication with administrator and viewer roles
- Demonstration email notification for threshold breaches
- Responsive layout for desktop, tablet and mobile screens

## Maternal and Child Health Indicators

1. ANC4+ coverage
2. Facility delivery coverage
3. Penta 3 immunisation coverage
4. Penta dropout rate
5. Postnatal care within 48 hours
6. Low birth weight proportion

The dashboard uses simplified indicator definitions for academic demonstration. Monitoring thresholds are illustrative and should not be interpreted as official Ministry of Health or WHO targets.

## Technologies Used

- HTML5 — page structure
- CSS3 — styling and responsive design
- JavaScript — dashboard interactions and calculations
- Chart.js — data visualisation
- Supabase Authentication — login and user roles
- Supabase Edge Functions — demonstration email alert processing
- Resend — email delivery
- GitHub — source code version control
- GitHub Pages — website hosting

## Data Sources

The project uses synthetic monthly aggregate service records for six selected health facilities covering January–March 2026.

It also displays national and district reference statistics attributed to Uganda's Ministry of Health Annual Performance Report FY 2025/26 and an ACRES 2026 publication citing DHIS2 data.

Source details and limitations are documented in `DATA_SOURCES.md`.

The synthetic facility records, demonstration facility identifiers and illustrative monitoring thresholds must not be treated as official health statistics.

## User Roles

**Administrator (District Biostatistician):** An authorised user responsible for overseeing the dashboard and its monitoring functions.

**Viewer:** An authorised user who can access the dashboard's available monitoring information.

This is an academic role-based access prototype, not a production health information system.

## How to Access the Dashboard

Live dashboard:

https://liniakansiime90-ops.github.io/Mukono-MCH-Dashboard/

Users require an authorised account to sign in.

## Running the Project Locally

1. Download or clone the GitHub repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` using Live Server.
4. Ensure the CSV files are available in the project folder.
5. Sign in using an authorised test account.

The application requires its configured Supabase services for authentication and email functionality.

## Testing

The dashboard has undergone manual testing in:

- Google Chrome
- Microsoft Edge
- Mozilla Firefox

Responsive display checks were conducted using simulated mobile and tablet screen sizes.

A desktop Lighthouse audit produced the following results:

| Category | Score |
|---|---:|
| Performance | 96 |
| Accessibility | 98 |
| Best Practices | 100 |
| SEO | 90 |

These scores represent one recorded Lighthouse audit and do not establish full compliance with every accessibility or security standard.

Usability evaluation with five participants is planned.

## Email Alert Demonstration

A threshold-breach email was successfully sent and received during a manually initiated test using synthetic indicator values.

The current implementation should not be described as a fully automated threshold monitoring system.

## Data Privacy and Limitations

- No identifiable patient records are used.
- The facility-level data are synthetic.
- Monitoring thresholds are illustrative.
- Publicly hosted CSV files can be accessed independently of the dashboard login.
- The prototype is not intended for real clinical decisions or confidential patient information.
- Further security, data governance and validation measures would be required for production deployment.

## Academic Purpose

Developed as part of a Master's programme in Health Informatics and Analytics.

The project demonstrates web technologies, data visualisation, health information management, authentication, usability testing and responsible handling of health data.
