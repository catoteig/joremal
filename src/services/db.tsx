import { FirebaseApp, initializeApp } from 'firebase/app'
import { Firestore, getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
}

let firebaseDB: Firestore | null = null
let firebaseApp: FirebaseApp | null = null
const app = initializeApp(firebaseConfig)

export const getDb = () => {
  if (!firebaseDB) firebaseDB = getFirestore(app)

  performance

  return firebaseDB
}

export const getFirebaseAuth = () => {
  if (!app) firebaseApp = initializeApp(firebaseConfig)

  return firebaseApp
}
