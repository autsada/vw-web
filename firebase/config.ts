import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyANsEH-QTt7MiDWKI9uOuP4SSk6LXJaYR0",
  authDomain: "vewwit.firebaseapp.com",
  projectId: "vewwit",
  storageBucket: "vewwit.appspot.com",
  messagingSenderId: "809386902428",
  appId: "1:809386902428:web:7cd98edd7afb9ea6f67e59",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const firebaseAuth = getAuth(app)
firebaseAuth.useDeviceLanguage()
export const storage = getStorage(app)
export const db = getFirestore(app)

export const profilesFolder = "profiles"
export const publishesFolder = "publishes"
export const updatesCollection = "updates"
export const notificationsCollection = "notifications"
