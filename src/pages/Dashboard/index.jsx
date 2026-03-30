import { useEffect, useMemo, useState } from 'react'
import Overview from './Overview'
import Growth from './Growth'
import TimeMachine from './TimeMachine'
import Insights from './Insights'
import { ASSET_LABELS } from '../../utils/constants'
import { calculateFutureValueMonthly, calculateBlendedRate } from '../../utils/calculations'

const TABS = ['Overview', 'Growth', 'Time Machine', 'Insights']

export default function Dashboard({ salary, totalExpenses, available, allocations, returns, onGoBack }) {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('dashboard_tab') || 'Overview'
  })

  useEffect(() => {
    localStorage.setItem('dashboard_tab', activeTab)
  }, [activeTab])

  const invested = useMemo(() => {
    return Object.values(allocations).reduce((s, v) => s + (Number.isFinite(v) ? v : 0), 0)
  }, [allocations])

  const uninvested = Math.max(0, available - invested)
  
  const pieData = useMemo(() => {
    return Object.keys(ASSET_LABELS).map((key) => ({
      key,
      name: ASSET_LABELS[key],
      value: allocations[key] ?? 0,
    }))
  }, [allocations])
  const totalPie = pieData.reduce((s, d) => s + (Number.isFinite(d.value) ? d.value : 0), 0)

  const blended = useMemo(() => calculateBlendedRate(allocations, returns), [allocations, returns])

  const fiveYearHeroValue = useMemo(() => {
    const result = calculateFutureValueMonthly({
      initial: 0,
      monthly: invested,
      annualRate: blended,
      years: 5,
    })
    return Number.isFinite(result) ? Math.max(0, Math.round(result)) : 0
  }, [invested, blended])

  return (
    <div className="pb-24 md:pb-6 relative z-10 w-full overflow-hidden">
      <div className="bg-[#141820] rounded-2xl p-2 flex overflow-x-auto mb-8 no-scrollbar z-10 relative border border-ff-border shadow-lg">
        {TABS.map(tab => {
          const isActive = activeTab === tab
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={[
                'flex-shrink-0 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 relative whitespace-nowrap',
                isActive ? 'text-white bg-ff-neon/10 shadow-[0_4px_20px_-5px_rgba(0,255,148,0.2)]' : 'text-[#94A3B8] hover:text-white'
              ].join(' ')}
            >
              {tab === 'Overview' ? '📊 ' : tab === 'Growth' ? '📈 ' : tab === 'Time Machine' ? '🕰️ ' : '💡 '}
              {tab}
              {isActive && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-ff-neon rounded-b-xl shadow-[0_0_10px_#00FF94]" />}
            </button>
          )
        })}
      </div>

      <div className="relative animate-fade-in-up" key={activeTab}>
        {activeTab === 'Overview' && (
          <Overview 
            invested={invested} uninvested={uninvested} pieData={pieData} totalPie={totalPie}
            salary={salary} totalExpenses={totalExpenses} onGoBack={onGoBack}
            blended={blended} fiveYearHeroValue={fiveYearHeroValue}
          />
        )}
        {activeTab === 'Growth' && (
          <Growth allocations={allocations} returns={returns} invested={invested} />
        )}
        {activeTab === 'Time Machine' && (
          <TimeMachine invested={invested} allocations={allocations} />
        )}
        {activeTab === 'Insights' && (
          <Insights allocations={allocations} salary={salary} expenses={totalExpenses} invested={invested} />
        )}
      </div>
    </div>
  )
}
