"use client"

import React from "react"

/**
 * Internationalization Service
 *
 * This service handles multi-language support for the application
 * including Hindi, Gujarati, Tamil, and other Indian languages.
 */

// Language definitions
export const SUPPORTED_LANGUAGES = {
  en: { name: "English", nativeName: "English", flag: "🇺🇸" },
  hi: { name: "Hindi", nativeName: "हिंदी", flag: "🇮🇳" },
  gu: { name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  ta: { name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  te: { name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  kn: { name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  ml: { name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
  bn: { name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  mr: { name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  pa: { name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
}

// Translation keys and default values
const translations: Record<string, Record<string, string>> = {
  en: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.invoices": "Invoices",
    "nav.products": "Products",
    "nav.customers": "Customers",
    "nav.reports": "Reports",
    "nav.settings": "Settings",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.welcome": "Welcome back! Here's what's happening with your business.",
    "dashboard.totalSales": "Total Sales",
    "dashboard.totalPurchases": "Total Purchases",
    "dashboard.paymentsReceived": "Payments Received",
    "dashboard.pendingDues": "Pending Dues",

    // Invoices
    "invoices.title": "Invoices",
    "invoices.create": "Create Invoice",
    "invoices.number": "Invoice Number",
    "invoices.customer": "Customer",
    "invoices.amount": "Amount",
    "invoices.date": "Date",
    "invoices.dueDate": "Due Date",
    "invoices.status": "Status",
    "invoices.paid": "Paid",
    "invoices.pending": "Pending",
    "invoices.overdue": "Overdue",

    // Products
    "products.title": "Products & Inventory",
    "products.add": "Add Product",
    "products.name": "Product Name",
    "products.category": "Category",
    "products.price": "Price",
    "products.stock": "Stock",
    "products.lowStock": "Low Stock",

    // Customers
    "customers.title": "Customers",
    "customers.add": "Add Customer",
    "customers.name": "Customer Name",
    "customers.email": "Email",
    "customers.phone": "Phone",
    "customers.totalSales": "Total Sales",
    "customers.outstanding": "Outstanding",

    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.export": "Export",
    "common.import": "Import",
    "common.loading": "Loading...",
    "common.noData": "No data available",
    "common.error": "An error occurred",
    "common.success": "Operation completed successfully",

    // GST REMOVED

    // Currency
    "currency.inr": "₹",
    "currency.rupees": "Rupees",
    "currency.paise": "Paise",
  },

  hi: {
    // Navigation
    "nav.dashboard": "डैशबोर्ड",
    "nav.invoices": "बिल",
    "nav.products": "उत्पाद",
    "nav.customers": "ग्राहक",
    "nav.reports": "रिपोर्ट",
    "nav.settings": "सेटिंग्स",

    // Dashboard
    "dashboard.title": "डैशबोर्ड",
    "dashboard.welcome": "वापस आपका स्वागत है! यहाँ आपके व्यवसाय के साथ क्या हो रहा है।",
    "dashboard.totalSales": "कुल बिक्री",
    "dashboard.totalPurchases": "कुल खरीदारी",
    "dashboard.paymentsReceived": "प्राप्त भुगतान",
    "dashboard.pendingDues": "लंबित बकाया",

    // Invoices
    "invoices.title": "बिल",
    "invoices.create": "बिल बनाएं",
    "invoices.number": "बिल संख्या",
    "invoices.customer": "ग्राहक",
    "invoices.amount": "राशि",
    "invoices.date": "दिनांक",
    "invoices.dueDate": "देय तिथि",
    "invoices.status": "स्थिति",
    "invoices.paid": "भुगतान किया गया",
    "invoices.pending": "लंबित",
    "invoices.overdue": "अतिदेय",

    // Products
    "products.title": "उत्पाद और इन्वेंटरी",
    "products.add": "उत्पाद जोड़ें",
    "products.name": "उत्पाद का नाम",
    "products.category": "श्रेणी",
    "products.price": "मूल्य",
    "products.stock": "स्टॉक",
    "products.lowStock": "कम स्टॉक",

    // Customers
    "customers.title": "ग्राहक",
    "customers.add": "ग्राहक जोड़ें",
    "customers.name": "ग्राहक का नाम",
    "customers.email": "ईमेल",
    "customers.phone": "फोन",
    "customers.totalSales": "कुल बिक्री",
    "customers.outstanding": "बकाया",

    // Common
    "common.save": "सेव करें",
    "common.cancel": "रद्द करें",
    "common.edit": "संपादित करें",
    "common.delete": "हटाएं",
    "common.search": "खोजें",
    "common.filter": "फिल्टर",
    "common.export": "निर्यात",
    "common.import": "आयात",
    "common.loading": "लोड हो रहा है...",
    "common.noData": "कोई डेटा उपलब्ध नहीं",
    "common.error": "एक त्रुटि हुई",
    "common.success": "ऑपरेशन सफलतापूर्वक पूरा हुआ",

    // GST REMOVED

    // Currency
    "currency.inr": "₹",
    "currency.rupees": "रुपये",
    "currency.paise": "पैसे",
  },

  gu: {
    // Navigation
    "nav.dashboard": "ડેશબોર્ડ",
    "nav.invoices": "બિલ",
    "nav.products": "ઉત્પાદનો",
    "nav.customers": "ગ્રાહકો",
    "nav.reports": "રિપોર્ટ્સ",
    "nav.settings": "સેટિંગ્સ",

    // Dashboard
    "dashboard.title": "ડેશબોર્ડ",
    "dashboard.welcome": "પાછા આવવા બદલ આભાર! અહીં તમારા વ્યવસાય સાથે શું થઈ રહ્યું છે.",
    "dashboard.totalSales": "કુલ વેચાણ",
    "dashboard.totalPurchases": "કુલ ખરીદી",
    "dashboard.paymentsReceived": "પ્રાપ્ત ચુકવણીઓ",
    "dashboard.pendingDues": "બાકી રકમ",

    // Common
    "common.save": "સેવ કરો",
    "common.cancel": "રદ કરો",
    "common.edit": "સંપાદિત કરો",
    "common.delete": "કાઢી નાખો",
    "common.search": "શોધો",
    "common.filter": "ફિલ્ટર",
    "common.export": "નિકાસ",
    "common.import": "આયાત",
    "common.loading": "લોડ થઈ રહ્યું છે...",
    "common.noData": "કોઈ ડેટા ઉપલબ્ધ નથી",
    "common.error": "એક ભૂલ આવી",
    "common.success": "ઓપરેશન સફળતાપૂર્વક પૂર્ણ થયું",

    // Currency
    "currency.inr": "₹",
    "currency.rupees": "રૂપિયા",
    "currency.paise": "પૈસા",
  },

  ta: {
    // Navigation
    "nav.dashboard": "டாஷ்போர்டு",
    "nav.invoices": "பில்கள்",
    "nav.products": "தயாரிப்புகள்",
    "nav.customers": "வாடிக்கையாளர்கள்",
    "nav.reports": "அறிக்கைகள்",
    "nav.settings": "அமைப்புகள்",

    // Dashboard
    "dashboard.title": "டாஷ்போர்டு",
    "dashboard.welcome": "மீண்டும் வரவேற்கிறோம்! உங்கள் வணிகத்தில் என்ன நடக்கிறது என்பது இங்கே.",
    "dashboard.totalSales": "மொத்த விற்பனை",
    "dashboard.totalPurchases": "மொத்த கொள்முதல்",
    "dashboard.paymentsReceived": "பெறப்பட்ட கொடுப்பனவுகள்",
    "dashboard.pendingDues": "நிலுவையில் உள்ள தொகை",

    // Common
    "common.save": "சேமிக்கவும்",
    "common.cancel": "ரத்து செய்யவும்",
    "common.edit": "திருத்தவும்",
    "common.delete": "நீக்கவும்",
    "common.search": "தேடவும்",
    "common.filter": "வடிகட்டி",
    "common.export": "ஏற்றுமதி",
    "common.import": "இறக்குமதி",
    "common.loading": "ஏற்றுகிறது...",
    "common.noData": "தரவு எதுவும் கிடைக்கவில்லை",
    "common.error": "ஒரு பிழை ஏற்பட்டது",
    "common.success": "செயல்பாடு வெற்றிகரமாக முடிந்தது",

    // Currency
    "currency.inr": "₹",
    "currency.rupees": "ரூபாய்",
    "currency.paise": "பைசா",
  },
}

// Current language state
let currentLanguage = "en"

/**
 * Set the current language
 */
export function setLanguage(language: string): void {
  if (SUPPORTED_LANGUAGES[language as keyof typeof SUPPORTED_LANGUAGES]) {
    currentLanguage = language
    localStorage.setItem("myinvoicebook_language", language)

    // Trigger language change event
    window.dispatchEvent(new CustomEvent("languageChanged", { detail: language }))
  }
}

/**
 * Get the current language
 */
export function getCurrentLanguage(): string {
  return currentLanguage
}

/**
 * Initialize language from localStorage or browser preference
 */
export function initializeLanguage(): void {
  const savedLanguage = localStorage.getItem("myinvoicebook_language")
  const browserLanguage = navigator.language.split("-")[0]

  if (savedLanguage && SUPPORTED_LANGUAGES[savedLanguage as keyof typeof SUPPORTED_LANGUAGES]) {
    currentLanguage = savedLanguage
  } else if (SUPPORTED_LANGUAGES[browserLanguage as keyof typeof SUPPORTED_LANGUAGES]) {
    currentLanguage = browserLanguage
  } else {
    currentLanguage = "en"
  }
}

/**
 * Translate a key to the current language
 */
export function t(key: string, fallback?: string): string {
  const languageTranslations = translations[currentLanguage] || translations.en
  return languageTranslations[key] || translations.en[key] || fallback || key
}

/**
 * Get all translations for a specific language
 */
export function getTranslations(language: string): Record<string, string> {
  return translations[language] || translations.en
}

/**
 * Add or update translations for a language
 */
export function addTranslations(language: string, newTranslations: Record<string, string>): void {
  if (!translations[language]) {
    translations[language] = {}
  }

  translations[language] = {
    ...translations[language],
    ...newTranslations,
  }
}

/**
 * Format currency based on language
 */
export function formatCurrency(amount: number, language?: string): string {
  const lang = language || currentLanguage
  const currencySymbol = t("currency.inr")

  // Format number based on Indian numbering system
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  })

  return formatter.format(amount).replace("₹", currencySymbol)
}

/**
 * Format date based on language
 */
export function formatDate(date: Date, language?: string): string {
  const lang = language || currentLanguage

  const formatters: Record<string, Intl.DateTimeFormat> = {
    en: new Intl.DateTimeFormat("en-IN"),
    hi: new Intl.DateTimeFormat("hi-IN"),
    gu: new Intl.DateTimeFormat("gu-IN"),
    ta: new Intl.DateTimeFormat("ta-IN"),
    te: new Intl.DateTimeFormat("te-IN"),
    kn: new Intl.DateTimeFormat("kn-IN"),
    ml: new Intl.DateTimeFormat("ml-IN"),
    bn: new Intl.DateTimeFormat("bn-IN"),
    mr: new Intl.DateTimeFormat("mr-IN"),
    pa: new Intl.DateTimeFormat("pa-IN"),
  }

  const formatter = formatters[lang] || formatters.en
  return formatter.format(date)
}

/**
 * Get text direction for the language (RTL/LTR)
 */
export function getTextDirection(language?: string): "ltr" | "rtl" {
  const lang = language || currentLanguage

  // Most Indian languages are LTR
  // Add RTL languages here if needed (like Urdu)
  const rtlLanguages = ["ur", "ar"]

  return rtlLanguages.includes(lang) ? "rtl" : "ltr"
}

/**
 * React hook for translations
 */
export function useTranslation() {
  const [language, setCurrentLanguage] = React.useState(currentLanguage)

  React.useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLanguage(event.detail)
    }

    window.addEventListener("languageChanged", handleLanguageChange as EventListener)

    return () => {
      window.removeEventListener("languageChanged", handleLanguageChange as EventListener)
    }
  }, [])

  return {
    t,
    language,
    setLanguage,
    formatCurrency,
    formatDate,
    getTextDirection: () => getTextDirection(language),
  }
}
