"use client";
import { useState } from "react";
import { Button, Input, Radio, RadioGroup } from "@nextui-org/react";
import { compressImage, parseTags } from "@/config/Util";
import Swal from "sweetalert2";
import { NewFierro, NewPersona } from "@/config/type";
import { createFierro, createPersona, getPersonaByDni, uploadImageAndGetUrl } from "@/config/crude";

export default function New() {
  const [dni, setDni] = useState<string>("");
  const [nombre, setNombre] = useState<string>("");
  const [folio, setFolio] = useState<number>(0);
  const [matri, setMatri] = useState<number>(0);
  const [direc, setDirec] = useState<string>("");
  const [fecha, setFecha] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [fot, setFot] = useState<File | null>(null);
  const [selected, setSelected] = useState<string>("1");
  const [disable, setDisable] = useState<boolean>(selected === "1");
  const [formDisable, setFormDisable] = useState<boolean>(true);
  const [dniPersona, setDniPersona] = useState<string>("");
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFot(file);
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const compressedFile = await compressImage(file);
          setFot(compressedFile);
        } catch (error) {
          console.error("Error comprimiendo la imagen:", error);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const handleFierro = async () => {
    try {
      if (!fot) {
        Swal.fire({
          title: "Opps!",
          text: "Debe seleccionar una imagen",
          icon: "error",
        });
        return;
      }
  
      const compressedImage = await compressImage(fot);
  
      const imageUrl = await uploadImageAndGetUrl(compressedImage,fecha);
  
      const parsedTags = parseTags(tags);
  
      const fierro: NewFierro = {
        folio: folio,
        matricula: matri,
        fecha: fecha,
        tags: parsedTags,
        dniPersona: dniPersona,
        urlImagen: imageUrl,
      };
  
      await createFierro(fierro);

      Swal.fire({
        title: "Éxito",
        text: "Los datos han sido guardados correctamente",
        icon: "success",
      });
  
      setDni("");
      setNombre("");
      setFolio(0);
      setMatri(0);
      setDirec("");
      setFecha("");
      setTags("");
      setFot(null);
      setFormDisable(true);
      setDniPersona("");
    } catch (error) {
      Swal.fire({
        title: "Opps!",
        text: `Algo salió mal: ${error}`,
        icon: "error",
      });
    }
  };
 
  const handlePersona = async () => {
    try {
      if(dni === ""){
        Swal.fire({
          title: "De Que Va Esto?", 
          text: "Parece Que no Ingresaste ningun DNI",
          icon: "error",
        });  
        return
      }
      const persona: NewPersona = {
        nombre: nombre,
        dni: dni,
        direccion: direc,
      };

      const existingPersona = await getPersonaByDni(persona.dni);

      if (!disable) {
        if (existingPersona === null) {
          try {
            const result = await createPersona(persona);
            if (result !== "") {
              setFormDisable(false);
              setDniPersona(persona.dni);
            }
          } catch (createError) {
            Swal.fire({
              title: "Opps!",
              text: `Algo salió mal al crear la persona: ${createError}`,
              icon: "error",
            });
          }
        } else {
          Swal.fire({
            title: "Opps!",
            text: "La Persona ya está registrada",
            icon: "error",
          });
        }
      } else {
        if (existingPersona !== null) {
          setFormDisable(false);
          setDniPersona(existingPersona.dni);
          setNombre(existingPersona.nombre);
          setDirec(existingPersona.direccion);
          setDni(existingPersona.dni);
        } else {
          Swal.fire({
            title: "Opps!",
            text: "No se encontró la persona",
            icon: "error",
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Opps!",
        text: `Algo salió mal: ${error}`,
        icon: "error",
      });
    }
  };

  const handleRadioChange = (value: string) => {
    setSelected(value);
    setDisable(value === "1");
  };
  return (
    <main className="flex flex-col justify-center items-center w-full h-5/6">
      <div className="w-full h-10 flex justify-center items-center">
        <div className="w-52"></div>
        <div className="flex justify-center w-2/4"> </div>
        <div className=" w-2/4"></div>
      </div>
      <div className="w-full flex flex-row justify-center items-start ">
        <div className="w-1/4 flex flex-col justify-center items-center">
          <RadioGroup
            value={selected}
            onValueChange={handleRadioChange}
            orientation="horizontal"
          >
            <Radio value={"1"}>
              <span className="font-bold text-white">Existente</span>
            </Radio>
            <Radio value={"2"}>
              <span className="font-bold text-white">Nuevo</span>
            </Radio>
          </RadioGroup>
          <form
            action="submit"
            className="flex flex-col justify-end items-center w-72 gap-3"
          >
            <span className="uppercase text-center font-bold text-white underline w-2/4">
              Contribuyente
            </span>
            <Input
            isRequired
              type="text"
              label="DNI"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              placeholder="0210"
            />
            <Input
              type="text"
              isDisabled={disable}
              label="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Juana de Arcos"
            />
            <Input
              type="text"
              label="Direccion"
              isDisabled={disable}
              value={direc}
              onChange={(e) => setDirec(e.target.value)}
              placeholder="El 5"
            />
            <Button
              color="secondary"
              href="/"
              variant="flat"
              className="text-white font-bold"
              onClick={() => handlePersona()}
            >
              {disable ? "Cargar" : "Agregar"}
            </Button>
          </form>
        </div>
        <div className="w-1/4">
          <form
            action="submit"
            className="flex flex-col justify-center items-center gap-3 w-72"
          >
            <span className="uppercase text-center font-bold text-white underline">
              Datos De La Marca
            </span>
            <span className="uppercase text-center font-bold text-white ">
              DNI:{dniPersona}
            </span>
            <Input
              isDisabled={formDisable}
              type="number"
              label="Folio"
              value={folio.toString()}
              onChange={(e) => setFolio(parseInt(e.target.value))}
            />
            <Input
              isDisabled={formDisable}
              type="number"
              label="Matricula"
              value={matri.toString()}
              onChange={(e) => setMatri(parseInt(e.target.value))}
            />

            <Input
              isDisabled={formDisable}
              type="date"
              label="Fecha"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
            <Input
              isDisabled={formDisable}
              type="text"
              label="Descripcion"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="alas,escudo"
            />
            <input
              disabled={formDisable}
              type="file"
              accept="image/*"
              className="w-72"
              onChange={handleFileChange}
            />
            <Button
              isDisabled={formDisable}
              color="secondary"
              href="/"
              variant="flat"
              className="text-white font-bold"
              onClick={() => handleFierro()}
            >
              Agregar
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
