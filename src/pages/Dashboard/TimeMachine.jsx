import { useState, useMemo } from 'react'
import { BarChart, Bar, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatINR } from '../../utils/formatters'
import { calculateFutureValueMonthly } from '../../utils/calculations'
import { ASSET_LABELS, HISTORICAL_RETURNS } from '../../utils/constants'

export default function TimeMachine({ invested, allocations }) {
  const [startedYearsAgo, setStartedYearsAgo] = useState(10)

  const historical = useMemo(() => {
    const years = startedYearsAgo
    const totalInvestedAmt = invested * 12 * years
    const assets = Object.keys(ASSET_LABELS).map((k) => {
      const amount = allocations[k] ?? 0
      const worth = calculateFutureValueMonthly({
        initial: 0,
        monthly: amount,
        annualRate: HISTORICAL_RETURNS[k],
        years,
      })
      return { key: k, name: ASSET_LABELS[k], invested: amount * 12 * years, worth }
    })
    const totalWorth = assets.reduce((s, a) => s + a.worth, 0)
    const multiple = totalInvestedAmt > 0 ? totalWorth / totalInvestedAmt : 0
    return { assets, totalInvestedAmt, totalWorth, multiple }
  }, [startedYearsAgo, invested, allocations])

  const historicalMsg =
    historical.totalWorth > 10000000
      ? "You'd be a CROREPATI today! 👑"
      : historical.totalWorth > 5000000
        ? "You'd be on your way to being a crorepati! 🚀"
        : historical.totalWorth > 1000000
          ? "You'd be a lakhpati today! 🎉"
          : 'Small starts create big futures.'

  return (
    <div className="rounded-3xl bg-ff-card border border-ff-border p-6 md:p-10 shadow-lg relative overflow-hidden">
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-ff-gold/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="text-center mb-12 relative z-10">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">🕰️ What If You Had Started Earlier?</h1>
        <p className="text-lg text-ff-textSec max-w-2xl mx-auto">
          Imagine you invested <span className="text-white font-bold">{formatINR(invested)}</span> every month consistently starting <span className="text-white font-bold">{startedYearsAgo}</span> years ago.
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto mb-16 relative z-10 bg-[#0B0F19] p-8 rounded-2xl border border-ff-border shadow-inner">
         <div className="text-center text-sm font-bold text-ff-textSec uppercase tracking-widest mb-6">Select Years Ago</div>
         <input
          type="range"
          min={1}
          max={20}
          step={1}
          value={startedYearsAgo}
          onChange={(e) => setStartedYearsAgo(Number(e.target.value))}
          className="w-full h-3 rounded-full appearance-none outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_20px_#F59E0B] [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-[0_0_20px_#F59E0B]"
          style={{
            background: `linear-gradient(90deg, #F59E0B 0%, #F59E0B ${(startedYearsAgo/20)*100}%, #1E2433 ${(startedYearsAgo/20)*100}%, #1E2433 100%)`
          }}
        />
        <div className="mt-4 flex justify-between text-sm font-bold text-[#F59E0B]">
          <span>1 Year</span>
          <span>{startedYearsAgo} Years</span>
          <span>20 Years</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 relative z-10 max-w-5xl mx-auto mb-10">
        <div className="rounded-2xl bg-[#0B0F19] border border-ff-border p-8 text-center shadow-lg transition hover:scale-105">
          <div className="text-sm font-bold uppercase tracking-widest text-[#94A3B8] mb-4">📅 Monthly SIP</div>
          <div className="text-3xl lg:text-4xl font-extrabold text-white font-mono">{formatINR(invested)}</div>
        </div>
        <div className="rounded-2xl border-2 border-ff-blue/40 bg-ff-blue/5 p-8 text-center shadow-[0_0_30px_rgba(59,130,246,0.1)] transition hover:scale-105">
          <div className="text-sm font-bold uppercase tracking-widest text-ff-blue mb-4">💰 Amount Put In</div>
          <div className="text-3xl lg:text-4xl font-extrabold text-white font-mono">{formatINR(historical.totalInvestedAmt)}</div>
        </div>
        <div className="rounded-2xl border-2 border-ff-neon bg-ff-neon/10 p-8 text-center shadow-[0_0_40px_rgba(0,255,148,0.2)] transition hover:scale-105 relative overflow-hidden">
          <div className="text-sm font-bold uppercase tracking-widest text-ff-neon mb-4">🚀 What It Grew To</div>
          <div className="text-4xl lg:text-5xl font-extrabold text-ff-neon font-mono drop-shadow-glow">{formatINR(historical.totalWorth)}</div>
          <div className="mt-3 text-sm font-bold text-white bg-ff-neon/20 py-1 rounded inline-block px-3">
            {historical.multiple.toFixed(2)}x Growth
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto rounded-2xl border border-ff-border bg-[#0B0F19] p-6 relative z-10 mb-12 shadow-sm">
        <div className="text-sm font-extrabold text-[#94A3B8] text-center mb-6 uppercase tracking-widest">How this compounding works</div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
          <div><div className="text-xs text-ff-textMuted mb-1">Per Month</div><div className="px-4 py-2 bg-ff-card border border-ff-border rounded-lg text-white font-mono font-bold text-lg">{formatINR(invested)}</div></div>
          <div className="text-ff-textMuted font-bold text-xl">×</div>
          <div><div className="text-xs text-ff-textMuted mb-1">Months</div><div className="px-4 py-2 bg-ff-card border border-ff-border rounded-lg text-white font-mono font-bold text-lg">12</div></div>
          <div className="text-ff-textMuted font-bold text-xl">×</div>
          <div><div className="text-xs text-ff-textMuted mb-1">Years</div><div className="px-4 py-2 bg-ff-card border border-ff-border rounded-lg text-white font-mono font-bold text-lg">{startedYearsAgo}</div></div>
          <div className="text-ff-textMuted font-bold text-xl">=</div>
          <div><div className="text-xs text-ff-textMuted mb-1">Total Put In</div><div className="px-4 py-2 bg-ff-card border border-ff-blue border-b-2 rounded-lg text-white font-mono font-bold text-xl drop-shadow-md">{formatINR(historical.totalInvestedAmt)}</div></div>
        </div>
      </div>

      <div className="h-80 w-full relative z-10 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={historical.assets} margin={{ top: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2433" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 13, fontWeight: 'bold' }} stroke="#1E2433" />
            <YAxis tickFormatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`} width={80} tick={{ fill: '#94A3B8', fontSize: 12 }} stroke="#1E2433" />
            <Tooltip formatter={(v) => formatINR(v)} cursor={{fill: '#1E2433', opacity: 0.4}} contentStyle={{ backgroundColor: '#141820', borderColor: '#1E2433', color: '#fff', borderRadius: '12px' }} />
            <Legend wrapperStyle={{ color: '#94A3B8', paddingTop: '20px' }} />
            <Bar dataKey="invested" fill="#4B5563" name="Amount Put In" radius={[4, 4, 0, 0]} />
            <Bar dataKey="worth" fill="#00FF94" name="Worth Today" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="text-center mt-12 relative z-10">
        <div className="inline-block px-8 py-4 bg-ff-neon/10 border-2 border-ff-neon rounded-2xl text-2xl md:text-3xl font-extrabold text-ff-neon drop-shadow-glow shadow-[0_0_30px_rgba(0,255,148,0.2)]">
          {historicalMsg}
        </div>
      </div>
    </div>
  )
}
