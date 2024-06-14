import './Home.css'
import * as React from 'react'
import { SetStateAction, useEffect, useRef, useState } from 'react'
import { fbCreate, fbDelete, fbGetAll, fbUpdate } from './services/joremal.tsx'
import { capitalize } from './helpers/helpers.tsx'
import { v4 } from 'uuid'
import { fakerNB_NO } from '@faker-js/faker'
import { Chip, Fab, Grow, Modal, Stack } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import TodoList from './components/todoList.tsx'
import TodoSubmit from './components/todoSubmit.tsx'
import firebase from 'firebase/compat/app'
import { Award04Icon, Idea01Icon, NoteAddIcon } from 'hugeicons-react'
import firestore = firebase.firestore

export type TodoItem = {
  id: string
  name: string
  complete: boolean
  notes: string
  list: string[]
  created: firestore.Timestamp
  updated: null | firestore.Timestamp
}
export type TodoFilter = 'complete' | 'incomplete' | null

const Home = () => {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [todosWithFilterAndSort, setTodosWithFilterAndSort] = useState<TodoItem[]>([])
  const [todoFilter, setTodoFilter] = React.useState<TodoFilter>(null)
  const [orderAsc, setOrderAsc] = React.useState<boolean>(true)

  const [inputFieldValue, setInputFieldValue] = useState<string>('')
  const [noteFieldValue, setNoteFieldValue] = useState<string>('')
  const [assigneeFieldValue, setAssigneeFieldValue] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
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

  useEffect(() => {
    handleFetch()
  }, [])

  useEffect(() => {
    handleTodoFilterAndSort()
  }, [todoFilter, todos, orderAsc])

  const handleAddVisible = () => {
    setAddVisible(!addVisible)
  }

  const handleTodoFilterAndSort = () => {
    let filtered: TodoItem[] = []
    if (todoFilter === 'complete') {
      filtered = todos.filter((t) => t.complete)
    } else if (todoFilter === 'incomplete') {
      filtered = todos.filter((t) => !t.complete)
    } else if (todoFilter === null) {
      filtered = todos
    }
    setTodosWithFilterAndSort(
      filtered.sort((a, b) => (orderAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)))
    )
  }

  const handleFetch = () => {
    fbGetAll()
      .then((res) => setTodos([...res]))
      .then(() => handleTodoFilterAndSort())
    setLoading(false)
  }

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
      list: assigneeFieldValue,
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
      list: Array.from({ length: fakerNB_NO.number.int({ min: 5, max: 5 }) }).map(() => fakerNB_NO.person.firstName()),
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
  const handleAssigneeFieldChange = (event: { target: { value: SetStateAction<string[]> } }) => {
    setAssigneeFieldValue(event.target.value)
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

  const setFilterComplete = () => setTodoFilter('complete')
  const setFilterIncomplete = () => setTodoFilter('incomplete')
  const clearFilter = () => setTodoFilter(null)

  return (
    <>
      <Grid
        container
        spacing={'1rem'}
        margin={'0 1rem'}
        height={'4rem'}
        width={'calc(100vw - 2rem)'}
        maxWidth={'400px'}
      >
        <Grid xs={hasTodos ? 5 : 12}>
          <h1>J</h1>
        </Grid>
        <Grid
          xs={7}
          container
          alignItems="flex-end"
          justifyContent={'flex-end'}
          sx={{
            '& .MuiChip-filled': {
              color: 'white',
            },
          }}
        >
          <Stack direction={'row'} spacing={'0.5rem'} justifyContent={'flex-end'}>
            {/*{todoFilter !== null && (*/}
            {/*  <Grow in={true} key="clearFilter">*/}
            {/*    <IconButton component={'button'} onClick={clearFilter} size={'small'} sx={{ p: '0 5px' }}>*/}
            {/*      <Clear />*/}
            {/*    </IconButton>*/}
            {/*  </Grow>*/}
            {/*)}*/}
            <Grow in={true} key="completeChip">
              <Chip
                component={'button'}
                variant={todoFilter === 'complete' ? 'filled' : 'outlined'}
                onClick={todoFilter === 'complete' ? clearFilter : setFilterComplete}
                icon={<Award04Icon />}
                label={`${incompleteTodos === 0 ? 'Alle ' : ''}${completeTodos} fullført${
                  completeTodos === 1 || incompleteTodos === 0 ? '' : 'e'
                }`}
                color={'success'}
              />
            </Grow>
            <Grow in={true} key="incompleteChip">
              <Chip
                component={'button'}
                variant={todoFilter === 'incomplete' ? 'filled' : 'outlined'}
                onClick={todoFilter === 'incomplete' ? clearFilter : setFilterIncomplete}
                icon={<Idea01Icon />}
                label={`${incompleteTodos} ugjort${incompleteTodos === 1 ? '' : 'e'}`}
                color={'warning'}
              ></Chip>
            </Grow>
          </Stack>
        </Grid>
        <Grid xs={12} maxHeight={'calc(100vh - 10rem)'} padding={0} paddingTop={'1rem'}>
          <TodoList
            todos={todosWithFilterAndSort}
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
            <NoteAddIcon />
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
          handleAssigneFieldChange={handleAssigneeFieldChange}
          assigneeFieldValue={assigneeFieldValue}
        />
      </Modal>
    </>
  )
}

export default Home
