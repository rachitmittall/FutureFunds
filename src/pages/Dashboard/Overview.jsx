import { useState, useMemo } from 'react'
import { Pie, PieChart, ResponsiveContainer, Tooltip, Legend, Cell } from 'recharts'
import AnimatedNumber from '../../components/AnimatedNumber'
import { formatINR } from '../../utils/formatters'
import { calculateFutureValueMonthly } from '../../utils/calculations'
import { COLORS } from '../../utils/constants'

function pctLabel(value, total) {
  if (total <= 0) return '0%'
  return `${Math.round((value / total) * 100)}%`
}

export default function Overview({ invested, uninvested, pieData, totalPie, salary, totalExpenses, onGoBack, blended, fiveYearHeroValue }) {
  const [fastYears, setFastYears] = useState(10)

  const fastForwardValue = useMemo(() => {
    return calculateFutureValueMonthly({
      initial: invested,
      monthly: invested,
      annualRate: blended,
      years: fastYears,
    })
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
              <div className="text-lg font-extrabold tracking-tight text-white">Fast Forward</div>
              <div className="mt-1 text-sm text-ff-textSec">Project ahead {fastYears} years</div>
            </div>
            <div className="text-xs font-semibold text-ff-textSec bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
              Blended return: <span className="font-extrabold text-white ml-1">{Math.round(blended * 100)}%</span>
            </div>
          </div>

          <div className="relative z-10 mb-8">
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={fastYears}
              onChange={(e) => setFastYears(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-glow [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-glow"
              style={{
                background: `linear-gradient(90deg, #3B82F6 0%, #00FF94 ${(fastYears/30)*100}%, #1E2433 ${(fastYears/30)*100}%, #1E2433 100%)`
              }}
            />
            <div className="mt-3 flex justify-between text-xs font-bold text-[#94A3B8]">
              <span>1y</span>
              <span>30y</span>
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
