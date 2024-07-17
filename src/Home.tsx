import './Home.css'
import * as React from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { fbCreate, fbDelete, fbGetAll, fbGetAllFolders, fbUpdate } from './services/joremal.tsx'
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
import ChangeUserData from './components/changeUserData.tsx'
import firestore = firebase.firestore

const LOCAL_STORAGE_CURRENT_FOLDER = 'joremal.currentFolder'
const LOCAL_STORAGE_ORDER_ASC = 'joremal.orderAsc'

export type TodoItem = {
  id: string
  name: string
  complete: boolean
  notes: string
  list: string[]
  created: firestore.Timestamp
  updated: null | firestore.Timestamp
  folder: string
}
export type TodoFilter = 'complete' | 'incomplete' | null

const Home = () => {
  const { user } = useAuth()

  const [todos, setTodos] = useState<TodoItem[]>([])
  const [todosWithFilterAndSort, setTodosWithFilterAndSort] = useState<TodoItem[]>([])
  const [todoFilter, setTodoFilter] = React.useState<TodoFilter>(null)
  const [tagFilter, setTagFilter] = React.useState<string[]>([])
  const [orderAsc, setOrderAsc] = React.useState<boolean>(true)

  const [loading, setLoading] = useState<boolean>(false)
  const [addModalVisible, setAddModalVisible] = React.useState<boolean>(false)
  const todoNameRef = useRef<HTMLInputElement>(null)
  const [userDataVisible, setUserDataVisible] = useState<boolean>(false)

  const [folderList, setFolderList] = useState<string[]>([])
  const [currentFolder, setCurrentFolder] = useState<string>('')

  const allTags = useMemo(() => todos.flatMap((todo) => todo.list), [todos])

  useEffect(() => {
    const storageOrderAsc = localStorage.getItem(LOCAL_STORAGE_ORDER_ASC) === 'true'
    if (storageOrderAsc) setOrderAsc(storageOrderAsc)
    const storageCurrentFolder = localStorage.getItem(LOCAL_STORAGE_CURRENT_FOLDER) as string
    if (storageCurrentFolder) setCurrentFolder(storageCurrentFolder)
    handleFolderList()
  }, [])

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_CURRENT_FOLDER, currentFolder)
    handleFetch()
  }, [currentFolder])

  useEffect(() => {
    let filtered: TodoItem[] =
      todoFilter === 'complete'
        ? todos.filter((t) => t.complete)
        : todoFilter === 'incomplete'
        ? todos.filter((t) => !t.complete)
        : todos

    if (tagFilter.length > 0) filtered = filtered.filter((todo) => tagFilter.some((tag) => todo.list.includes(tag)))
    filtered = filtered.sort((a, b) => (orderAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)))

    setTodosWithFilterAndSort(filtered)
    localStorage.setItem(LOCAL_STORAGE_ORDER_ASC, String(orderAsc))
  }, [todos, todoFilter, orderAsc, tagFilter])

  useEffect(() => {
    if (todosWithFilterAndSort.length === 0) setCurrentFolder(folderList[0])
  }, [todosWithFilterAndSort])

  const handleFolderChange = (folder: string) => setCurrentFolder(folder)

  const handleFolderList = () => {
    fbGetAllFolders().then((res) => {
      setCurrentFolder(res[0])
      setFolderList(res)
    })
  }

  const handleAddModalVisible = () => setAddModalVisible(!addModalVisible)

  const handleUserDataModalVisible = () => setUserDataVisible(!userDataVisible)

  const handleAddTodo = (newTodo: TodoItem) => {
    fbCreate(newTodo).then(() => handleFetch())

    if (!folderList.includes(newTodo.folder)) setFolderList([...folderList, newTodo.folder])

    if (todoNameRef.current) todoNameRef.current.value = ''
  }

  const handleFetch = () => {
    fbGetAll(currentFolder).then((res) => {
      setTodos([...res])
      if (res.length === 0) handleFolderList()
    })
    setLoading(false)
  }

  const handleUpdateTodo = (todo: TodoItem | TodoItem[]) => {
    fbUpdate(todo).then(() => handleFetch())
  }

  const handleToggleTodo = (id: string) => {
    const newTodos = [...todos]
    const todo = newTodos.find((todo) => todo.id === id)
    if (todo) {
      todo.complete = !todo.complete
      handleUpdateTodo(todo)
    }
  }

  const handleToggleAllTodos = () => {
    setLoading(true)
    const newTodos: TodoItem[] = todos.map((todo, _idx, allTodos) => ({
      ...todo,
      complete: allTodos.some((e) => !e.complete),
    }))
    handleUpdateTodo(newTodos)
  }

  const handleRemove = (todo: TodoItem | TodoItem[]): void => {
    if (Array.isArray(todo)) setLoading(true)
    fbDelete(todo).then(() => handleFetch())
    setLoading(false)
  }

  const handleRemoveCompletedTodos = () => {
    setLoading(true)
    const completedTodos = todos.filter((todo) => todo.complete)
    handleRemove(completedTodos)
  }

  const handleRemoveTodo = (id: string) => {
    const todo = todos.find((todo) => todo.id === id)!
    handleRemove(todo)
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
      folder: currentFolder,
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

  return !user ? (
    <Navigate to="/login" />
  ) : (
    <>
      <Grid
        container
        spacing={'1rem'}
        margin={'0 1rem'}
        height={'4rem'}
        width={'calc(100vw - 2rem)'}
        maxWidth={'400px'}
      >
        <Grid xs={todos.length > 0 ? 5 : 12}>
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
                  onClick={todoFilter === 'complete' ? () => setTodoFilter(null) : () => setTodoFilter('complete')}
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
                  onClick={todoFilter === 'incomplete' ? () => setTodoFilter(null) : () => setTodoFilter('incomplete')}
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
            removeAllTodo={handleRemoveCompletedTodos}
            autoFill={autoFill}
            incompleteTodos={incompleteTodos}
            completeTodos={completeTodos}
            hasTodos={todos.length > 0}
            orderAsc={orderAsc}
            setOrderAsc={setOrderAsc}
            loading={loading}
            addVisible={addModalVisible}
            setAddVisible={handleAddModalVisible}
            tagFilter={tagFilter}
            setTagFilter={setTagFilter}
            userDataVisible={userDataVisible}
            setUserDataVisible={handleUserDataModalVisible}
            currentFolder={currentFolder}
            setCurrentFolder={handleFolderChange}
            folderList={folderList}
            handleAddTodo={handleAddTodo}
          />
        </Grid>
      </Grid>
      <Fab
        aria-label="Create"
        color="warning"
        sx={{ position: 'absolute', bottom: '3rem', right: '3rem', color: 'primary.light' }}
        onClick={handleAddModalVisible}
      >
        <NoteAddIcon />
      </Fab>
      <Modal open={addModalVisible} onClose={handleAddModalVisible}>
        <TodoSubmit
          todoNameRef={todoNameRef}
          handleAddTodo={handleAddTodo}
          handleAddModalVisible={handleAddModalVisible}
          currentFolder={currentFolder}
          allFolders={folderList}
          allTags={allTags}
        />
      </Modal>
      <Modal open={userDataVisible} onClose={handleUserDataModalVisible}>
        <ChangeUserData setVisible={setUserDataVisible} />
      </Modal>
      {/*<ParticleElement />*/}
    </>
  )
}

export default Home
