import { RefObject, SetStateAction, useRef, useState } from 'react'
import { Box, capitalize, Card, CardContent, Chip, IconButton, InputAdornment, Stack, TextField } from '@mui/material'
import { CancelCircleIcon, PlusSignIcon, SentIcon, Tag01Icon } from 'hugeicons-react'
import Grid from '@mui/material/Unstable_Grid2'
import { TodoItem } from '../Home.tsx'
import { v4 } from 'uuid'

export interface TodoSubmitProps {
  todoNameRef: RefObject<HTMLInputElement>
  handleAddTodo: (newTodo: TodoItem) => void
  handleAddModalVisible: () => void
}

const TodoSubmit = (props: TodoSubmitProps) => {
  const { todoNameRef, handleAddTodo, handleAddModalVisible } = props
  const [tagInput, setTagInput] = useState<string>('')
  const tagNameRef = useRef<HTMLInputElement>(null)
  const [inputFieldValue, setInputFieldValue] = useState<string>('')
  const [noteFieldValue, setNoteFieldValue] = useState<string>('')
  const [tagInputListValue, setTagInputListValue] = useState<string[]>([])

  const onFormSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!inputFieldValue.trim()) return
    const newTodo: TodoItem = {
      name: capitalize(inputFieldValue),
      complete: false,
      id: v4(),
      notes: noteFieldValue,
      // @ts-expect-error Created datatype
      created: new Date(),
      list: tagInputListValue,
    }
    handleAddTodo(newTodo)
    setInputFieldValue('')
    setNoteFieldValue('')
    handleAddModalVisible()
    setTagInputListValue([])
  }

  const handleInputFieldChange = (event: { target: { value: SetStateAction<string> } }) => {
    setInputFieldValue(event.target.value)
  }
  const handleNoteFieldChange = (event: { target: { value: SetStateAction<string> } }) => {
    setNoteFieldValue(event.target.value)
  }
  const handleTagInputListValue = (val: string[]) => {
    setTagInputListValue(val)
  }
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
          <p>-{inputFieldValue}-</p>
          <IconButton
            type="submit"
            disabled={!inputFieldValue}
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
