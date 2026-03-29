export function calculateCompoundInterest({ initial = 0, annualRate = 0, years = 0 }) {
  const i = Math.pow(1 + annualRate, 1 / 12) - 1
  const n = Math.round(years * 12)
  if (n <= 0) return initial
  return initial * Math.pow(1 + i, n)
}

export function calculateSIPReturns({ monthly = 0, annualRate = 0, years = 0 }) {
  const i = Math.pow(1 + annualRate, 1 / 12) - 1
  const n = Math.round(years * 12)
  if (n <= 0) return 0
  if (Math.abs(i) < 1e-9) return monthly * n
  return monthly * ((Math.pow(1 + i, n) - 1) / i)
}

export function calculateFutureValueMonthly({ initial = 0, monthly = 0, annualRate = 0, years = 0 }) {
  const i = Math.pow(1 + annualRate, 1 / 12) - 1
  const n = Math.round(years * 12)
  const p0 = Number.isFinite(initial) ? initial : 0
  const pmt = Number.isFinite(monthly) ? monthly : 0
  if (n <= 0) return p0
  if (Math.abs(i) < 1e-9) return p0 + pmt * n
  return p0 * Math.pow(1 + i, n) + pmt * ((Math.pow(1 + i, n) - 1) / i)
}

export function calculateBlendedRate(allocations, returns) {
  let total = 0
  for (const k of Object.keys(allocations)) total += allocations[k] ?? 0
  if (total <= 0) return 0
  let weighted = 0
  for (const k of Object.keys(allocations)) {
    const w = (allocations[k] ?? 0) / total
    weighted += w * (returns[k] ?? 0)
  }
  return weighted
}

export function calculatePortfolioHealthScore(allocations, salary, expenses) {
  const totalInvestedAmt = Object.values(allocations).reduce((s, v) => s + (Number.isFinite(v) ? v : 0), 0)
  const assetCount = Object.values(allocations).filter((v) => v > 0).length
  const cryptoPct = totalInvestedAmt > 0 ? (allocations.crypto || 0) / totalInvestedAmt : 0

  let healthScore = 0
  // Diversification
  if (assetCount >= 3) healthScore += 30
  else if (assetCount === 2) healthScore += 20
  else if (assetCount === 1) healthScore += 10
  
  // Savings Rate
  const savingsRate = salary > 0 ? totalInvestedAmt / salary : 0
  if (savingsRate > 0.2) healthScore += 40
  else if (savingsRate > 0.1) healthScore += 20
  else if (savingsRate > 0.05) healthScore += 10

  // Risk Balance
  if (cryptoPct > 0.4) healthScore += 0
  else if (cryptoPct > 0.2) healthScore += 15
  else healthScore += 30

  // Risk Profile Calculation
  const fdGoldPct = totalInvestedAmt > 0 ? ((allocations.fd || 0) + (allocations.gold || 0)) / totalInvestedAmt : 0
  const stocksMfPct = totalInvestedAmt > 0 ? ((allocations.stocks || 0) + (allocations.mutualFunds || 0)) / totalInvestedAmt : 0
  
  let riskProfile = 'Balanced'
  if (cryptoPct > 0.3) riskProfile = 'Very Aggressive'
  else if (stocksMfPct > 0.3 && cryptoPct <= 0.3) riskProfile = 'Aggressive'
  else if (fdGoldPct > 0.5) riskProfile = 'Conservative'

  const riskLevel = {
    'Conservative': 25,
    'Balanced': 50,
    'Aggressive': 75,
    'Very Aggressive': 90
  }[riskProfile]

  let healthColor = healthScore > 70 ? '#00FF94' : healthScore >= 40 ? '#F59E0B' : '#FF4B4B'

  return { healthScore, healthColor, riskProfile, riskLevel }
}

export function generatePortfolioTips(allocations) {
  const totalInvestedAmt = Object.values(allocations).reduce((s, v) => s + (Number.isFinite(v) ? v : 0), 0)
  const cryptoPct = totalInvestedAmt > 0 ? (allocations.crypto || 0) / totalInvestedAmt : 0
  
  const generatedTips = []
  if (cryptoPct > 0.4) {
    generatedTips.push({ type: 'warning', text: "⚠️ High crypto exposure — consider diversifying into stable assets", color: "border-ff-danger" })
  }
  if ((allocations.fd || 0) > 0 && typeof allocations.fd !== 'undefined' && (allocations.fd / totalInvestedAmt) > 0.5) {
    generatedTips.push({ type: 'tip', text: "💡 Heavy FD allocation — you're being safe but missing growth opportunities", color: "border-[#3B82F6]" })
  }
  if (!allocations.stocks || allocations.stocks === 0) {
    generatedTips.push({ type: 'tip', text: "📈 No stock market exposure — even small amounts can grow significantly", color: "border-[#3B82F6]" })
  }
  if ((allocations.gold || 0) > 0 && (allocations.gold / totalInvestedAmt) > 0.3) {
    generatedTips.push({ type: 'good', text: "🥇 Good gold allocation for inflation protection", color: "border-ff-neon" })
  }
  if ((allocations.mutualFunds || 0) > 0) {
    generatedTips.push({ type: 'good', text: "✅ Smart choice — mutual funds offer professional management", color: "border-ff-neon" })
  }

  return generatedTips.slice(0, 3)
}

export function clamp(val, min, max) { return Math.min(Math.max(val, min), max) }
