import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/shared/training/$trainingId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { trainingId } = Route.useParams();

  return <div>Hello "/shared/training/{trainingId}"!</div>
}
