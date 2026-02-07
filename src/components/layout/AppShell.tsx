'use client';

import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  const isAuthPage = pathname === '/login';
  const showChrome = !isAuthPage && !loading && user;

  return (
    <>
      {showChrome && <Header />}
      <main className={showChrome ? 'pb-16' : ''}>{children}</main>
      {showChrome && <BottomNav />}
    </>
  );
}
