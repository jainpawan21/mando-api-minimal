/**
 * CORS origin validator for dynamic domain support
 */

// Static production domains
const STATIC_DOMAINS = [
  'mando.cx',
  'mando.news',
  'mando.bot',
  'mando.chat',
  'mando.help',
]

/**
 * Validates and returns the appropriate origin for CORS
 * @param origin - The origin header from the request
 * @returns The allowed origin or false if rejected
 */
export function validateCorsOrigin(origin: string): string | undefined | null {
  // Allow requests with no origin (e.g., mobile apps, Postman)
  if (!origin) {
    return '*'
  }

  // Parse the origin to get the hostname
  try {
    const url = new URL(origin as string)
    const hostname = url.hostname

    // Check if it's a localhost development domain
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return origin
    }

    // Check if it matches any of the static production domains
    for (const domain of STATIC_DOMAINS) {
      // Exact match
      if (hostname === domain) {
        return origin
      }

      // Subdomain match (*.domain.com)
      if (hostname.endsWith(`.${domain}`)) {
        return origin
      }
    }

    // For any other origin (custom domains), mirror it back
    // This allows custom domains without any lookup
    return origin
  } catch {
    // If origin parsing fails, reject it
    return
  }
}
