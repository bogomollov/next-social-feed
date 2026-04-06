export default function AuthLoading() {
  return (
    <main className="app-shell">
      <div className="auth-grid">
        <section className="rounded-[calc(var(--radius)+0.5rem)] border border-border bg-card p-5 shadow-[var(--shadow-xs)] sm:p-6 lg:p-8" />
        <section className="flex flex-col justify-center">
          <div className="rounded-[calc(var(--radius)+0.5rem)] border border-border bg-card p-5 shadow-[var(--shadow-sm)] sm:p-6 lg:p-8">
            <div className="mb-6 flex flex-col gap-3">
              <div className="h-6 w-32 animate-pulse rounded-md bg-muted" />
              <div className="h-8 w-56 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
            </div>
            <div className="h-px w-full bg-border" />
            <div className="mt-6 grid gap-4">
              <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
              <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
              <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
