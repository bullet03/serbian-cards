import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { AppData } from './types';

export async function loadFromCloud(uid: string): Promise<AppData | undefined> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as AppData) : undefined;
}

export async function saveToCloud(uid: string, data: AppData): Promise<void> {
  await setDoc(doc(db, 'users', uid), data);
}
