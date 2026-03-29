export function SkeletonLine({ className = '' }) {
  return (
    <div
      className={[
        'h-4 w-full animate-pulse rounded-lg bg-emerald-900/10',
        className,
      ].join(' ')}
      aria-hidden="true"
    />
  )
}

export function SkeletonCard({ rows = 3 }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-md">
      <div className="flex items-center justify-between gap-3">
        <SkeletonLine className="h-5 w-40" />
        <SkeletonLine className="h-5 w-24" />
      </div>
      <div className="mt-4 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonLine key={i} />
        ))}
        <SkeletonLine className="mt-6 h-3 w-1/2" />
      </div>
    </div>
  )
}

