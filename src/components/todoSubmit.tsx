import { RefObject, SetStateAction, useRef, useState } from 'react'
import {
  Alert,
  Autocomplete,
  Box,
  capitalize,
  Card,
  CardContent,
  Chip,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material'
import { CancelCircleIcon, PlusSignIcon, SentIcon, Tag01Icon } from 'hugeicons-react'
import Grid from '@mui/material/Unstable_Grid2'
import { TodoItem } from '../Home.tsx'
import { v4 } from 'uuid'

export interface TodoSubmitProps {
  todoNameRef: RefObject<HTMLInputElement>
  handleAddTodo: (newTodo: TodoItem) => void
  handleAddModalVisible: (newFolder?: boolean) => void
  currentFolder: string
  allFolders: string[]
  allTags: string[]
}

const TodoSubmit = ({
  todoNameRef,
  handleAddTodo,
  handleAddModalVisible,
  currentFolder,
  allFolders,
}: TodoSubmitProps) => {
  const [tagInput, setTagInput] = useState<string>('')
  const [inputFieldValue, setInputFieldValue] = useState<string>('')
  const [noteFieldValue, setNoteFieldValue] = useState<string>('')
  const [tagInputListValue, setTagInputListValue] = useState<string[]>([])
  const [folderValue, setFolderValue] = useState<string | null>(currentFolder)
  const [folderInputValue, setFolderInputValue] = useState('')
  const tagNameRef = useRef<HTMLInputElement>(null)

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
      folder: folderInputValue,
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

  const createsNewFolder = !allFolders.includes(folderInputValue)

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'calc(100% - 4rem)',
        maxWidth: '30rem',
        bgcolor: 'secondary.light',
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
            multiline
            minRows={2}
            maxRows={6}
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
                  sx={{
                    bgcolor: 'warning.main',
                    marginTop: '1rem',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.main' },
                  }}
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
                {tagInputListValue.map((tag, idx) => (
                  <Grid>
                    <Chip
                      deleteIcon={<CancelCircleIcon />}
                      onDelete={() => removeTag(tag)}
                      label={tag}
                      color={'warning'}
                      variant={'outlined'}
                      key={`tag-${idx}`}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
          <Autocomplete
            freeSolo
            options={allFolders}
            defaultValue={currentFolder}
            value={folderValue}
            onChange={(_event, newValue: string | null) => {
              setFolderValue(newValue)
            }}
            inputValue={folderInputValue}
            onInputChange={(_event, newInputValue) => {
              setFolderInputValue(newInputValue)
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                inputProps={{ ...params.inputProps, maxLength: 20 }}
                label={'Mappe'}
                variant="outlined"
                id="todoFolder"
                type="text"
                fullWidth
                color={createsNewFolder ? 'info' : undefined}
              />
            )}
          />
          {createsNewFolder && (
            <Alert severity={'info'} variant={'filled'}>
              Ny mappe vil bli opprettet
            </Alert>
          )}
        </Stack>
        <Box flexDirection={'column'} textAlign={'right'}>
          <IconButton
            type="submit"
            disabled={!inputFieldValue}
            title={'Opprett'}
            size="large"
            sx={{ bgcolor: 'warning.main', marginTop: '1rem', color: 'white', '&:hover': { bgcolor: 'primary.main' } }}
          >
            <SentIcon />
          </IconButton>
        </Box>
      </form>
    </Box>
  )
}
export default TodoSubmit
