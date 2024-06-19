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
  // return [
  //   {
  //     id: '1jRA97i94Qt79xz6f392L',
  //     name: 'Todo 1',
  //     complete: false,
  //     notes: '',
  //     created: {
  //       seconds: 1718049192,
  //       nanoseconds: 571000000,
  //     },
  //     updated: {
  //       seconds: 1718536883,
  //       nanoseconds: 513000000,
  //     },
  //     list: ['John Doe', 'Jane Doe'],
  //   },    {
  //     id: '2jRA97i94Qt79xz6f392L',
  //     name: 'Todo 3',
  //     complete: false,
  //     notes: '',
  //     created: {
  //       seconds: 1718049192,
  //       nanoseconds: 571000000,
  //     },
  //     updated: {
  //       seconds: 1718536883,
  //       nanoseconds: 513000000,
  //     },
  //     list: ['John Doe', 'Jane Doe'],
  //   },    {
  //     id: '3jRA97i94Qt79xz6f392L',
  //     name: 'Todo 2',
  //     complete: false,
  //     notes: '',
  //     created: {
  //       seconds: 1718049192,
  //       nanoseconds: 571000000,
  //     },
  //     updated: {
  //       seconds: 1718536883,
  //       nanoseconds: 513000000,
  //     },
  //     list: ['John Doe', 'Jane Doe'],
  //   },
  // ]
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
