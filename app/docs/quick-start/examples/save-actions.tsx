import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'

export function SaveActions() {
  return (
    <ButtonGroup>
      <Button>Cancel</Button>
      <Button variant="primary">Save changes</Button>
    </ButtonGroup>
  )
}
