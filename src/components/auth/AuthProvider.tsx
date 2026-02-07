'use client';

import { useEffect } from 'react';
import { onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { useAuthStore } from '@/stores/authStore';
import type { User } from '@/types';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    // Process any pending sign-in redirect (used in standalone/PWA mode)
    getRedirectResult(auth).catch(() => {});

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
          await setDoc(userRef, {
            displayName: firebaseUser.displayName || 'Anonymous',
            photoURL: firebaseUser.photoURL || null,
            isAnonymous: firebaseUser.isAnonymous,
            createdAt: serverTimestamp(),
          });
        }

        const userData = snap.exists() ? snap.data() : null;

        const user: User = {
          uid: firebaseUser.uid,
          displayName: userData?.displayName ?? firebaseUser.displayName ?? 'Anonymous',
          photoURL: userData?.photoURL ?? firebaseUser.photoURL ?? null,
          isAnonymous: firebaseUser.isAnonymous,
          createdAt: userData?.createdAt ?? null!,
        };

        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return <>{children}</>;
}
