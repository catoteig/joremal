import { initializeApp } from 'firebase/app'
import { Firestore, getFirestore } from 'firebase/firestore'

let db: Firestore | null = null

export const getDb = () => {
  if (!db) {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_API_KEY,
      authDomain: import.meta.env.VITE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_APP_ID,
    }

    const app = initializeApp(firebaseConfig)

    db = getFirestore(app)
  }
  performance
  return db
}
