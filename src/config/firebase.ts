import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

// Define la interfaz para la configuración de Firebase
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Configuración de Firebase usando variables de entorno para mayor seguridad
const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.API_KEY ?? "defaultValue",
  authDomain: process.env.AUTH_DOMAIN ?? "galletas",
  projectId: "justice-muni",
  storageBucket: "justice-muni.appspot.com",
  messagingSenderId: "652379146314",
  appId: process.env.APPID ?? "Galletas"
};

// Inicializa Firebase App
const app: FirebaseApp = initializeApp(firebaseConfig);

// Inicializa Firestore
export const db: Firestore = getFirestore(app);
export const storage = getStorage(app);