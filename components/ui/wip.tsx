import EmptyWindow from "../illustrations/empty-window"
import { EmptyState } from "./empty-state"

export const WIP = () => {
  return (
    <EmptyState
      description="Мы пока что это не реализовали"
      illustration={<EmptyWindow />}
      title="WIP"
    />
  )
}
