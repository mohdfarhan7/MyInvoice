"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calculator,
  Menu,
  X,
  ChevronDown,
  FileText,
  Package,
  Receipt,
  BarChart3,
  Users,
  Star,
  Check,
  ArrowRight,
  Play,
  Shield,
  Globe,
  Smartphone,
} from "lucide-react"

const solutions = [
  {
    title: "Smart Invoicing",
    description: "GST-compliant invoices in seconds",
    icon: FileText,
    color: "text-blue-600",
  },
  {
    title: "Inventory Control",
    description: "Real-time stock management",
    icon: Package,
    color: "text-green-600",
  },
  {
    title: "GST & Compliance",
    description: "Automated tax calculations",
    icon: Receipt,
    color: "text-purple-600",
  },
  {
    title: "Business Analytics",
    description: "Insights that drive growth",
    icon: BarChart3,
    color: "text-orange-600",
  },
]

const features = [
  {
    title: "GST Billing & Invoicing",
    description: "Create professional GST invoices instantly",
    icon: FileText,
    items: ["GST Invoice", "Quotation", "Delivery Challan", "Purchase Order"],
  },
  {
    title: "Inventory Management",
    description: "Track stock levels in real-time",
    icon: Package,
    items: ["Stock Management", "Low Stock Alerts", "Barcode Scanning", "Multi-location"],
  },
  {
    title: "Customer Management",
    description: "Manage all customer relationships",
    icon: Users,
    items: ["Customer Database", "Payment Tracking", "Credit Management", "Communication"],
  },
  {
    title: "Reports & Analytics",
    description: "Get insights into your business",
    icon: BarChart3,
    items: ["Sales Reports", "GST Reports", "Profit Analysis", "Tax Reports"],
  },
]

const pricingPlans = [
  {
    name: "Starter",
    price: "0",
    period: "forever",
    description: "Perfect for small businesses getting started",
    features: ["5 invoices per month", "Basic inventory tracking", "Email support", "Mobile app access"],
    buttonText: "Get Started Free",
    buttonVariant: "outline" as const,
    popular: false,
  },
  {
    name: "Professional",
    price: "399",
    period: "month",
    description: "For growing businesses with advanced needs",
    features: [
      "Unlimited invoices",
      "Advanced inventory management",
      "WhatsApp integration",
      "E-way bill & E-invoice",
      "Priority support",
    ],
    buttonText: "Start Free Trial",
    buttonVariant: "default" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "799",
    period: "month",
    description: "For large businesses with complex requirements",
    features: [
      "Everything in Professional",
      "Multi-user access",
      "Advanced analytics",
      "API access",
      "24/7 phone support",
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const,
    popular: false,
  },
]

const testimonials = [
  {
    name: "Rajesh Kumar",
    business: "Kumar Electronics",
    rating: 5,
    text: "MyInvoiceBook has transformed how we manage our business. GST filing is now so simple!",
  },
  {
    name: "Priya Sharma",
    business: "Sharma Textiles",
    rating: 5,
    text: "The inventory management feature saved us from stockouts. Highly recommended!",
  },
  {
    name: "Amit Patel",
    business: "Patel Trading Co.",
    rating: 5,
    text: "Customer support is excellent. They helped us migrate all our data seamlessly.",
  },
]

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 text-center text-sm">
        <span className="font-medium">🎉 Save up to 45% today</span>
        <Link href="/demo" className="ml-2 underline hover:no-underline">
          Book 1:1 Demo →
        </Link>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MyInvoiceBook</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <div className="relative">
                <button
                  onClick={() => setSolutionsOpen(!solutionsOpen)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <span>Solutions</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {solutionsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50">
                    <div className="grid gap-3">
                      {solutions.map((solution) => (
                        <Link
                          key={solution.title}
                          href={`/solutions/${solution.title.toLowerCase().replace(/\s+/g, "-")}`}
                          className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <solution.icon className={`w-5 h-5 mt-0.5 ${solution.color}`} />
                          <div>
                            <div className="font-medium text-gray-900">{solution.title}</div>
                            <div className="text-sm text-gray-600">{solution.description}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link href="/pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
                Pricing
              </Link>
              <Link href="/resources" className="text-gray-700 hover:text-blue-600 transition-colors">
                Resources
              </Link>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-gray-700">
                  Login
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline">Book Free Demo</Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Start Free Trial
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-4">
              <Link href="/solutions" className="block text-gray-700 hover:text-blue-600">
                Solutions
              </Link>
              <Link href="/pricing" className="block text-gray-700 hover:text-blue-600">
                Pricing
              </Link>
              <Link href="/resources" className="block text-gray-700 hover:text-blue-600">
                Resources
              </Link>
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full bg-transparent">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">Start Free Trial</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Smart Business
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Made Simple
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Join <span className="font-semibold text-blue-600">2+ Crore Indian entrepreneurs</span> who trust our
                  AI-powered platform for GST billing, inventory management, and complete business automation.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4"
                  >
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-transparent">
                    <Play className="w-5 h-5 mr-2" />
                    Watch Demo
                  </Button>
                </Link>
              </div>

              <div className="text-sm text-gray-600">
                ✓ Paid plans starting from <span className="font-semibold">₹399/month</span>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">GST Compliant</Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">Tax Invoice</span>
                    <span className="text-blue-600 font-semibold">INV-2024-001</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>₹10,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>CGST (9%)</span>
                      <span>₹900</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>SGST (9%)</span>
                      <span>₹900</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>₹11,800</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">4.8+ Rating</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">ISO Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="border-t border-gray-200 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">4.8+</div>
                <div className="text-sm text-gray-600">Google Play Store</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">4.7+</div>
                <div className="text-sm text-gray-600">Apple Store</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">ISO</div>
                <div className="text-sm text-gray-600">Certified</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">2Cr+</div>
                <div className="text-sm text-gray-600">Happy Users</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
              One software for
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                All your business needs
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A Complete GST Billing & Business Management Software. Designed & developed for the amazing small & medium
              businesses of India! 🇮🇳
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-xl text-gray-600">Choose the perfect plan for your business needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${plan.popular ? "ring-2 ring-blue-600 scale-105" : ""} hover:shadow-xl transition-all duration-300`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                )}
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900">₹{plan.price}</span>
                      <span className="text-gray-600">/{plan.period}</span>
                    </div>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${plan.popular ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" : ""}`}
                    variant={plan.buttonVariant}
                    size="lg"
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">Trusted by businesses across India</h2>
            <p className="text-xl text-gray-600">See what our customers have to say about us</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.business}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">Ready to transform your business?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of businesses already using MyInvoiceBook</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 bg-transparent"
              >
                Book a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">MyInvoiceBook</span>
              </div>
              <p className="text-gray-400">Complete Business Accounting Solution for Indian SMEs</p>
              <div className="flex space-x-4">
                <Globe className="w-5 h-5 text-gray-400" />
                <Smartphone className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Solutions</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/solutions/invoicing" className="hover:text-white transition-colors">
                    Smart Invoicing
                  </Link>
                </li>
                <li>
                  <Link href="/solutions/inventory" className="hover:text-white transition-colors">
                    Inventory Control
                  </Link>
                </li>
                <li>
                  <Link href="/solutions/gst" className="hover:text-white transition-colors">
                    GST & Compliance
                  </Link>
                </li>
                <li>
                  <Link href="/solutions/analytics" className="hover:text-white transition-colors">
                    Business Analytics
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/webinars" className="hover:text-white transition-colors">
                    Webinars
                  </Link>
                </li>
                <li>
                  <Link href="/templates" className="hover:text-white transition-colors">
                    Templates
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MyInvoiceBook. All rights reserved. Made with ❤️ in India</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
