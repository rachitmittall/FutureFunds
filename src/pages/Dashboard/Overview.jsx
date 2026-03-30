import { useState, useMemo } from 'react'
import { Pie, PieChart, ResponsiveContainer, Tooltip, Legend, Cell } from 'recharts'
import AnimatedNumber from '../../components/AnimatedNumber'
import { formatINR } from '../../utils/formatters'
import { COLORS } from '../../utils/constants'
import { calculateSIPReturns } from '../../utils/calculations'

function pctLabel(value, total) {
  if (total <= 0) return '0%'
  return `${Math.round((value / total) * 100)}%`
}

export default function Overview({ invested, uninvested, pieData, totalPie, salary, totalExpenses, onGoBack, blended, fiveYearHeroValue }) {
  const [fastYears, setFastYears] = useState(10)

  const fastForwardValue = useMemo(() => {
    if (!Number.isFinite(invested) || invested <= 0) return 0
    
    // blended can be 0 (returns just the principal), but not negative
    const safeRate = Math.max(0, blended || 0)
    
    const result = calculateSIPReturns({
      monthly: invested,
      annualRate: safeRate,
      years: fastYears
    })
    
    return Number.isFinite(result) ? Math.max(0, Math.round(result)) : 0
  }, [invested, blended, fastYears])

  if (invested === 0) {
    return (
      <div className="rounded-2xl border border-ff-border bg-ff-card p-10 text-center shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-ff-neon/5 blur-[100px]" />
        <h2 className="text-3xl font-extrabold text-white mb-3 relative z-10">No investments yet!</h2>
        <p className="text-ff-textSec mb-8 text-lg relative z-10">Start allocating your available funds to see projections and unlock your dashboard.</p>
        <button 
          onClick={onGoBack} 
          className="rounded-full bg-ff-neon px-8 py-3 text-lg font-bold text-[#0B0F19] shadow-glow hover:brightness-110 transition hover:scale-105 active:scale-95 relative z-10"
        >
          Go to Investments →
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center py-10 bg-ff-card rounded-3xl border border-ff-border shadow-lg relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-ff-neon/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="text-sm font-extrabold uppercase tracking-widest text-[#94A3B8] mb-3 relative z-10">Your Portfolio in 5 Years</div>
        <AnimatedNumber 
          value={fiveYearHeroValue} 
          format={formatINR} 
          className="text-5xl md:text-7xl font-extrabold text-ff-neon drop-shadow-glow block relative z-10 font-mono tracking-tight" 
        />
        <div className="mt-4 text-[#94A3B8] text-sm md:text-base relative z-10">Assuming regular SIPs of <span className="text-white font-bold font-mono">{formatINR(invested)}</span> / month</div>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border-2 border-ff-neon bg-ff-card p-5 shadow-lg relative overflow-hidden">
          <div className="text-sm font-semibold text-ff-textSec">💰 Monthly Salary</div>
          <AnimatedNumber value={salary} format={formatINR} className="mt-2 block text-2xl font-extrabold text-white font-mono" />
        </div>
        <div className="rounded-2xl border-2 border-[#FF4B4B] bg-ff-card p-5 shadow-lg relative overflow-hidden">
          <div className="text-sm font-semibold text-ff-textSec">📤 Total Expenses</div>
          <AnimatedNumber value={totalExpenses} format={formatINR} className="mt-2 block text-2xl font-extrabold text-[#FF4B4B] font-mono drop-shadow-[0_0_10px_rgba(255,75,75,0.4)]" />
        </div>
        <div className="rounded-2xl border-2 border-[#3B82F6] bg-ff-card p-5 shadow-lg relative overflow-hidden">
          <div className="text-sm font-semibold text-ff-textSec">📈 Total Invested</div>
          <AnimatedNumber value={invested} format={formatINR} className="mt-2 block text-2xl font-extrabold text-[#3B82F6] font-mono drop-shadow-[0_0_10px_rgba(59,130,246,0.4)]" />
        </div>
        <div className="rounded-2xl border-2 border-[#F59E0B] bg-ff-card p-5 shadow-lg relative overflow-hidden">
          <div className="text-sm font-semibold text-ff-textSec">💵 Uninvested</div>
          <AnimatedNumber value={uninvested} format={formatINR} className="mt-2 block text-2xl font-extrabold text-white font-mono drop-shadow-[0_0_10px_rgba(245,158,11,0.4)]" />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-ff-card border border-ff-border p-6 shadow-lg">
          <div className="text-lg font-extrabold tracking-tight text-white mb-6">Allocation</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={95}
                  innerRadius={65}
                  label={({ value }) => pctLabel(value, totalPie)}
                  stroke="none"
                  fill="#1E2433"
                >
                  {pieData.map((d) => (
                    <Cell key={d.key} fill={COLORS[d.key]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(v) => formatINR(v)} 
                  contentStyle={{ backgroundColor: '#141820', borderColor: '#1E2433', color: '#fff', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#94A3B8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-ff-card to-ff-bg border border-ff-border p-6 shadow-lg overflow-hidden relative">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-ff-blue/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="flex flex-wrap items-end justify-between gap-3 relative z-10 mb-8">
            <div>
              <div className="text-lg font-extrabold tracking-tight text-white uppercase tracking-wider">Fast Forward</div>
              <div className="mt-1 text-sm text-ff-textSec">Select a milestone</div>
            </div>
            
            <div className="flex bg-ff-bg rounded-lg p-1 border border-ff-border overflow-hidden">
              {[1, 5, 10].map((y) => (
                <button
                  key={y}
                  onClick={() => setFastYears(y)}
                  className={[
                    'px-4 py-1.5 rounded-md text-xs font-bold transition-all relative z-20',
                    fastYears === y 
                      ? 'bg-ff-neon text-[#0B0F19] shadow-[0_0_15px_rgba(0,255,148,0.4)]' 
                      : 'text-ff-textMuted hover:text-white'
                  ].join(' ')}
                >
                  {y}Y
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-[#0B0F19] border border-ff-border p-5 relative z-10 shadow-inner">
            <div className="text-sm font-semibold text-ff-textSec">
              In {fastYears} years, you reach:
            </div>
            <AnimatedNumber value={fastForwardValue} format={formatINR} className="mt-2 block text-4xl font-extrabold tracking-tight text-ff-neon drop-shadow-glow md:text-5xl font-mono" />
          </div>
        </div>
      </div>
    </div>
  )
}
