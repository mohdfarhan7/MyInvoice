/**
 * E-Way Bill Service
 *
 * This service handles integration with the government E-Way Bill portal
 * through their official APIs. It provides functionality to generate,
 * update, and cancel e-way bills directly from the application.
 */

import axios from "axios"

// Configuration for E-Way Bill API
const EWAY_BILL_API_CONFIG = {
  baseURL: process.env.EWAY_BILL_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.EWAY_BILL_API_KEY}`,
  },
}

// Interface for E-Way Bill data
export interface EWayBillData {
  supplyType: "O" | "I" // Outward or Inward
  subSupplyType: string
  docType: string
  docNo: string
  docDate: string
  fromGstin: string
  fromTrdName: string
  fromAddr1: string
  fromAddr2?: string
  fromPlace: string
  fromPincode: number
  fromStateCode: number
  toGstin: string
  toTrdName: string
  toAddr1: string
  toAddr2?: string
  toPlace: string
  toPincode: number
  toStateCode: number
  transactionType: number
  dispatchFromGstin?: string
  dispatchFromTrdName?: string
  shipToGstin?: string
  shipToTrdName?: string
  otherValue?: number
  totalValue: number
  cgstValue?: number
  sgstValue?: number
  igstValue?: number
  cessValue?: number
  transporterId?: string
  transporterName?: string
  transDocNo?: string
  transMode: string
  transDistance: string
  vehicleNo?: string
  vehicleType?: string
  itemList: Array<{
    productName: string
    productDesc?: string
    hsnCode: number
    quantity: number
    qtyUnit: string
    taxableAmount: number
    cgstRate?: number
    sgstRate?: number
    igstRate?: number
    cessRate?: number
  }>
}

// Interface for E-Way Bill response
export interface EWayBillResponse {
  success: boolean
  ewayBillNo?: string
  ewayBillDate?: string
  validUpto?: string
  error?: string
}

/**
 * Generate a new E-Way Bill
 * @param data E-Way Bill data
 * @returns E-Way Bill response with bill number and validity
 */
export async function generateEWayBill(data: EWayBillData): Promise<EWayBillResponse> {
  try {
    const response = await axios.post("/generate", data, EWAY_BILL_API_CONFIG)

    if (response.data.success) {
      return {
        success: true,
        ewayBillNo: response.data.ewayBillNo,
        ewayBillDate: response.data.ewayBillDate,
        validUpto: response.data.validUpto,
      }
    } else {
      return {
        success: false,
        error: response.data.errorDetails || "Failed to generate E-Way Bill",
      }
    }
  } catch (error) {
    console.error("E-Way Bill generation error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

/**
 * Cancel an existing E-Way Bill
 * @param ewayBillNo E-Way Bill number to cancel
 * @param cancelReason Reason for cancellation
 * @param cancelRemarks Additional remarks
 * @returns Response indicating success or failure
 */
export async function cancelEWayBill(
  ewayBillNo: string,
  cancelReason: string,
  cancelRemarks: string,
): Promise<EWayBillResponse> {
  try {
    const response = await axios.post(
      "/cancel",
      {
        ewayBillNo,
        cancelReason,
        cancelRemarks,
      },
      EWAY_BILL_API_CONFIG,
    )

    return {
      success: response.data.success,
      error: response.data.success ? undefined : response.data.errorDetails || "Failed to cancel E-Way Bill",
    }
  } catch (error) {
    console.error("E-Way Bill cancellation error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

/**
 * Get E-Way Bill details by number
 * @param ewayBillNo E-Way Bill number
 * @returns E-Way Bill details
 */
export async function getEWayBillDetails(ewayBillNo: string): Promise<any> {
  try {
    const response = await axios.get(`/details/${ewayBillNo}`, EWAY_BILL_API_CONFIG)
    return response.data
  } catch (error) {
    console.error("Error fetching E-Way Bill details:", error)
    throw error
  }
}

/**
 * Update vehicle information for an existing E-Way Bill
 * @param ewayBillNo E-Way Bill number
 * @param vehicleNo New vehicle number
 * @param fromPlace Place from where goods are transported
 * @param fromState State from where goods are transported
 * @param reasonCode Reason code for vehicle update
 * @param reasonRemarks Additional remarks
 * @param transDocNo Transport document number
 * @param transDocDate Transport document date
 * @returns Response indicating success or failure
 */
export async function updateVehicleInfo(
  ewayBillNo: string,
  vehicleNo: string,
  fromPlace: string,
  fromState: number,
  reasonCode: string,
  reasonRemarks: string,
  transDocNo?: string,
  transDocDate?: string,
): Promise<EWayBillResponse> {
  try {
    const response = await axios.post(
      "/update-vehicle",
      {
        ewayBillNo,
        vehicleNo,
        fromPlace,
        fromState,
        reasonCode,
        reasonRemarks,
        transDocNo,
        transDocDate,
      },
      EWAY_BILL_API_CONFIG,
    )

    return {
      success: response.data.success,
      error: response.data.success ? undefined : response.data.errorDetails || "Failed to update vehicle information",
    }
  } catch (error) {
    console.error("Vehicle update error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

/**
 * Extend validity of an E-Way Bill
 * @param ewayBillNo E-Way Bill number
 * @param vehicleNo Vehicle number
 * @param extendReason Reason for extension
 * @param extendRemarks Additional remarks
 * @returns Response with new validity date
 */
export async function extendValidity(
  ewayBillNo: string,
  vehicleNo: string,
  extendReason: string,
  extendRemarks: string,
): Promise<EWayBillResponse> {
  try {
    const response = await axios.post(
      "/extend-validity",
      {
        ewayBillNo,
        vehicleNo,
        extendReason,
        extendRemarks,
      },
      EWAY_BILL_API_CONFIG,
    )

    if (response.data.success) {
      return {
        success: true,
        validUpto: response.data.validUpto,
      }
    } else {
      return {
        success: false,
        error: response.data.errorDetails || "Failed to extend E-Way Bill validity",
      }
    }
  } catch (error) {
    console.error("Validity extension error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
