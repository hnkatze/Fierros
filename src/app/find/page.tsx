'use client'
import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import ImageSlider from "@/components/ImageSlider";
import { getFierrosByDniPersona } from "@/config/crude";
import Swal from "sweetalert2";
import { Fierro } from "@/config/type";

const Find: React.FC = () => {
  const [dni, setDni] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);

  const handleFierro = async () => {
    try {
      const fierros: Fierro[] = await getFierrosByDniPersona(dni);
      if (!fierros || fierros.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'DNI no encontrado',
          text: 'No se encontraron fierros para el DNI proporcionado.',
        });
        return;
      }
      const imageUrls = fierros.map(fierro => fierro.urlImagen);
      setImages(imageUrls);

    } catch (error) {
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
        <div className=" w-72 pt-6  ">
        <ImageSlider images={images} />
        </div>
        
      </div>
    </>
  );
};

export default Find;
