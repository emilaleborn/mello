export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="text-center">
        <div className="mb-4 text-5xl">&#128268;</div>
        <h1 className="mb-2 text-xl font-bold text-white">Du är offline</h1>
        <p className="text-sm text-zinc-400">
          Anslut till internet för att använda Mello.
        </p>
      </div>
    </div>
  );
}
