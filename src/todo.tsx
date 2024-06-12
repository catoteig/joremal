import { TodoItem } from './Home.tsx'
import { Checkbox, ListItem, ListItemText } from '@mui/material'

export interface TodoProps {
  todo: TodoItem
  toggleTodo: (id: string) => void
}

const Todo = (props: TodoProps) => {
  const { todo, toggleTodo } = props

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
