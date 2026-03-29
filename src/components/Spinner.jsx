export default function Spinner({ label = 'Loading…', size = 18 }) {
  return (
    <div className="inline-flex items-center gap-2 text-sm text-emerald-950/70">
      <span
        className="inline-block animate-spin rounded-full border-2 border-emerald-950/10 border-t-[#10B981]"
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
      <span>{label}</span>
    </div>
  )
}

