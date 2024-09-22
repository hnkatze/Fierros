"use client";
import UpdateFierro from "@/components/UpdateFierro";
import {
  getFierrosByDniPersona,
  getPersonaByDni,
  updatePersonaById,
} from "@/config/crude";
import { FierroArr, Persona } from "@/config/type";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { useState } from "react";
import Swal from "sweetalert2";

export default function Page() {
  const [fierrosData, setFierrosData] = useState<FierroArr[]>([]);
  const [fierroData, setFierroData] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFierroId, setSelectedFierroId] = useState<string>("");
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
      await updatePersonaById(form.id, form).then(() => {
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
      });
    } else {
      Swal.fire({
        title: "Ojo",
        text: "No se pudo encontrar la persona ",
        icon: "warning",
      });
    }
  };

  const findPerson = async () => {
    const persona = await getPersonaByDni(dni);

    if (persona) {
      const fierros = await getFierrosByDniPersona(persona.dni);
      setForm(persona);
      setFierrosData(fierros);
    } else {
      setForm({
        id: "",
        dni: "",
        nombre: "",
        direccion: "",
      });
      Swal.fire({
        title: "No Se Encontro",
        text: "La Persona No Existe",
        icon: "info",
      });
    }
  };
  const openModal = (id: string, data: any) => {
    setSelectedFierroId(id);
    setFierroData(data);
    setIsModalOpen(true);
  };

  const closeModal = async () => {
    setIsModalOpen(false);
    const fierros = await getFierrosByDniPersona(dni);
    setFierrosData(fierros);
  };
  return (
    <main className=' w-full h-auto flex flex-col justify-start items-center '>
      <div className='w-full h-fit xy-auto pt-10'>
        <h1 className='font-semibold text-center text-5xl text-white uppercase'>
          Administrar Contribuyentes
        </h1>
      </div>
      <div className='flex flex-row gap-3 my-8'>
        <Input
          name='dni'
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          placeholder='DNI'
        />
        <Button color='danger' variant='solid' onClick={findPerson}>
          Buscar
        </Button>
      </div>

      {form.id && (
        <div className='flex flex-col my-7 gap-3'>
          <h2 className='text-center text-white font-medium uppercase text-xl'>
            Contribuyente Encontrado
          </h2>
          <form onSubmit={handleSubmit} className='flex flex-col gap-3 w-80'>
            <Input
              name='dni'
              label='DNI'
              value={form.dni}
              onChange={handleChange}
              placeholder='DNI'
            />
            <Input
              name='nombre'
              label='Nombre'
              value={form.nombre}
              onChange={handleChange}
              placeholder='Nombre'
            />
            <Input
              name='direccion'
              label='Direccion'
              value={form.direccion}
              onChange={handleChange}
              placeholder='Direccion'
            />

            <Button type='submit' color='success' variant='solid'>
              Guardar
            </Button>
          </form>
        </div>
      )}
      {fierrosData.length > 0 && (
        <div className='flex flex-col gap-3 w-[600px]'>
          <h2 className='text-center text-white font-medium uppercase text-xl'>
            Fierros Registrados
          </h2>
          <table className='w-full'>
            <thead>
              <tr className='text-white'>
                <th>Matricula</th>
                <th>Folio</th>
                <th>Fecha</th>
                <th>Comentario</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {fierrosData.map((fierro) => (
                <tr key={fierro.id} className='text-white '>
                  <td className='text-center font-semibold '>
                    {fierro.matricula}
                  </td>
                  <td className='text-center font-semibold '>{fierro.folio}</td>
                  <td className='text-center font-semibold '>{fierro.fecha}</td>
                  <td className='text-center font-semibold w-[180px]'>
                    {fierro.comentario}
                  </td>
                  <td className='text-center font-semibold '>
                    <Button
                      color='warning'
                      variant='solid'
                      onClick={() => openModal(fierro.id, fierro)}>
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        size='sm'
        backdrop='blur'
        onClose={closeModal}
        className='h-[500px] w-full flex flex-col justify-center items-center bg-gradient-to-r from-neutral-300 to-stone-400'>
        <ModalContent>
          <ModalHeader className='text-2xl border-b border-slate-400 w-full'>
            Editar Fierro Matricula: {fierroData.matricula}
          </ModalHeader>
          <ModalBody className='pt-10 w-10/12'>
            <UpdateFierro
              isOpen={isModalOpen}
              changeModal={closeModal}
              id={selectedFierroId}
              data={fierroData}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </main>
  );
}
