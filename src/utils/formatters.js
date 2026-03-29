export function formatINR(val) {
  if (!Number.isFinite(val)) return '₹0'
  return '₹' + Math.round(val).toLocaleString('en-IN')
}

export function formatCrore(val) {
  if (!Number.isFinite(val) || val < 10000000) return formatINR(val)
  return '₹' + (val / 10000000).toFixed(2) + ' Cr'
}

export function formatLakh(val) {
  if (!Number.isFinite(val) || val < 100000) return formatINR(val)
  return '₹' + (val / 100000).toFixed(2) + ' L'
}

export function formatChange(change) {
  if (!Number.isFinite(change)) return '0.00%'
  const sign = change > 0 ? '+' : ''
  return sign + change.toFixed(2) + '%'
}
