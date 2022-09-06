import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { config } from './firebaseConfig';

const firebaseConfig = config;

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
