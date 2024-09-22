"use client";
import { updateFierroById } from "@/config/crude";
import { FierroArr } from "@/config/type";
import { Button, Input, Modal } from "@nextui-org/react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

interface UpdateFierroProps {
  isOpen: boolean;
  changeModal: () => void;
  id: string;
  data: FierroArr;
}

export default function UpdateFierro({
  id,
  data,
  changeModal,
}: Readonly<UpdateFierroProps>) {
  const [fierro, setFierro] = useState<FierroArr>({
    id: "",
    dniPersona: "",
    urlImagen: "",
    folio: 0,
    matricula: 0,
    fecha: "",
    tags: [],
    comentario: "",
  });

  useEffect(() => {
    if (data) {
      setFierro(data);
    }
  }, [data]);

  const updatefierro = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (fierro.id) {
      await updateFierroById(id, fierro).then(() => {
        Swal.fire({
          title: "Fierro actualizado",
          icon: "success",
        });

        setFierro({
          id: "",
          dniPersona: "",
          urlImagen: "",
          folio: 0,
          matricula: 0,
          fecha: "",
          tags: [],
          comentario: "",
        });

        changeModal();
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "No se pudo encontrar el fierro ",
        icon: "warning",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFierro({
      ...fierro,
      [name]: value,
    });
  };

  return (
    <form
      onSubmit={updatefierro}
      className='flex flex-col justify-center items-center gap-3 w-full'>
      <Input
        className='w-full'
        type='number'
        label='Folio'
        value={fierro.folio.toString()}
        onChange={handleInputChange}
        name='folio'
      />
      <Input
        className='w-full'
        type='number'
        label='Matricula'
        value={fierro.matricula.toString()}
        onChange={handleInputChange}
        name='matricula'
      />

      <Input
        className='w-full'
        type='date'
        label='Fecha'
        value={fierro.fecha}
        onChange={handleInputChange}
        name='fecha'
      />
      <Input
        className='w-full'
        type='text'
        label='Descripcion'
        value={fierro.tags.toString()}
        onChange={handleInputChange}
        placeholder='alas,escudo'
        name='tags'
      />
      <Input
        className='w-full'
        type='text'
        label='Comentario'
        value={fierro.comentario}
        onChange={handleInputChange}
        placeholder='Paso a'
        name='comentario'
      />
      <Button
        color='success'
        variant='flat'
        className='text-white font-bold'
        type='submit'>
        Actualizar
      </Button>
    </form>
  );
}
