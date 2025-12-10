import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC62nid4Ot6hDxGSyV_w2CsP3i90Th114E",
  authDomain: "makarios-d2293.firebaseapp.com",
  projectId: "makarios-d2293",
  storageBucket: "makarios-d2293.firebasestorage.app",
  messagingSenderId: "202619494926",
  appId: "1:202619494926:web:667b4498b147235396125f",
  measurementId: "G-S4S4G2GPKS"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
