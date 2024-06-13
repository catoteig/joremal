import * as React from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Stack,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { TodoItem } from './Home.tsx'
import {
  ArrowDown01Icon,
  CheckListIcon,
  CheckmarkSquare02Icon,
  Delete04Icon,
  Logout03Icon,
  NoteAddIcon,
  RowDeleteIcon,
  SortingAZ01Icon,
  SquareIcon,
  Tick02Icon,
  ZapIcon,
} from 'hugeicons-react'

export interface TodoListProps {
  todos: TodoItem[]
  toggleTodo: (id: string) => void
  removeTodo: (id: string) => void
  toggleAllTodos: () => void
  removeAllTodo: () => void
  autoFill: () => void
  hasIncompleteTodos: boolean
  completeTodos: number
  hasTodos: boolean
  orderAsc: boolean
  setOrderAsc: (orderBy: boolean) => void
  fetchData: () => void
  loading: boolean
  setAddVisible: () => void
  addVisible: boolean
}

const TodoList = (props: TodoListProps) => {
  const {
    todos,
    toggleTodo,
    removeTodo,
    hasTodos,
    toggleAllTodos,
    hasIncompleteTodos,
    completeTodos,
    removeAllTodo,
    autoFill,
    orderAsc,
    setOrderAsc,
    loading,
    setAddVisible,
    addVisible,
  } = props

  const [snackbarOpen, setSnackbarOpen] = React.useState(false)
  const [snackbarMessage, setSnackbarMessage] = React.useState('')
  const [removeLoading, setRemoveLoading] = React.useState(false)
  const [expanded, setExpanded] = React.useState<string | false>('panel1')

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false)
  }

  const handleRemoveClick = (todo: TodoItem) => {
    removeTodo(todo.id)
    setExpanded(false)
    setSnackbarMessage(`${todo.name} slettet`)
    if (hasTodos) setSnackbarOpen(true)
  }

  const handleRemoveAllClick = () => {
    removeAllTodo()
    setExpanded(false)
    setSnackbarMessage(`Alle utførte slettet (${completeTodos} stk)`)
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
    setExpanded(false)
  }

  const handleOrderBy = () => {
    setOrderAsc(!orderAsc)
  }

  const handleRandom = () => {
    autoFill()
    setSnackbarMessage('3 tilfeldige opprettet')
    setSnackbarOpen(true)
  }

  const handleToggle = (id: string) => {
    setRemoveLoading(true)
    toggleTodo(id)
    setRemoveLoading(false)
  }

  return (
    hasTodos && (
      <Box
        component={'section'}
        sx={{ border: '1px dashed grey', borderRadius: 2 }}
        height={'100%'}
        bgcolor={'#EDF4ED'}
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
              sx={{
                padding: 0,
                paddingTop: 1,
                verticalAlign: 'middle',
                borderBottom: '1px solid lightgrey',
              }}
              height={'3.3rem'}
            >
              <Stack direction={'row'} spacing={2} justifyContent={'center'} alignItems={'center'}>
                <IconButton color={addVisible ? 'warning' : 'default'} onClick={setAddVisible} title={'Opprett'}>
                  <NoteAddIcon />
                </IconButton>
                <IconButton
                  onClick={handleToggleAll}
                  disabled={!hasTodos}
                  title={hasIncompleteTodos ? 'Fjern alle kryss' : 'Kryss av alle'}
                >
                  {hasIncompleteTodos ? <SquareIcon /> : <CheckListIcon />}
                </IconButton>
                <IconButton onClick={handleRemoveAllClick} disabled={!completeTodos} title={'Slett utførte'}>
                  <RowDeleteIcon />
                </IconButton>
                <IconButton onClick={handleOrderBy} title={'Sorter'}>
                  <SortingAZ01Icon />
                </IconButton>
                <IconButton onClick={handleRandom} title={'Lag tulleoppgaver'}>
                  <ZapIcon />
                </IconButton>
                <IconButton title={'Logg ut'} disabled>
                  <Logout03Icon />
                </IconButton>
              </Stack>
            </Grid>
            <Grid xs={12} sx={{ padding: 0 }} height={'calc(100% - 3.3rem)'} overflow={'auto'}>
              {todos.map((todo) => {
                const labelId = `checkbox-list-label-${todo.id}`
                const handleTodoClick = () => handleToggle(todo.id)
                const created = new Date(todo.created.seconds * 1000).toLocaleDateString()
                const updated: string | null = todo.updated
                  ? new Date(todo.updated.seconds * 1000).toLocaleDateString()
                  : null
                const updatedString = updated && todo.complete ? ` - fullført ${updated}` : ''

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
                      },
                    }}
                    expanded={expanded === todo.id}
                    onChange={handleChange(todo.id)}
                  >
                    <AccordionSummary
                      sx={{
                        backgroundColor: todo.complete ? '#BDCCA48C' : 'transparent',
                      }}
                      expandIcon={<ArrowDown01Icon />}
                    >
                      {todo.complete ? (
                        <ListItemIcon children={<Tick02Icon />} sx={{ minWidth: '0', paddingRight: '0.5rem' }} />
                      ) : (
                        <></>
                      )}
                      <ListItemText id={labelId} primary={todo.name} />
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{
                        padding: 0,
                        backgroundColor: todo.complete ? '#BDCCA48C' : 'transparent',
                      }}
                    >
                      <ListItem
                        key={todo.id}
                        secondaryAction={
                          <Stack width={'100%'}>
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() => handleRemoveClick(todo)}
                              id={'listItemDropdown'}
                            >
                              <Delete04Icon color="disabled" />
                            </IconButton>
                          </Stack>
                        }
                        disablePadding
                        color=""
                      >
                        <ListItemButton
                          role={undefined}
                          onClick={handleTodoClick}
                          dense
                          sx={{ alignItems: 'center' }}
                        >
                          <ListItemIcon>
                            <Checkbox
                              icon={<SquareIcon />}
                              checkedIcon={<CheckmarkSquare02Icon />}
                              edge="start"
                              checked={todo.complete}
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ 'aria-labelledby': labelId }}
                              sx={{ paddingLeft: 2 }}
                            />
                          </ListItemIcon>
                          <Grid sx={{ padding: 0 }} width={'100%'} height={'100%'}>
                            {todo.notes && <ListItemText id={labelId} primary={todo.notes} />}
                            {todo.list.length > 0 && (
                              <Grid container spacing={1} flex={'auto'} direction={'row'} padding={0}>
                                {todo.list.map((e) => (
                                  <Grid>
                                    <Chip label={e} color={'warning'} variant={'outlined'} />
                                  </Grid>
                                ))}
                              </Grid>
                            )}
                            {(todo.notes || todo.list.length > 0) && <Divider sx={{ marginBottom: 1, marginTop: 1 }}></Divider>}
                            <ListItemText
                              sx={{ fontStyle: 'italic', margin: 0, marginTop: 0 }}
                              id={labelId}
                              primary={`${created}${updatedString}`}
                            />
                          </Grid>
                        </ListItemButton>
                      </ListItem>
                    </AccordionDetails>
                  </Accordion>
                )
              })}
            </Grid>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={handleSnackbarClose}
              anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
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
