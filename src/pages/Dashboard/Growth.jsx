import { useMemo } from 'react'
import { Area, ComposedChart, CartesianGrid, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatINR } from '../../utils/formatters'
import { calculateFutureValueMonthly } from '../../utils/calculations'
import { COLORS, ASSET_LABELS } from '../../utils/constants'

export default function Growth({ allocations, returns, invested }) {
  const bestKey = useMemo(() => {
    const candidates = Object.keys(ASSET_LABELS)
    let best = candidates[0]
    let bestVal = -Infinity
    for (const k of candidates) {
      const val = calculateFutureValueMonthly({
        initial: allocations[k] ?? 0,
        monthly: allocations[k] ?? 0,
        annualRate: returns[k] ?? 0,
        years: 5,
      })
      if (val > bestVal) {
        bestVal = val
        best = k
      }
    }
    return best
  }, [allocations, returns])

  const bestVal5Y = useMemo(() => {
    return calculateFutureValueMonthly({
      initial: allocations[bestKey] ?? 0,
      monthly: allocations[bestKey] ?? 0,
      annualRate: returns[bestKey] ?? 0,
      years: 5,
    })
  }, [allocations, returns, bestKey])

  const growthData = useMemo(() => {
    const years = [0, 1, 2, 3, 4, 5]
    return years.map((y) => {
      const row = { year: `Year ${y}` }
      let total = 0
      for (const k of Object.keys(ASSET_LABELS)) {
        const v = calculateFutureValueMonthly({
          initial: allocations[k] ?? 0,
          monthly: allocations[k] ?? 0,
          annualRate: returns[k] ?? 0,
          years: y,
        })
        row[k] = Math.round(v)
        total += v
      }
      row.total = Math.round(total)
      return row
    })
  }, [allocations, returns])

  const tableRows = useMemo(() => {
    const years = [1, 3, 5]
    return Object.keys(ASSET_LABELS).map((k) => {
      const initial = allocations[k] ?? 0
      const monthly = allocations[k] ?? 0
      const annualRate = returns[k] ?? 0
      const values = years.map((y) => calculateFutureValueMonthly({ initial, monthly, annualRate, years: y }))
      return { key: k, name: ASSET_LABELS[k], invested: initial, values }
    })
  }, [allocations, returns])

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-ff-border bg-ff-card shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-extrabold text-white">5-Year Projection</h2>
          <p className="text-sm text-ff-textSec">Total portfolio growth tracking individual asset lines</p>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={growthData} margin={{ left: 6, right: 12, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00FF94" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#00FF94" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2433" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: '#94A3B8', fontSize: 12 }} stroke="#1E2433" />
              <YAxis tickFormatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`} width={80} tick={{ fill: '#94A3B8', fontSize: 12 }} stroke="#1E2433" />
              <Tooltip 
                formatter={(v) => formatINR(v)} 
                contentStyle={{ backgroundColor: '#141820', borderColor: '#1E2433', color: '#fff', borderRadius: '12px' }}
              />
              <Legend wrapperStyle={{ color: '#94A3B8', paddingTop: '20px' }} />
              <Line type="monotone" dataKey="stocks" stroke={COLORS.stocks} dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="mutualFunds" stroke={COLORS.mutualFunds} dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="gold" stroke={COLORS.gold} dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="fd" stroke={COLORS.fd} dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="crypto" stroke={COLORS.crypto} dot={false} strokeWidth={2} />
              <Area type="monotone" dataKey="total" stroke="#00FF94" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={3} name="Total Portfolio" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {invested > 0 && (
        <div className="rounded-2xl tracking-wide bg-gradient-to-r from-ff-neon/20 to-ff-card border border-ff-neon/50 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-glow">
          <div>
            <div className="text-ff-neon font-extrabold text-sm uppercase tracking-widest mb-1">🏆 Best Performer</div>
            <div className="text-2xl font-bold text-white">{ASSET_LABELS[bestKey]}</div>
          </div>
          <div className="text-left md:text-right">
            <div className="text-sm text-[#94A3B8]">Expected to reach</div>
            <div className="text-3xl font-extrabold font-mono text-white drop-shadow-md">{formatINR(bestVal5Y)}</div>
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-ff-card border border-ff-border overflow-hidden shadow-lg">
        <div className="p-6 border-b border-ff-border">
          <h3 className="text-lg font-extrabold text-white tracking-tight">Investment Breakdown</h3>
          <p className="text-sm text-ff-textSec mt-1">Expected values with compounding monthly contributions</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm whitespace-nowrap border-collapse">
            <thead className="bg-[#064E3B] text-white">
              <tr>
                <th className="py-4 px-6 font-bold tracking-wider text-xs uppercase">Name</th>
                <th className="py-4 px-6 font-bold tracking-wider text-xs uppercase">Amount Invested</th>
                <th className="py-4 px-6 font-bold tracking-wider text-xs uppercase">Expected (1y)</th>
                <th className="py-4 px-6 font-bold tracking-wider text-xs uppercase">Expected (3y)</th>
                <th className="py-4 px-6 font-bold tracking-wider text-xs uppercase text-ff-neon">Expected (5y)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ff-border">
              {tableRows.map((r, i) => {
                const highlight = r.key === bestKey
                return (
                  <tr key={r.key} className={[i % 2 === 0 ? 'bg-[#141820]' : 'bg-[#0F1419]', highlight ? 'hover:bg-ff-neon/10' : 'hover:bg-ff-card/80', 'transition'].join(' ')}>
                    <td className="py-4 px-6 font-bold">
                      <span className={highlight ? 'bg-ff-neon/20 text-ff-neon border border-ff-neon/50 px-3 py-1.5 rounded-full inline-block shadow-glow' : 'text-white'}>
                        {r.name}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-ff-textSec font-mono">{formatINR(r.invested)}</td>
                    <td className="py-4 px-6 text-[#94A3B8] font-mono">{formatINR(r.values[0])}</td>
                    <td className="py-4 px-6 text-[#94A3B8] font-mono">{formatINR(r.values[1])}</td>
                    <td className={['py-4 px-6 font-bold font-mono text-base', highlight ? 'text-ff-neon drop-shadow-glow' : 'text-white'].join(' ')}>
                      {formatINR(r.values[2])}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
