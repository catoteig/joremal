import * as React from 'react'
import { RefObject } from 'react'
import { Stack, TextField } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'

import { CheckOutlined } from '@mui/icons-material'
import Button from '@mui/material/Button'

const TodoSubmit: React.FC<{
  todoNameRef: RefObject<HTMLInputElement>
  inputFieldValue: string
  noteFieldValue: string
  onFormSubmit: any
  handleInputFieldChange: any
  handleNoteFieldChange: any
}> = ({
  todoNameRef,
  inputFieldValue,
  noteFieldValue,
  handleNoteFieldChange,
  onFormSubmit,
  handleInputFieldChange,
}) => {
  return (
    <Grid xs={12}>
      <form onSubmit={onFormSubmit}>
        <TextField
          sx={{ paddingTop: 1 }}
          variant="standard"
          id="todoInput"
          ref={todoNameRef}
          type="text"
          value={inputFieldValue}
          onChange={handleInputFieldChange}
          placeholder={'Ny ting'}
          fullWidth
        />
        <Stack direction={'row'} spacing={2} sx={{ paddingTop: 2 }}>
          <TextField
            variant="standard"
            id="todoComment"
            ref={todoNameRef}
            type="text"
            value={noteFieldValue}
            onChange={handleNoteFieldChange}
            placeholder={'Kommentar'}
            fullWidth
          />
          <Button type="submit" disabled={!inputFieldValue.trim()}>
            <CheckOutlined sx={{ paddingRight: 1 }} />
            {['Smekk!', 'Pang!', 'Yeah!', 'Boom!', 'Pffft!'][Math.floor(Math.random() * 5)]}
          </Button>
        </Stack>
      </form>
    </Grid>
  )
}
export default TodoSubmit
