import { NextRequest, NextResponse } from 'next/server';
import { stripe, PLAN_PRICE_IDS } from '@/lib/stripe';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { priceId, email, customerId, metadata } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    const validPriceIds = Object.values(PLAN_PRICE_IDS);
    if (!validPriceIds.includes(priceId)) {
      return NextResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      );
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Determine mode based on plan period
    const isSubscription = metadata?.plan_period?.includes('month');
    
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: isSubscription ? 'subscription' : 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#pricing`,
      metadata: metadata || {},
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
      // customer_creation is only valid for payment mode
      ...(isSubscription ? {} : { customer_creation: 'always' as const }),
    };

    if (email) {
      sessionParams.customer_email = email;
    }

    if (customerId) {
      sessionParams.customer = customerId;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
