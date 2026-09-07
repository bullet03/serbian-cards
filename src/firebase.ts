import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDgTTaUTQmYiy_UWTY1zvgbNbfHWaRmgxQ',
  authDomain: 'serbian-cards.firebaseapp.com',
  projectId: 'serbian-cards',
  storageBucket: 'serbian-cards.firebasestorage.app',
  messagingSenderId: '205658863762',
  appId: '1:205658863762:web:9a710a2b1ebebb970b8e4b',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
