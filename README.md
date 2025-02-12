# Project Title

Buddy MD

## Overview

Buddy MD is a user-friendly medication tracker designed to help individuals with chronic conditions manage their medication schedules effectively.

### Problem Space

Managing chronic diseases requires strict adherence to medication schedules, yet many patients struggle with:

- Forgetting to take medication on time

- Running out of prescriptions

- Lack of insights into their adherence trends

- Difficulty communicating their medication history to healthcare providers

### User Profile

Patients: Need structured medication reminders and tracking

### Features

As a user, I want to receive medication reminders via push notifications or SMS

As a user, I want to log my medication intake to track adherence

As a user, I want to see my medication history and trends in a dashboard

As a user, I want to get alerts when my prescription is running low

As a user, I want to view drug information and interactions

## Implementation

### Tech Stack

- React
- MySQL
- Express
- Client libraries:
  - react
  - react-router
  - axios
- Server libraries:
  - knex
  - express
  - bcrypt for password hashing

### APIs

- Drug Interaction API: Check for medication interactions
- Health Data API: Apple Health

### Sitemap

- Welcome Page – User introduction and onboarding

- Sign-Up / Login – User authentication

- Dashboard – Medication schedule overview and adherence stats

- Medication Management – Add, edit, and track medications

- Reports & Analytics – View medication trends and adherence reports

### Mockups

- Welcome Page![Welcome Page](<img width="262" alt="WelcomePage" src="https://github.com/user-attachments/assets/45473ce6-7b06-40b3-b3a2-4e1e84d5af75" />
)

- Login Page![Login Page](<src="https://github.com/user-attachments/assets/cdcb8604-26db-4982-8f96-52804f569fe0" />
)

- Dashboard![Dashboard](<src="https://github.com/user-attachments/assets/c1ebc01f-237d-4034-9bca-43cb794248f8" />
)

- Medication Tracking View![Medication Tracking View](<src="https://github.com/user-attachments/assets/d76ddbdc-a0b0-4774-bb8f-202b0cd372bb" />
)

- Reports & Insights Page ![Reports & Insights Page](<src="https://github.com/user-attachments/assets/1c460e30-1c01-48c4-b40d-941d0224ef3f" />
)

### Data

Users (ID, Name, Email, Password, Preferences)

Medications (Name, Dosage, Frequency, Start/End Date, Side Effects, Notes)

Adherence Logs (Timestamp, Taken/Missed Status)

Reminders (Time, Delivery Method, Status)

### Endpoints

GET /medications – Fetch a user’s medication list

POST /medications – Add a new medication

PUT /medications/:id – Update medication details

DELETE /medications/:id – Remove a medication

POST /reminders – Create a medication reminder

GET /reports – Fetch medication adherence trend

## Roadmap

- Sprint 1: Setup & Authentication

Initialize React project and Express server

Implement Firebase authentication

Develop UI wireframes in Figma

- Sprint 2: Core Features

Implement medication management (CRUDE)

Build reminder notifications with Twilio API

Integrate OpenFDA/RxNorm API for drug information

- Sprint 3: Enhancements & Reports

Develop adherence analytics and reports

- Sprint 4: Finalization & Deployment

Perform bug fixes and security improvements

- Deploy

---

## Future Implementations

- Recipes tailored to side effects – Suggest meals based on medications and their side effects to minimize discomfort and enhance nutrition.

- Daily healthy tips – Provide users with wellness tips tailored to their health conditions and medication regimen.
