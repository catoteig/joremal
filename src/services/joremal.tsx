import { addDoc, collection, deleteDoc, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { getDb } from './db.tsx'
import { TodoItem } from '../Home.tsx'

const collectionName = 'joremal'

export const fbGetAllFolders = async (): Promise<string[]> => {
  const collectionRef = collection(getDb(), collectionName)
  const docRefs = await getDocs(collectionRef)

  const uniqueFolders = new Set<string>()
  docRefs.forEach((todo) => {
    const { folder } = todo.data() as TodoItem
    uniqueFolders.add(folder)
  })
  return [...uniqueFolders].sort((a, b) => a.localeCompare(b))
}

export const fbGetAll = async (folder?: string): Promise<TodoItem[]> => {
  const q = folder
    ? query(collection(getDb(), collectionName), where('folder', '==', folder))
    : query(collection(getDb(), collectionName))

  const doc_refs = await getDocs(q)

  const res: TodoItem[] = []
  doc_refs.forEach((todo) => res.push({ ...(todo.data() as TodoItem), id: todo.id }))

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

export const fbCreate = async (data: TodoItem | TodoItem[]) => {
  const items: TodoItem[] = Array.isArray(data) ? data : [data]
  for (const item of items) {
    item.list = [...new Set(item.list)] // Remove duplicates
    await addDoc(collection(getDb(), collectionName), item)
  }
}

export const fbUpdate = async (data: TodoItem | TodoItem[]) => {
  const items: TodoItem[] = Array.isArray(data) ? data : [data]
  for (const item of items) {
    // @ts-expect-error 'Updated' datatype
    item.updated = new Date()
    await setDoc(doc(getDb(), collectionName, item.id), item)
  }
}

export const fbDelete = async (data: TodoItem | TodoItem[]) => {
  const items: TodoItem[] = Array.isArray(data) ? data : [data]
  for (const item of items) {
    await deleteDoc(doc(getDb(), collectionName, item.id))
  }
}
