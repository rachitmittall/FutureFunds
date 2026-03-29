import { IndianRupee } from 'lucide-react'

export default function RupeeLogo({ size = 28 }) {
  return (
    <div className="inline-flex items-center justify-center rounded-xl bg-brand-500/10 text-brand-600">
      <IndianRupee style={{ width: size, height: size }} aria-hidden="true" />
      <span className="sr-only">FutureFunds</span>
    </div>
  )
}

