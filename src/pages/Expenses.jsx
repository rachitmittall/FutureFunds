import MoneySlider from '../components/MoneySlider'
import { formatINR } from '../utils/formatters'
import { CITY_MINIMUMS } from '../utils/constants'
import AnimatedNumber from '../components/AnimatedNumber'
import { useEffect } from 'react'

const config = [
  { key: 'rent', label: 'Rent', max: 15000, step: 100, defaultValue: 5000, emoji: '🏠' },
  { key: 'food', label: 'Food & Groceries', max: 10000, step: 100, defaultValue: 3000, emoji: '🍔' },
  { key: 'transport', label: 'Transport', max: 5000, step: 100, defaultValue: 1500, emoji: '🚗' },
  { key: 'entertainment', label: 'Entertainment', max: 5000, step: 100, defaultValue: 1000, emoji: '🍿' },
  { key: 'misc', label: 'Miscellaneous', max: 5000, step: 100, defaultValue: 500, emoji: '🛍️' },
]



export function getDefaultExpenses() {
  return config.reduce((acc, c) => ({ ...acc, [c.key]: c.defaultValue }), {})
}

export default function Expenses({ salary, city, expenses, setExpenses, onProceed }) {
  const mins = CITY_MINIMUMS[city] ?? CITY_MINIMUMS.Other

  useEffect(() => {
    setExpenses((prev) => {
      const next = { ...prev }
      for (const k of Object.keys(mins)) {
        next[k] = Math.max(mins[k], Number.isFinite(prev[k]) ? prev[k] : mins[k])
      }
      return next
    })
  }, [mins, setExpenses])

  const totalExpenses = Object.values(expenses).reduce((s, v) => s + (Number.isFinite(v) ? v : 0), 0)
  const totalMinimum = Object.values(mins).reduce((s, v) => s + v, 0)
  const available = Math.max(0, salary - totalExpenses)
  const salaryInsufficient = salary < totalMinimum
  const banner = `Minimums set for ${city} — these reflect real cost of living`
  const dividerClass = 'my-5 h-px w-full bg-gradient-to-r from-transparent via-ff-border to-transparent'

  return (
    <div className="pb-24 md:pb-6 relative z-10">
      <div className="rounded-2xl border border-ff-blue/30 bg-ff-blue/10 px-4 py-3 text-sm font-semibold text-ff-blue shadow-glow-blue">
        {banner}
      </div>
      {salaryInsufficient ? (
        <div className="mt-3 rounded-2xl border border-ff-danger/30 bg-ff-danger/10 px-4 py-3 text-sm font-semibold text-ff-danger shadow-glow-red">
          Your salary may not cover basic living costs in {city}
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-2xl font-extrabold tracking-tight text-white">Monthly Expenses</div>
          <div className="mt-1 text-ff-textSec">Deduct your monthly costs first</div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-ff-card border border-ff-border p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-ff-neon/5 rounded-full blur-2xl"></div>
        <div className="text-sm font-semibold text-ff-textSec">Your monthly salary</div>
        <AnimatedNumber
          value={salary}
          format={formatINR}
          className="mt-1 block text-3xl font-extrabold tracking-tight text-white"
        />
      </div>
      <div className={dividerClass} />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {config.map((c) => (
          <MoneySlider
            key={c.key}
            label={<span className="flex items-center gap-2"><span className="text-lg">{c.emoji}</span> {c.label}</span>}
            min={mins[c.key]}
            max={c.max}
            step={c.step}
            value={expenses[c.key] ?? 0}
            onChange={(val) => setExpenses((e) => ({ ...e, [c.key]: val }))}
            accentColor="#00FF94"
            hint={`Req. min: ${formatINR(mins[c.key])}`}
            hintClassName="text-ff-textMuted"
          />
        ))}
      </div>
      <div className={dividerClass} />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-ff-danger/20 bg-ff-danger/5 p-5 shadow-lg">
          <div className="text-sm font-semibold text-ff-danger/80">Total expenses</div>
          <AnimatedNumber
            value={totalExpenses}
            format={formatINR}
            className="mt-1 block text-2xl font-extrabold tracking-tight text-ff-danger"
          />
        </div>

        <div className="relative rounded-2xl p-0.5 bg-gradient-to-r from-ff-neon to-ff-blue shadow-glow animate-glow">
          <div className="h-full w-full rounded-[14px] bg-ff-card p-5">
            <div className="text-sm font-extrabold text-white">💰 Available to Invest</div>
            <AnimatedNumber
              value={available}
              format={formatINR}
              className="mt-1 block text-4xl font-extrabold tracking-tight text-ff-neon"
            />
            <div className="mt-1 text-sm text-ff-textSec">Updates live as you adjust your expenses.</div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 rounded-2xl bg-ff-bg border border-ff-border p-4 text-sm text-ff-textSec shadow-md">
        Total minimum expenses for {city}:{' '}
        <span className="font-extrabold text-white">
          <AnimatedNumber value={totalMinimum} format={formatINR} />
        </span>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          className="w-full rounded-xl bg-ff-neon px-4 py-3 text-base font-extrabold text-[#0B0F19] shadow-glow transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-ff-neon/50 md:w-auto md:min-w-[256px]"
          onClick={onProceed}
        >
          Proceed to Investments
        </button>
      </div>
    </div>
  )
}

