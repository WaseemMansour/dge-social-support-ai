import { HelmetProvider } from '@dr.pogodin/react-helmet'
import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router'

import { Header } from '../components/Header'
import { Toaster } from '../components/ui/sonner'
import '../lib/i18n'
import { getPageIdentifier } from '../types/navigation'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const location = useLocation()
  const currentPage = getPageIdentifier(location.pathname)

  return (
    <HelmetProvider>
      <Header currentPage={currentPage} />
      <Outlet />
      <Toaster />
    </HelmetProvider>
  )
}
