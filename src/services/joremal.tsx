import { addDoc, collection, deleteDoc, doc, getDocs, setDoc, query, orderBy } from 'firebase/firestore'
import { getDb } from './db.tsx'
import { TodoItem } from '../App.tsx'

export const collectionName = 'joremal'

export const fbGetAll = async (orderAsc: boolean): Promise<TodoItem[]> => {
  const q = query(collection(getDb(), collectionName), orderBy('name', orderAsc ? 'asc' : 'desc'))
  const doc_refs = await getDocs(q)

  const res: TodoItem[] = []

  doc_refs.forEach((todo) => {
    const { name, complete, notes, created, updated } = todo.data() as TodoItem
    res.push({ id: todo.id, name: name, complete: complete, notes: notes, created: created, updated: updated })
  })

  return res
}

export const fbCreate = async (args: TodoItem | TodoItem[]) => {
  const items: TodoItem[] = Array.isArray(args) ? args : [args]
  for (const item of items) {
    await addDoc(collection(getDb(), collectionName), item)
  }
}

export const fbUpdate = async (args: TodoItem | TodoItem[]) => {
  const items: TodoItem[] = Array.isArray(args) ? args : [args]
  for (const item of items) {
    // @ts-expect-error 'Updated' datatype
    item.updated = new Date()
    await setDoc(doc(getDb(), collectionName, item.id), item)
  }
}

export const fbDelete = async (args: TodoItem | TodoItem[]) => {
  const items: TodoItem[] = Array.isArray(args) ? args : [args]
  for (const item of items) {
    await deleteDoc(doc(getDb(), collectionName, item.id))
  }
}
