'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { signInWithPopup, signInWithRedirect, GoogleAuthProvider, signInAnonymously } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { trackEvent } from '@/lib/firebase/analytics';
import { useAuthStore } from '@/stores/authStore';
import VideoBackground from '@/components/login/VideoBackground';
import { FloatingParticles } from '@/components/ui/FloatingParticles';

export default function LoginPage() {
  const [showNickname, setShowNickname] = useState(false);
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user, router]);

  if (user) return null;

  async function handleGoogle() {
    setError('');
    setLoading(true);
    try {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      if (isStandalone) {
        await signInWithRedirect(auth, new GoogleAuthProvider());
      } else {
        await signInWithPopup(auth, new GoogleAuthProvider());
      }
      trackEvent('login', { method: 'google' });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Sign-in failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleAnonymous() {
    if (!nickname.trim()) {
      setError('Ange ett smeknamn');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const cred = await signInAnonymously(auth);
      await setDoc(doc(db, 'users', cred.user.uid), {
        displayName: nickname.trim(),
        photoURL: null,
        isAnonymous: true,
        createdAt: serverTimestamp(),
      });
      trackEvent('login', { method: 'anonymous' });
      router.replace('/');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Sign-in failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const stagger = (i: number) => ({ delay: i * 0.1 });

  return (
    <div className="relative h-dvh overflow-hidden flex items-center justify-center bg-[var(--background)] px-4">
      <VideoBackground />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-radial-[at_center] from-transparent to-black/40" />

      {/* Floating particles */}
      <FloatingParticles />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="glow-border relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-[var(--background-elevated)]/60 backdrop-blur-2xl p-8 shadow-xl shadow-[0_0_30px_rgba(240,180,41,0.1)]"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', ...stagger(1) }}
          className="mb-6 text-center"
        >
          <div className="flex items-center justify-center gap-3">
            <Image
              src="/icons/icon-512.png"
              alt="Mello"
              width={48}
              height={48}
              className="rounded-full"
            />
            <h1 className="bg-gradient-to-r from-[var(--mello-gold)] via-[var(--mello-magenta)] to-[var(--mello-purple)] bg-clip-text text-5xl font-display font-black tracking-tight text-transparent text-glow-gold">
              Mellometer
            </h1>
          </div>
          <p className="mt-2 text-sm text-[var(--foreground-muted)]">
            Er soffa, er jury, ert resultat
          </p>
        </motion.div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-900/30 px-4 py-2 text-sm text-red-400">
            {error}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', ...stagger(2) }}
        >
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/15 hover:border-white/25 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] disabled:opacity-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Logga in med Google
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', ...stagger(3) }}
          className="my-6 flex items-center gap-3"
        >
          <div className="h-px flex-1 bg-[var(--border)]" />
          <span className="text-xs text-[var(--foreground-muted)]">eller</span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', ...stagger(4) }}
        >
          <AnimatePresence mode="wait">
            {!showNickname ? (
              <motion.div
                key="guest-button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={() => setShowNickname(true)}
                  disabled={loading}
                  className="w-full rounded-xl border border-[var(--mello-gold)]/20 bg-[var(--background-surface)]/50 px-4 py-3 text-sm font-medium text-[var(--mello-gold-light)] transition hover:border-[var(--mello-gold)]/40 hover:shadow-[0_0_15px_rgba(240,180,41,0.08)] disabled:opacity-50"
                >
                  Fortsätt som gäst
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="nickname-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Ange ett smeknamn"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAnonymous()}
                    maxLength={20}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background-surface)] px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--foreground-muted)] outline-none focus:border-[var(--mello-gold)]"
                    autoFocus
                  />
                  <button
                    onClick={handleAnonymous}
                    disabled={loading || !nickname.trim()}
                    className="w-full rounded-xl bg-gradient-to-r from-[var(--mello-gold)] to-[var(--mello-magenta)] px-4 py-3 text-sm font-bold text-black transition disabled:opacity-50"
                  >
                    Gå med som {nickname.trim() || '...'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
