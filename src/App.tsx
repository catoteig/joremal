import './App.css'
import TodoList from './todoList.tsx'
import * as React from 'react'
import { SetStateAction, useEffect, useRef, useState } from 'react'
import { Box, Chip, Grow, Stack, ThemeProvider } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { Check, Info } from '@mui/icons-material'
import { createTheme } from '@mui/material/styles'
import TodoSubmit from './todoSubmit.tsx'
import { fakerNB_NO } from '@faker-js/faker'
import { fbCreate, fbDelete, fbGetAll, fbUpdate } from './services/joremal.tsx'
import { v4 } from 'uuid'
import { capitalize } from './helpers.ts'
import firebase from 'firebase/compat/app'
import firestore = firebase.firestore

export enum OrderBy {
  name_asc = 'Name, ascending',
  name_desc = 'Name, descending',
  completed = 'Completed',
}

const LOCAL_STORAGE_KEY = 'todoApp.orderAsc'

export type TodoItem = {
  id: string
  name: string
  complete: boolean
  notes: string
  created: firestore.Timestamp
  updated: null | firestore.Timestamp
}

const App = () => {
  const theme = createTheme({
    palette: {
      primary: {
        light: '#0AD3FF',
        main: '#1F271B',
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
  const [noteFieldValue, setNoteFieldValue] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [orderAsc, setOrderAsc] = React.useState<boolean>(true)
  const [width, setWidth] = useState<number>(window.innerWidth)
  const [addVisible, setAddVisible] = React.useState<boolean>(true)
  const todoNameRef = useRef<HTMLInputElement>(null)

  function handleWindowSizeChange() {
    setWidth(window.innerWidth)
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange)
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
    }
  }, [])

  const isMobile = width <= 768

  const handleAddVisible = () => {
    setAddVisible(!addVisible)
  }

  const handleFetch = () => {
    fbGetAll(orderAsc).then((res) => {
      setTodos([...res])
      setLoading(false)
    })
  }

  useEffect(() => {
    const orderAscLocal = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) as string) === 'true'
    if (orderAscLocal) setOrderAsc(orderAscLocal)
  }, [])

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orderAsc))
    handleFetch()
  }, [orderAsc])

  // const orderTodos = () => {
  //   const sorted = todos.sort((a, b) => {
  //     if (orderAsc == OrderBy.name_asc) return b.name.localeCompare(a.name)
  //     if (orderAsc == OrderBy.name_desc) return a.name.localeCompare(b.name)
  //     if (orderAsc == OrderBy.completed) return Number(b.complete) - Number(a.complete)
  //     return 0
  //   })
  //   setTodos(sorted)
  // }

  const handleCreate = async (todo: TodoItem) => {
    await fbCreate(todo).then(() => handleFetch())
  }

  const handleRemove = async (todo: TodoItem | TodoItem[]) => {
    if (Array.isArray(todo)) setLoading(true)
    await fbDelete(todo)
      .then(() => setLoading(false))
      .then(() => handleFetch())
  }

  const handleUpdateTodo = async (todo: TodoItem | TodoItem[]) => {
    await fbUpdate(todo).then(() => handleFetch())
  }

  const handleToggleTodo = (id: string) => {
    const newTodos = [...todos]
    const todo = newTodos.find((todo) => todo.id === id)
    if (todo) {
      todo.complete = !todo.complete
      handleUpdateTodo(todo).then(() => handleFetch())
    }
  }

  const handleToggleAllTodos = () => {
    setLoading(true)
    const newTodos: TodoItem[] = todos.map((todo, _idx, allTodos) => ({
      ...todo,
      complete: allTodos.some((e) => !e.complete),
    }))
    handleUpdateTodo(newTodos).then(() => handleFetch())
  }

  const handleAddTodo = () => {
    if (!inputFieldValue.trim()) return
    const newTodo: TodoItem = {
      name: capitalize(inputFieldValue),
      complete: false,
      id: v4(),
      notes: noteFieldValue,
      // @ts-expect-error Created datatype
      created: new Date(),
    }
    handleCreate(newTodo).then(() => handleFetch())
    setInputFieldValue('')
    setNoteFieldValue('')
    if (todoNameRef.current) {
      todoNameRef.current.value = ''
    }
  }

  const handleRemoveCompletedTodo = () => {
    setLoading(true)
    const completedTodos = todos.filter((todo) => todo.complete)
    handleRemove(completedTodos).then(() => handleFetch())
  }

  const handleRemoveTodo = (id: string) => {
    const todo = todos.find((todo) => todo.id === id)!
    handleRemove(todo).then(() => handleFetch())
  }

  const autoFill = () => {
    setLoading(true)
    // @ts-expect-error Created datatype
    const todoItems: TodoItem[] = Array.from({ length: 3 }, () => ({
      id: v4(),
      name: capitalize(fakerNB_NO.word.noun()),
      complete: false,
      notes: fakerNB_NO.word.words(15),
      created: new Date(),
    }))
    fbCreate(todoItems).then(() => handleFetch())
  }

  const onFormSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    handleAddTodo()
  }

  const handleInputFieldChange = (event: { target: { value: SetStateAction<string> } }) => {
    setInputFieldValue(event.target.value)
  }
  const handleNoteFieldChange = (event: { target: { value: SetStateAction<string> } }) => {
    setNoteFieldValue(event.target.value)
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
      <Grid container spacing={2}>
        <Grid xs={4} height={'4rem'}>
          <h1>Liste</h1>
        </Grid>
        <Grid xs={8} height={'4rem'}>
          <Grid container justifyContent="flex-end">
            <Stack direction={'row'} spacing={1}>
              {completeTodos > 0 && (
                <Grow in={true} key="completeChip">
                  <Chip
                    icon={<Check />}
                    label={`${incompleteTodos === 0 ? 'Alle ' : ''}${completeTodos} fullført${
                      completeTodos === 1 || incompleteTodos === 0 ? '' : 'e'
                    }`}
                    color={'success'}
                    variant="outlined"
                  />
                </Grow>
              )}
              {incompleteTodos > 0 && (
                <Grow in={true} key="incompleteChip">
                  <Chip
                    label={`${incompleteTodos} ugjort${incompleteTodos === 1 ? '' : 'e'}`}
                    color={'warning'}
                    icon={<Info />}
                    variant="outlined"
                  />
                </Grow>
              )}
            </Stack>
          </Grid>
        </Grid>
        <Grid xs={12} height={'calc(100vh - 6rem)'}>
          <TodoList
            todos={todos}
            toggleTodo={handleToggleTodo}
            removeTodo={handleRemoveTodo}
            toggleAllTodos={handleToggleAllTodos}
            removeAllTodo={handleRemoveCompletedTodo}
            autoFill={autoFill}
            incompleteTodos={incompleteTodos}
            completeTodos={completeTodos}
            hasTodos={hasTodos}
            orderAsc={orderAsc}
            setOrderAsc={setOrderAsc}
            fetchData={handleFetch}
            loading={loading}
            addVisible={addVisible}
            setAddVisible={handleAddVisible}
          />
        </Grid>
      </Grid>
      {addVisible && (
        <Box
          id="Box2"
          sx={{
            position: 'fixed',
            bottom: '50%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'white',
            padding: '10px',
            border: isMobile ? '1px solid grey' : '1px dashed grey',
            borderRadius: 2,
            width: isMobile ? '100%' : '400px',
          }}
        >
          <Grow in={true} key="addVisible">
            <Grid container spacing={2} alignItems={'flex-start'}>
              <TodoSubmit
                todoNameRef={todoNameRef}
                inputFieldValue={inputFieldValue}
                noteFieldValue={noteFieldValue}
                onFormSubmit={onFormSubmit}
                handleInputFieldChange={handleInputFieldChange}
                handleNoteFieldChange={handleNoteFieldChange}
              />
            </Grid>
          </Grow>
        </Box>
      )}
    </ThemeProvider>
  )
}

export default App
