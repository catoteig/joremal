import * as React from 'react'
import { Grid, Stack, TextField } from '@mui/material'
import { Check } from '@mui/icons-material'
import Button from '@mui/material/Button'

const TodoSubmit: React.FC<{
  todoNameRef: any
  inputFieldValue: string
  onFormSubmit: any
  handleInputFieldChange: any
}> = ({ todoNameRef, inputFieldValue, onFormSubmit, handleInputFieldChange }) => {
  return (
    <Grid item xs={12}>
      <form onSubmit={onFormSubmit}>
        <Stack direction={'row'} spacing={2}>
          <TextField
            variant="standard"
            id="todoInput"
            ref={todoNameRef}
            type="text"
            value={inputFieldValue}
            onChange={handleInputFieldChange}
            placeholder={'Ny ting'}
            fullWidth
          />
          <Button variant="outlined" type="submit" disabled={!inputFieldValue.trim()}>
            <Check />
            {['Smekk!', 'Pang!', 'Yeah!', 'Boom!', 'Pffft!'][Math.floor(Math.random() * 5)]}
          </Button>
        </Stack>
      </form>
    </Grid>
  )
}
export default TodoSubmit
