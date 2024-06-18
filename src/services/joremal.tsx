import { addDoc, collection, deleteDoc, doc, getDocs, query, setDoc } from 'firebase/firestore'
import { getDb } from './db.tsx'
import { TodoItem } from '../Home.tsx'

export const collectionName = 'joremal'

export const fbGetAll = async (): Promise<TodoItem[]> => {
  const q = query(collection(getDb(), collectionName))
  const doc_refs = await getDocs(q)

  const res: TodoItem[] = []

  doc_refs.forEach((todo) => {
    const { name, complete, notes, created, updated, list } = todo.data() as TodoItem
    res.push({
      id: todo.id,
      name: name,
      complete: complete,
      notes: notes,
      created: created,
      updated: updated,
      list: list,
    })
  })
  return res
}

export const fbCreate = async (args: TodoItem | TodoItem[]) => {
  const items: TodoItem[] = Array.isArray(args) ? args : [args]
  for (const item of items) {
    item.list = [...new Set(item.list)] // Remove duplicates
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
