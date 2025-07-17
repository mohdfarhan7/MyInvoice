/**
 * Offline Mode Service
 *
 * This service handles offline functionality using service workers
 * and IndexedDB for data synchronization when the app goes offline.
 */

import { openDB, type DBSchema, type IDBPDatabase } from "idb"

// Database schema for offline storage
interface OfflineDB extends DBSchema {
  invoices: {
    key: string
    value: {
      id: string
      data: any
      timestamp: number
      synced: boolean
    }
  }
  customers: {
    key: string
    value: {
      id: string
      data: any
      timestamp: number
      synced: boolean
    }
  }
  products: {
    key: string
    value: {
      id: string
      data: any
      timestamp: number
      synced: boolean
    }
  }
  sync_queue: {
    key: string
    value: {
      id: string
      action: "create" | "update" | "delete"
      table: string
      data: any
      timestamp: number
    }
  }
}

let db: IDBPDatabase<OfflineDB>

/**
 * Initialize offline database
 */
export async function initOfflineDB(): Promise<void> {
  try {
    db = await openDB<OfflineDB>("MyInvoiceBookOffline", 1, {
      upgrade(db) {
        // Create object stores
        if (!db.objectStoreNames.contains("invoices")) {
          const invoiceStore = db.createObjectStore("invoices", { keyPath: "id" })
          invoiceStore.createIndex("synced", "synced")
          invoiceStore.createIndex("timestamp", "timestamp")
        }

        if (!db.objectStoreNames.contains("customers")) {
          const customerStore = db.createObjectStore("customers", { keyPath: "id" })
          customerStore.createIndex("synced", "synced")
          customerStore.createIndex("timestamp", "timestamp")
        }

        if (!db.objectStoreNames.contains("products")) {
          const productStore = db.createObjectStore("products", { keyPath: "id" })
          productStore.createIndex("synced", "synced")
          productStore.createIndex("timestamp", "timestamp")
        }

        if (!db.objectStoreNames.contains("sync_queue")) {
          const syncStore = db.createObjectStore("sync_queue", { keyPath: "id" })
          syncStore.createIndex("timestamp", "timestamp")
        }
      },
    })

    console.log("Offline database initialized")
  } catch (error) {
    console.error("Error initializing offline database:", error)
    throw error
  }
}

/**
 * Save data to offline storage
 */
export async function saveOfflineData(table: keyof OfflineDB, id: string, data: any): Promise<void> {
  try {
    if (table === "sync_queue") {
      await db.put(table, data)
    } else {
      await db.put(table as any, {
        id,
        data,
        timestamp: Date.now(),
        synced: false,
      })
    }
  } catch (error) {
    console.error("Error saving offline data:", error)
    throw error
  }
}

/**
 * Get data from offline storage
 */
export async function getOfflineData(table: keyof OfflineDB, id?: string): Promise<any> {
  try {
    if (id) {
      return await db.get(table as any, id)
    } else {
      return await db.getAll(table as any)
    }
  } catch (error) {
    console.error("Error getting offline data:", error)
    throw error
  }
}

/**
 * Add action to sync queue
 */
export async function addToSyncQueue(action: "create" | "update" | "delete", table: string, data: any): Promise<void> {
  try {
    const queueItem = {
      id: `${table}_${action}_${Date.now()}_${Math.random()}`,
      action,
      table,
      data,
      timestamp: Date.now(),
    }

    await saveOfflineData("sync_queue", queueItem.id, queueItem)
  } catch (error) {
    console.error("Error adding to sync queue:", error)
    throw error
  }
}

/**
 * Sync offline data with server when online
 */
export async function syncOfflineData(): Promise<void> {
  try {
    if (!navigator.onLine) {
      console.log("Device is offline, skipping sync")
      return
    }

    const syncQueue = await getOfflineData("sync_queue")

    for (const item of syncQueue) {
      try {
        await processSyncItem(item)

        // Remove from sync queue after successful sync
        await db.delete("sync_queue", item.id)

        // Mark original data as synced
        if (item.table !== "sync_queue") {
          const originalData = await getOfflineData(item.table as keyof OfflineDB, item.data.id)
          if (originalData) {
            originalData.synced = true
            await db.put(item.table as any, originalData)
          }
        }
      } catch (error) {
        console.error(`Error syncing item ${item.id}:`, error)
        // Keep item in queue for retry
      }
    }

    console.log("Offline data sync completed")
  } catch (error) {
    console.error("Error during offline sync:", error)
    throw error
  }
}

/**
 * Process individual sync item
 */
async function processSyncItem(item: any): Promise<void> {
  const { action, table, data } = item

  let url = `/api/${table}`
  let method = "POST"

  switch (action) {
    case "create":
      method = "POST"
      break
    case "update":
      method = "PUT"
      url = `${url}/${data.id}`
      break
    case "delete":
      method = "DELETE"
      url = `${url}/${data.id}`
      break
  }

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: action !== "delete" ? JSON.stringify(data) : undefined,
  })

  if (!response.ok) {
    throw new Error(`Sync failed for ${table} ${action}: ${response.statusText}`)
  }
}

/**
 * Check if device is online
 */
export function isOnline(): boolean {
  return navigator.onLine
}

/**
 * Set up online/offline event listeners
 */
export function setupOfflineListeners(): void {
  window.addEventListener("online", () => {
    console.log("Device came online, starting sync...")
    syncOfflineData()
  })

  window.addEventListener("offline", () => {
    console.log("Device went offline, enabling offline mode...")
  })

  // Periodic sync when online
  setInterval(
    () => {
      if (isOnline()) {
        syncOfflineData()
      }
    },
    5 * 60 * 1000,
  ) // Sync every 5 minutes
}

/**
 * Get unsynced data count
 */
export async function getUnsyncedCount(): Promise<number> {
  try {
    const syncQueue = await getOfflineData("sync_queue")
    return syncQueue.length
  } catch (error) {
    console.error("Error getting unsynced count:", error)
    return 0
  }
}

/**
 * Clear all offline data
 */
export async function clearOfflineData(): Promise<void> {
  try {
    await db.clear("invoices")
    await db.clear("customers")
    await db.clear("products")
    await db.clear("sync_queue")

    console.log("Offline data cleared")
  } catch (error) {
    console.error("Error clearing offline data:", error)
    throw error
  }
}
