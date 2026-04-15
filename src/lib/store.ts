import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { Cake, Message } from './types';

// ========== localStorage fallback ==========
function getLocalData<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

function setLocalData<T>(key: string, data: T[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// ========== Cake operations ==========
export async function createCake(cake: Cake): Promise<void> {
  if (isFirebaseConfigured && db) {
    await setDoc(doc(db, 'cakes', cake.id), cake);
  } else {
    const cakes = getLocalData<Cake>('cakes');
    cakes.push(cake);
    setLocalData('cakes', cakes);
  }
}

export async function getCake(id: string): Promise<Cake | null> {
  if (isFirebaseConfigured && db) {
    const snap = await getDoc(doc(db, 'cakes', id));
    return snap.exists() ? (snap.data() as Cake) : null;
  } else {
    const cakes = getLocalData<Cake>('cakes');
    return cakes.find((c) => c.id === id) || null;
  }
}

// ========== Message operations ==========
export async function addMessage(message: Message): Promise<void> {
  if (isFirebaseConfigured && db) {
    await setDoc(doc(db, 'cakes', message.cakeId, 'messages', message.id), message);
  } else {
    const key = `messages_${message.cakeId}`;
    const messages = getLocalData<Message>(key);
    messages.push(message);
    setLocalData(key, messages);
  }
}

export async function getMessages(cakeId: string): Promise<Message[]> {
  if (isFirebaseConfigured && db) {
    const q = query(
      collection(db, 'cakes', cakeId, 'messages'),
      orderBy('createdAt', 'asc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Message);
  } else {
    const key = `messages_${cakeId}`;
    const messages = getLocalData<Message>(key);
    return messages.sort((a, b) => a.createdAt - b.createdAt);
  }
}
