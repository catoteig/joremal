import * as React from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Stack,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import {
  AddTaskOutlined,
  BoltOutlined,
  Check,
  CheckBoxOutlineBlankOutlined,
  CheckBoxOutlined,
  DeleteForever,
  DeleteSweepOutlined,
  KeyboardArrowDown,
  SortByAlphaOutlined,
} from '@mui/icons-material'
import { TodoItem } from './App.tsx'

const TodoList: React.FC<{
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
  fetchData: () => void
  loading: boolean
  setAddVisible: () => void
  addVisible: boolean
}> = ({
  todos,
  toggleTodo,
  removeTodo,
  hasTodos,
  toggleAllTodos,
  incompleteTodos,
  completeTodos,
  removeAllTodo,
  autoFill,
  orderAsc,
  setOrderAsc,
  loading,
  setAddVisible,
  addVisible,
}) => {
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
    setSnackbarOpen(true)
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

  return hasTodos ? (
    <Box component={'section'} sx={{ border: '1px dashed grey', borderRadius: 2 }} height={'100%'}>
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
            sx={{ padding: 0, paddingTop: 1, verticalAlign: 'middle', borderBottom: '1px solid lightgrey' }}
            height={'3.3rem'}
          >
            <Stack direction={'row'} spacing={2} justifyContent={'center'} alignItems={'center'}>
              <IconButton onClick={handleToggleAll} disabled={!hasTodos}>
                {incompleteTodos === 0 ? <CheckBoxOutlineBlankOutlined /> : <CheckBoxOutlined />}
              </IconButton>
              <IconButton onClick={handleRemoveAllClick} disabled={!completeTodos}>
                <DeleteSweepOutlined />
              </IconButton>
              <IconButton onClick={handleOrderBy}>
                <SortByAlphaOutlined />
              </IconButton>
              <IconButton onClick={handleRandom}>
                <BoltOutlined />
              </IconButton>
              <IconButton color={addVisible ? 'success' : 'default'} onClick={setAddVisible}>
                <AddTaskOutlined />
              </IconButton>
            </Stack>
          </Grid>
          <Grid xs={12} sx={{ padding: 0 }} height={'calc(100% - 3.3rem)'} overflow={'auto'}>
            <List sx={{ padding: 0 }}>
              {todos.map((todo) => {
                const labelId = `checkbox-list-label-${todo.id}`
                const handleTodoClick = () => handleToggle(todo.id)
                const created = new Date(todo.created.seconds * 1000).toLocaleDateString()
                const updated: string | null = todo.updated
                  ? new Date(todo.updated.seconds * 1000).toLocaleDateString()
                  : null
                const updatedString = updated ? `, ${todo.complete ? 'fullført' : 'oppdatert'} ${updated}` : ''

                return removeLoading ? (
                  <CircularProgress />
                ) : (
                  <Accordion
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
                      sx={{ backgroundColor: todo.complete ? 'rgba(189,204,164,0.55)' : 'transparent' }}
                      expandIcon={<KeyboardArrowDown />}
                    >
                      {todo.complete ? <Check sx={{ paddingRight: 1 }} /> : <></>}
                      <ListItemText id={labelId} primary={todo.name} />
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{
                        padding: 0,
                        backgroundColor: todo.complete ? 'rgba(189,204,164,0.55)' : 'transparent',
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
                              <DeleteForever color="disabled" />
                            </IconButton>
                          </Stack>
                        }
                        disablePadding
                        color=""
                      >
                        <ListItemButton role={undefined} onClick={handleTodoClick} dense>
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={todo.complete}
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ 'aria-labelledby': labelId }}
                              sx={{ paddingLeft: 2 }}
                            />
                          </ListItemIcon>
                          <Grid sx={{ padding: 0 }} width={'100%'} height={'100%'}>
                            {todo.notes && (
                              <>
                                <ListItemText id={labelId} primary={todo.notes} />
                                <Divider sx={{ marginBottom: 1, marginTop: 1 }}></Divider>
                              </>
                            )}
                            <ListItemText
                              sx={{ fontStyle: 'italic', margin: 0, marginTop: 0 }}
                              id={labelId}
                              primary={`${created}${updatedString}`}
                            />
                            {/*{updated && (*/}
                            {/*  <ListItemText*/}
                            {/*    sx={{ fontStyle: 'italic', margin: 0 }}*/}
                            {/*    id={labelId}*/}
                            {/*    primary={`Oppdatert ${updated}`}*/}
                            {/*  />*/}
                            {/*)}*/}
                          </Grid>
                        </ListItemButton>
                      </ListItem>
                    </AccordionDetails>
                  </Accordion>
                )
              })}
            </List>
          </Grid>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
            sx={{ background: 'primary.main' }}
          >
            <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </>
      )}
    </Box>
  ) : (
    <Grid
      xs={12}
      width="360px"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    ></Grid>
  )
}

export default TodoList
