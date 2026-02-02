'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const [_session, setSession] = useState<{
    customerName: string
    planName: string
    amount: string
  } | null>(null)

  useEffect(() => {
    if (sessionId) {
      // In a production app, you might want to verify the session with your backend
      // For now, we'll just show a success message
      setTimeout(() => {
        setSession({
          customerName: 'Valued Customer',
          planName: 'Your Plan',
          amount: '',
        })
        setLoading(false)
      }, 1000)
    } else {
      setLoading(false)
    }
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#00d4ff]" size={40} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050510] text-white flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        {/* Success Animation */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-[#00ff88] rounded-full blur-3xl opacity-20 animate-pulse" />
          <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-[#00d4ff] to-[#00ff88] rounded-full flex items-center justify-center">
            <CheckCircle size={48} className="text-[#050510]" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4 font-['Orbitron']">
          Payment{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#00ff88]">
            Successful!
          </span>
        </h1>

        <p className="text-[#a0a0b0] text-lg mb-8">
          Thank you for your purchase! We've sent a confirmation email with all the details.
        </p>

        {/* What's Next */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-8 text-left">
          <h2 className="text-lg font-semibold mb-4">What happens next?</h2>
          <ul className="space-y-3 text-[#a0a0b0]">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#00d4ff]/20 text-[#00d4ff] flex items-center justify-center flex-shrink-0 text-sm font-bold">1</span>
              <span>You'll receive a confirmation email shortly</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#00d4ff]/20 text-[#00d4ff] flex items-center justify-center flex-shrink-0 text-sm font-bold">2</span>
              <span>Our team will reach out within 24 hours</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#00d4ff]/20 text-[#00d4ff] flex items-center justify-center flex-shrink-0 text-sm font-bold">3</span>
              <span>We'll schedule a kickoff call to discuss your project</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00d4ff] to-[#00ff88] text-[#050510] font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all duration-300"
          >
            Back to Home
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050510] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#00d4ff]" size={40} />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
