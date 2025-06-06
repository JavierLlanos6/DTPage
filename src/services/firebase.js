import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAkk7tpsJm9Y4Y2VhPYigyDJ6XqYIDUGyI",
  authDomain: "footballcoachapp-a4e28.firebaseapp.com",
  projectId: "footballcoachapp-a4e28",
  storageBucket: "footballcoachapp-a4e28.firebasestorage.app",
  messagingSenderId: "726916248095",
  appId: "1:726916248095:web:eca482896d0574b4435b2a",
  measurementId: "G-ZQSL60CP13",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export async function addPlayer(data) {
  await addDoc(collection(db, "players"), {
    name: data.name,
    height: data.height,
    weight: data.weight,
    foot: data.foot,
    position: data.position, // array
    playerType: data.playerType, // nuevo campo
    photo: data.photo,
  });
}

export async function getPlayers() {
  const snapshot = await getDocs(collection(db, "players"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
export { db };
