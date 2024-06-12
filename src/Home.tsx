import './Home.css'
import * as React from 'react'
import { SetStateAction, useEffect, useRef, useState } from 'react'
import { fbCreate, fbDelete, fbGetAll, fbUpdate } from './services/joremal.tsx'
import { capitalize } from './helpers.ts'
import { v4 } from 'uuid'
import { fakerNB_NO } from '@faker-js/faker'
import { Chip, Fab, Grow, Modal, Stack, ThemeProvider } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { AddTaskOutlined, Check, InfoOutlined } from '@mui/icons-material'
import TodoList from './todoList.tsx'
import TodoSubmit from './todoSubmit.tsx'
import firebase from 'firebase/compat/app'
import firestore = firebase.firestore
import theme from './theme.tsx'

const LOCAL_STORAGE_KEY = 'todoApp.orderAsc'

export type TodoItem = {
  id: string
  name: string
  complete: boolean
  notes: string
  created: firestore.Timestamp
  updated: null | firestore.Timestamp
}

const Home: React.FC = () => {
  theme()
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [inputFieldValue, setInputFieldValue] = useState<string>('')
  const [noteFieldValue, setNoteFieldValue] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [orderAsc, setOrderAsc] = React.useState<boolean>(true)
  const [, setWidth] = useState<number>(window.innerWidth)
  const [addVisible, setAddVisible] = React.useState<boolean>(false)
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

  // const isMobile = width <= 768

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
    handleAddVisible()
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
  const hasIncompleteTodos = incompleteTodos === 0
  const hasTodos: boolean = todos.length > 0

  return (
    <ThemeProvider theme={theme}>
      <Grid container spacing={'1rem'} margin={'0 1rem'} height={'4rem'} width={'calc(100vw - 2rem)'} maxWidth={'400px'}>
        <Grid xs={hasTodos ? 5 : 12}>{hasTodos ? <h1>J</h1> : <h1>Jør ettellerannet.</h1>}</Grid>
        <Grid xs={7} container alignItems="flex-end" justifyContent={'flex-end'}>
          <Stack direction={'row'} spacing={'1rem'} justifyContent={'flex-end'}>
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
                  icon={<InfoOutlined />}
                  variant="outlined"
                ></Chip>
              </Grow>
            )}
          </Stack>
        </Grid>
        <Grid xs={12} height={'calc(100vh - 10rem)'} padding={0} paddingTop={'1rem'}>
          <TodoList
            todos={todos}
            toggleTodo={handleToggleTodo}
            removeTodo={handleRemoveTodo}
            toggleAllTodos={handleToggleAllTodos}
            removeAllTodo={handleRemoveCompletedTodo}
            autoFill={autoFill}
            hasIncompleteTodos={hasIncompleteTodos}
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
      {!addVisible && (
        <>
          {/*<SpeedDialCustom />*/}
          <Fab
            aria-label="Create"
            color="warning"
            sx={
              hasTodos
                ? { position: 'absolute', bottom: '3rem', right: '3rem', color: '#F4ECD6' }
                : { position: 'absolute', top: '7rem', right: 'calc(50% - 8rem)' }
            }
            onClick={handleAddVisible}
          >
            <AddTaskOutlined />
          </Fab>
        </>
      )}
      <Modal open={addVisible} onClose={handleAddVisible}>
        <TodoSubmit
          todoNameRef={todoNameRef}
          inputFieldValue={inputFieldValue}
          noteFieldValue={noteFieldValue}
          onFormSubmit={onFormSubmit}
          handleInputFieldChange={handleInputFieldChange}
          handleNoteFieldChange={handleNoteFieldChange}
        />
      </Modal>
    </ThemeProvider>
  )
}

export default Home
