"use client";
import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import ImageSlider from "@/components/ImageSlider";
import { getFierrosByDniPersona, getPersonaByDni } from "@/config/crude";
import Swal from "sweetalert2";
import { DniState, Persona } from "@/config/type";

const Find: React.FC = () => {
  const [dni, setDni] = useState<DniState>({ dni: "" });
  const [fierrosData, setFierrosData] = useState<
    {
      url: string;
      fecha: string;
      folio: number;
      id: string;
      comentario: string;
    }[]
  >([]);
  const [per, setPer] = useState<Persona | null>(null);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setDni({ dni: value });
  };
  const handleFierro = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const pero = await getPersonaByDni(dni.dni);
      const fierros = await getFierrosByDniPersona(dni.dni);

      if (!fierros || fierros.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "DNI no encontrado",
          text: "No se encontraron fierros para el DNI proporcionado.",
        });
        return;
      }

      const data = fierros.map((fierro) => ({
        url: fierro.urlImagen,
        fecha: fierro.fecha,
        folio: fierro.folio,
        id: fierro.id,
        comentario: fierro.comentario,
      }));
      setPer(pero);
      setFierrosData(data);
    } catch (error) {
      console.error("Error fetching fierros:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al obtener los fierros. Por favor, inténtalo de nuevo.",
      });
    }
  };

  return (
    <>
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <form onSubmit={handleFierro}>
          <div className="w-72 flex h-10">
            <Input
              type="string"
              isDisabled={false}
              label="DNI"
              name="dni"
              value={dni.dni}
              onChange={handleInputChange}
              placeholder="0210199"
            />
            <Button
              color="secondary"
              variant="flat"
              className="text-white font-bold"
              type="submit"
            >
              Buscar
            </Button>
          </div>
        </form>
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
