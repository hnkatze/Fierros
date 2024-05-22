'use client'
import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import ImageSlider from "@/components/ImageSlider";
import { getFierrosByDniPersona, getPersonaByDni } from "@/config/crude";
import Swal from "sweetalert2";
import { Fierro, Persona } from "@/config/type";

const Find: React.FC = () => {
  const [dni, setDni] = useState<string>("");
  const [fierrosData, setFierrosData] = useState<{ url: string; fecha: string; folio: number; }[]>([]);
  const [per, setPer] = useState<Persona | null>(null);

  const handleFierro = async () => {
    try {
      const pero = await getPersonaByDni(dni);
      const fierros = await getFierrosByDniPersona(dni);
      console.log('fierros:', fierros);

      if (!fierros || fierros.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'DNI no encontrado',
          text: 'No se encontraron fierros para el DNI proporcionado.',
        });
        return;
      }

      const data = fierros.map(fierro => ({
        url: fierro.urlImagen,
        fecha: fierro.fecha,
        folio: fierro.folio
      }));
      setPer(pero)
      setFierrosData(data);

    } catch (error) {
      console.error('Error fetching fierros:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al obtener los fierros. Por favor, inténtalo de nuevo.',
      });
    }
  };




  return (
    <>
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <div className="w-72 flex h-10">
          <Input
            type="string"
            isDisabled={false}
            label="DNI"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            placeholder="0210199"
          />
          <Button
            color="secondary"
            variant="flat"
            className="text-white font-bold"
            onClick={handleFierro}
          >
            Buscar
          </Button>
        </div>
        <div className=" flex flex-row gap-8">
       <div className="text-white font-semibold flex flex-col pt-4">
       <span className="text-3xl">{per?.nombre}</span>
        <span className="text-2xl">{per?.dni}</span>
        <span className="text-xl">{per?.direccion}</span>
       </div>
        <div className=" w-72 pt-6  ">
        <ImageSlider data={fierrosData} />
        </div>
        </div>
      </div>
    </>
  );
};

export default Find;
