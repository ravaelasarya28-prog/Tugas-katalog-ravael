import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyByfb9jBUArc6EJEqchkxY5IDAHs4Ity24",
  authDomain: "katalog-buku-2ddfb.firebaseapp.com",
  projectId: "katalog-buku-2ddfb",
  storageBucket: "katalog-buku-2ddfb.firebasestorage.app",
  messagingSenderId: "161602581907",
  appId: "1:161602581907:web:9e64ea4f02884c130e6466",
  measurementId: "G-M25FS3B0LC"
};


const app = initializeApp(firebaseConfig);


const auth = getAuth(app);
const db = getFirestore(app);

//Google
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
