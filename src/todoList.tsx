import * as React from 'react'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Stack,
} from '@mui/material'
import { DeleteForever } from '@mui/icons-material'
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
}) => {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false)
  const [snackbarMessage, setSnackbarMessage] = React.useState('')

  const handleRemoveClick = (todo: TodoItem) => {
    removeTodo(todo.id)
    setSnackbarMessage(`${todo.name} slettet`)
    setSnackbarOpen(true)
  }

  const handleRemoveAllClick = () => {
    removeAllTodo()
    setSnackbarMessage(`Alle utførte slettet`)
    setSnackbarOpen(true)
  }

  const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarOpen(false)
  }

  return (
    <Box component={'section'} sx={{ border: '1px dashed grey', borderRadius: 2 }}>
      <Grid item xs={12}>
        <Box component={'section'}>
          <Stack direction={'row'} spacing={1}>
            {hasTodos && (
              <Button variant="text" onClick={toggleAllTodos} sx={{ textDecoration: 'underline' }}>
                {incompleteTodos === 0 ? 'Fjern markerte' : 'Marker alle'}
              </Button>
            )}
            {completeTodos > 0 && (
              <Button variant="text" onClick={handleRemoveAllClick} sx={{ textDecoration: 'underline' }}>
                Slett utførte
              </Button>
            )}
            <Button variant="text" onClick={autoFill} sx={{ textDecoration: 'underline' }}>
              Random
            </Button>
          </Stack>
        </Box>
      </Grid>
      <List sx={{ width: '100%' }}>
        {todos.map((todo) => {
          const labelId = `checkbox-list-label-${todo.id}`
          const handleTodoClick = () => toggleTodo(todo.id)

          return (
            <ListItem
              key={todo.id}
              secondaryAction={
                <Stack>
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
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={todo.name} />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
      <Snackbar
        open={snackbarOpen}
        //autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        sx={{ background: 'primary.main' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default TodoList
