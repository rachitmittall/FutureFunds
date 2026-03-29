import { useMemo } from 'react'
import { calculatePortfolioHealthScore, generatePortfolioTips } from '../../utils/calculations'

export default function Insights({ allocations, salary, expenses, invested }) {
  const insights = useMemo(() => {
    const { healthScore, healthColor, riskProfile, riskLevel } = calculatePortfolioHealthScore(allocations, salary, expenses)
    const tips = generatePortfolioTips(allocations)
    return { healthScore, healthColor, riskProfile, riskLevel, tips }
  }, [allocations, invested, salary, expenses])

  const circleRadius = 40
  const circleCircumference = 2 * Math.PI * circleRadius
  const dashoffset = circleCircumference - (insights.healthScore / 100) * circleCircumference

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-[#0B0F19] to-ff-card border-x-4 border-x-ff-neon border-y border-y-ff-border p-8 shadow-[0_0_30px_rgba(0,255,148,0.1)]">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-ff-neon/10 text-4xl border border-ff-neon/30 shadow-glow animate-pulse">🤖</div>
          <div className="text-center md:text-left">
            <div className="text-2xl font-extrabold tracking-tight text-white mb-2">FutureFunds AI Insight</div>
            <div className="text-[#94A3B8] text-lg leading-relaxed max-w-3xl">
              Analyzing your portfolio allocations mathematically to assign a health score and provide instant feedback based on standard diversification practices.
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
         <div className="rounded-2xl bg-ff-card border border-ff-border p-8 shadow-lg flex flex-col items-center text-center">
            <h3 className="text-xl font-extrabold text-white mb-2">Portfolio Health Score</h3>
            <p className="text-sm text-ff-textSec mb-8 max-w-sm">Evaluates diversification, savings rate, and risk balance scaling from 0-100.</p>
            
            <div className="relative w-48 h-48 mb-6 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_15px_rgba(0,255,148,0.3)]">
                <circle cx="96" cy="96" r={circleRadius * 2} stroke="#1E2433" strokeWidth="12" fill="none" />
                <circle 
                  cx="96" cy="96" r={circleRadius * 2} 
                  stroke={insights.healthColor} 
                  strokeWidth="12" fill="none" 
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: circleCircumference * 2,
                    strokeDashoffset: dashoffset * 2,
                    transition: 'stroke-dashoffset 1.5s ease-in-out'
                  }}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-5xl font-extrabold" style={{ color: insights.healthColor }}>{insights.healthScore}</span>
                <span className="text-sm font-bold text-ff-textSec mt-1">/ 100</span>
              </div>
            </div>
         </div>

         <div className="flex flex-col gap-6">
           <div className="rounded-2xl bg-ff-card border border-ff-border p-6 shadow-lg">
              <h3 className="text-sm uppercase tracking-widest font-bold text-ff-textSec mb-4">Your Risk Profile</h3>
              <div className="mb-6 flex justify-between items-end">
                <div className="text-3xl font-extrabold text-white">{insights.riskProfile}</div>
              </div>
              <div className="relative w-full h-4 bg-[#1E2433] rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[#3B82F6] via-[#F59E0B] to-[#FF4B4B] opacity-80" />
                <div 
                  className="absolute inset-y-0 w-2 bg-white rounded-full shadow-[0_0_10px_white] transition-all duration-1000"
                  style={{ left: `calc(${insights.riskLevel}% - 4px)` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs font-bold text-ff-textMuted uppercase">
                <span>Low Risk</span>
                <span>High Risk</span>
              </div>
           </div>

           <div className="rounded-2xl bg-ff-card border border-ff-border p-6 shadow-lg flex-1">
              <h3 className="text-sm uppercase tracking-widest font-bold text-ff-textSec mb-4">Actionable Tips</h3>
              {insights.tips.length === 0 ? (
                <div className="text-center py-6 text-ff-textMuted">Not enough data. Invest more to see tips!</div>
              ) : (
                <div className="space-y-3">
                  {insights.tips.map((tip, idx) => (
                    <div key={idx} className={['bg-[#0B0F19] text-white p-4 rounded-xl border-l-4 text-sm font-semibold tracking-wide', tip.color].join(' ')}>
                      {tip.text}
                    </div>
                  ))}
                </div>
              )}
           </div>
         </div>
      </div>
    </div>
  )
}
