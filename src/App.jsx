import { useEffect, useMemo, useState } from 'react'
import { IndianRupee } from 'lucide-react'
import BottomNav from './components/BottomNav'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Expenses, { getDefaultExpenses } from './pages/Expenses'
import Home from './pages/Home'
import Investments from './pages/Investments'
import { formatINR } from './utils/formatters'
import { ASSET_RETURNS } from './utils/constants'

const STORAGE_KEY = 'futurefunds.portfolio.v1'

function clampAllocationsToAvailable(allocations, available) {
  const keys = ['stocks', 'mutualFunds', 'gold', 'silver', 'fd', 'crypto']
  const next = { ...allocations }
  let total = keys.reduce((s, k) => s + (Number.isFinite(next[k]) ? next[k] : 0), 0)
  if (total <= available) return next

  for (const k of keys) {
    if (total <= available) break
    const v = Number.isFinite(next[k]) ? next[k] : 0
    const reducible = Math.min(v, total - available)
    next[k] = Math.max(0, v - reducible)
    total -= reducible
  }
  return next
}

export default function App() {
  const [current, setCurrent] = useState('home')
  const [student, setStudent] = useState({ name: '', salary: 20000, city: 'Delhi' })
  const [expenses, setExpenses] = useState(getDefaultExpenses())
  const [allocations, setAllocations] = useState({
    stocks: 0,
    mutualFunds: 0,
    gold: 0,
    silver: 0,
    fd: 0,
    crypto: 0,
  })
  const [stockPortfolio, setStockPortfolio] = useState({})
  const [lastSavedAt, setLastSavedAt] = useState(null)
  const [toast, setToast] = useState(false)
  const [hasSavedData, setHasSavedData] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const data = JSON.parse(raw)
      if (data.student) setStudent(data.student)
      if (data.expenses) setExpenses(data.expenses)
      if (data.allocations) setAllocations(data.allocations)
      if (data.stockPortfolio) setStockPortfolio(data.stockPortfolio)
      if (data.current) setCurrent(data.current)
      if (data.lastSavedAt) setLastSavedAt(data.lastSavedAt)
      setHasSavedData(true)
    } catch {
      // ignore
    }
  }, [])

  const salary = Number.isFinite(student.salary) ? student.salary : 0
  const totalExpenses = useMemo(() => {
    return Object.values(expenses).reduce((s, v) => s + (Number.isFinite(v) ? v : 0), 0)
  }, [expenses])
  const available = Math.max(0, salary - totalExpenses)
  const totalInvested = useMemo(
    () => Object.values(allocations).reduce((s, v) => s + (Number.isFinite(v) ? v : 0), 0),
    [allocations],
  )

  useEffect(() => {
    setAllocations((a) => clampAllocationsToAvailable(a, available))
  }, [available])

  useEffect(() => {
    const payload = {
      current,
      student,
      expenses,
      allocations,
      stockPortfolio,
      lastSavedAt: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    setLastSavedAt(payload.lastSavedAt)
    setToast(true)
    const timer = setTimeout(() => setToast(false), 1200)
    return () => clearTimeout(timer)
  }, [current, student, expenses, allocations, stockPortfolio])

  function resetPortfolio() {
    const ok = window.confirm('Reset your portfolio and clear saved data?')
    if (!ok) return
    localStorage.removeItem(STORAGE_KEY)
    setCurrent('home')
    setStudent({ name: '', salary: 20000, city: 'Delhi' })
    setExpenses(getDefaultExpenses())
    setAllocations({ stocks: 0, mutualFunds: 0, gold: 0, silver: 0, fd: 0, crypto: 0 })
    setStockPortfolio({})
    setHasSavedData(false)
    setLastSavedAt(null)
  }

  const content = useMemo(() => {
    if (current === 'expenses') {
      return (
        <Expenses
          salary={salary}
          city={student.city}
          expenses={expenses}
          setExpenses={setExpenses}
          onProceed={() => setCurrent('investments')}
        />
      )
    }
    if (current === 'investments') {
      return (
        <Investments
          available={available}
          allocations={allocations}
          setAllocations={setAllocations}
          stockPortfolio={stockPortfolio}
          setStockPortfolio={setStockPortfolio}
          onProceed={() => setCurrent('dashboard')}
        />
      )
    }
    if (current === 'dashboard') {
      return (
        <Dashboard
          salary={salary}
          totalExpenses={totalExpenses}
          available={available}
          allocations={allocations}
          returns={ASSET_RETURNS}
          onGoBack={() => setCurrent('investments')}
        />
      )
    }
    return (
      <Home
        student={student}
        setStudent={setStudent}
        hasSavedData={hasSavedData}
        onStart={() => setCurrent('expenses')}
      />
    )
  }, [allocations, available, current, expenses, salary, student, totalExpenses, stockPortfolio, hasSavedData])

  const stepIdx = { home: 1, expenses: 2, investments: 3, dashboard: 4 }[current]
  const helpText =
    current === 'home'
      ? 'Fill your profile and start simulating.'
      : current === 'expenses'
        ? 'Set monthly costs first, then invest the remainder.'
        : current === 'investments'
          ? 'Pick assets and keep total allocation within available money.'
          : 'Review your projections and try time travel scenarios.'

  return (
    <div className="min-h-screen bg-ff-bg">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <Sidebar
          current={current}
          onNavigate={setCurrent}
          student={student}
          totalExpenses={totalExpenses}
          available={available}
          totalInvested={totalInvested}
          lastSavedAt={lastSavedAt}
          onReset={resetPortfolio}
        />

        <main className="flex-1">
          <div className="px-4 pt-4 md:px-8">
            <div className="rounded-xl bg-ff-card border border-ff-border px-4 py-3 shadow-md">
              <div className="grid grid-cols-4 gap-2 text-xs font-semibold md:text-sm">
                {['Profile', 'Expenses', 'Investments', 'Dashboard'].map((s, idx) => {
                  const done = idx + 1 < stepIdx
                  const active = idx + 1 === stepIdx
                  return (
                    <div key={s} className={['rounded-lg px-2 py-1 text-center transition-colors', active ? 'bg-ff-neon/10 text-ff-neon ring-1 ring-ff-neon/50 shadow-glow' : done ? 'bg-ff-card text-ff-neon border border-ff-border' : 'bg-ff-card text-ff-textMuted border border-ff-border'].join(' ')}>
                      {done ? '✓ ' : ''}Step {idx + 1}: {s}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="sticky top-0 z-30 border-b border-ff-border bg-ff-bg/95 backdrop-blur md:hidden">
            <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-ff-neon/20 text-ff-neon">
                  <IndianRupee className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="text-lg font-extrabold tracking-tight text-white">Future<span className="text-ff-neon">Funds</span></div>
              </div>
              <div className="text-xs font-semibold text-ff-textSec">Learn to invest before you earn</div>
            </div>
          </div>

          <div className="mx-auto max-w-3xl px-4 py-6 md:max-w-none md:px-8">
            <div key={current} className="animate-fade-in-up">
              {content}
            </div>
          </div>
        </main>
      </div>

      <button
        type="button"
        onClick={() => setHelpOpen((v) => !v)}
        className="fixed bottom-24 right-4 z-40 grid h-12 w-12 place-items-center rounded-full bg-ff-border border border-ff-neon/50 text-xl font-extrabold text-ff-neon shadow-glow md:bottom-6 hover:bg-ff-border/80 transition"
      >
        ?
      </button>
      {helpOpen ? (
        <div className="fixed bottom-40 right-4 z-40 w-64 rounded-xl bg-ff-card border border-ff-border p-3 text-sm text-ff-text shadow-lg md:bottom-20">
          {helpText}
        </div>
      ) : null}

      {toast ? (
        <div className="fixed right-4 top-4 z-50 rounded-lg bg-ff-neon/20 border border-ff-neon px-3 py-2 text-xs font-bold text-ff-neon shadow-glow">
          Auto-saved
        </div>
      ) : null}

      <BottomNav current={current} onNavigate={setCurrent} />
    </div>
  )
}
