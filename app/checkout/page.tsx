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
    address: '',
    city: '',
    state: '',
    zipCode: '',
    businessName: '',
    website: '',
    industry: '',
    businessSize: '',
    projectGoals: '',
    timeline: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          planName: plan.name,
          priceId: plan.priceId,
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
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/#pricing"
          className="inline-flex items-center gap-2 text-[#a0a0b0] hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to pricing
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-6">
            <Icon size={20} className="text-[#00d4ff]" />
            <span className="text-white font-semibold">{plan.name}</span>
            <span className="text-[#00d4ff] font-bold">{plan.price}</span>
            <span className="text-[#a0a0b0]">{plan.period}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-['Orbitron']">
            Complete Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#00ff88]">Order</span>
          </h1>
          <p className="text-[#a0a0b0] max-w-lg mx-auto">
            Fill in your details below to proceed with your {plan.name} plan purchase.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#00d4ff]/20 text-[#00d4ff] flex items-center justify-center text-sm font-bold">1</span>
              Personal Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
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
              <div>
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
              <div>
                <label className="block text-sm text-[#a0a0b0] mb-2">Phone *</label>
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
            </div>
          </div>

          {/* Address */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#00d4ff]/20 text-[#00d4ff] flex items-center justify-center text-sm font-bold">2</span>
              Address
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-[#a0a0b0] mb-2">Street Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-[#00d4ff] focus:outline-none transition-colors"
                  placeholder="123 Main St"
                />
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm text-[#a0a0b0] mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-[#00d4ff] focus:outline-none transition-colors"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#a0a0b0] mb-2">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-[#00d4ff] focus:outline-none transition-colors"
                    placeholder="NY"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#a0a0b0] mb-2">ZIP Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-[#00d4ff] focus:outline-none transition-colors"
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#00d4ff]/20 text-[#00d4ff] flex items-center justify-center text-sm font-bold">3</span>
              Business Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
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
              <div>
                <label className="block text-sm text-[#a0a0b0] mb-2">Current Website (optional)</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-[#00d4ff] focus:outline-none transition-colors"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm text-[#a0a0b0] mb-2">Industry *</label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#00d4ff] focus:outline-none transition-colors"
                >
                  <option value="" className="bg-[#0a0a1a]">Select industry</option>
                  <option value="restaurant" className="bg-[#0a0a1a]">Restaurant / Food Service</option>
                  <option value="retail" className="bg-[#0a0a1a]">Retail / E-commerce</option>
                  <option value="healthcare" className="bg-[#0a0a1a]">Healthcare</option>
                  <option value="technology" className="bg-[#0a0a1a]">Technology</option>
                  <option value="professional" className="bg-[#0a0a1a]">Professional Services</option>
                  <option value="construction" className="bg-[#0a0a1a]">Construction / Home Services</option>
                  <option value="education" className="bg-[#0a0a1a]">Education</option>
                  <option value="other" className="bg-[#0a0a1a]">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#a0a0b0] mb-2">Business Size *</label>
                <select
                  name="businessSize"
                  value={formData.businessSize}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#00d4ff] focus:outline-none transition-colors"
                >
                  <option value="" className="bg-[#0a0a1a]">Select size</option>
                  <option value="solo" className="bg-[#0a0a1a]">Just me</option>
                  <option value="small" className="bg-[#0a0a1a]">2-10 employees</option>
                  <option value="medium" className="bg-[#0a0a1a]">11-50 employees</option>
                  <option value="large" className="bg-[#0a0a1a]">50+ employees</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-[#a0a0b0] mb-2">Project Goals *</label>
                <textarea
                  name="projectGoals"
                  value={formData.projectGoals}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-[#00d4ff] focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about your project goals and what you're looking to achieve..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-[#a0a0b0] mb-2">Timeline *</label>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#00d4ff] focus:outline-none transition-colors"
                >
                  <option value="" className="bg-[#0a0a1a]">When do you need this completed?</option>
                  <option value="asap" className="bg-[#0a0a1a]">As soon as possible</option>
                  <option value="1-2weeks" className="bg-[#0a0a1a]">1-2 weeks</option>
                  <option value="1month" className="bg-[#0a0a1a]">Within a month</option>
                  <option value="flexible" className="bg-[#0a0a1a]">Flexible / No rush</option>
                </select>
              </div>
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
                Proceed to Payment
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
