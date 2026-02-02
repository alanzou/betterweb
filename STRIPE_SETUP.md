# Stripe Payment Integration Setup Guide

## Overview

This project has been integrated with Stripe for processing payments for products and services. The implementation includes:

- ✅ Stripe Checkout Sessions for secure payment processing
- ✅ Webhook handling for real-time payment status updates
- ✅ Database synchronization with Prisma
- ✅ Payment success/cancel pages
- ✅ Email and SMS notification infrastructure

## File Structure

```
app/
├── api/
│   └── stripe/
│       ├── create-checkout-session/
│       │   └── route.ts          # Creates Stripe Checkout sessions
│       └── webhook/
│           └── route.ts          # Handles Stripe webhook events
└── payment/
    ├── success/
    │   └── page.tsx             # Payment success page
    └── cancel/
        └── page.tsx             # Payment cancel page

lib/
├── stripe.ts                     # Stripe client configuration
└── prisma.ts                     # Prisma client instance

src/components/sections/
└── Pricing.tsx                   # Updated with payment integration
```

## Environment Variables

Ensure these are configured in your `.env` file:

```bash
# Database
DATABASE_URL="your_postgresql_connection_string"

# Stripe Configuration (Client-side)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Stripe Configuration (Server-side)
STRIPE_SECRET_KEY="sk_test_..."

# Stripe Webhook Secret (get from Stripe Dashboard -> Webhooks)
STRIPE_WEBHOOK_SECRET="whsec_..."

# Stripe Price IDs (get these from Stripe Dashboard after creating products)
NEXT_PUBLIC_STRIPE_PRICE_STARTER="price_..."
NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL="price_..."
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE="price_..."

# Optional: App URL for redirects
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional: SendGrid for emails
SENDGRID_API_KEY="SG...."
SENDGRID_FROM_EMAIL="support@betterweb.pro"

# Optional: Twilio for SMS
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+1..."
```

## Setup Instructions

### 1. Create Stripe Products and Prices

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Products** → **Add Product**
3. Create three products:
   - **Starter**: One-time payment of $199
   - **Professional**: Recurring monthly payment of $29
   - **Enterprise**: Recurring monthly payment of $49
4. Copy each Price ID and add to your `.env` file

### 2. Set Up Webhook Endpoint

#### For Local Development (using Stripe CLI):

1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Login to Stripe CLI:
   ```bash
   stripe login
   ```
3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
4. Copy the webhook signing secret (starts with `whsec_`) to your `.env` file

#### For Production:

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your webhook URL: `https://yourdomain.com/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the webhook signing secret to your `.env` file

### 3. Run Database Migrations

Ensure your database schema is up to date:

```bash
npx prisma generate
npx prisma migrate dev
```

### 4. Start Development Server

```bash
npm run dev
```

## How It Works

### Payment Flow

1. **User clicks on a pricing plan** → `Pricing.tsx` component
2. **Create checkout session** → `POST /api/stripe/create-checkout-session`
   - Validates price ID
   - Creates Stripe Checkout Session
   - Returns checkout URL
3. **User redirected to Stripe Checkout** → Stripe-hosted payment page
4. **User completes payment** → Stripe processes payment
5. **Webhook fired** → `POST /api/stripe/webhook`
   - Verifies webhook signature
   - Updates database (customers, transactions, subscriptions)
   - Sends notifications (optional)
6. **User redirected back** → Success or Cancel page

### Webhook Events Handled

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Create/update customer, transaction, and subscription records |
| `payment_intent.succeeded` | Update transaction status to SUCCEEDED |
| `payment_intent.payment_failed` | Update transaction status to FAILED |
| `customer.subscription.updated` | Update subscription status and period |
| `customer.subscription.deleted` | Mark subscription as CANCELED |

### Database Models

The integration uses three main Prisma models:

**customers**
- Links to Stripe via `stripe_id`
- Stores customer information

**transactions**
- Tracks individual payments via `stripe_payment_id`
- Status: PENDING, PROCESSING, SUCCEEDED, FAILED, REFUNDED, CANCELED

**subscriptions**
- Tracks recurring subscriptions via `stripe_subscription_id`
- Status: ACTIVE, PAST_DUE, CANCELED, UNPAID, TRIALING, PAUSED

## Testing

### Test Cards

Use these test cards for testing payments:

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 0002` | Card declined |
| `4000 0000 0000 9995` | Insufficient funds |

**Note:** Use any future expiry date, any 3-digit CVC, and any 5-digit ZIP code.

### Testing Webhooks Locally

1. Start your dev server: `npm run dev`
2. In another terminal, run Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
3. Trigger test webhook events:
   ```bash
   stripe trigger checkout.session.completed
   stripe trigger payment_intent.succeeded
   ```

### Manual Testing Checklist

- [ ] Click on Starter plan → redirects to Stripe Checkout
- [ ] Complete payment with test card → redirects to success page
- [ ] Check database for new customer record
- [ ] Check database for new transaction record (status: SUCCEEDED)
- [ ] Cancel payment → redirects to cancel page
- [ ] Verify webhook signature validation works
- [ ] Test subscription plans (Professional/Enterprise)
- [ ] Verify subscription records are created

## Security Considerations

### ✅ Implemented

- Webhook signature verification
- Server-side price validation
- HTTPS required for production webhooks
- Environment variables for sensitive keys
- Origin validation for checkout sessions

### 🔒 Additional Recommendations

1. **Rate Limiting**: Add rate limiting to API routes
2. **CORS**: Configure CORS for API routes if needed
3. **Error Logging**: Set up proper error logging (Sentry, etc.)
4. **Monitoring**: Monitor webhook failures in Stripe Dashboard
5. **Idempotency**: Stripe webhooks can fire multiple times; ensure database operations are idempotent

## Troubleshooting

### Webhook signature verification fails

- Ensure `STRIPE_WEBHOOK_SECRET` is correct
- Check that you're using the correct secret for test/live mode
- Verify raw body is being sent to webhook handler

### Checkout session creation fails

- Verify `STRIPE_SECRET_KEY` is set correctly
- Check that price IDs exist in your Stripe account
- Ensure price IDs match the test/live mode of your secret key

### Database updates not happening

- Check webhook endpoint is receiving events (Stripe Dashboard → Developers → Webhooks)
- Review server logs for errors
- Ensure Prisma client is generated: `npx prisma generate`
- Verify database connection string is correct

### Customer email not captured

- Check that customer email is being collected in Checkout Session
- Verify `customer_email` or `customer_details.email` exists in webhook payload

## Next Steps

1. **Set up notification system**: Implement SendGrid/Twilio integration for confirmation emails/SMS
2. **Add customer portal**: Allow customers to manage subscriptions
3. **Implement refunds**: Add refund functionality
4. **Add analytics**: Track conversion rates and revenue
5. **Custom receipts**: Send branded email receipts
6. **Invoice generation**: Auto-generate PDF invoices

## Support

For Stripe-specific issues:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)

For integration issues:
- Check server logs
- Review Stripe Dashboard webhook logs
- Contact support@betterweb.pro
