'use server';

import { db, isFirebaseConfigured } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore';
import type { Product } from './types';

type ProductDocumentData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'> & {
  createdAt: Timestamp;
  updatedAt?: Timestamp;
};

function productFromDoc(docSnapshot: any): Product {
    const data = docSnapshot.data() as ProductDocumentData;
    return {
        id: docSnapshot.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt?.toDate(),
    };
}

export async function getProducts(userId: string): Promise<Product[]> {
  if (!isFirebaseConfigured || !userId) return [];
  // The orderBy clause was removed as it can cause errors if the required
  // composite index is not configured in Firestore. The client-side already handles sorting.
  const q = query(
    collection(db, 'products'),
    where('userId', '==', userId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(productFromDoc);
}

export async function getProduct(productId: string): Promise<Product | null> {
    if (!isFirebaseConfigured || !productId) return null;
    try {
        const docRef = doc(db, 'products', productId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? productFromDoc(docSnap) : null;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

export async function addProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  if (!isFirebaseConfigured) throw new Error("Firebase not configured");
  const docRef = await addDoc(collection(db, 'products'), {
    ...productData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  const newDoc = await getDoc(docRef);
  return productFromDoc(newDoc);
}

export async function updateProduct(productId: string, productData: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Product> {
    if (!isFirebaseConfigured) throw new Error("Firebase not configured");
  const docRef = doc(db, 'products', productId);
  await updateDoc(docRef, {
    ...productData,
    updatedAt: serverTimestamp(),
  });
  const updatedDoc = await getDoc(docRef);
  return productFromDoc(updatedDoc);
}

export async function deleteProduct(productId: string): Promise<void> {
    if (!isFirebaseConfigured) throw new Error("Firebase not configured");
  await deleteDoc(doc(db, 'products', productId));
}
