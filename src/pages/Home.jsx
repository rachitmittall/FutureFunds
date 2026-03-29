import { useState } from 'react'

const CITIES = [
  { id: 'Delhi', emoji: '🏛️' },
  { id: 'Mumbai', emoji: '🌊' },
  { id: 'Bangalore', emoji: '🌿' },
  { id: 'Chennai', emoji: '☀️' },
  { id: 'Kolkata', emoji: '🎨' },
  { id: 'Other', emoji: '🗺️' }
]

const SALARY_CHIPS = [10000, 15000, 20000, 30000, 50000]

export default function Home({ student, setStudent, onStart, hasSavedData }) {
  const [startedFresh, setStartedFresh] = useState(false)
  const [step, setStep] = useState(1)

  const name = student.name ?? ''
  const salary = student.salary ?? 20000
  const city = student.city ?? ''

  const formatINR = (val) => '₹' + Number(val).toLocaleString('en-IN')

  const handleKeyDown = (e, nextStep, validator) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (validator && !validator()) return
      setStep(nextStep)
    }
  }

  const isReturning = hasSavedData && !startedFresh

  if (isReturning) {
    return (
      <div className="absolute inset-x-0 inset-y-0 z-50 min-h-[100dvh] w-full bg-[#0B0F19] flex flex-col items-center justify-center p-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-ff-neon/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        
        <div key="welcome-back" className="animate-slide-up flex flex-col items-center justify-center z-10 max-w-md w-full text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-ff-card border border-ff-border mb-6 shadow-glow">
            <span className="text-3xl">👋</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Welcome back, {student.name}!</h1>
          <p className="mt-3 text-ff-textSec">Your last session is saved and ready.</p>
          
          <div className="mt-8 w-full p-5 rounded-2xl border border-ff-neon/30 bg-ff-card/50 backdrop-blur-sm shadow-[0_0_20px_rgba(0,255,148,0.1)]">
            <div className="flex justify-between border-b border-ff-border pb-3">
              <span className="text-ff-textSec">Income</span>
              <span className="font-bold text-white font-mono">{formatINR(student.salary)}</span>
            </div>
            <div className="flex justify-between pt-3">
              <span className="text-ff-textSec">City</span>
              <span className="font-bold text-white">{student.city}</span>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 w-full">
            <button 
              onClick={onStart} 
              className="w-full rounded-full bg-ff-neon px-6 py-4 text-lg font-extrabold text-[#0B0F19] shadow-glow transition hover:brightness-110"
            >
              Continue where I left off →
            </button>
            <button 
              onClick={() => {
                setStudent({})
                setStartedFresh(true)
                setStep(1)
              }} 
              className="w-full text-sm font-semibold text-ff-textSec hover:text-white transition"
            >
              Start fresh
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-x-0 inset-y-0 z-50 min-h-[100dvh] w-full bg-[#0B0F19] flex flex-col p-6 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-ff-neon/5 rounded-full blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-ff-blue/5 rounded-full blur-[150px] pointer-events-none animate-pulse" />

      <div className="w-full max-w-4xl mx-auto flex items-center justify-between z-10 pt-4">
        <div className="text-sm font-extrabold text-ff-neon">Future<span className="text-white">Funds</span></div>
        {step <= 3 && (
          <div className="text-xs font-semibold text-ff-textSec">
            {step} of 3
          </div>
        )}
      </div>

      {step <= 3 && (
        <div className="w-full max-w-4xl mx-auto mt-4 h-1 bg-ff-card rounded-full overflow-hidden z-10">
          <div 
            className="h-full bg-ff-neon transition-all duration-500 ease-out" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      )}

      <div className="flex-1 w-full max-w-3xl mx-auto flex items-center justify-center z-10 py-12">
        {step === 1 && (
          <div key="step1" className="w-full animate-slide-up">
            <div className="text-xs font-bold tracking-widest text-ff-textSec uppercase">Let's Get Started</div>
            <h1 className="mt-3 text-3xl md:text-5xl font-bold text-white leading-tight">What should we call you? 👋</h1>
            <p className="mt-3 text-ff-textSec text-lg">We'll personalize your simulation just for you.</p>
            
            <div className="mt-10">
              <input 
                autoFocus
                type="text" 
                value={name} 
                onChange={(e) => setStudent((s) => ({ ...s, name: e.target.value }))}
                onKeyDown={(e) => handleKeyDown(e, 2, () => name.trim().length > 0)}
                placeholder="Type your name..."
                className="w-full bg-transparent border-b-2 border-ff-border focus:border-ff-neon text-3xl md:text-5xl text-white outline-none py-3 placeholder-ff-textMuted transition-colors"
                autoComplete="off"
              />
            </div>
            
            <div className="mt-12 flex items-center gap-4">
              <button 
                onClick={() => { if(name.trim().length > 0) setStep(2) }}
                className="rounded-full bg-ff-neon px-8 py-3 text-xl font-bold text-[#0B0F19] shadow-glow hover:brightness-110 transition disabled:opacity-50 disabled:shadow-none"
                disabled={name.trim().length === 0}
              >
                Continue →
              </button>
              <span className="text-sm text-ff-textSec hidden md:block">Press Enter ↵ to continue</span>
            </div>
          </div>
        )}

        {step === 2 && (
          <div key="step2" className="w-full animate-slide-up">
            <button onClick={() => setStep(1)} className="text-ff-textSec hover:text-white mb-6 flex items-center gap-1 text-sm font-semibold transition">
              ← Back
            </button>
            <div className="text-xs font-bold tracking-widest text-ff-textSec uppercase">Almost There</div>
            <h1 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">What's your monthly income or stipend? 💰</h1>
            <p className="mt-3 text-ff-textSec text-lg">This could be salary, pocket money, or freelance income — no judgment!</p>
            
            <div className="mt-10 flex items-center">
              <span className="text-4xl md:text-6xl font-bold text-ff-neon mr-3">₹</span>
              <input 
                autoFocus
                type="number" 
                min={0}
                value={salary || ''} 
                onChange={(e) => setStudent((s) => ({ ...s, salary: Number(e.target.value) }))}
                onKeyDown={(e) => handleKeyDown(e, 3, () => salary > 0)}
                placeholder="20000"
                className="w-full bg-transparent border-b-2 border-ff-border focus:border-ff-neon text-4xl md:text-6xl text-white outline-none py-3 font-mono transition-colors"
                autoComplete="off"
              />
            </div>
            <div className="mt-2 text-sm text-ff-textSec font-mono font-semibold">
              <span className="text-ff-textMuted font-sans">Formatted: </span>{salary > 0 ? formatINR(salary) : '--'}
            </div>
            
            <div className="mt-8 flex flex-wrap gap-3">
              {SALARY_CHIPS.map(chip => (
                <button
                  key={chip}
                  onClick={() => setStudent((s) => ({ ...s, salary: chip }))}
                  className="rounded-full border border-ff-neon bg-ff-bg px-4 py-2 text-sm font-bold text-white hover:bg-ff-neon hover:text-[#0B0F19] transition"
                >
                  {formatINR(chip)}
                </button>
              ))}
            </div>
            
            <div className="mt-12 flex items-center gap-4">
              <button 
                onClick={() => { if(salary > 0) setStep(3) }}
                className="rounded-full bg-ff-neon px-8 py-3 text-xl font-bold text-[#0B0F19] shadow-glow hover:brightness-110 transition disabled:opacity-50 disabled:shadow-none"
                disabled={!salary || salary <= 0}
              >
                Continue →
              </button>
              <span className="text-sm text-ff-textSec hidden md:block">Press Enter ↵ to continue</span>
            </div>
          </div>
        )}

        {step === 3 && (
          <div key="step3" className="w-full animate-slide-up">
            <button onClick={() => setStep(2)} className="text-ff-textSec hover:text-white mb-6 flex items-center gap-1 text-sm font-semibold transition">
              ← Back
            </button>
            <div className="text-xs font-bold tracking-widest text-ff-textSec uppercase">One Last Thing</div>
            <h1 className="mt-3 text-3xl md:text-5xl font-bold text-white leading-tight">Which city are you based in? 🏙️</h1>
            <p className="mt-3 text-ff-textSec text-lg">We use this to set realistic expense minimums for your city.</p>
            
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
              {CITIES.map((c) => {
                const isSelected = city === c.id
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setStudent((s) => ({ ...s, city: c.id }))
                      setTimeout(() => setStep(4), 500)
                    }}
                    className={[
                      'group flex flex-col items-center justify-center gap-2 rounded-2xl border p-5 md:p-6 transition-all hover:scale-105',
                      isSelected 
                        ? 'border-ff-neon bg-ff-neon/10 shadow-[0_0_15px_rgba(0,255,148,0.2)]' 
                        : 'border-ff-border bg-ff-card hover:border-ff-neon/50'
                    ].join(' ')}
                  >
                    <span className="text-4xl transition-transform group-hover:scale-110">{c.emoji}</span>
                    <span className="font-bold text-white text-lg">{c.id}</span>
                  </button>
                )
              })}
            </div>
            
            <div className="mt-12 flex items-center gap-4">
              <button 
                onClick={() => { if(city) setStep(4) }}
                className="rounded-full bg-ff-neon px-8 py-3 text-xl font-bold text-[#0B0F19] shadow-glow hover:brightness-110 transition disabled:opacity-50 disabled:shadow-none"
                disabled={!city}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div key="step4" className="w-full flex justify-center items-center animate-slide-up">
            <div className="max-w-md w-full text-center">
              <div className="grid h-24 w-24 mx-auto place-items-center rounded-full bg-ff-neon/20 border border-ff-neon mb-8 shadow-glow animate-scale-in">
                <span className="text-5xl">✅</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">You're all set, {name}! 🎉</h1>
              <p className="mt-3 text-ff-textSec text-lg">Your personalized simulation is ready.</p>
              
              <div className="mt-8 rounded-2xl bg-ff-card border border-ff-neon/50 p-6 shadow-[0_0_20px_rgba(0,255,148,0.1)] text-left backdrop-blur-sm">
                <div className="flex justify-between border-b border-ff-border pb-4">
                  <span className="text-ff-textSec font-semibold">Name</span>
                  <span className="font-bold text-white">{name}</span>
                </div>
                <div className="flex justify-between border-b border-ff-border py-4">
                  <span className="text-ff-textSec font-semibold">Monthly Income</span>
                  <span className="font-bold text-white font-mono">{formatINR(salary)}</span>
                </div>
                <div className="flex justify-between pt-4">
                  <span className="text-ff-textSec font-semibold">Location</span>
                  <span className="font-bold text-white">{city}</span>
                </div>
              </div>
              
              <div className="mt-10">
                <button 
                  onClick={onStart}
                  className="w-full rounded-full bg-ff-neon px-8 py-4 text-xl font-extrabold text-[#0B0F19] shadow-glow hover:brightness-110 transition hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  Start Simulating →
                </button>
                <p className="mt-4 text-xs font-semibold text-ff-textMuted uppercase tracking-widest">
                  Your data is saved automatically
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
