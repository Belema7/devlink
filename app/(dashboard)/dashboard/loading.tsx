export default function DashboardLoading() {
  return (
    <div className="container mx-auto space-y-4 px-4 py-8">
      <div className="h-7 w-40 animate-pulse rounded bg-muted" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="h-56 animate-pulse rounded-xl bg-muted" />
        <div className="h-56 animate-pulse rounded-xl bg-muted" />
        <div className="h-56 animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  );
}
