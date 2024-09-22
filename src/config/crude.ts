import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage, db } from "./firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  Fierro,
  FierroArr,
  NewFierroArr,
  NewPersona,
  Persona,
  Tags,
} from "./type";

export async function uploadImageAndGetUrl(
  file: File,
  name: string
): Promise<string> {
  const storageRef = ref(storage, `fierros/${name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);
  return new Promise((resolve, reject) => {
    uploadTask.on("state_changed", null, reject, () => {
      getDownloadURL(uploadTask.snapshot.ref)
        .then((downloadURL) => {
          resolve(downloadURL);
        })
        .catch(reject);
    });
  });
}
export async function createPersona(newPersona: NewPersona): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "personas"), newPersona);
    return docRef.id;
  } catch (e) {
    throw new Error("Error al agregar la persona");
  }
}
export async function getPersonaByDni(dni: string): Promise<Persona | null> {
  const personasRef = collection(db, "personas");
  const q = query(personasRef, where("dni", "==", dni));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const doc = querySnapshot.docs[0];
  const persona = { id: doc.id, ...doc.data() } as Persona;
  return persona;
}
export async function updatePersonaById(
  personaId: string,
  updatedPersona: NewPersona
): Promise<void> {
  try {
    const docRef = doc(db, "personas", personaId);
    await updateDoc(docRef, updatedPersona);
  } catch (e) {
    throw new Error("Error al actualizar la persona");
  }
}
export async function createFierro(newFierro: NewFierroArr): Promise<void> {
  try {
    await addDoc(collection(db, "fierros"), newFierro);
  } catch (e) {
    throw new Error("Error al agregar el fierro");
  }
}
export async function getFierrosByDniPersona(
  dniPersona: string
): Promise<FierroArr[]> {
  const fierrosRef = collection(db, "fierros");
  const q = query(fierrosRef, where("dniPersona", "==", dniPersona));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return [];
  }

  const fierros: FierroArr[] = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as FierroArr[];

  return fierros;
}
export const deleteImage = async (imageUrl: string) => {
  try {
    // Crear una referencia a la imagen que deseas eliminar
    const imageRef = ref(storage, imageUrl);

    // Borrar la imagen
    await deleteObject(imageRef);
  } catch (error) {
    throw new Error("Error al eliminar la imagen");
  }
};
export async function deleteFierroById(fierroId: string): Promise<void> {
  try {
    const docRef = doc(db, "fierros", fierroId);
    await deleteDoc(docRef);
  } catch (e) {
    throw new Error("Error al eliminar el fierro" + e);
  }
}
export async function updateFierroById(
  fierroId: string,
  updatedFierro: NewFierroArr
): Promise<void> {
  try {
    const docRef = doc(db, "fierros", fierroId);
    await updateDoc(docRef, updatedFierro);
  } catch (e) {
    throw new Error("Error al actualizar el fierro" + e);
  }
}

export async function getFierrosByTags(tags: Tags[]): Promise<Fierro[]> {
  if (tags.length === 0) {
    return [];
  }

  const fierrosRef = collection(db, "fierros");
  let fierros: Fierro[] = [];

  // Realiza una consulta para cada tag
  for (const tag of tags) {
    const q = query(fierrosRef, where("tags.tag", "array-contains", tag));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      continue;
    }

    // Agrega los documentos a la lista de fierros
    const fierrosForTag: Fierro[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Fierro[];

    // Si es la primera consulta, inicializa la lista de fierros
    if (fierros.length === 0) {
      fierros = fierrosForTag;
    } else {
      // Intersecta la lista de fierros con los resultados de la consulta actual
      fierros = fierros.filter((fierro) =>
        fierrosForTag.some((f) => f.id === fierro.id)
      );
    }
  }

  return fierros;
}
export async function getFierrosByKeyword(keyword: string): Promise<Fierro[]> {
  if (!keyword) {
    return [];
  }

  const fierrosRef = collection(db, "fierros");
  const q = query(fierrosRef, where("tags", "array-contains", keyword));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return [];
  }

  const fierros: Fierro[] = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Fierro[];

  return fierros;
}

export async function checkUserExists(
  userName: string,
  password: string
): Promise<boolean> {
  const usersRef = collection(db, "usuarios");
  const q = query(
    usersRef,
    where("userName", "==", userName),
    where("password", "==", password)
  );
  const querySnapshot = await getDocs(q);

  return !querySnapshot.empty;
}
