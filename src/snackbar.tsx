import * as React from 'react'
import Button from '@mui/material/Button'
import Snackbar, { SnackbarProps } from '@mui/material/Snackbar'
import IconButton from '@mui/material/IconButton'
import { Cancel01Icon } from 'hugeicons-react'

export interface SnackbarPropsExt extends SnackbarProps {
  message: string
}

const SimpleSnackbar = (props: SnackbarPropsExt) => {
  const [open, setOpen] = React.useState(false)
  const { message } = props

  const handleClick = () => {
    setOpen(true)
  }

  const handleClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  const action = (
    <React.Fragment>
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
        <Cancel01Icon fontSize="small" />
      </IconButton>
    </React.Fragment>
  )

  return (
    <div>
      <Button onClick={handleClick}>Open Snackbar</Button>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} message={message} action={action} />
    </div>
  )
}

export default SimpleSnackbar
