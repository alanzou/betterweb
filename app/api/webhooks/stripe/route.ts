import { NextRequest, NextResponse } from 'next/server'
import { stripe, STRIPE_WEBHOOK_SECRET } from '@/lib/stripe'
import prisma from '@/lib/prisma'
import { sendConfirmationEmail } from '@/lib/email'
import { sendConfirmationSMS } from '@/lib/sms'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdate(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionCanceled(subscription)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaid(invoice)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(invoice)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing checkout.session.completed:', session.id)

  // Retrieve full session with customer and line items
  const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ['customer', 'line_items', 'payment_intent'],
  })

  const customer = fullSession.customer as Stripe.Customer | null
  const paymentIntent = fullSession.payment_intent as Stripe.PaymentIntent | null
  const lineItem = fullSession.line_items?.data[0]
  
  if (!customer || typeof customer === 'string') {
    console.error('No customer found for session:', session.id)
    return
  }

  // Get customer info from metadata (from our checkout form) or fall back to Stripe data
  const metadata = session.metadata || {}
  const email = customer.email || fullSession.customer_details?.email || ''
  const phone = metadata.customer_phone || fullSession.customer_details?.phone || ''
  const firstName = metadata.customer_first_name || ''
  const lastName = metadata.customer_last_name || ''
  const businessName = metadata.customer_business || ''
  const website = metadata.customer_website || ''
  const address = fullSession.customer_details?.address

  const planName = metadata.plan_name || lineItem?.description || 'Unknown Plan'
  const planPeriod = metadata.plan_period || 'one-time'
  const amount = fullSession.amount_total ? `$${(fullSession.amount_total / 100).toFixed(2)}` : '$0.00'

  // Create or update customer in database
  let dbCustomer = await prisma.customers.findUnique({
    where: { email },
  })

  if (!dbCustomer) {
    dbCustomer = await prisma.customers.create({
      data: {
        id: crypto.randomUUID(),
        stripe_id: customer.id,
        email,
        first_name: firstName,
        last_name: lastName,
        phone: phone || '',
        address: address?.line1 || '',
        city: address?.city || '',
        state: address?.state || '',
        zip_code: address?.postal_code || '',
        updated_at: new Date(),
      },
    })
    console.log('Created new customer:', dbCustomer.id)
  } else {
    // Update existing customer with latest info
    await prisma.customers.update({
      where: { id: dbCustomer.id },
      data: {
        stripe_id: customer.id,
        first_name: firstName || dbCustomer.first_name,
        last_name: lastName || dbCustomer.last_name,
        phone: phone || dbCustomer.phone,
        updated_at: new Date(),
      },
    })
    console.log('Updated customer:', dbCustomer.id)
  }

  // Create business record for this purchase (customer can have multiple businesses)
  if (businessName) {
    await prisma.businesses.create({
      data: {
        id: crypto.randomUUID(),
        customer_id: dbCustomer.id,
        business_name: businessName,
        website: website || null,
        industry: 'other',
        business_size: 'small',
        project_goals: `${planName} plan purchase`,
        timeline: 'asap',
        updated_at: new Date(),
      },
    })
    console.log('Created business for customer:', dbCustomer.id)
  }

  // Create transaction record
  const transaction = await prisma.transactions.create({
    data: {
      id: crypto.randomUUID(),
      customer_id: dbCustomer.id,
      stripe_payment_id: paymentIntent?.id || session.id,
      amount: fullSession.amount_total ? fullSession.amount_total / 100 : 0,
      currency: fullSession.currency || 'usd',
      status: 'SUCCEEDED',
      plan_name: planName,
      plan_period: planPeriod,
      description: `${planName} - ${planPeriod}`,
      receipt_email: email,
      metadata: {
        session_id: session.id,
        customer_id: customer.id,
      },
      updated_at: new Date(),
    },
  })
  console.log('Created transaction:', transaction.id)

  // Get receipt URL from payment intent
  let receiptUrl: string | undefined
  if (paymentIntent?.latest_charge) {
    const charge = await stripe.charges.retrieve(paymentIntent.latest_charge as string)
    receiptUrl = charge.receipt_url || undefined
  }

  // Send confirmation email
  const emailSent = await sendConfirmationEmail(
    email,
    firstName || 'Valued Customer',
    planName,
    amount,
    receiptUrl
  )

  // Send confirmation SMS if phone provided
  let smsSent = false
  if (phone) {
    smsSent = await sendConfirmationSMS(
      phone,
      firstName || 'Valued Customer',
      planName,
      amount
    )
  }

  // Update transaction with notification status
  await prisma.transactions.update({
    where: { id: transaction.id },
    data: {
      email_sent: emailSent,
      sms_sent: smsSent,
      updated_at: new Date(),
    },
  })

  console.log(`Notifications sent - Email: ${emailSent}, SMS: ${smsSent}`)
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  console.log('Processing subscription update:', subscription.id)

  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer.id

  const customer = await prisma.customers.findUnique({
    where: { stripe_id: customerId },
  })

  if (!customer) {
    console.warn('Customer not found for subscription:', subscription.id)
    return
  }

  // Find or create subscription record
  const existingSub = await prisma.subscriptions.findUnique({
    where: { stripe_subscription_id: subscription.id },
  })

  const planName = subscription.items.data[0]?.price?.nickname || 'Subscription'
  const planPrice = subscription.items.data[0]?.price?.unit_amount
    ? subscription.items.data[0].price.unit_amount / 100
    : 0

  // Access subscription period from the subscription object - use type assertion for newer API
  const subAny = subscription as unknown as Record<string, unknown>
  const currentPeriodStart = subAny.current_period_start as number | undefined
  const currentPeriodEnd = subAny.current_period_end as number | undefined
  const canceledAt = subAny.canceled_at as number | null | undefined

  const subscriptionData = {
    customer_id: customer.id,
    stripe_subscription_id: subscription.id,
    plan_name: planName,
    plan_price: planPrice,
    status: mapSubscriptionStatus(subscription.status),
    current_period_start: currentPeriodStart ? new Date(currentPeriodStart * 1000) : null,
    current_period_end: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : null,
    canceled_at: canceledAt ? new Date(canceledAt * 1000) : null,
    updated_at: new Date(),
  }

  if (existingSub) {
    await prisma.subscriptions.update({
      where: { id: existingSub.id },
      data: subscriptionData,
    })
    console.log('Updated subscription:', existingSub.id)
  } else {
    await prisma.subscriptions.create({
      data: {
        id: crypto.randomUUID(),
        ...subscriptionData,
      },
    })
    console.log('Created subscription for customer:', customer.id)
  }
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  console.log('Processing subscription cancellation:', subscription.id)

  await prisma.subscriptions.updateMany({
    where: { stripe_subscription_id: subscription.id },
    data: {
      status: 'CANCELED',
      canceled_at: new Date(),
      updated_at: new Date(),
    },
  })
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log('Processing invoice payment:', invoice.id)
  
  // Invoice payments are handled through checkout.session.completed for new subscriptions
  // This handles recurring payments - use type assertion for subscription field
  const invoiceAny = invoice as unknown as Record<string, unknown>
  const subscriptionId = invoiceAny.subscription as string | null
  
  if (!subscriptionId) return

  const customerId = typeof invoice.customer === 'string'
    ? invoice.customer
    : (invoice.customer as Stripe.Customer | null)?.id

  if (!customerId) return

  const customer = await prisma.customers.findUnique({
    where: { stripe_id: customerId },
  })

  if (!customer) return

  // Create transaction for recurring payment
  const paymentIntentId = invoiceAny.payment_intent as string | null
  await prisma.transactions.create({
    data: {
      id: crypto.randomUUID(),
      customer_id: customer.id,
      stripe_payment_id: paymentIntentId || invoice.id,
      amount: invoice.amount_paid / 100,
      currency: invoice.currency,
      status: 'SUCCEEDED',
      plan_name: invoice.lines.data[0]?.description || 'Subscription',
      plan_period: 'recurring',
      description: `Recurring payment - ${invoice.lines.data[0]?.description || 'Subscription'}`,
      receipt_email: customer.email,
      updated_at: new Date(),
    },
  })
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Processing failed payment:', invoice.id)
  
  const customerId = typeof invoice.customer === 'string'
    ? invoice.customer
    : (invoice.customer as Stripe.Customer | null)?.id

  if (!customerId) return

  const customer = await prisma.customers.findUnique({
    where: { stripe_id: customerId },
  })

  if (!customer) return

  // Update subscription status if exists - use type assertion
  const invoiceAny = invoice as unknown as Record<string, unknown>
  const subscriptionId = invoiceAny.subscription as string | null
  
  if (subscriptionId) {
    await prisma.subscriptions.updateMany({
      where: {
        stripe_subscription_id: subscriptionId,
      },
      data: {
        status: 'PAST_DUE',
        updated_at: new Date(),
      },
    })
  }
}

function mapSubscriptionStatus(status: Stripe.Subscription.Status): 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'UNPAID' | 'TRIALING' | 'PAUSED' {
  const statusMap: Record<string, 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'UNPAID' | 'TRIALING' | 'PAUSED'> = {
    active: 'ACTIVE',
    past_due: 'PAST_DUE',
    canceled: 'CANCELED',
    unpaid: 'UNPAID',
    trialing: 'TRIALING',
    paused: 'PAUSED',
  }
  return statusMap[status] || 'ACTIVE'
}
