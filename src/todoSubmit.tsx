import { RefObject } from 'react'
import { Box, Chip, IconButton, Stack, TextField } from '@mui/material'
import { SentIcon } from 'hugeicons-react'
import Grid from '@mui/material/Unstable_Grid2'
import { allUsers } from './users.tsx'

export interface TodoSubmitProps {
  todoNameRef: RefObject<HTMLInputElement>
  inputFieldValue: string
  noteFieldValue: string
  onFormSubmit: any
  handleInputFieldChange: any
  handleNoteFieldChange: any
  assigneeFieldValue: string[]
  handleAssigneFieldChange: any
}

const TodoSubmit = (props: TodoSubmitProps) => {
  const { todoNameRef, inputFieldValue, noteFieldValue, handleNoteFieldChange, onFormSubmit, handleInputFieldChange } =
    props

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
        <Stack direction={'column'} spacing={2} sx={{ paddingTop: 2 }}>
          <TextField
            label={'Jør'}
            variant="outlined"
            id="todoInput"
            ref={todoNameRef}
            type="text"
            value={inputFieldValue}
            onChange={handleInputFieldChange}
            fullWidth
            autoFocus
          />
          <TextField
            label={'Kommentar'}
            variant="outlined"
            id="todoComment"
            ref={todoNameRef}
            type="text"
            value={noteFieldValue}
            onChange={handleNoteFieldChange}
            fullWidth
          />
          <Grid
            container
            spacing={1}
            flex={'auto'}
            direction={'row'}
            padding={0}
            sx={{
              '& .MuiChip-filled': {
                color: 'white',
              },
            }}
          >
            {allUsers && allUsers.map((user) => (
              <Grid>
                <Chip label={user.name} color={'warning'} variant={'outlined'}/>
              </Grid>
            ))}
          </Grid>
        </Stack>
        <Box flexDirection={'column'} textAlign={'right'}>
          <IconButton
            type="submit"
            disabled={!inputFieldValue.trim()}
            title={'Opprett'}
            size="large"
            sx={{ bgcolor: '#ef767a', marginTop: '1rem', color: 'white' }}
          >
            <SentIcon />
          </IconButton>
        </Box>
      </form>
    </Box>
  )
}
export default TodoSubmit
