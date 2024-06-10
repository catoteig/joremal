import * as React from 'react'
import { RefObject } from 'react'
import { Box, Stack, TextField } from '@mui/material'

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
    <Box
      sx={{
        position: 'absolute',
        bottom: '4rem',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'calc(100% - 4rem)',
        bgcolor: 'background.paper',
        border: '1px dashed grey',
        borderRadius: 2,
        boxShadow: 24,
        p: 2,
      }}
    >
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
          autoFocus
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
    </Box>
  )
}
export default TodoSubmit
