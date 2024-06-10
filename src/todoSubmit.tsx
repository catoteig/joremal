import * as React from 'react'
import { RefObject } from 'react'
import { Box, IconButton, Stack, TextField } from '@mui/material'

import { AddCircle } from '@mui/icons-material'

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
        maxWidth: '30rem',
        bgcolor: '#EDF4ED',
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
          <IconButton type="submit" disabled={!inputFieldValue.trim()} title={'Opprett'} size="large" color={'warning'}>
            <AddCircle />
          </IconButton>
        </Stack>
      </form>
    </Box>
  )
}
export default TodoSubmit
