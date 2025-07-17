/**
 * WhatsApp Integration Service
 *
 * This service handles integration with the WhatsApp Business API
 * to send invoices, payment reminders, and product catalogs to customers.
 */

import axios from "axios"

// Configuration for WhatsApp Business API
const WHATSAPP_API_CONFIG = {
  baseURL: process.env.WHATSAPP_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
  },
}

// Interface for WhatsApp message response
interface WhatsAppResponse {
  success: boolean
  messageId?: string
  error?: string
}

// Interface for WhatsApp template data
interface TemplateData {
  name: string
  language: {
    code: string
  }
  components: Array<{
    type: "header" | "body" | "button"
    parameters: Array<{
      type: "text" | "currency" | "date_time" | "image" | "document"
      text?: string
      currency?: {
        fallback_value: string
        code: string
        amount_1000: number
      }
      date_time?: {
        fallback_value: string
      }
      image?: {
        link: string
      }
      document?: {
        link: string
        filename: string
      }
    }>
  }>
}

/**
 * Send an invoice to a customer via WhatsApp
 * @param phoneNumber Customer's phone number with country code
 * @param invoiceNumber Invoice number
 * @param customerName Customer's name
 * @param amount Invoice amount
 * @param dueDate Due date for payment
 * @param pdfUrl URL to the invoice PDF
 * @returns Response with message ID or error
 */
export async function sendInvoice(
  phoneNumber: string,
  invoiceNumber: string,
  customerName: string,
  amount: number,
  dueDate: string,
  pdfUrl: string,
): Promise<WhatsAppResponse> {
  try {
    const templateData: TemplateData = {
      name: "invoice_notification",
      language: { code: "en" },
      components: [
        {
          type: "header",
          parameters: [
            {
              type: "document",
              document: {
                link: pdfUrl,
                filename: `Invoice-${invoiceNumber}.pdf`,
              },
            },
          ],
        },
        {
          type: "body",
          parameters: [
            { type: "text", text: customerName },
            { type: "text", text: invoiceNumber },
            {
              type: "currency",
              currency: {
                fallback_value: `₹${(amount / 100).toFixed(2)}`,
                code: "INR",
                amount_1000: amount * 10, // Convert to WhatsApp's format (amount * 1000)
              },
            },
            {
              type: "date_time",
              date_time: {
                fallback_value: dueDate,
              },
            },
          ],
        },
      ],
    }

    const response = await axios.post(
      `${WHATSAPP_API_CONFIG.baseURL}/messages`,
      {
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "template",
        template: templateData,
      },
      { headers: WHATSAPP_API_CONFIG.headers },
    )

    return {
      success: true,
      messageId: response.data.message_id,
    }
  } catch (error) {
    console.error("WhatsApp invoice send error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send invoice",
    }
  }
}

/**
 * Send payment reminder via WhatsApp
 */
export async function sendPaymentReminder(
  phoneNumber: string,
  customerName: string,
  invoiceNumber: string,
  amount: number,
  daysOverdue: number,
): Promise<WhatsAppResponse> {
  try {
    const templateData: TemplateData = {
      name: "payment_reminder",
      language: { code: "en" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: customerName },
            { type: "text", text: invoiceNumber },
            {
              type: "currency",
              currency: {
                fallback_value: `₹${(amount / 100).toFixed(2)}`,
                code: "INR",
                amount_1000: amount * 10,
              },
            },
            { type: "text", text: daysOverdue.toString() },
          ],
        },
      ],
    }

    const response = await axios.post(
      `${WHATSAPP_API_CONFIG.baseURL}/messages`,
      {
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "template",
        template: templateData,
      },
      { headers: WHATSAPP_API_CONFIG.headers },
    )

    return {
      success: true,
      messageId: response.data.messages[0].id,
    }
  } catch (error) {
    console.error("WhatsApp payment reminder error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send payment reminder",
    }
  }
}

/**
 * Send product catalog via WhatsApp
 */
export async function sendProductCatalog(
  phoneNumber: string,
  customerName: string,
  catalogUrl: string,
): Promise<WhatsAppResponse> {
  try {
    const response = await axios.post(
      `${WHATSAPP_API_CONFIG.baseURL}/messages`,
      {
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "document",
        document: {
          link: catalogUrl,
          filename: "Product-Catalog.pdf",
          caption: `Hi ${customerName}, here's our latest product catalog!`,
        },
      },
      { headers: WHATSAPP_API_CONFIG.headers },
    )

    return {
      success: true,
      messageId: response.data.messages[0].id,
    }
  } catch (error) {
    console.error("WhatsApp catalog send error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send catalog",
    }
  }
}

/**
 * Send bulk WhatsApp messages
 */
export async function sendBulkMessages(
  messages: Array<{
    phoneNumber: string
    customerName: string
    message: string
  }>,
): Promise<Array<WhatsAppResponse>> {
  const results: Array<WhatsAppResponse> = []

  for (const msg of messages) {
    try {
      const response = await axios.post(
        `${WHATSAPP_API_CONFIG.baseURL}/messages`,
        {
          messaging_product: "whatsapp",
          to: msg.phoneNumber,
          type: "text",
          text: {
            body: `Hi ${msg.customerName}, ${msg.message}`,
          },
        },
        { headers: WHATSAPP_API_CONFIG.headers },
      )

      results.push({
        success: true,
        messageId: response.data.messages[0].id,
      })

      // Add delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`WhatsApp bulk message error for ${msg.phoneNumber}:`, error)
      results.push({
        success: false,
        error: error instanceof Error ? error.message : "Failed to send message",
      })
    }
  }

  return results
}
