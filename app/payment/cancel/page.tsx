import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="glass-card p-8">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <XCircle size={32} className="text-red-500" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-4 font-['Orbitron']">
            Payment Canceled
          </h1>

          <p className="text-[#a0a0b0] mb-8">
            Your payment was canceled. No charges have been made to your account.
          </p>

          <p className="text-sm text-[#a0a0b0] mb-8">
            If you experienced any issues, please don't hesitate to reach out to our
            support team.
          </p>

          <div className="space-y-4">
            <Link
              href="/#pricing"
              className="block w-full py-3 rounded-lg bg-[#00d4ff] text-[#050510] font-semibold hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all duration-300"
            >
              Try Again
            </Link>

            <Link
              href="/"
              className="block w-full py-3 rounded-lg bg-white/5 text-white border border-white/10 hover:border-[#00d4ff]/50 hover:bg-[#00d4ff]/10 transition-all duration-300"
            >
              Back to Home
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
