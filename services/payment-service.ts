/**
 * Payment Gateway Service
 *
 * This service handles integration with Razorpay and PayU
 * for processing subscription payments and invoice payments.
 */

import Razorpay from "razorpay"
import crypto from "crypto"

// Razorpay configuration
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

// Interface for payment order
export interface PaymentOrder {
  id: string
  amount: number
  currency: string
  receipt: string
  status: string
  created_at: number
}

// Interface for subscription plan
export interface SubscriptionPlan {
  id: string
  name: string
  amount: number
  currency: string
  interval: "monthly" | "yearly"
  intervalCount: number
}

/**
 * Create a payment order for subscription
 */
export async function createSubscriptionOrder(
  amount: number,
  currency = "INR",
  receipt: string,
): Promise<PaymentOrder> {
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency,
      receipt,
      payment_capture: 1,
    })

    return {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
      created_at: order.created_at,
    }
  } catch (error) {
    console.error("Error creating payment order:", error)
    throw new Error("Failed to create payment order")
  }
}

/**
 * Verify payment signature
 */
export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
  try {
    const body = orderId + "|" + paymentId
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex")

    return expectedSignature === signature
  } catch (error) {
    console.error("Error verifying payment signature:", error)
    return false
  }
}

/**
 * Create subscription plan
 */
export async function createSubscriptionPlan(planData: Omit<SubscriptionPlan, "id">): Promise<SubscriptionPlan> {
  try {
    const plan = await razorpay.plans.create({
      period: planData.interval,
      interval: planData.intervalCount,
      item: {
        name: planData.name,
        amount: planData.amount * 100, // Convert to paise
        currency: planData.currency,
      },
    })

    return {
      id: plan.id,
      name: planData.name,
      amount: planData.amount,
      currency: planData.currency,
      interval: planData.interval,
      intervalCount: planData.intervalCount,
    }
  } catch (error) {
    console.error("Error creating subscription plan:", error)
    throw new Error("Failed to create subscription plan")
  }
}

/**
 * Create subscription
 */
export async function createSubscription(planId: string, customerId: string, totalCount?: number): Promise<any> {
  try {
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_id: customerId,
      total_count: totalCount,
      quantity: 1,
    })

    return subscription
  } catch (error) {
    console.error("Error creating subscription:", error)
    throw new Error("Failed to create subscription")
  }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(subscriptionId: string): Promise<any> {
  try {
    const subscription = await razorpay.subscriptions.cancel(subscriptionId, {
      cancel_at_cycle_end: 0,
    })

    return subscription
  } catch (error) {
    console.error("Error canceling subscription:", error)
    throw new Error("Failed to cancel subscription")
  }
}

/**
 * Get payment details
 */
export async function getPaymentDetails(paymentId: string): Promise<any> {
  try {
    const payment = await razorpay.payments.fetch(paymentId)
    return payment
  } catch (error) {
    console.error("Error fetching payment details:", error)
    throw new Error("Failed to fetch payment details")
  }
}

/**
 * Process refund
 */
export async function processRefund(paymentId: string, amount?: number, notes?: any): Promise<any> {
  try {
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount ? amount * 100 : undefined, // Convert to paise if amount provided
      notes,
    })

    return refund
  } catch (error) {
    console.error("Error processing refund:", error)
    throw new Error("Failed to process refund")
  }
}

/**
 * Create customer for subscription
 */
export async function createCustomer(name: string, email: string, contact: string): Promise<any> {
  try {
    const customer = await razorpay.customers.create({
      name,
      email,
      contact,
      fail_existing: 0,
    })

    return customer
  } catch (error) {
    console.error("Error creating customer:", error)
    throw new Error("Failed to create customer")
  }
}
