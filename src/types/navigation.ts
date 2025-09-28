// Page identifiers for internal routing logic (not actual URL paths)
// These are used to determine which UI elements to show in components like Header
export const PageIdentifier = {
  HOME: 'home',
  FINANCIAL_ASSISTANCE: 'financial-assistance'
} as const

// URL path constants for actual routes
export const ROUTES = {
  HOME: '/',
  FINANCIAL_ASSISTANCE: '/financial-assistance'
} as const

// Helper function to map URL paths to page identifiers
export const getPageIdentifier = (pathname: string): typeof PageIdentifier[keyof typeof PageIdentifier] => {
  if (pathname === ROUTES.FINANCIAL_ASSISTANCE) return PageIdentifier.FINANCIAL_ASSISTANCE
  if (pathname === ROUTES.HOME) return PageIdentifier.HOME
  return PageIdentifier.HOME // fallback for any other routes (like 404s)
}
