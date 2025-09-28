import { TanstackDevtools } from '@tanstack/react-devtools'
import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import { Header } from '../components/Header'
import '../lib/i18n'
import { getPageIdentifier } from '../types/navigation'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const location = useLocation()
  const currentPage = getPageIdentifier(location.pathname)

  return (
    <>
      <Header currentPage={currentPage} />
      <Outlet />
      <TanstackDevtools
        config={{
          position: 'bottom-left',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  )
}
