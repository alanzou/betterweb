'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Sparkles, Zap, Crown, Loader2 } from 'lucide-react'
import Link from 'next/link'

const plans = {
  starter: {
    name: 'Starter',
    price: '$199',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER,
    period: 'one-time',
    icon: Zap,
  },
  professional: {
    name: 'Professional',
    price: '$29',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL,
    period: '/month',
    icon: Sparkles,
  },
  enterprise: {
    name: 'Enterprise',
    price: '$49',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE,
    period: '/month',
    icon: Crown,
  },
}

function CheckoutForm() {
  const searchParams = useSearchParams()
  const planKey = searchParams.get('plan') as keyof typeof plans
  const plan = plans[planKey] || plans.starter

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
    website: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          email: formData.email,
          metadata: {
            plan_name: plan.name,
            plan_period: plan.period,
            customer_first_name: formData.firstName,
            customer_last_name: formData.lastName,
            customer_phone: formData.phone,
            customer_business: formData.businessName,
            customer_website: formData.website,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process checkout')
      setLoading(false)
    }
  }

  const Icon = plan.icon

  return (
    <div className="min-h-screen bg-[#050510] text-white py-12 px-6">
      <div className="max-w-xl mx-auto">
        {/* Back Button */}
        <Link
          href="/#pricing"
          className="inline-flex items-center gap-2 text-[#a0a0b0] hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to pricing
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-6">
            <Icon size={20} className="text-[#00d4ff]" />
            <span className="text-white font-semibold">{plan.name}</span>
            <span className="text-[#00d4ff] font-bold">{plan.price}</span>
            <span className="text-[#a0a0b0]">{plan.period}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-['Orbitron']">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#00ff88]">Information</span>
          </h1>
          <p className="text-[#a0a0b0] max-w-lg mx-auto">
            Please provide your details so we can get started on your project.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 md:p-8">
            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-[#a0a0b0] mb-2">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-[#00d4ff] focus:outline-none transition-colors"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm text-[#a0a0b0] mb-2">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-[#00d4ff] focus:outline-none transition-colors"
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm text-[#a0a0b0] mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-[#00d4ff] focus:outline-none transition-colors"
                placeholder="john@example.com"
              />
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="block text-sm text-[#a0a0b0] mb-2">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-[#00d4ff] focus:outline-none transition-colors"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            {/* Business Name */}
            <div className="mb-4">
              <label className="block text-sm text-[#a0a0b0] mb-2">Business Name *</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-[#00d4ff] focus:outline-none transition-colors"
                placeholder="Acme Inc."
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm text-[#a0a0b0] mb-2">Business Website (optional)</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-[#00d4ff] focus:outline-none transition-colors"
                placeholder="https://example.com"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-[#00d4ff] to-[#00ff88] text-[#050510] font-bold rounded-lg hover:shadow-[0_0_40px_rgba(0,212,255,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Processing...
              </>
            ) : (
              <>
                Continue to Payment
              </>
            )}
          </button>

          <p className="text-center text-sm text-[#a0a0b0]">
            You'll be redirected to our secure payment partner Stripe to complete your purchase.
          </p>
        </form>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050510] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#00d4ff]" size={40} />
      </div>
    }>
      <CheckoutForm />
    </Suspense>
  )
}
