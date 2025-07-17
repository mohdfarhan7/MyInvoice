"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const plans = [
  {
    name: "Starter",
    price: 0,
    period: "forever",
    description: "Perfect for small businesses getting started",
    features: [
      "5 invoices per month",
      "Basic inventory tracking",
      "Email support",
      "Mobile app access",
    ],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    name: "Professional",
    price: 399,
    period: "month",
    description: "For growing businesses with advanced needs",
    features: [
      "Unlimited invoices",
      "Advanced inventory management",
      "WhatsApp integration",
      "E-way bill & E-invoice",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: 799,
    period: "month",
    description: "For large businesses with complex requirements",
    features: [
      "Everything in Professional",
      "Multi-user access",
      "Advanced analytics",
      "API access",
      "24/7 phone support",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

export default function PricingPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Simple, Transparent Pricing</h1>
        <p className="text-lg text-gray-600">Choose the plan that fits your business. No hidden fees, no surprises.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl shadow-lg bg-white p-8 flex flex-col items-center border-2 transition-all ${plan.highlight ? "border-blue-600 scale-105" : "border-gray-100"}`}
          >
            {plan.highlight && (
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full shadow-lg z-10">Most Popular</span>
            )}
            <h2 className="text-2xl font-bold mb-2 text-gray-900">{plan.name}</h2>
            <div className="text-4xl font-extrabold text-blue-600 mb-1">
              {plan.price === 0 ? "Free" : `₹${plan.price}`}
              <span className="text-base font-medium text-gray-500 ml-1">{plan.price === 0 ? "" : `/ ${plan.period}`}</span>
            </div>
            <p className="text-gray-600 mb-4">{plan.description}</p>
            <ul className="mb-6 space-y-2 w-full text-left">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-gray-700">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              className={`w-full ${plan.highlight ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-100 text-blue-700 hover:bg-blue-50"}`}
              onClick={() => {
                if (plan.name === "Starter" || plan.name === "Professional") {
                  router.push("/auth/signup");
                } else if (plan.name === "Enterprise") {
                  router.push("/contact");
                }
              }}
            >
              {plan.cta}
            </Button>
          </div>
        ))}
      </div>
      <div className="max-w-3xl mx-auto mt-16 text-center text-gray-500 text-sm">
        <p>All plans include secure cloud backup, regular updates, and access to our knowledge base and support team. <br /> Need a custom plan? <a href="/contact" className="text-blue-600 hover:underline">Contact us</a>.</p>
      </div>
    </div>
  );
} 