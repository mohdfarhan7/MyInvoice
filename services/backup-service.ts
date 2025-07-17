/**
 * Data Backup and Restore Service
 *
 * This service handles exporting and importing business data
 * for backup and restore functionality.
 */

import JSZip from "jszip"
import { saveAs } from "file-saver"

// Interface for backup data structure
interface BackupData {
  version: string
  timestamp: string
  businessProfile: any
  customers: any[]
  products: any[]
  invoices: any[]
  purchases: any[]
  payments: any[]
  expenses: any[]
  settings: any
}

/**
 * Export all business data as a backup file
 */
export async function exportBusinessData(): Promise<void> {
  try {
    // Fetch all data from your API endpoints
    const [businessProfile, customers, products, invoices, purchases, payments, expenses, settings] = await Promise.all(
      [
        fetch("/api/business-profile").then((res) => res.json()),
        fetch("/api/customers").then((res) => res.json()),
        fetch("/api/products").then((res) => res.json()),
        fetch("/api/invoices").then((res) => res.json()),
        fetch("/api/purchases").then((res) => res.json()),
        fetch("/api/payments").then((res) => res.json()),
        fetch("/api/expenses").then((res) => res.json()),
        fetch("/api/settings").then((res) => res.json()),
      ],
    )

    const backupData: BackupData = {
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      businessProfile,
      customers,
      products,
      invoices,
      purchases,
      payments,
      expenses,
      settings,
    }

    // Create ZIP file with backup data
    const zip = new JSZip()

    // Add main data file
    zip.file("backup-data.json", JSON.stringify(backupData, null, 2))

    // Add individual data files for easier access
    zip.file("customers.json", JSON.stringify(customers, null, 2))
    zip.file("products.json", JSON.stringify(products, null, 2))
    zip.file("invoices.json", JSON.stringify(invoices, null, 2))
    zip.file("purchases.json", JSON.stringify(purchases, null, 2))
    zip.file("payments.json", JSON.stringify(payments, null, 2))
    zip.file("expenses.json", JSON.stringify(expenses, null, 2))

    // Add README file with instructions
    const readme = `
MyInvoiceBook Data Backup
========================

This backup was created on: ${new Date().toLocaleString()}

Contents:
- backup-data.json: Complete backup data
- customers.json: Customer data
- products.json: Product and inventory data
- invoices.json: Invoice data
- purchases.json: Purchase data
- payments.json: Payment records
- expenses.json: Expense records

To restore this backup, use the import function in MyInvoiceBook settings.

Version: ${backupData.version}
    `

    zip.file("README.txt", readme)

    // Generate and download the ZIP file
    const content = await zip.generateAsync({ type: "blob" })
    const filename = `myinvoicebook-backup-${new Date().toISOString().split("T")[0]}.zip`
    saveAs(content, filename)

    console.log("Backup exported successfully")
  } catch (error) {
    console.error("Error exporting backup:", error)
    throw new Error("Failed to export backup data")
  }
}

/**
 * Import business data from backup file
 */
export async function importBusinessData(file: File): Promise<void> {
  try {
    const zip = new JSZip()
    const contents = await zip.loadAsync(file)

    // Check if backup-data.json exists
    const backupFile = contents.files["backup-data.json"]
    if (!backupFile) {
      throw new Error("Invalid backup file: backup-data.json not found")
    }

    // Read and parse backup data
    const backupDataStr = await backupFile.async("string")
    const backupData: BackupData = JSON.parse(backupDataStr)

    // Validate backup version compatibility
    if (!isVersionCompatible(backupData.version)) {
      throw new Error(`Incompatible backup version: ${backupData.version}`)
    }

    // Import data in the correct order to maintain relationships
    await importDataInOrder(backupData)

    console.log("Backup imported successfully")
  } catch (error) {
    console.error("Error importing backup:", error)
    throw new Error("Failed to import backup data")
  }
}

/**
 * Check if backup version is compatible
 */
function isVersionCompatible(version: string): boolean {
  const supportedVersions = ["1.0.0"]
  return supportedVersions.includes(version)
}

/**
 * Import data in the correct order to maintain relationships
 */
async function importDataInOrder(backupData: BackupData): Promise<void> {
  try {
    // 1. Import business profile and settings first
    await fetch("/api/business-profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(backupData.businessProfile),
    })

    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(backupData.settings),
    })

    // 2. Import customers and products (no dependencies)
    await Promise.all([
      fetch("/api/customers/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(backupData.customers),
      }),
      fetch("/api/products/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(backupData.products),
      }),
    ])

    // 3. Import invoices and purchases (depend on customers and products)
    await Promise.all([
      fetch("/api/invoices/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(backupData.invoices),
      }),
      fetch("/api/purchases/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(backupData.purchases),
      }),
    ])

    // 4. Import payments and expenses (depend on invoices/purchases)
    await Promise.all([
      fetch("/api/payments/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(backupData.payments),
      }),
      fetch("/api/expenses/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(backupData.expenses),
      }),
    ])
  } catch (error) {
    console.error("Error during data import:", error)
    throw error
  }
}

/**
 * Export specific data type (customers, products, etc.)
 */
export async function exportSpecificData(dataType: string): Promise<void> {
  try {
    const response = await fetch(`/api/${dataType}`)
    const data = await response.json()

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    })

    const filename = `${dataType}-export-${new Date().toISOString().split("T")[0]}.json`
    saveAs(blob, filename)

    console.log(`${dataType} data exported successfully`)
  } catch (error) {
    console.error(`Error exporting ${dataType} data:`, error)
    throw new Error(`Failed to export ${dataType} data`)
  }
}

/**
 * Import specific data type from JSON file
 */
export async function importSpecificData(file: File, dataType: string): Promise<void> {
  try {
    const text = await file.text()
    const data = JSON.parse(text)

    const response = await fetch(`/api/${dataType}/import`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Failed to import ${dataType} data`)
    }

    console.log(`${dataType} data imported successfully`)
  } catch (error) {
    console.error(`Error importing ${dataType} data:`, error)
    throw new Error(`Failed to import ${dataType} data`)
  }
}

/**
 * Schedule automatic backups
 */
export function scheduleAutoBackup(intervalHours = 24): void {
  const intervalMs = intervalHours * 60 * 60 * 1000

  setInterval(async () => {
    try {
      await exportBusinessData()
      console.log("Automatic backup completed")
    } catch (error) {
      console.error("Automatic backup failed:", error)
    }
  }, intervalMs)
}
