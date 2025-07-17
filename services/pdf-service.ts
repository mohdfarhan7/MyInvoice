/**
 * PDF Generation Service
 *
 * This service handles PDF generation for invoices, reports,
 * and other documents using jsPDF and html2canvas.
 */

import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { formatCurrency, formatDate } from "./i18n-service"

// Interface for invoice data
export interface InvoicePDFData {
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  businessInfo: {
    name: string
    address: string
    gstin: string
    phone: string
    email: string
    logo?: string
  }
  customerInfo: {
    name: string
    address: string
    gstin?: string
    phone?: string
    email?: string
  }
  items: Array<{
    description: string
    hsn: string
    quantity: number
    unit: string
    rate: number
    amount: number
    gstRate: number
    gstAmount: number
  }>
  totals: {
    subtotal: number
    cgst: number
    sgst: number
    igst: number
    total: number
  }
  terms?: string
  notes?: string
}

/**
 * Generate invoice PDF
 */
export async function generateInvoicePDF(data: InvoicePDFData): Promise<Blob> {
  const pdf = new jsPDF("p", "mm", "a4")
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  let yPosition = 20

  // Add business logo if available
  if (data.businessInfo.logo) {
    try {
      pdf.addImage(data.businessInfo.logo, "PNG", 20, yPosition, 40, 20)
      yPosition += 25
    } catch (error) {
      console.error("Error adding logo to PDF:", error)
    }
  }

  // Business information
  pdf.setFontSize(16)
  pdf.setFont("helvetica", "bold")
  pdf.text(data.businessInfo.name, 20, yPosition)
  yPosition += 8

  pdf.setFontSize(10)
  pdf.setFont("helvetica", "normal")
  const businessLines = data.businessInfo.address.split("\n")
  businessLines.forEach((line) => {
    pdf.text(line, 20, yPosition)
    yPosition += 5
  })

  pdf.text(`GSTIN: ${data.businessInfo.gstin}`, 20, yPosition)
  yPosition += 5
  pdf.text(`Phone: ${data.businessInfo.phone}`, 20, yPosition)
  yPosition += 5
  pdf.text(`Email: ${data.businessInfo.email}`, 20, yPosition)
  yPosition += 15

  // Invoice title and details
  pdf.setFontSize(20)
  pdf.setFont("helvetica", "bold")
  pdf.text("TAX INVOICE", pageWidth - 60, 30)

  pdf.setFontSize(12)
  pdf.setFont("helvetica", "normal")
  pdf.text(`Invoice No: ${data.invoiceNumber}`, pageWidth - 60, 45)
  pdf.text(`Date: ${formatDate(new Date(data.invoiceDate))}`, pageWidth - 60, 55)
  pdf.text(`Due Date: ${formatDate(new Date(data.dueDate))}`, pageWidth - 60, 65)

  // Customer information
  pdf.setFontSize(12)
  pdf.setFont("helvetica", "bold")
  pdf.text("Bill To:", 20, yPosition)
  yPosition += 8

  pdf.setFont("helvetica", "normal")
  pdf.text(data.customerInfo.name, 20, yPosition)
  yPosition += 6

  const customerLines = data.customerInfo.address.split("\n")
  customerLines.forEach((line) => {
    pdf.text(line, 20, yPosition)
    yPosition += 5
  })

  if (data.customerInfo.gstin) {
    pdf.text(`GSTIN: ${data.customerInfo.gstin}`, 20, yPosition)
    yPosition += 5
  }

  if (data.customerInfo.phone) {
    pdf.text(`Phone: ${data.customerInfo.phone}`, 20, yPosition)
    yPosition += 5
  }

  yPosition += 10

  // Items table
  const tableStartY = yPosition
  const tableHeaders = ["Description", "HSN", "Qty", "Unit", "Rate", "Amount", "GST%", "GST Amt"]
  const columnWidths = [50, 20, 15, 15, 20, 25, 15, 20]
  const columnX = [20, 70, 90, 105, 120, 140, 165, 180]

  // Table header
  pdf.setFillColor(240, 240, 240)
  pdf.rect(20, yPosition, pageWidth - 40, 8, "F")

  pdf.setFontSize(10)
  pdf.setFont("helvetica", "bold")
  tableHeaders.forEach((header, index) => {
    pdf.text(header, columnX[index], yPosition + 6)
  })

  yPosition += 10

  // Table rows
  pdf.setFont("helvetica", "normal")
  data.items.forEach((item, index) => {
    if (yPosition > pageHeight - 50) {
      pdf.addPage()
      yPosition = 20
    }

    const rowData = [
      item.description,
      item.hsn,
      item.quantity.toString(),
      item.unit,
      formatCurrency(item.rate),
      formatCurrency(item.amount),
      `${item.gstRate}%`,
      formatCurrency(item.gstAmount),
    ]

    rowData.forEach((data, colIndex) => {
      pdf.text(data, columnX[colIndex], yPosition + 6)
    })

    yPosition += 8

    // Add line separator
    if (index < data.items.length - 1) {
      pdf.setDrawColor(200, 200, 200)
      pdf.line(20, yPosition, pageWidth - 20, yPosition)
    }
  })

  yPosition += 10

  // Totals section
  const totalsX = pageWidth - 80
  pdf.setFont("helvetica", "normal")

  pdf.text("Subtotal:", totalsX - 30, yPosition)
  pdf.text(formatCurrency(data.totals.subtotal), totalsX, yPosition)
  yPosition += 6

  if (data.totals.cgst > 0) {
    pdf.text("CGST:", totalsX - 30, yPosition)
    pdf.text(formatCurrency(data.totals.cgst), totalsX, yPosition)
    yPosition += 6
  }

  if (data.totals.sgst > 0) {
    pdf.text("SGST:", totalsX - 30, yPosition)
    pdf.text(formatCurrency(data.totals.sgst), totalsX, yPosition)
    yPosition += 6
  }

  if (data.totals.igst > 0) {
    pdf.text("IGST:", totalsX - 30, yPosition)
    pdf.text(formatCurrency(data.totals.igst), totalsX, yPosition)
    yPosition += 6
  }

  // Total line
  pdf.setDrawColor(0, 0, 0)
  pdf.line(totalsX - 35, yPosition, pageWidth - 20, yPosition)
  yPosition += 8

  pdf.setFont("helvetica", "bold")
  pdf.text("Total:", totalsX - 30, yPosition)
  pdf.text(formatCurrency(data.totals.total), totalsX, yPosition)

  yPosition += 20

  // Terms and conditions
  if (data.terms) {
    pdf.setFont("helvetica", "bold")
    pdf.text("Terms & Conditions:", 20, yPosition)
    yPosition += 8

    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(9)
    const termsLines = pdf.splitTextToSize(data.terms, pageWidth - 40)
    termsLines.forEach((line: string) => {
      pdf.text(line, 20, yPosition)
      yPosition += 4
    })
  }

  // Notes
  if (data.notes) {
    yPosition += 10
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(10)
    pdf.text("Notes:", 20, yPosition)
    yPosition += 8

    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(9)
    const notesLines = pdf.splitTextToSize(data.notes, pageWidth - 40)
    notesLines.forEach((line: string) => {
      pdf.text(line, 20, yPosition)
      yPosition += 4
    })
  }

  // Footer
  const footerY = pageHeight - 20
  pdf.setFontSize(8)
  pdf.setFont("helvetica", "italic")
  pdf.text("This is a computer generated invoice.", 20, footerY)
  pdf.text(`Generated on: ${formatDate(new Date())}`, pageWidth - 60, footerY)

  return pdf.output("blob")
}

/**
 * Generate report PDF from HTML element
 */
export async function generateReportPDF(
  elementId: string,
  filename: string,
  orientation: "portrait" | "landscape" = "portrait",
): Promise<Blob> {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error(`Element with ID ${elementId} not found`)
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
  })

  const imgData = canvas.toDataURL("image/png")
  const pdf = new jsPDF(orientation, "mm", "a4")

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  const imgWidth = pageWidth - 20 // 10mm margin on each side
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  let heightLeft = imgHeight
  let position = 10 // 10mm top margin

  // Add first page
  pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight)
  heightLeft -= pageHeight - 20 // Account for margins

  // Add additional pages if needed
  while (heightLeft >= 0) {
    position = heightLeft - imgHeight + 10
    pdf.addPage()
    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight)
    heightLeft -= pageHeight - 20
  }

  return pdf.output("blob")
}

/**
 * Generate customer statement PDF
 */
export async function generateCustomerStatementPDF(
  customerData: any,
  transactions: any[],
  fromDate: string,
  toDate: string,
): Promise<Blob> {
  const pdf = new jsPDF("p", "mm", "a4")
  const pageWidth = pdf.internal.pageSize.getWidth()

  let yPosition = 20

  // Header
  pdf.setFontSize(18)
  pdf.setFont("helvetica", "bold")
  pdf.text("Customer Statement", pageWidth / 2, yPosition, { align: "center" })
  yPosition += 15

  // Customer info
  pdf.setFontSize(12)
  pdf.text(`Customer: ${customerData.name}`, 20, yPosition)
  yPosition += 8
  pdf.text(`Period: ${formatDate(new Date(fromDate))} to ${formatDate(new Date(toDate))}`, 20, yPosition)
  yPosition += 15

  // Transactions table
  const tableHeaders = ["Date", "Description", "Debit", "Credit", "Balance"]
  const columnWidths = [30, 80, 25, 25, 25]
  const columnX = [20, 50, 130, 155, 180]

  // Table header
  pdf.setFillColor(240, 240, 240)
  pdf.rect(20, yPosition, pageWidth - 40, 8, "F")

  pdf.setFontSize(10)
  pdf.setFont("helvetica", "bold")
  tableHeaders.forEach((header, index) => {
    pdf.text(header, columnX[index], yPosition + 6)
  })

  yPosition += 10

  // Table rows
  pdf.setFont("helvetica", "normal")
  transactions.forEach((transaction, index) => {
    if (yPosition > pdf.internal.pageSize.getHeight() - 50) {
      pdf.addPage()
      yPosition = 20
    }

    const rowData = [
      formatDate(new Date(transaction.date)),
      transaction.description,
      formatCurrency(transaction.debit),
      formatCurrency(transaction.credit),
      formatCurrency(transaction.balance),
    ]

    rowData.forEach((data, colIndex) => {
      pdf.text(data, columnX[colIndex], yPosition + 6)
    })

    yPosition += 8

    // Add line separator
    if (index < transactions.length - 1) {
      pdf.setDrawColor(200, 200, 200)
      pdf.line(20, yPosition, pageWidth - 20, yPosition)
    }
  })

  // Footer
  const footerY = pdf.internal.pageSize.getHeight() - 20
  pdf.setFontSize(8)
  pdf.setFont("helvetica", "italic")
  pdf.text("This is a computer generated statement.", 20, footerY)
  pdf.text(`Generated on: ${formatDate(new Date())}`, pageWidth - 60, footerY)

  return pdf.output("blob")
}
