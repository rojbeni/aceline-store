/**
 * Shipping and returns terms — the single source for the product page's
 * "Shipping & Returns" tab and the Product structured data, so what shoppers
 * read and what Google is told cannot drift apart.
 */

export const SHIPPING_POLICY = {
  countryCode: "TN",
  fee: 7,
  currencyCode: "TND",
  /** Business days to prepare the order. */
  handlingDays: { min: 0, max: 1 },
  /** Business days in transit. */
  transitDays: { min: 1, max: 1 },
  /** What we promise shoppers: handling + transit, at most. */
  deliveryDays: 2,
} as const

/**
 * Right of withdrawal under Tunisian Law No. 2000-83 of 9 August 2000 on
 * electronic exchanges and commerce (art. 30): 10 working days from receipt,
 * refund within 10 working days of the return, return shipping paid by the
 * customer.
 */
export const RETURN_POLICY = {
  countryCode: "TN",
  lawReference: "2000-83",
  windowWorkingDays: 10,
  refundWorkingDays: 10,
} as const
