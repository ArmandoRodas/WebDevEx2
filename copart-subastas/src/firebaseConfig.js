import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD-hK7SC13zNKMZ1VONGounmvXx_2pyH0Y",
  authDomain: "copartsubastas-dba28.firebaseapp.com",
  databaseURL: "https://copartsubastas-dba28-default-rtdb.firebaseio.com",
  projectId: "copartsubastas-dba28",
  storageBucket: "copartsubastas-dba28.firebasestorage.app",
  messagingSenderId: "152758820266",
  appId: "1:152758820266:web:cf6e4ccd630a38233bdfd3"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios listos para usar en la app
export const auth = getAuth(app);
export const db = getDatabase(app);