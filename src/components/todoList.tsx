import * as React from 'react'
import { useContext, useState } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Badge,
  Box,
  capitalize,
  Chip,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { TodoItem } from '../Home.tsx'
import {
  ArrowDown01Icon,
  CheckListIcon,
  CheckmarkSquare04Icon,
  Delete04Icon,
  FilterRemoveIcon,
  Folder01Icon,
  LibraryIcon,
  Logout03Icon,
  Menu01Icon,
  NoteAddIcon,
  PasswordValidationIcon,
  PoopIcon,
  RowDeleteIcon,
  SquareIcon,
  Tag01Icon,
  ZapIcon,
} from 'hugeicons-react'
import { AuthContext } from '../AuthContext.ts'
import Typography from '@mui/material/Typography'
import { themeOpts } from '../theme.tsx'
import Button from '@mui/material/Button'
import { v4 } from 'uuid'

export interface TodoListProps {
  todos: TodoItem[]
  toggleTodo: (id: string) => void
  removeTodo: (id: string) => void
  toggleAllTodos: () => void
  removeAllTodo: () => void
  autoFill: () => void
  incompleteTodos: number
  completeTodos: number
  hasTodos: boolean
  orderAsc: boolean
  setOrderAsc: (orderBy: boolean) => void
  loading: boolean
  setAddVisible: (newFolder: boolean) => void
  addVisible: boolean
  setTagFilter: (tags: string[]) => void
  tagFilter: string[]
  userDataVisible: boolean
  setUserDataVisible: () => void
  currentFolder: string
  setCurrentFolder: (folder: string) => void
  folderList: string[]
  handleAddTodo: (newTodo: TodoItem) => void
}

const TodoList = ({
  todos,
  toggleTodo,
  removeTodo,
  hasTodos,
  toggleAllTodos,
  incompleteTodos,
  completeTodos,
  removeAllTodo,
  autoFill,
  loading,
  setAddVisible,
  addVisible,
  setTagFilter,
  tagFilter,
  setUserDataVisible,
  currentFolder,
  setCurrentFolder,
  folderList,
  handleAddTodo,
}: TodoListProps) => {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false)
  const [snackbarMessage, setSnackbarMessage] = React.useState('')
  const [removeLoading, setRemoveLoading] = React.useState(false)
  const [expandedAccordion, setExpandedAccordion] = React.useState<string | false>(false)
  const [quickTodoInput, setQuickTodoInput] = React.useState('')

  const handleQuickTodoChange = (e: React.ChangeEvent<HTMLInputElement>) => setQuickTodoInput(e.target.value)
  const handleQuickTodoSubmitKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (!quickTodoInput.trim()) return
      const newTodo: TodoItem = {
        name: capitalize(quickTodoInput),
        complete: false,
        id: v4(),
        notes: '',
        // @ts-expect-error Created datatype
        created: new Date(),
        list: [],
        folder: currentFolder,
      }
      handleAddTodo(newTodo)
      setQuickTodoInput('')
    }
  }

  const { SignOut, user } = useContext(AuthContext)

  const hasIncompleteTodos = incompleteTodos === 0

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpandedAccordion(newExpanded ? panel : false)
  }

  const handleRemoveClick = (todo: TodoItem) => {
    removeTodo(todo.id)
    setExpandedAccordion(false)
    setSnackbarMessage(`${todo.name} slettet`)
    if (hasTodos) setSnackbarOpen(true)
  }
  // const handleEditClick = (todo: TodoItem) => {
  //   setAddVisible()
  // }

  const handleRemoveAllClick = () => {
    removeAllTodo()
    setExpandedAccordion(false)
    setSnackbarMessage(`Alle utførte slettet (${completeTodos} stk)`)
    setMoreMenuAnchorEl(null)
    setSnackbarOpen(true)
  }

  const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarOpen(false)
  }

  const handleToggleAll = () => {
    toggleAllTodos()
    setMoreMenuAnchorEl(null)
    console.log(moreMenuAnchorEl)
    setExpandedAccordion(false)
  }

  // const handleOrderBy = () => setOrderAsc(!orderAsc)

  const handleRandom = () => {
    autoFill()
    setSnackbarMessage('3 tilfeldige opprettet')
    setSnackbarOpen(true)
    setMoreMenuAnchorEl(null)
  }

  const handleToggle = async (id: string) => {
    setRemoveLoading(true)
    toggleTodo(id)
    setRemoveLoading(false)
    await handleRefresh()
  }

  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = React.useState<null | HTMLElement>(null)
  const moreMenuOpen = Boolean(moreMenuAnchorEl)
  const handlemoreMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMoreMenuAnchorEl(event.currentTarget)
  }
  const handleMoreMenuClose = () => {
    setMoreMenuAnchorEl(null)
  }

  const [tagMenuAnchorEl, setTagMenuAnchorEl] = React.useState<null | HTMLElement>(null)
  const tagMenuOpen = Boolean(tagMenuAnchorEl)
  const handleTagMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setTagMenuAnchorEl(event.currentTarget)
  }
  const handleTagMenuClose = () => {
    setTagMenuAnchorEl(null)
  }

  const tags: string[] = todos
    .map((todo) => todo.list)
    .flat()
    .filter((value, index, array) => array.indexOf(value) === index)
    .sort((a, b) => a.localeCompare(b))

  const handleTagFilter = (tag: string) => {
    if (tagFilter.includes(tag)) {
      setTagFilter(tagFilter.filter((t) => t !== tag))
    } else {
      setTagFilter([...tagFilter, tag])
    }
  }

  const removeTagFilter = () => setTagFilter([])

  const handleChangePasswordClick = () => {
    setUserDataVisible()
    handleMoreMenuClose()
  }

  const [folderMenuAnchorEl, setFolderMenuAnchorEl] = React.useState<null | HTMLElement>(null)
  const folderMenuOpen = Boolean(folderMenuAnchorEl)
  const handleFolderMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFolderMenuAnchorEl(event.currentTarget)
  }
  const handleFolderMenuClose = () => {
    setFolderMenuAnchorEl(null)
  }

  const selectFolder = (folder: string) => {
    setCurrentFolder(folder)
    handleFolderMenuClose()
  }

  // @ts-expect-error This color does exist in theme
  const iconFocusColor = themeOpts.palette.warning.main

  const [refresh, doRefresh] = useState(false)
  const handleRefresh = async () => doRefresh(!refresh)

  return (
    hasTodos && (
      <Box
        component={'section'}
        sx={{ border: '1px dashed grey', borderRadius: 2 }}
        height={'100%'}
        bgcolor={'secondary.light'}
      >
        {loading ? (
          <Grid xs={12} sx={{ padding: '1rem' }} height={'100%'} width={'100%'}>
            <Container sx={{ textAlign: 'center', verticalAlign: 'middle', padding: 4 }}>
              <CircularProgress />
            </Container>
          </Grid>
        ) : (
          <>
            <Grid
              xs={12}
              height={'3.5rem'}
              sx={{ padding: 0, paddingTop: 1, verticalAlign: 'middle', borderBottom: '1px dashed lightgrey' }}
            >
              <Stack direction={'row'} spacing={1} justifyContent={'start'} alignItems={'center'} margin={'0 0.5rem'}>
                {/*<ConfettiElement refresh={refresh} />*/}
                <Button
                  onClick={handleFolderMenuClick}
                  title={'Tags'}
                  disabled={folderList.length === 0}
                  sx={{ color: 'rgba(0, 0, 0, 0.54)', borderRadius: '30px' }}
                >
                  <LibraryIcon color={folderMenuOpen ? 'warning' : 'rgba(0, 0, 0, 0.54)'} />
                  <Typography marginLeft={'0.5rem'}>{currentFolder}</Typography>
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={folderMenuAnchorEl}
                  open={folderMenuOpen}
                  onClose={handleFolderMenuClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  {folderList.map((folder) => (
                    <MenuItem key={folder} onClick={() => selectFolder(folder)} title={`${folder}`}>
                      <Folder01Icon color={currentFolder === folder ? iconFocusColor : undefined} />
                      <p style={{ margin: '0rem 1rem' }}>{currentFolder === folder ? <b>{folder}</b> : folder}</p>
                    </MenuItem>
                  ))}
                </Menu>
                <IconButton
                  color={addVisible ? 'warning' : 'default'}
                  onClick={() => setAddVisible(false)}
                  title={'Opprett'}
                >
                  <NoteAddIcon />
                </IconButton>
                {/*<IconButton onClick={handleOrderBy} title={'Sorter'}>*/}
                {/*  <SortingAZ01Icon />*/}
                {/*</IconButton>*/}
                <Badge
                  badgeContent={tagFilter.length}
                  color="warning"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  overlap={'circular'}
                >
                  <IconButton
                    color={tagMenuOpen ? 'warning' : 'default'}
                    onClick={handleTagMenuClick}
                    title={'Tags'}
                    disabled={tags.length === 0}
                  >
                    <Tag01Icon />
                  </IconButton>
                </Badge>
                <Menu
                  id="basic-menu"
                  anchorEl={tagMenuAnchorEl}
                  open={tagMenuOpen}
                  onClose={handleTagMenuClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  {tagFilter.length > 0 && (
                    <div>
                      <MenuItem key={'all'} onClick={removeTagFilter} title={'Vis alle'}>
                        <FilterRemoveIcon />
                        <p style={{ margin: '0rem 1rem' }}>Vis alle</p>
                      </MenuItem>
                      <Divider />
                    </div>
                  )}
                  {tags.map((tag) => (
                    <MenuItem key={tag} onClick={() => handleTagFilter(tag)} title={`Tag ${tag}`}>
                      <Tag01Icon color={tagFilter.includes(tag) ? iconFocusColor : undefined} />
                      <p style={{ margin: '0rem 1rem' }}>{tagFilter.includes(tag) ? <b>{tag}</b> : tag}</p>
                    </MenuItem>
                  ))}
                </Menu>
                <IconButton
                  color={moreMenuOpen ? 'warning' : 'default'}
                  id="basic-button"
                  aria-controls={moreMenuOpen ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={moreMenuOpen ? 'true' : undefined}
                  onClick={handlemoreMenuClick}
                  title={'Meny'}
                >
                  <Menu01Icon />
                </IconButton>
                <Menu
                  id="basic-menu"
                  anchorEl={moreMenuAnchorEl}
                  open={moreMenuOpen}
                  onClose={handleMoreMenuClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                  transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                  sx={{ color: 'primary.light' }}
                >
                  <MenuItem onClick={handleRemoveAllClick} disabled={!completeTodos} title={'Slett utførte'}>
                    <RowDeleteIcon />
                    <p style={{ margin: '0rem 1rem' }}>Slett utførte</p>
                  </MenuItem>
                  <MenuItem
                    onClick={handleToggleAll}
                    disabled={!hasTodos}
                    title={hasIncompleteTodos ? 'Fjern alle kryss' : 'Kryss av alle'}
                  >
                    {hasIncompleteTodos ? <SquareIcon /> : <CheckListIcon />}
                    <p style={{ margin: '0rem 1rem' }}>{hasIncompleteTodos ? 'Fjern alle kryss' : 'Kryss av alle'}</p>
                  </MenuItem>
                  <MenuItem onClick={handleRandom} title={'Lag tulleoppgaver'}>
                    <ZapIcon />
                    <p style={{ margin: '0rem 1rem' }}>Lag tulleoppgaver</p>
                  </MenuItem>
                  <Divider />
                  <MenuItem title={'Endre passord'} onClick={handleChangePasswordClick}>
                    <PasswordValidationIcon />
                    <p style={{ margin: '0rem 1rem' }}>Endre passord</p>
                  </MenuItem>
                  <MenuItem title={'Logg ut'} onClick={SignOut}>
                    <Logout03Icon />
                    <Stack>
                      <p style={{ margin: '0rem 1rem' }}>Logg ut</p>
                      {user && (
                        <p style={{ fontSize: '0.8rem', margin: '0rem 1rem', color: 'dimgrey' }}>{user.email}</p>
                      )}
                    </Stack>
                  </MenuItem>
                </Menu>
              </Stack>
            </Grid>
            <Grid xs={12} height={'calc(100% - 8rem)'} sx={{ padding: 0 }} overflow={'auto'}>
              {todos.map((todo) => {
                const labelId = `checkbox-list-label-${todo.id}`
                const handleTodoClick = (e: { stopPropagation: () => void }) => {
                  e.stopPropagation()
                  handleToggle(todo.id)
                }
                const created = new Date(todo.created.seconds * 1000).toLocaleDateString()
                const updated: string | null = todo.updated
                  ? new Date(todo.updated.seconds * 1000).toLocaleDateString()
                  : null
                const updatedString = updated && todo.complete ? ` - fullført ${updated}` : ''
                const isExpanded = expandedAccordion === todo.id

                // @ts-expect-error This color does exist in theme
                const checkedIconColor = themeOpts.palette.secondary.dark

                return removeLoading ? (
                  <CircularProgress />
                ) : (
                  <Accordion
                    key={todo.id}
                    disableGutters
                    elevation={0}
                    sx={{
                      backgroundColor: 'transparent',
                      '&.Mui-expanded:before': {
                        opacity: '100',
                        backgroundColor: 'lightgrey',
                      },
                      '&:before': {
                        backgroundColor: 'transparent',
                      },
                      '.MuiAccordionSummary-root': {
                        p: '0 0.5rem',
                      },
                    }}
                    expanded={isExpanded}
                    onChange={handleChange(todo.id)}
                  >
                    <AccordionSummary
                      sx={{
                        backgroundColor: isExpanded ? '#FAFAFA' : 'transparent',
                        '.MuiAccordionSummary-content': {
                          margin: 0,
                        },
                      }}
                      expandIcon={<ArrowDown01Icon />}
                    >
                      <IconButton type={'button'} onClick={handleTodoClick}>
                        {todo.complete ? <CheckmarkSquare04Icon color={checkedIconColor} /> : <SquareIcon />}
                      </IconButton>
                      <Typography component={'p'} alignSelf={'center'} id={labelId} padding={'0 1rem'}>
                        {todo.name}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{
                        bgcolor: '#FAFAFA',
                        padding: 0,
                        '&.MuiAccordionDetails-root': { borderBottom: '1px solid lightgrey' },
                      }}
                    >
                      <Grid container alignItems={'stretch'}>
                        <Grid xs={10}>
                          <Stack sx={{ padding: '1rem' }}>
                            {todo.notes && <ListItemText id={labelId} primary={todo.notes} />}
                            {todo.list.length > 0 && (
                              <Grid
                                container
                                spacing={1}
                                flex={'auto'}
                                direction={'row'}
                                alignItems={'center'}
                                padding={0}
                              >
                                {todo.list.map((tagName, index) => (
                                  <Grid key={`${todo.id}-${index}`}>
                                    <Chip
                                      icon={tagName === 'Marit' ? <PoopIcon color={'#953636'} /> : undefined}
                                      label={tagName}
                                      color={'warning'}
                                      variant={'outlined'}
                                    />
                                  </Grid>
                                ))}
                              </Grid>
                            )}
                            {(todo.notes || todo.list.length > 0) && (
                              <Divider sx={{ marginBottom: 1, marginTop: 1 }}></Divider>
                            )}
                            <Typography
                              component={'p'}
                              fontStyle={'italic'}
                              fontSize={'0.9rem'}
                              id={labelId}
                            >{`${created}${updatedString}`}</Typography>
                          </Stack>
                        </Grid>
                        <Grid xs={2}>
                          <Stack direction="column" spacing={'.5rem'} sx={{ padding: '0.5rem' }}>
                            {/*<IconButton*/}
                            {/*  title={'Rediger'}*/}
                            {/*  aria-label="edit"*/}
                            {/*  onClick={() => handleEditClick(todo)}*/}
                            {/*  id={'listItemDropdown'}*/}
                            {/*  size={'large'}*/}
                            {/*>*/}
                            {/*  <PencilEdit02Icon />*/}
                            {/*</IconButton>*/}
                            <IconButton
                              title={'Slett'}
                              aria-label="delete"
                              onClick={() => handleRemoveClick(todo)}
                              id={'listItemDropdown'}
                              size={'large'}
                            >
                              <Delete04Icon color="disabled" />
                            </IconButton>
                          </Stack>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                )
              })}
            </Grid>
            <Grid xs={12} height={'4.5rem'} borderTop={'1px dashed lightgrey'}>
              <TextField
                autoFocus
                placeholder={'Ny'}
                variant={'outlined'}
                fullWidth
                onChange={handleQuickTodoChange}
                value={quickTodoInput}
                onKeyDown={handleQuickTodoSubmitKey}
              />
            </Grid>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={handleSnackbarClose}
              anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
              sx={{ background: 'primary.main', borderRadius: 2 }}
            >
              <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </>
        )}
      </Box>
    )
  )
}

export default TodoList
