import { useEffect, useMemo, useRef, useState } from 'react'
import MoneySlider from '../components/MoneySlider'
import AnimatedNumber from '../components/AnimatedNumber'
import { SkeletonLine } from '../components/Skeleton'
import { clamp } from '../utils/calculations'
import { formatINR } from '../utils/formatters'
import { FALLBACK_STOCK_PRICES, FALLBACK_CRYPTO_PRICES, FALLBACK_METAL_PRICES, FALLBACK_MF_PRICES } from '../utils/constants'

function StatusBadge({ status }) {
  if (status === 'live') {
    return (
      <span className="ml-2 rounded-full border border-ff-neon/30 bg-ff-neon/10 px-2 py-0.5 text-[10px] text-ff-neon shadow-glow">
        LIVE
      </span>
    )
  }
  return (
    <span className="ml-2 rounded-full border border-ff-textMuted/30 bg-ff-textMuted/10 px-2 py-0.5 text-[10px] text-ff-textMuted">
      INDICATIVE
    </span>
  )
}

function MiniSparkline({ up }) {
  const points = up 
    ? "0,15 5,12 10,14 15,8 20,10 25,4 30,5" 
    : "0,5 5,8 10,6 15,12 20,10 25,16 30,15"
  const color = up ? "#00FF94" : "#FF4B4B"
  return (
    <svg width="30" height="20" viewBox="0 0 30 20" className="opacity-80">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const STOCKS = [
  ['Reliance Industries', 'RELIANCE.NS'],
  ['TCS', 'TCS.NS'],
  ['Infosys', 'INFY.NS'],
  ['HDFC Bank', 'HDFCBANK.NS'],
  ['ICICI Bank', 'ICICIBANK.NS'],
  ['Wipro', 'WIPRO.NS'],
  ['Bajaj Finance', 'BAJFINANCE.NS'],
  ['Hindustan Unilever', 'HINDUNILVR.NS'],
  ['Asian Paints', 'ASIANPAINT.NS'],
  ['Maruti Suzuki', 'MARUTI.NS'],
  ['Titan Company', 'TITAN.NS'],
  ['Tata Motors', 'TATAMOTORS.NS'],
  ['SBI', 'SBIN.NS'],
  ['Kotak Mahindra Bank', 'KOTAKBANK.NS'],
  ['Sun Pharma', 'SUNPHARMA.NS'],
  ['ITC', 'ITC.NS'],
  ['Larsen & Toubro', 'LT.NS'],
  ['Nestle India', 'NESTLEIND.NS'],
  ['Adani Ports', 'ADANIPORTS.NS'],
  ['Power Grid', 'POWERGRID.NS'],
  ['NTPC', 'NTPC.NS'],
  ['Axis Bank', 'AXISBANK.NS'],
  ['Dr Reddys', 'DRREDDY.NS'],
  ['Zomato', 'ZOMATO.NS'],
  ['Nifty 50 Index Fund', '^NSEI'],
]



function usePollingJson(url, { intervalMs = 60000, fallback } = {}) {
  const [data, setData] = useState(fallback ?? null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('indicative')
  const lastGoodRef = useRef(fallback ?? null)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        const json = await res.json()
        if (!mounted) return
        setData(json)
        setStatus('live')
        lastGoodRef.current = json
      } catch (e) {
        if (!mounted) return
        setStatus('indicative')
        setData(lastGoodRef.current)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    const timer = setInterval(load, intervalMs)
    return () => {
      mounted = false
      clearInterval(timer)
    }
  }, [url, intervalMs])

  return { data, loading, status }
}

function useStocksData() {
  const [prices, setPrices] = useState(FALLBACK_STOCK_PRICES)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('indicative')

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const entries = await Promise.all(
          STOCKS.map(async ([name, ticker]) => {
            try {
              const res = await fetch(`/api/stock?ticker=${ticker}`)
              if (!res.ok) throw new Error('stock fetch failed')
              const json = await res.json()
              return [ticker, { name, ticker, price: json.price, changePct: json.change, sparkline: json.sparkline }]
            } catch {
              return [ticker, { ...FALLBACK_STOCK_PRICES[ticker], name, ticker }]
            }
          }),
        )
        if (!mounted) return
        setPrices(Object.fromEntries(entries))
        setStatus('live')
      } catch {
        if (!mounted) return
        setStatus('indicative')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    const timer = setInterval(load, 60000)
    return () => {
      mounted = false
      clearInterval(timer)
    }
  }, [])

  return { prices, loading, status }
}

export default function Investments({
  available,
  allocations,
  setAllocations,
  stockPortfolio,
  setStockPortfolio,
  onProceed,
}) {
  const [search, setSearch] = useState('')
  const [overAlloc, setOverAlloc] = useState(false)
  const { prices: stockPrices, loading: stocksLoading, status: stocksStatus } = useStocksData()

  const hdfc = usePollingJson('/api/mutualfunds?schemeCode=118989', { fallback: { nav: FALLBACK_MF_PRICES['118989'] } })
  const mirae = usePollingJson('/api/mutualfunds?schemeCode=118778', { fallback: { nav: FALLBACK_MF_PRICES['118778'] } })
  const gold = usePollingJson('/api/metals?metal=gold', { fallback: { pricePerGramINR: FALLBACK_METAL_PRICES.gold } })
  const silver = usePollingJson('/api/metals?metal=silver', { fallback: { pricePerGramINR: FALLBACK_METAL_PRICES.silver } })
  const crypto = usePollingJson('/api/crypto', { fallback: FALLBACK_CRYPTO_PRICES })

  const filteredStocks = useMemo(() => {
    const q = search.trim().toLowerCase()
    return STOCKS.filter(([name, ticker]) => !q || name.toLowerCase().includes(q) || ticker.toLowerCase().includes(q))
  }, [search])

  const stockTotal = useMemo(() => {
    return Object.values(stockPortfolio).reduce((sum, s) => {
      const price = stockPrices[s.ticker]?.price ?? s.price ?? 0
      return sum + (Number(s.shares || 0) * price)
    }, 0)
  }, [stockPortfolio, stockPrices])

  useEffect(() => {
    setAllocations((a) => ({ ...a, stocks: Math.round(stockTotal) }))
  }, [stockTotal, setAllocations])

  const totalAllocated = Object.values(allocations).reduce((s, v) => s + (Number.isFinite(v) ? v : 0), 0)
  const remaining = Math.max(0, available - totalAllocated)

  function setAllocation(key, nextRaw) {
    const current = allocations[key] ?? 0
    const others = Object.entries(allocations).reduce((s, [k, v]) => (k === key ? s : s + (v || 0)), 0)
    const maxAllowed = Math.max(0, available - others)
    const next = clamp(nextRaw, 0, maxAllowed)
    setOverAlloc(nextRaw > maxAllowed + 1)
    if (next === current) return
    setAllocations((a) => ({ ...a, [key]: next }))
  }

  function addStock(name, ticker) {
    setStockPortfolio((prev) => {
      if (prev[ticker]) return prev
      return { ...prev, [ticker]: { name, ticker, shares: 1, price: stockPrices[ticker]?.price ?? 0 } }
    })
  }

  function updateShares(ticker, shares) {
    setStockPortfolio((prev) => ({ ...prev, [ticker]: { ...prev[ticker], shares: Math.max(0, Number(shares || 0)) } }))
  }

  function removeStock(ticker) {
    setStockPortfolio((prev) => {
      const next = { ...prev }
      delete next[ticker]
      return next
    })
  }

  const goldInrPerGram = gold.data?.pricePerGramINR ?? FALLBACK_METAL_PRICES.gold
  const silverInrPerGram = silver.data?.pricePerGramINR ?? FALLBACK_METAL_PRICES.silver
  const mfRows = [
    { name: 'HDFC Top 100 Fund', nav: hdfc.data?.nav ?? FALLBACK_MF_PRICES['118989'], status: hdfc.status },
    { name: 'Mirae Asset Large Cap', nav: mirae.data?.nav ?? FALLBACK_MF_PRICES['118778'], status: mirae.status },
  ]

  return (
    <div className="pb-24 md:pb-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-2xl font-extrabold tracking-tight text-white">Invest Your Money</div>
          <div className="mt-1 text-ff-textSec">Allocate your <span className="text-white font-bold">{formatINR(available)}</span> wisely</div>
        </div>
        <div className="rounded-2xl bg-ff-card border border-ff-border px-4 py-3 shadow-lg">
          <div className="text-xs font-semibold uppercase tracking-wide text-ff-textSec">Allocated / Available</div>
          <div className="mt-1 text-lg font-extrabold text-white">
            <span className="text-ff-neon font-mono">{formatINR(totalAllocated)}</span> / {formatINR(available)}
          </div>
          <div className="text-sm">
            Remaining:{' '}
            <span className={remaining > 0 ? 'font-bold text-ff-blue' : 'font-bold text-ff-danger'}>{formatINR(remaining)}</span>
          </div>
        </div>
      </div>

      {overAlloc ? (
        <div className="mt-3 rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
          You can’t allocate more than your available amount.
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border-l-4 border-ff-neon bg-ff-card p-5 shadow-lg">
          <div className="text-lg font-extrabold text-white">📈 Stocks (NSE) <StatusBadge status={stocksStatus} /></div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stocks by name or ticker"
            className="mt-3 w-full rounded-xl border border-ff-border bg-ff-bg px-3 py-2 text-white outline-none focus:border-ff-neon focus:ring-1 focus:ring-ff-neon placeholder-ff-textMuted"
          />
          <div className="mt-3 max-h-72 space-y-2 overflow-auto pr-1">
            {stocksLoading ? <SkeletonLine className="h-10" /> : null}
            {filteredStocks.map(([name, ticker]) => {
              const p = stockPrices[ticker]
              const up = (p?.changePct ?? 0) >= 0
              return (
                <button
                  key={ticker}
                  type="button"
                  onClick={() => addStock(name, ticker)}
                  className="flex w-full items-center justify-between rounded-xl bg-ff-bg border border-ff-border px-3 py-2 text-left hover:border-ff-neon/50 transition group"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-white group-hover:text-ff-neon transition-colors">{name}</div>
                    <div className="text-xs text-ff-textMuted font-mono">{ticker}</div>
                  </div>
                  <div className="px-2">
                    <MiniSparkline up={up} />
                  </div>
                  <div className="text-right flex-1">
                    <div className="font-bold text-white font-mono">{p?.price ? formatINR(p.price) : '--'}</div>
                    <div className={['text-xs font-bold', up ? 'text-ff-neon' : 'text-ff-danger'].join(' ')}>
                      {up ? '↑' : '↓'} {Math.abs(p?.changePct ?? 0).toFixed(2)}%
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="mt-4 rounded-xl bg-ff-bg border border-ff-border p-3">
            <div className="font-extrabold text-white">My Stock Portfolio</div>
            <div className="mt-2 space-y-2">
              {Object.values(stockPortfolio).length === 0 ? <div className="text-sm text-ff-textMuted">No stocks added yet.</div> : null}
              {Object.values(stockPortfolio).map((row) => {
                const price = stockPrices[row.ticker]?.price ?? row.price ?? 0
                const cost = (row.shares || 0) * price
                return (
                  <div key={row.ticker} className="rounded-lg bg-ff-card border border-ff-border px-3 py-2">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-white">
                        {row.name} <span className="text-ff-textMuted font-mono text-xs ml-1">({row.ticker})</span>
                      </div>
                      <button type="button" onClick={() => removeStock(row.ticker)} className="text-ff-danger font-bold hover:text-red-400">×</button>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        value={row.shares}
                        onChange={(e) => updateShares(row.ticker, e.target.value)}
                        onFocus={(e) => e.target.select()}
                        className="w-28 rounded-lg border border-ff-border bg-ff-bg text-white px-2 py-1 outline-none focus:border-ff-neon focus:ring-1 focus:ring-ff-neon"
                      />
                      <span className="text-sm text-ff-textSec">shares</span>
                    </div>
                    <div className="mt-1 text-sm font-semibold text-ff-textSec">Total cost: <span className="text-white">{formatINR(cost)}</span></div>
                  </div>
                )
              })}
            </div>
            <div className="mt-3 text-sm font-extrabold text-ff-textSec pt-2 border-t border-ff-border">
              Total stocks investment: <span className="text-ff-neon font-mono">{formatINR(stockTotal)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border-l-4 border-ff-blue bg-ff-card p-5 shadow-lg">
          <div className="text-lg font-extrabold text-white">🏦 Mutual Funds <StatusBadge status={hdfc.status === 'live' && mirae.status === 'live' ? 'live' : 'indicative'} /></div>
          <div className="mt-3 space-y-2 text-sm">
            {mfRows.map((r) => (
              <div key={r.name} className="flex justify-between rounded-xl bg-ff-bg border border-ff-border px-3 py-2">
                <span className="font-semibold text-white">{r.name}</span>
                <span className="font-mono text-ff-textSec">{r.nav ? `₹${r.nav}` : '--'}</span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <MoneySlider label="Allocation" hint="Expected Annual Return: 11%" min={0} max={available} step={100} value={allocations.mutualFunds ?? 0} onChange={(v) => setAllocation('mutualFunds', v)} accentColor="#3B82F6" />
          </div>
        </div>

        <div className="rounded-2xl border-l-4 border-ff-gold bg-ff-card p-5 shadow-lg">
          <div className="text-lg font-extrabold text-white">🥇 Gold <StatusBadge status={gold.status} /></div>
          <div className="mt-2 rounded-xl bg-ff-bg border border-ff-border px-3 py-2 text-sm text-white">Price per gram: <span className="font-mono">{goldInrPerGram ? formatINR(goldInrPerGram) : '--'}</span></div>
          <div className="mt-4">
            <MoneySlider label="Allocation" hint="Expected Annual Return: 8%" min={0} max={available} step={100} value={allocations.gold ?? 0} onChange={(v) => setAllocation('gold', v)} accentColor="#F59E0B" />
          </div>
        </div>

        <div className="rounded-2xl border-l-4 border-ff-silver bg-ff-card p-5 shadow-lg">
          <div className="text-lg font-extrabold text-white">🥈 Silver <StatusBadge status={silver.status} /></div>
          <div className="mt-2 rounded-xl bg-ff-bg border border-ff-border px-3 py-2 text-sm text-white">Price per gram: <span className="font-mono">{silverInrPerGram ? formatINR(silverInrPerGram) : '--'}</span></div>
          <div className="mt-4">
            <MoneySlider label="Allocation" hint="Expected Annual Return: 6%" min={0} max={available} step={100} value={allocations.silver ?? 0} onChange={(v) => setAllocation('silver', v)} accentColor="#94A3B8" />
          </div>
        </div>

        <div className="rounded-2xl border-l-4 border-[#8B5CF6] bg-ff-card p-5 shadow-lg">
          <div className="text-lg font-extrabold text-white">🏛️ Fixed Deposit</div>
          <div className="mt-3 space-y-2 text-sm">
            {[
              ['SBI', '6.80%'], ['HDFC Bank', '7.10%'], ['Post Office', '7.50%'],
            ].map(([bank, rate]) => (
              <div key={bank} className="flex justify-between rounded-xl bg-ff-bg border border-ff-border px-3 py-2">
                <span className="font-semibold text-white">{bank}</span><span className="text-ff-textSec font-mono">{rate}</span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <MoneySlider label="Allocation" hint="Expected Annual Return: 7%" min={0} max={available} step={100} value={allocations.fd ?? 0} onChange={(v) => setAllocation('fd', v)} accentColor="#8B5CF6" />
          </div>
        </div>

        <div className="rounded-2xl border-l-4 border-ff-danger bg-ff-card p-5 shadow-lg">
          <div className="text-lg font-extrabold text-white">₿ Crypto <StatusBadge status={crypto.status} /></div>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between rounded-xl bg-ff-bg border border-ff-border px-3 py-2"><span className="text-white font-semibold">Bitcoin</span><span className="font-mono text-ff-textSec">{crypto.data?.bitcoin?.inr ? formatINR(crypto.data.bitcoin.inr) : '--'}</span></div>
            <div className="flex justify-between rounded-xl bg-ff-bg border border-ff-border px-3 py-2"><span className="text-white font-semibold">Ethereum</span><span className="font-mono text-ff-textSec">{crypto.data?.ethereum?.inr ? formatINR(crypto.data.ethereum.inr) : '--'}</span></div>
            <div className="rounded-xl border border-ff-danger/30 bg-ff-danger/10 px-3 py-2 text-ff-danger text-xs font-semibold">Highly volatile. Invest carefully.</div>
          </div>
          <div className="mt-4">
            <MoneySlider label="Allocation" hint="Expected Annual Return: 20% (High Risk ⚠️)" min={0} max={available} step={100} value={allocations.crypto ?? 0} onChange={(v) => setAllocation('crypto', v)} accentColor="#FF4B4B" />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button type="button" className="w-full rounded-xl bg-ff-neon px-4 py-3 text-base font-extrabold text-[#0B0F19] shadow-glow transition hover:brightness-110 md:w-auto md:min-w-[256px]" onClick={onProceed}>
          View Dashboard
        </button>
      </div>
    </div>
  )
}


