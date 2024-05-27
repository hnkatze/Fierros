import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage, db } from "./firebase";
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { Fierro, FierroArr, NewFierroArr, NewPersona, Persona, Tags } from "./type";

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
export async function createFierro(newFierro: NewFierroArr): Promise<void> {
  try {
    const docRef = await addDoc(collection(db, "fierros"), newFierro);
    console.log("Fierro agregado con ID: ", docRef.id);
  } catch (e) {
    console.error("Error al agregar el fierro: ", e);
  }
}
export async function getFierrosByDniPersona(dniPersona: string): Promise<FierroArr[]> {
  const fierrosRef = collection(db, "fierros");
  const q = query(fierrosRef, where("dniPersona", "==", dniPersona));
  
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    console.log("No se encontraron fierros para el DNI proporcionado.");
    return [];
  }

  const fierros: FierroArr[] = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as FierroArr[];
  
  return fierros;
}
export const deleteImage = async (imageUrl: string) => {
  try {
    // Crear una referencia a la imagen que deseas eliminar
    const imageRef = ref(storage, imageUrl);

    // Borrar la imagen
    await deleteObject(imageRef);

    console.log('Imagen borrada exitosamente');
  } catch (error) {
    console.error('Error al borrar la imagen:', error);
  }
};
export async function deleteFierroById(fierroId: string): Promise<void> {
  try {
    const docRef = doc(db, "fierros", fierroId);
    await deleteDoc(docRef);
    console.log("Fierro eliminado con ID: ", fierroId);
  } catch (e) {
    console.error("Error al eliminar el fierro: ", e);
  }
}
// export async function getFierrosByTags(tags: Tags[]): Promise<Fierro[]> {
//   if (tags.length === 0) {
//     console.log("No se proporcionaron tags para buscar.");
//     return [];
//   }

//   const fierrosRef = collection(db, "fierros");

//   // Inicia la consulta con el primer tag
//   let q = query(fierrosRef, where("tags.tag", "array-contains", tags[0]));

//   const querySnapshot = await getDocs(q);

//   if (querySnapshot.empty) {
//     console.log("No se encontraron fierros para el primer tag proporcionado.");
//     return [];
//   }

//   // Filtra los documentos que contienen todos los tags
//   const fierros: Fierro[] = querySnapshot.docs.map(doc => ({
//     id: doc.id,
//     ...doc.data()
//   })) as Fierro[];

//   const filteredFierros = fierros.filter(fierro => 
//     tags.every(tag => fierro.tags.some(t => t.tag === tag))
//   );

//   return filteredFierros;
// }
export async function getFierrosByTags(tags: Tags[]): Promise<Fierro[]> {
  if (tags.length === 0) {
    console.log("No se proporcionaron tags para buscar.");
    return [];
  }

  const fierrosRef = collection(db, "fierros");
  let fierros: Fierro[] = [];

  // Realiza una consulta para cada tag
  for (const tag of tags) {
    const q = query(fierrosRef, where("tags.tag", "array-contains", tag));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log(`No se encontraron fierros para el tag ${tag}.`);
      continue;
    }

    // Agrega los documentos a la lista de fierros
    const fierrosForTag: Fierro[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Fierro[];

    // Si es la primera consulta, inicializa la lista de fierros
    if (fierros.length === 0) {
      fierros = fierrosForTag;
    } else {
      // Intersecta la lista de fierros con los resultados de la consulta actual
      fierros = fierros.filter(fierro => 
        fierrosForTag.some(f => f.id === fierro.id)
      );
    }
  }

  return fierros;
}
export async function getFierrosByKeyword(keyword: string): Promise<Fierro[]> {
  if (!keyword) {
    console.log("No se proporcionó una palabra clave para buscar.");
    return [];
  }

  const fierrosRef = collection(db, "fierros");
  const q = query(fierrosRef, where("tags", "array-contains", keyword));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    console.log(`No se encontraron fierros para la palabra clave ${keyword}.`);
    return [];
  }

  const fierros: Fierro[] = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Fierro[];

  return fierros;
}
export async function convertTagsToStringArray() {
  const fierrosRef = collection(db, "fierros");
  const querySnapshot = await getDocs(fierrosRef);

  for (const docSnapshot of querySnapshot.docs) {
    const fierroData = docSnapshot.data() as Fierro;

    if (Array.isArray(fierroData.tags) && fierroData.tags.length > 0 && typeof (fierroData.tags[0] as Tags).tag === 'string') {
      // Convertir los tags a un arreglo de strings en minúsculas
      const tagsArray = (fierroData.tags as Tags[]).map((tag: Tags) => tag.tag.toLowerCase());

      // Actualizar el documento
      const fierroDocRef = doc(db, "fierros", docSnapshot.id);
      await updateDoc(fierroDocRef, { tags: tagsArray });

      console.log(`Documento ${docSnapshot.id} actualizado con nuevos tags en minúsculas: `, tagsArray);
    }
  }
}