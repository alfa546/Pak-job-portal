/**
 * Utility function to normalize URLs
 * Ensures URLs have a proper protocol (http:// or https://)
 * If no protocol is present, prepends https://
 * Handles relative URLs and validates URL format
 */
export function normalizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '#';
  }

  const trimmedUrl = url.trim();

  // If URL is empty, return a placeholder
  if (trimmedUrl.length === 0) {
    return '#';
  }

  // If URL already starts with http:// or https://, validate and return
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    try {
      // Validate URL format
      new URL(trimmedUrl);
      return trimmedUrl;
    } catch {
      // Invalid URL format, return placeholder
      return '#';
    }
  }

  // Handle relative URLs (starting with /)
  if (trimmedUrl.startsWith('/')) {
    // Relative URLs can't be resolved without a base URL
    // Return placeholder to prevent "Domain not found" errors
    return '#';
  }

  // Handle protocol-relative URLs (starting with //)
  if (trimmedUrl.startsWith('//')) {
    return `https:${trimmedUrl}`;
  }

  // Handle relative paths (../ or ./)
  if (trimmedUrl.startsWith('../') || trimmedUrl.startsWith('./')) {
    // Can't resolve relative paths without base URL
    return '#';
  }

  // Check if it looks like a domain (contains a dot and no spaces)
  // This is a simple heuristic - if it looks like a domain, prepend https://
  if (trimmedUrl.includes('.') && !trimmedUrl.includes(' ')) {
    try {
      // Try to create a URL with https:// prefix
      const testUrl = `https://${trimmedUrl}`;
      new URL(testUrl);
      return testUrl;
    } catch {
      // Invalid format, return placeholder
      return '#';
    }
  }

  // If none of the above, return placeholder
  return '#';
}

/**
 * Validates and normalizes a URL for database storage
 * Returns the normalized URL or null if invalid
 * This is used in scripts/API routes to validate before saving
 */
export function validateAndNormalizeUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const normalized = normalizeUrl(url);

  // If normalization returned '#', the URL is invalid
  if (normalized === '#') {
    return null;
  }

  return normalized;
}
