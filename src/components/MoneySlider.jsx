import { formatINR, formatChange } from '../utils/formatters'

export default function MoneySlider({
  label,
  value,
  min = 0,
  max,
  step = 100,
  onChange,
  hint,
  hintClassName = 'text-ff-textSec',
  accentColor = '#10B981',
}) {
  // Calculate percentage for gradient fill
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100)) || 0;

  return (
    <div className="rounded-2xl bg-ff-card border border-ff-border p-5 shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-semibold text-white">{label}</div>
          {hint ? <div className={['mt-0.5 text-sm', hintClassName].join(' ')}>{hint}</div> : null}
        </div>
        <div className="shrink-0 rounded-xl bg-ff-bg border border-ff-border px-3 py-1.5 font-bold text-ff-neon shadow-sm">
          {formatINR(value)}
        </div>
      </div>

      <div className="mt-5">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 appearance-none rounded-full outline-none transition cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_15px_#00FF94] [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-[0_0_15px_#00FF94]"
          style={{
            background: `linear-gradient(90deg, #3B82F6 0%, #00FF94 ${percentage}%, #1E2433 ${percentage}%, #1E2433 100%)`,
          }}
        />
        <div className="mt-2 flex justify-between text-xs font-semibold text-ff-textMuted">
          <span>{formatINR(min)}</span>
          <span>{formatINR(max)}</span>
        </div>
      </div>
    </div>
  )
}

