export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <div className="text-center">
        <div className="mb-4 text-5xl">&#128268;</div>
        <h1 className="mb-2 text-xl font-bold text-[var(--foreground)]">Du är offline</h1>
        <p className="text-sm text-[var(--foreground-muted)]">
          Anslut till internet för att använda Mello.
        </p>
      </div>
    </div>
  );
}
