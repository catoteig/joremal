import './Home.css'
import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { fbCreate, fbDelete, fbGetAll, fbUpdate } from './services/joremal.tsx'
import { capitalize } from './helpers/helpers.tsx'
import { v4 } from 'uuid'
import { fakerNB_NO } from '@faker-js/faker'
import { Chip, Fab, Grow, Modal, Stack } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import TodoList from './components/todoList.tsx'
import TodoSubmit from './components/todoSubmit.tsx'
import firebase from 'firebase/compat/app'
import { Award04Icon, NoteAddIcon, WorkoutKickingIcon } from 'hugeicons-react'
import { useAuth } from './AuthContext.ts'
import { Navigate } from 'react-router-dom'
import firestore = firebase.firestore
import ChangeUserData from './components/changeUserData.tsx'
import ParticleElement from './components/particleElement.tsx'

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
  const [tagFilter, setTagFilter] = React.useState<string[]>([])
  const [orderAsc, setOrderAsc] = React.useState<boolean>(true)

  const [loading, setLoading] = useState<boolean>(false)
  const [, setWidth] = useState<number>(window.innerWidth)
  const [addModalVisible, setAddModalVisible] = React.useState<boolean>(false)
  const todoNameRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
  const [userDataVisible, setUserDataVisible] = useState<boolean>(false)

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
  }, [todoFilter, todos, orderAsc, tagFilter])

  const handleAddModalVisible = () => {
    setAddModalVisible(!addModalVisible)
  }
  const handleUserDataModalVisible = () => {
    setUserDataVisible(!userDataVisible)
  }
  const handleAddTodo = (newTodo: TodoItem) => {
    fbCreate(newTodo).then(() => handleFetch())

    if (todoNameRef.current) {
      todoNameRef.current.value = ''
    }
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

    if (tagFilter.length > 0) filtered = filtered.filter((todo) => tagFilter.some((tag) => todo.list.includes(tag)))
    filtered = filtered.sort((a, b) => (orderAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)))
    setTodosWithFilterAndSort(filtered)
  }

  const handleFetch = () => {
    fbGetAll()
      .then((res) => setTodos([...res]))
      .then(() => handleTodoFilterAndSort())
    setLoading(false)
  }

  const handleRemove = async (todo: TodoItem | TodoItem[]) => {
    if (Array.isArray(todo)) setLoading(true)
    clearTodoFilter()
    clearTagFilter()
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
      list: Array.from({ length: fakerNB_NO.number.int({ min: 0, max: 5 }) }).map(() => fakerNB_NO.person.firstName()),
    }))
    fbCreate(todoItems).then(() => handleFetch())
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
  const clearTodoFilter = () => setTodoFilter(null)
  const clearTagFilter = () => setTagFilter([])

  return !user ? (
    <Navigate to="/login" />
  ) : (
    <>
      <ParticleElement/>
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
            {completeTodos > 0 && (
              <Grow in={true} key="completeChip">
                <Chip
                  component={'button'}
                  variant={todoFilter === 'complete' ? 'filled' : 'outlined'}
                  onClick={todoFilter === 'complete' ? clearTodoFilter : setFilterComplete}
                  icon={<Award04Icon />}
                  label={`${incompleteTodos === 0 ? 'Alle ' : ''}${completeTodos} fullført${
                    completeTodos === 1 || incompleteTodos === 0 ? '' : 'e'
                  }`}
                  color={'success'}
                />
              </Grow>
            )}
            {incompleteTodos > 0 && (
              <Grow in={true} key="incompleteChip">
                <Chip
                  component={'button'}
                  variant={todoFilter === 'incomplete' ? 'filled' : 'outlined'}
                  onClick={todoFilter === 'incomplete' ? clearTodoFilter : setFilterIncomplete}
                  icon={<WorkoutKickingIcon />}
                  label={`${incompleteTodos} uferdig${incompleteTodos === 1 ? '' : 'e'}`}
                  color={'warning'}
                ></Chip>
              </Grow>
            )}
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
            addVisible={addModalVisible}
            setAddVisible={handleAddModalVisible}
            tagFilter={tagFilter}
            setTagFilter={setTagFilter}
            userDataVisible={userDataVisible}
            setUserDataVisible={handleUserDataModalVisible}
          />
        </Grid>
      </Grid>
      <Fab
        aria-label="Create"
        color="warning"
        sx={{ position: 'absolute', bottom: '3rem', right: '3rem', color: '#F4ECD6' }}
        onClick={handleAddModalVisible}
      >
        <NoteAddIcon />
      </Fab>
      <Modal open={addModalVisible} onClose={handleAddModalVisible}>
        <TodoSubmit
          todoNameRef={todoNameRef}
          handleAddTodo={handleAddTodo}
          handleAddModalVisible={handleAddModalVisible}
        />
      </Modal>
      <Modal open={userDataVisible} onClose={handleUserDataModalVisible}>
        <ChangeUserData setVisible={setUserDataVisible} />
      </Modal>
    </>
  )
}

export default Home
