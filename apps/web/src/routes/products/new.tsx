import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/products/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/users/products/new"!</div>
}
