import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
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

export async function updateCake(cake: Cake): Promise<void> {
  if (isFirebaseConfigured && db) {
    await setDoc(doc(db, 'cakes', cake.id), cake);
  } else {
    const cakes = getLocalData<Cake>('cakes');
    const index = cakes.findIndex((c) => c.id === cake.id);
    if (index !== -1) {
      cakes[index] = cake;
      setLocalData('cakes', cakes);
    }
  }
}

export async function deleteCake(id: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    // Delete all messages first
    const q = query(collection(db, 'cakes', id, 'messages'));
    const snap = await getDocs(q);
    for (const d of snap.docs) {
      await deleteDoc(d.ref);
    }
    await deleteDoc(doc(db, 'cakes', id));
  } else {
    const cakes = getLocalData<Cake>('cakes');
    setLocalData('cakes', cakes.filter((c) => c.id !== id));
    localStorage.removeItem(`messages_${id}`);
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

export async function deleteMessage(cakeId: string, messageId: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    await deleteDoc(doc(db, 'cakes', cakeId, 'messages', messageId));
  } else {
    const key = `messages_${cakeId}`;
    const messages = getLocalData<Message>(key);
    setLocalData(key, messages.filter((m) => m.id !== messageId));
  }
}

export async function updateMessagePosition(
  cakeId: string,
  messageId: string,
  positionX: number,
  positionY: number
): Promise<void> {
  if (isFirebaseConfigured && db) {
    const ref = doc(db, 'cakes', cakeId, 'messages', messageId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await setDoc(ref, { ...snap.data(), positionX, positionY });
    }
  } else {
    const key = `messages_${cakeId}`;
    const messages = getLocalData<Message>(key);
    const index = messages.findIndex((m) => m.id === messageId);
    if (index !== -1) {
      messages[index].positionX = positionX;
      messages[index].positionY = positionY;
      setLocalData(key, messages);
    }
  }
}
