require('dotenv').config({ path: '.env.local' });

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Load Firebase config from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.projectId) {
  console.error('Firebase project ID is not set in the environment variables. Cannot seed database.');
  process.exit(1);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedDatabase() {
  console.log('Seeding database...');

  try {
    const adaniPowerRef = doc(db, 'entities', 'adani_power');
    
    await setDoc(adaniPowerRef, {
      id: 'adani_power',
      name: 'Adani Power',
      ticker: 'ADANIPOWER',
      country: 'India',
      sector: 'Power Generation',
      keywords: [
        'Adani Power',
        'thermal power',
        'coal plant',
        'environment',
        'regulatory',
        'earnings'
      ]
    });

    console.log('Successfully seeded adani_power entity.');

    const earningsDataRef = doc(db, 'entities/adani_power/alternative_data', 'earnings_data');
    await setDoc(earningsDataRef, {
      entity: "Adani Power",
      source: "Public earnings summaries",
      tone: "Cautious",
      confidence_words: ["growth", "capacity expansion"],
      caution_words: ["regulatory", "cost pressure"],
      overall_signal: "Mildly Negative",
      fetched_at: serverTimestamp()
    });
    
    console.log('Successfully seeded earnings_data for adani_power.');


  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }

  console.log('Database seeding complete.');
  process.exit(0);
}

seedDatabase();
