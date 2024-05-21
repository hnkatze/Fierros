import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, db } from "./firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { Fierro, NewFierro, NewPersona, Persona } from "./type";

export async function uploadImageAndGetUrl(file: File, name:string): Promise<string> {
  const storageRef = ref(storage, `fierros/${name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);
  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      null,
      reject,
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        }).catch(reject);
      }
    );
  });
}
export async function createPersona(newPersona: NewPersona): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "personas"), newPersona);
    return (docRef.id)
  } catch (e) {
    throw new Error("Error al agregar la persona");
  }
}
export async function getPersonaByDni(dni: string): Promise<Persona | null> {
  const personasRef = collection(db, "personas");
  const q = query(personasRef, where("dni", "==", dni));
  
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    console.log("No se encontraron documentos con el DNI proporcionado.");
    return null;
  }

  const doc = querySnapshot.docs[0];
  const persona = { id: doc.id, ...doc.data() } as Persona;
  return persona;
}
export async function createFierro(newFierro: NewFierro): Promise<void> {
  try {
    const docRef = await addDoc(collection(db, "fierros"), newFierro);
    console.log("Fierro agregado con ID: ", docRef.id);
  } catch (e) {
    console.error("Error al agregar el fierro: ", e);
  }
}
export async function getFierrosByDniPersona(dniPersona: string): Promise<Fierro[]> {
  const fierrosRef = collection(db, "fierros");
  const q = query(fierrosRef, where("dniPersona", "==", dniPersona));
  
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    console.log("No se encontraron fierros para el DNI proporcionado.");
    return [];
  }

  const fierros: Fierro[] = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Fierro[];
  
  return fierros;
}