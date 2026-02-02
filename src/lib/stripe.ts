import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-01-28.clover',
  typescript: true,
});

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

export const PLAN_PRICE_IDS = {
  starter: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER || '',
  professional: process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL || '',
  enterprise: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE || '',
} as const;
