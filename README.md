# Ganapathi Seva

Ganapathi Seva is a professional static web app for managing annual Ganapathi festival donations and expenses with transparency as the primary goal.

## Features

- Admin, Treasurer, and Viewer roles
- Public transparency page without login
- Donation and expense management
- Bill upload support for expenses
- Verified and pending transaction tracking
- Festival year management
- Financial summary and reporting
- Demo data for fast setup
- Responsive mobile-first design

## Project Structure

- index.html
- login.html
- dashboard.html
- donations.html
- expenses.html
- reports.html
- transparency.html
- festival-years.html
- users.html
- settings.html
- css/style.css
- css/responsive.css
- js/firebase-config.js
- js/auth.js
- js/dashboard.js
- js/donations.js
- js/expenses.js
- js/reports.js
- js/transparency.js
- js/festivals.js
- js/users.js
- js/utils.js

## Run locally

1. Open the folder in a static file server or use Python:
   `python3 -m http.server 8000`
2. Visit: http://localhost:8000/

## Firebase setup

1. Replace the placeholder values in `js/firebase-config.js` with your Firebase project configuration.
2. Add Firebase Authentication and Firestore.
3. Enable Storage for expense receipts.
4. Add security rules to restrict public and role access as required.

## Notes

This project uses demo/local data by default to make the user interface work without a backend. It is designed to be upgraded to Firebase in the next phase.
