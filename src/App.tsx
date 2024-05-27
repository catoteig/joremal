import './App.css'
import TodoList from './todoList.tsx'
import { SetStateAction, useEffect, useRef, useState } from 'react'
import { v4 } from 'uuid'
import { Chip, Grid, Stack, ThemeProvider } from '@mui/material'
import { Check, Error } from '@mui/icons-material'
import { createTheme } from '@mui/material/styles'
import TodoSubmit from './todoSubmit.tsx'
import { fakerNB_NO } from '@faker-js/faker'

const LOCAL_STORAGE_KEY = 'todoApp.todos'

export type TodoItem = {
  id: string
  name: string
  complete: boolean
}

const App = () => {
  const theme = createTheme({
    palette: {
      primary: {
        light: '#0AD3FF',
        main: '#C3979F',
        dark: '#023C40',
        contrastText: '#78FFD6',
      },
      secondary: {
        light: '#ff7961',
        main: '#f44336',
        dark: '#ba000d',
        contrastText: '#000',
      },
    },
    spacing: 8,
    typography: { button: { textTransform: 'none' } },
  })

  const [todos, setTodos] = useState<TodoItem[]>([])
  const [inputFieldValue, setInputFieldValue] = useState<string>('')
  const todoNameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) as string)
    if (storedTodos) setTodos(storedTodos)
  }, [])

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const toggleTodo = (id: string) => {
    const newTodos = [...todos]
    const todo = newTodos.find((todo) => todo.id === id)
    if (todo) {
      todo.complete = !todo.complete
      setTodos(newTodos)
    }
  }

  const toggleAllTodos = () => {
    const newTodos = todos.map((todo, _idx, allTodos) => ({
      ...todo,
      complete: allTodos.some((e) => !e.complete),
    }))
    setTodos(newTodos)
  }

  const handleAddTodo = () => {
    if (!inputFieldValue.trim()) return
    setTodos((prevTodos) => [...prevTodos, { id: v4(), name: inputFieldValue, complete: false }])
    setInputFieldValue('')
    if (todoNameRef.current) {
      todoNameRef.current.value = ''
    }
  }

  const handleRemoveAllTodo = () => {
    const newTodos = todos.filter((todo) => !todo.complete)
    setTodos(newTodos)
  }

  const handleRemoveTodo = (id: string) => {
    setTodos((prevTodos) => [...prevTodos.filter((todo) => todo.id !== id)])
  }

  const autoFill = async () => {
    const todoItems: TodoItem[] = Array.from({ length: 3 }, () => {
      const noun = fakerNB_NO.word.noun()
      return noun.charAt(0).toUpperCase() + noun.slice(1);
    }).map((e) => ({
      id: v4(),
      name: e,
      complete: false,
    }))
    setTodos((prevTodos) => [...prevTodos, ...todoItems])
  }

  const onFormSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    handleAddTodo()
  }

  const handleInputFieldChange = (event: { target: { value: SetStateAction<string> } }) => {
    setInputFieldValue(event.target.value)
  }

  const { incompleteTodos, completeTodos } = todos.reduce(
    (acc: { incompleteTodos: number; completeTodos: number }, todo) => {
      !todo.complete ? acc.incompleteTodos++ : acc.completeTodos++
      return acc
    },
    { incompleteTodos: 0, completeTodos: 0 }
  )
  const hasTodos: boolean = todos.length > 0

  return (
    <ThemeProvider theme={theme}>
      <Grid container spacing={2} alignItems={'flex-start'}>
        <Grid item xs={12}>
          <h1>Jør</h1>
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent="flex-end">
            <Stack direction={'row'} spacing={1}>
              {completeTodos > 0 && (
                <Chip
                  icon={<Check />}
                  label={`${incompleteTodos == 0 ? 'Alle ':''}${completeTodos} fullført${completeTodos == 1 || incompleteTodos == 0 ? '' : 'e'}`}
                  color={'success'}
                  variant="outlined"
                ></Chip>
              )}
              {incompleteTodos > 0 && (
                <Chip
                  label={`${incompleteTodos} ugjort${incompleteTodos == 1 ? '' : 'e'}`}
                  color={'error'}
                  icon={<Error />}
                  variant="outlined"
                ></Chip>
              )}
            </Stack>
          </Grid>
        </Grid>
          <Grid item xs={12}>
            <TodoList
              todos={todos}
              toggleTodo={toggleTodo}
              removeTodo={handleRemoveTodo}
              toggleAllTodos={toggleAllTodos}
              removeAllTodo={handleRemoveAllTodo}
              autoFill={autoFill}
              incompleteTodos={incompleteTodos}
              completeTodos={completeTodos}
              hasTodos={hasTodos}
            />
          </Grid>
        <Grid item xs={12}>
          <TodoSubmit
            todoNameRef={todoNameRef}
            inputFieldValue={inputFieldValue}
            onFormSubmit={onFormSubmit}
            handleInputFieldChange={handleInputFieldChange}
          ></TodoSubmit>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}

export default App
