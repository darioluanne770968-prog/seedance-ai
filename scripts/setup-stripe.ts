/**
 * Stripe Setup Script
 * Run with: npx tsx scripts/setup-stripe.ts
 */

import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is required')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
})

const plans = [
  {
    name: 'Basic',
    description: 'For casual creators - 500 credits per month',
    monthlyPrice: 999, // $9.99 in cents
    yearlyPrice: 9999, // $99.99 in cents
  },
  {
    name: 'Pro',
    description: 'For professional creators - 2,000 credits per month',
    monthlyPrice: 2999, // $29.99 in cents
    yearlyPrice: 29999, // $299.99 in cents
  },
  {
    name: 'Max',
    description: 'For teams and enterprises - 10,000 credits per month',
    monthlyPrice: 9999, // $99.99 in cents
    yearlyPrice: 99999, // $999.99 in cents
  },
]

async function setupStripe() {
  console.log('🚀 Setting up Stripe products and prices...\n')

  const priceIds: Record<string, { monthly: string; yearly: string }> = {}

  for (const plan of plans) {
    console.log(`Creating product: ${plan.name}...`)

    // Create product
    const product = await stripe.products.create({
      name: `Seedance ${plan.name}`,
      description: plan.description,
      metadata: {
        plan: plan.name.toUpperCase(),
      },
    })

    console.log(`  ✓ Product created: ${product.id}`)

    // Create monthly price
    const monthlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: plan.monthlyPrice,
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      metadata: {
        plan: plan.name.toUpperCase(),
        interval: 'monthly',
      },
    })

    console.log(`  ✓ Monthly price created: ${monthlyPrice.id}`)

    // Create yearly price
    const yearlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: plan.yearlyPrice,
      currency: 'usd',
      recurring: {
        interval: 'year',
      },
      metadata: {
        plan: plan.name.toUpperCase(),
        interval: 'yearly',
      },
    })

    console.log(`  ✓ Yearly price created: ${yearlyPrice.id}`)

    priceIds[plan.name.toUpperCase()] = {
      monthly: monthlyPrice.id,
      yearly: yearlyPrice.id,
    }

    console.log('')
  }

  console.log('✅ Setup complete!\n')
  console.log('Add these to your .env.local file:\n')
  console.log('# Stripe Price IDs')
  console.log(`STRIPE_PRICE_BASIC_MONTHLY=${priceIds.BASIC.monthly}`)
  console.log(`STRIPE_PRICE_BASIC_YEARLY=${priceIds.BASIC.yearly}`)
  console.log(`STRIPE_PRICE_PRO_MONTHLY=${priceIds.PRO.monthly}`)
  console.log(`STRIPE_PRICE_PRO_YEARLY=${priceIds.PRO.yearly}`)
  console.log(`STRIPE_PRICE_MAX_MONTHLY=${priceIds.MAX.monthly}`)
  console.log(`STRIPE_PRICE_MAX_YEARLY=${priceIds.MAX.yearly}`)
}

setupStripe().catch(console.error)
