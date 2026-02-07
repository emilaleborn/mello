'use client';

import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { FloatingParticles } from '@/components/ui/FloatingParticles';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  const isAuthPage = pathname === '/login';
  const showChrome = !isAuthPage && !loading && user;

  if (!showChrome) {
    return <main>{children}</main>;
  }

  return (
    <div className="flex h-dvh flex-col">
      <FloatingParticles />
      <Header />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <BottomNav />
    </div>
  );
}
