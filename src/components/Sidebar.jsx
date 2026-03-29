import { BarChart3, Home, IndianRupee, TrendingUp, Wallet } from 'lucide-react'
import { formatINR } from '../utils/formatters'

const items = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'expenses', label: 'Expenses', icon: Wallet },
  { key: 'investments', label: 'Investments', icon: TrendingUp },
  { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
]

export default function Sidebar({ current, onNavigate, student, totalExpenses, availableToInvest, totalInvested, lastSavedAt, onReset }) {
  return (
    <aside className="hidden md:flex md:w-72 md:flex-col md:gap-6 bg-ff-sidebar border-r border-ff-border p-5">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-ff-neon/10 text-ff-neon shadow-glow">
          <IndianRupee className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <div className="text-xl font-extrabold tracking-tight text-white">Future<span className="text-ff-neon">Funds</span></div>
          <div className="text-xs font-semibold text-ff-textSec">Learn to invest before you earn.</div>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {items.map(({ key, label, icon: Icon }) => {
          const active = key === current
          return (
            <button
              key={key}
              type="button"
              onClick={() => onNavigate(key)}
              className={[
                'relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left font-semibold transition',
                active
                  ? 'bg-ff-card text-white border-l-4 border-ff-neon shadow-glow'
                  : 'text-ff-textSec hover:bg-ff-card/50 hover:text-white',
              ].join(' ')}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span>{label}</span>
            </button>
          )
        })}
      </nav>

      <div className="mt-auto rounded-2xl bg-ff-card border border-ff-border p-5 shadow-lg">
        {student?.name ? (
          <>
            <div className="text-xs font-extrabold uppercase tracking-widest text-ff-textMuted mb-3">Your Portfolio</div>
            <div className="h-px w-full bg-gradient-to-r from-ff-border to-transparent mb-4" />
            
            <div className="font-bold text-white truncate text-base">👤 {student.name} <span className="text-ff-textMuted font-normal ml-1 text-sm">• {student.city || '—'}</span></div>
            
            <div className="mt-5 space-y-2.5 text-sm font-semibold">
              <div className="flex justify-between items-center"><span className="text-ff-textSec">💰 Salary</span><span className="font-mono text-white">{formatINR(student.salary || 0)}</span></div>
              <div className="flex justify-between items-center"><span className="text-ff-textSec">📤 Expenses</span><span className="font-mono text-ff-danger">{formatINR(totalExpenses || 0)}</span></div>
              <div className="flex justify-between items-center"><span className="text-ff-textSec">📈 Invested</span><span className="font-mono text-ff-neon">{formatINR(totalInvested || 0)}</span></div>
              <div className="flex justify-between items-center"><span className="text-ff-textSec">💵 Available</span><span className="font-mono text-ff-blue">{formatINR(availableToInvest || 0)}</span></div>
            </div>
            
            <div className="mt-5 text-[10px] text-ff-textMuted uppercase tracking-widest">
              Last saved: {lastSavedAt ? new Date(lastSavedAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }) : '--'}
            </div>
            
            <button
              type="button"
              onClick={onReset}
              className="mt-4 w-full rounded-xl border border-ff-danger text-ff-danger bg-transparent px-3 py-2.5 text-xs font-bold hover:bg-ff-danger/10 transition"
            >
              Reset Portfolio
            </button>
          </>
        ) : (
          <div className="text-sm font-semibold text-ff-textMuted leading-relaxed">
            👋 Complete your profile<br/>to get started →
          </div>
        )}
      </div>
    </aside>
  )
}

