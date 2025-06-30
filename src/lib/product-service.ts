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
  writeBatch,
  type DocumentSnapshot,
  type Timestamp,
} from 'firebase/firestore';
import type { Product, Seller, Attribute } from './types';

// Converts a Firestore doc to a usable object, handling timestamps safely.
function docToData(docSnapshot: DocumentSnapshot) {
    if (!docSnapshot.exists()) return null;
    const data = docSnapshot.data();
    const createdAt = (data.createdAt && typeof data.createdAt.toDate === 'function') ? data.createdAt.toDate() : new Date();
    const updatedAt = (data.updatedAt && typeof data.updatedAt.toDate === 'function') ? data.updatedAt.toDate() : undefined;
    return {
        id: docSnapshot.id,
        ...data,
        createdAt,
        updatedAt,
    };
}

// Fetch all products for a specific user.
// This fetches the user's private list and combines it with public product data.
export async function getProducts(userId: string): Promise<Product[]> {
    if (!isFirebaseConfigured || !userId) return [];
    
    const userProductsQuery = query(collection(db, 'userProducts'), where('userId', '==', userId));
    const userProductsSnapshot = await getDocs(userProductsQuery);
    
    const products: Product[] = [];
    for (const userProductDoc of userProductsSnapshot.docs) {
        const userProduct = docToData(userProductDoc);
        if (userProduct && userProduct.publicProductId) {
            const publicProductDoc = await getDoc(doc(db, 'publicProducts', userProduct.publicProductId));
            if (publicProductDoc.exists()) {
                const publicProduct = docToData(publicProductDoc);
                products.push({
                    id: userProduct.id,
                    userId: userProduct.userId,
                    publicProductId: publicProduct.id,
                    name: publicProduct.name,
                    model: publicProduct.model,
                    attributes: publicProduct.attributes || [],
                    sellers: [...(publicProduct.onlineSellers || []), ...(userProduct.localSellers || [])],
                    createdAt: userProduct.createdAt,
                    updatedAt: userProduct.updatedAt,
                });
            }
        }
    }
    return products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

// Get a single combined product view.
export async function getProduct(userProductId: string): Promise<Product | null> {
    if (!isFirebaseConfigured || !userProductId) return null;
    
    const userProductDoc = await getDoc(doc(db, 'userProducts', userProductId));
    if (!userProductDoc.exists()) return null;

    const userProduct = docToData(userProductDoc);
    if (!userProduct?.publicProductId) return null;

    const publicProductDoc = await getDoc(doc(db, 'publicProducts', userProduct.publicProductId));
    if (!publicProductDoc.exists()) return null;

    const publicProduct = docToData(publicProductDoc);

    return {
        id: userProduct.id,
        userId: userProduct.userId,
        publicProductId: publicProduct.id,
        name: publicProduct.name,
        model: publicProduct.model,
        attributes: publicProduct.attributes || [],
        sellers: [...(publicProduct.onlineSellers || []), ...(userProduct.localSellers || [])],
        createdAt: userProduct.createdAt,
        updatedAt: userProduct.updatedAt,
    };
}

// Find a public product by its model number.
export async function findPublicProductByModel(model: string): Promise<any | null> {
    if (!isFirebaseConfigured || !model) return null;
    const q = query(collection(db, 'publicProducts'), where('model', '==', model));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return docToData(snapshot.docs[0]);
}

// Save a product. This handles creating/updating public and user-specific data.
export async function saveProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }, userId: string) {
    if (!isFirebaseConfigured) throw new Error("Firebase not configured");

    const onlineSellers = productData.sellers.filter(s => s.isOnline);
    const localSellers = productData.sellers.filter(s => !s.isOnline);

    let publicProductId = productData.publicProductId;
    
    const batch = writeBatch(db);

    // Step 1: Find or create the public product.
    if (!publicProductId) {
        const existingPublic = await findPublicProductByModel(productData.model);
        if (existingPublic) {
            publicProductId = existingPublic.id;
        }
    }

    if (publicProductId) {
        // Update existing public product
        const publicDocRef = doc(db, 'publicProducts', publicProductId);
        const publicDocSnap = await getDoc(publicDocRef);
        if (publicDocSnap.exists()) {
            const publicData = publicDocSnap.data();
            const existingAttrs = publicData.attributes.map((a: Attribute) => a.name);
            const newAttrs = productData.attributes.filter(a => !existingAttrs.includes(a.name));
            
            const existingLinks = publicData.onlineSellers.map((s: Seller) => s.link);
            const newSellers = onlineSellers.filter(s => s.link && !existingLinks.includes(s.link));

            if (newAttrs.length > 0 || newSellers.length > 0) {
                 batch.update(publicDocRef, {
                    attributes: [...publicData.attributes, ...newAttrs],
                    onlineSellers: [...publicData.onlineSellers, ...newSellers],
                    updatedAt: serverTimestamp(),
                });
            }
        }
    } else {
        // Create new public product
        const newPublicDocRef = doc(collection(db, 'publicProducts'));
        publicProductId = newPublicDocRef.id;
        batch.set(newPublicDocRef, {
            name: productData.name,
            model: productData.model,
            attributes: productData.attributes,
            onlineSellers: onlineSellers,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    }

    // Step 2: Create or update the user-specific product link.
    if (productData.id) {
        // Update existing user product (e.g., updating local sellers)
        const userDocRef = doc(db, 'userProducts', productData.id);
        batch.update(userDocRef, {
            localSellers,
            updatedAt: serverTimestamp(),
        });
    } else {
        // Create new user product link
        const userDocRef = doc(collection(db, 'userProducts'));
        batch.set(userDocRef, {
            userId,
            publicProductId,
            localSellers,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    }

    await batch.commit();
}


// A user "deletes" a product by removing their personal link to it.
// The public product data remains for other users.
export async function deleteProduct(userProductId: string): Promise<void> {
    if (!isFirebaseConfigured) throw new Error("Firebase not configured");
    await deleteDoc(doc(db, 'userProducts', userProductId));
}
