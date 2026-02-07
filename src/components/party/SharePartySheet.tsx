'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

interface SharePartySheetProps {
  open: boolean;
  onClose: () => void;
  joinCode: string;
  partyName: string;
}

export function SharePartySheet({ open, onClose, joinCode, partyName }: SharePartySheetProps) {
  const [copied, setCopied] = useState(false);
  const joinUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/party/join/${joinCode}`
    : '';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(joinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Gå med i ${partyName} på Mello`,
          text: `Gå med i mitt sällskap "${partyName}" på Mello! Kod: ${joinCode}`,
          url: joinUrl,
        });
      } catch {
        // User cancelled share
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-lg rounded-t-3xl bg-zinc-900 p-6 pb-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-zinc-700" />
            <h2 className="mb-6 text-center text-lg font-bold text-white">
              Bjud in till {partyName}
            </h2>

            {/* Join code */}
            <button
              onClick={handleCopy}
              className="mx-auto mb-6 block rounded-2xl bg-zinc-800 px-8 py-4 active:bg-zinc-700"
            >
              <p className="mb-1 text-xs text-zinc-400">{copied ? 'Kopierad!' : 'Tryck för att kopiera'}</p>
              <p className="text-3xl font-mono font-bold tracking-[0.4em] text-violet-400">
                {joinCode}
              </p>
            </button>

            {/* QR code */}
            {joinUrl && (
              <div className="mx-auto mb-6 flex w-fit rounded-2xl bg-white p-4">
                <QRCodeSVG value={joinUrl} size={160} />
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleCopyLink}
                className="w-full rounded-xl bg-zinc-800 py-3 text-sm font-medium text-white active:bg-zinc-700"
              >
                {copied ? 'Kopierad!' : 'Kopiera länk'}
              </button>

              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  onClick={handleShare}
                  className="w-full rounded-xl bg-violet-600 py-3 text-sm font-bold text-white active:bg-violet-700"
                >
                  Dela
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
