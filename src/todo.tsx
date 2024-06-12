import * as React from 'react'
import { TodoItem } from './Home.tsx'
import { Checkbox, ListItem, ListItemText } from '@mui/material'

const Todo: React.FC<{
  todo: TodoItem
  toggleTodo: (id: string) => void
}> = ({ todo, toggleTodo }) => {
  const handleTodoClick = () => {
    toggleTodo(todo.id)
  }
  return (
    <ListItem>
      <Checkbox checked={todo.complete} onChange={handleTodoClick} />
      <ListItemText>{todo.name}</ListItemText>
    </ListItem>
  )
}

export default Todo
