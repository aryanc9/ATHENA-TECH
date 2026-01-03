# **App Name**: Athena Insights

## Core Features:

- User Authentication: Implement Google Sign-In with Firebase Auth.
- Automated Data Fetching: Automatically fetch Earnings, ESG, Patent, and Market data using Cloud Functions. These functions will act as a tool to incorporate data.
- Data Aggregation: Aggregate the fetched alternative data into a unified dataset using Cloud Functions.
- Risk Analysis and Scoring: Analyze Adani Power using the aggregated data to determine risk level, confidence score, and key drivers. This component uses reasoning.
- Analysis Display: Display the risk level, confidence score, key drivers, and explainability section on the Analysis page.
- Status Indicator: Implement a status indicator on the Dashboard page to show the progress of data fetching and analysis.
- Firestore Integration: Store entities, alternative data, analysis results, and user information in Firestore collections.

## Style Guidelines:

- Primary color: Dark blue (#30475E) to convey trust and stability, reflecting the app's analytical focus.
- Background color: Light gray (#F0F4F8) to provide a clean and neutral backdrop.
- Accent color: Bright orange (#F05454) to highlight key insights and calls to action, ensuring important elements stand out against the neutral background.
- Body and headline font: 'Inter' for a modern, neutral, and readable feel.
- Use a set of consistent and professional icons to represent key drivers (ESG, Earnings, Market, Innovation).
- Maintain a clean, structured layout with clear sections for Risk Level, Confidence Score, Key Drivers, and Explainability.
- Implement subtle animations to indicate data fetching and analysis progress, providing user feedback without being distracting.