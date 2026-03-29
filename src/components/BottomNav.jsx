import { BarChart3, Home, TrendingUp, Wallet } from 'lucide-react'

const items = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'expenses', label: 'Expenses', icon: Wallet },
  { key: 'investments', label: 'Invest', icon: TrendingUp },
  { key: 'dashboard', label: 'Dash', icon: BarChart3 },
]

export default function BottomNav({ current, onNavigate }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-ff-border bg-ff-bg/95 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-3xl grid-cols-4 px-2 py-2">
        {items.map(({ key, label, icon: Icon }) => {
          const active = key === current
          return (
            <button
              key={key}
              type="button"
              onClick={() => onNavigate(key)}
              className={[
                'flex flex-col items-center justify-center gap-1 py-1 text-xs font-semibold transition',
                active ? 'text-ff-neon' : 'text-ff-textSec hover:text-white',
              ].join(' ')}
            >
              <div className={['grid h-8 w-12 place-items-center rounded-full transition-all', active ? 'bg-ff-neon/20 shadow-glow' : 'bg-transparent'].join(' ')}>
                <Icon className={['h-5 w-5', active ? 'text-ff-neon' : 'text-ff-textMuted'].join(' ')} />
              </div>
              <span>{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

