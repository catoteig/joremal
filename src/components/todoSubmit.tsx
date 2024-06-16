import { RefObject, SetStateAction, useRef, useState } from 'react'
import { Box, Card, CardContent, Chip, IconButton, InputAdornment, Stack, TextField } from '@mui/material'
import { CancelCircleIcon, PlusSignIcon, SentIcon, Tag01Icon } from 'hugeicons-react'
import Grid from '@mui/material/Unstable_Grid2'

export interface TodoSubmitProps {
  todoNameRef: RefObject<HTMLInputElement>
  inputFieldValue: string
  noteFieldValue: string
  onFormSubmit: any
  handleInputFieldChange: any
  handleNoteFieldChange: any
  tagInputListValue: string[]
  handleTagInputListValue: any
}

const TodoSubmit = (props: TodoSubmitProps) => {
  const {
    todoNameRef,
    inputFieldValue,
    noteFieldValue,
    handleNoteFieldChange,
    onFormSubmit,
    handleInputFieldChange,
    tagInputListValue,
    handleTagInputListValue,
  } = props
  const [tagInput, setTagInput] = useState<string>('')
  const tagNameRef = useRef<HTMLInputElement>(null)

  const handleTagInput = (event: { target: { value: SetStateAction<string> } }) => {
    if (event.target.value.length > 20) return
    setTagInput(event.target.value)
  }

  const handleTagListChange = () => {
    handleTagInputListValue([...tagInputListValue, tagInput])
    setTagInput('')
    tagNameRef.current?.focus()
  }

  const removeTag = (tag: string) => {
    const newTagList = tagInputListValue.filter((tagItem) => tagItem !== tag)
    handleTagInputListValue(newTagList)
  }

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
            type="text"
            value={noteFieldValue}
            onChange={handleNoteFieldChange}
            fullWidth
          />
          <Card variant={'outlined'} style={{ backgroundColor: 'transparent' }}>
            <CardContent>
              <Stack direction={'row'} alignItems={'center'} spacing={'1rem'} paddingBottom={'1rem'}>
                <TextField
                  label={'Merkelapp'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Tag01Icon />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  id="todolabel"
                  type="text"
                  value={tagInput}
                  onChange={handleTagInput}
                  inputRef={tagNameRef}
                  fullWidth
                />
                <IconButton
                  type="button"
                  onClick={handleTagListChange}
                  disabled={!tagInput.trim()}
                  title={'Opprett'}
                  size="medium"
                  sx={{ whiteSpace: 'nowrap', bgcolor: '#ef767a', color: 'white' }}
                >
                  <PlusSignIcon />
                </IconButton>
              </Stack>
              <Grid
                container
                spacing={1}
                flex={'auto'}
                direction={'row'}
                sx={{
                  '& .MuiChip-filled': {
                    color: 'white',
                  },
                }}
              >
                {tagInputListValue.map((tag) => (
                  <Grid>
                    <Chip
                      deleteIcon={<CancelCircleIcon />}
                      onDelete={() => removeTag(tag)}
                      label={tag}
                      color={'warning'}
                      variant={'outlined'}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
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
