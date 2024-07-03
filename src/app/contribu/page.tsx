'use client';
import { getPersonaByDni, updatePersonaById } from "@/config/crude";
import { Persona } from "@/config/type";
import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import Swal from "sweetalert2";

export default function Page() {
  const [form, setForm] = useState<Persona>({
    id: "",
    dni: "",
    nombre: "",
    direccion: "",
  });
  const [dni, setDni] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.id) {
        //update person
        await updatePersonaById(form.id, form)
        .then(() => {
            Swal.fire({
                title: "Persona actualizada",
                icon: "success",
            });
            setForm({
              id: "",
              dni: "",
              nombre: "",
              direccion: "",
            });
        })
         } else {
      Swal.fire({
        title: "Ojo",
        text: "No se pudo encontrar la persona ",
        icon: "warning",
      });
    }
    };
  //search a person by dni
  const findPerson = async () => {
    const persona = await getPersonaByDni(dni);
    if (persona) {
      setForm(persona);
    } else {
      setForm({
        id: "",
        dni: "",
        nombre: "",
        direccion: "",
      });
      Swal.fire({
        title:"No Se Encontro",
        text:"La Persona No Existe",
        icon:"info"

      })
    }
  }

  return (
    <main className=" w-full h-auto flex flex-col justify-start items-center ">
      <div className="w-full h-fit xy-auto pt-10">
        <h1 className="font-semibold text-center text-5xl text-white uppercase">
          Administrar Contribuyentes
        </h1>
      </div>
      <div className="flex flex-row gap-3 my-8">
        <Input name="dni" value={dni} onChange={(e) => setDni(e.target.value)} placeholder="DNI" />
        <Button color="danger" variant="solid" onClick={findPerson}>Buscar</Button>
      </div>
      
       {form.id && ( 
        <div className="flex flex-col my-7 gap-3">
            <h2 className="text-center text-white font-medium uppercase text-xl">Contribuyente Encontrado</h2>
         <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
         <Input name="dni" label="DNI" value={form.dni} onChange={handleChange} placeholder="DNI" />
         <Input name="nombre" label="Nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" />
         <Input name="direccion" label="Direccion" value={form.direccion} onChange={handleChange} placeholder="Direccion" />
         <Button type="submit" color="success" variant="solid">Guardar</Button>
     </form>
     </div>
       )}
      
    </main>
  );
}
