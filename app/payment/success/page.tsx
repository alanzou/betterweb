import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="glass-card p-8">
          <div className="w-16 h-16 rounded-full bg-[#00ff88]/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-[#00ff88]" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-4 font-['Orbitron']">
            Payment Successful!
          </h1>

          <p className="text-[#a0a0b0] mb-8">
            Thank you for your purchase. We've received your payment and will start
            working on your project right away.
          </p>

          <p className="text-sm text-[#a0a0b0] mb-8">
            You will receive a confirmation email shortly with all the details.
          </p>

          <div className="space-y-4">
            <Link
              href="/"
              className="block w-full py-3 rounded-lg bg-[#00d4ff] text-[#050510] font-semibold hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all duration-300"
            >
              Back to Home
            </Link>

            <Link
              href="/#pricing"
              className="block w-full py-3 rounded-lg bg-white/5 text-white border border-white/10 hover:border-[#00d4ff]/50 hover:bg-[#00d4ff]/10 transition-all duration-300"
            >
              View Other Plans
            </Link>
          </div>
        </div>

        <p className="text-xs text-[#a0a0b0] mt-6">
          Need help? Contact us at{' '}
          <a
            href="mailto:support@betterweb.pro"
            className="text-[#00d4ff] hover:underline"
          >
            support@betterweb.pro
          </a>
        </p>
      </div>
    </div>
  );
}
