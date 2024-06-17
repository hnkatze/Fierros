"use client";
import { useState } from "react";
import { Button, Input, Radio, RadioGroup } from "@nextui-org/react";
import {
  compressImage,
  convertStringToTagsArray,
  delayedReload,
} from "@/config/Util";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import {
  CustomFormData,
  CustomPerson,
  NewFierroArr,
  NewPersona,
} from "@/config/type";
import {
  createFierro,
  createPersona,
  getPersonaByDni,
  uploadImageAndGetUrl,
} from "@/config/crude";

export default function New() {
  const [formValue, setFormValue] = useState<CustomFormData>({
    dni: "",
    folio: 0,
    matricula: 0,
    fecha: "",
    comentario: "",
    tags: "",
    fot: null,
  });
  const [FormPersona, setFormPersona] = useState<CustomPerson>({
    dni: "",
    nombre: "",
    direccion: "",
  });
  const [selected, setSelected] = useState<string>("1");
  const [disable, setDisable] = useState<boolean>(selected === "1");
  const [formDisable, setFormDisable] = useState<boolean>(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue((prevFormValue) => ({
      ...prevFormValue,
      [name]: value,
    }));
  };
  const handleInputChangePersona = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormPersona((prevFormValue) => ({
      ...prevFormValue,
      [name]: value,
    }));
  };
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormValue((prevFormValue) => ({
        ...prevFormValue,
        fot: file,
      }));
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const compressedFile = await compressImage(file);
          setFormValue((prevFormValue) => ({
            ...prevFormValue,
            fot: compressedFile,
          }));
        } catch (error) {
          console.error("Error comprimiendo la imagen:", error);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const handleFierro = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (!formValue.fot) {
        Swal.fire({
          title: "Opps!",
          text: "Debe seleccionar una imagen",
          icon: "error",
        });
        return;
      }

      const compressedImage = await compressImage(formValue.fot);
      const uniqueFileName = `${uuidv4()}-${formValue.fot?.name}`;
      const imageUrl = await uploadImageAndGetUrl(
        compressedImage,
        uniqueFileName
      );

      const parsedTags = convertStringToTagsArray(formValue.tags.toLowerCase());

      const fierro: NewFierroArr = {
        folio: formValue.folio,
        matricula: formValue.matricula,
        fecha: formValue.fecha,
        tags: parsedTags,
        dniPersona: formValue.dni,
        urlImagen: imageUrl,
        comentario: formValue.comentario,
      };

      await createFierro(fierro).then(() => {
        Swal.fire({
          title: "Éxito",
          text: "Los datos han sido guardados correctamente",
          icon: "success",
        });
        delayedReload().then(() => {
          window.location.reload();
        });
      });
    } catch (error) {
      Swal.fire({
        title: "Opps!",
        text: `Algo salió mal: ${error}`,
        icon: "error",
      });
    }
  };
  const handlePersona = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (FormPersona.dni === "") {
        console.log("persona", FormPersona);
        Swal.fire({
          title: "De Que Va Esto?",
          text: "Parece Que no Ingresaste ningun DNI",
          icon: "error",
        });
        return;
      }
      const persona: NewPersona = {
        nombre: FormPersona.nombre,
        dni: FormPersona.dni,
        direccion: FormPersona.direccion,
      };

      const existingPersona = await getPersonaByDni(persona.dni);

      if (!disable) {
        if (existingPersona === null) {
          try {
            const result = await createPersona(persona);
            if (result !== "") {
              setFormDisable(false);
              setFormValue((prevFormValue) => ({
                ...prevFormValue,
                dni: persona.dni,
              }));
              setDisable(true);
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
          setFormValue((prevFormValue) => ({
            ...prevFormValue,
            dni: persona.dni,
          }));
          setFormPersona({
            dni: existingPersona.dni,
            nombre: existingPersona.nombre,
            direccion: existingPersona.direccion,
          });
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
            name="radioGroup"
          >
            <Radio value={"1"}>
              <span className="font-bold text-white">Existente</span>
            </Radio>
            <Radio value={"2"}>
              <span className="font-bold text-white">Nuevo</span>
            </Radio>
          </RadioGroup>
          <form
            onSubmit={handlePersona}
            className="flex flex-col justify-end items-center w-72 gap-3"
          >
            <span className="uppercase text-center font-bold text-white underline w-2/4">
              Contribuyente
            </span>
            <Input
              isRequired
              type="text"
              label="DNI"
              value={FormPersona.dni}
              onChange={handleInputChangePersona}
              placeholder="0210"
              name="dni"
            />
            <Input
              type="text"
              isDisabled={disable}
              label="Nombre"
              value={FormPersona.nombre}
              onChange={handleInputChangePersona}
              placeholder="Juana de Arcos"
              name="nombre"
            />
            <Input
              type="text"
              label="Direccion"
              isDisabled={disable}
              value={FormPersona.direccion}
              onChange={handleInputChangePersona}
              placeholder="El 5"
              name="direccion"
            />
            <Button
              color="secondary"
              href="/"
              type="submit"
              variant="flat"
              className="text-white font-bold"
            >
              {disable ? "Cargar" : "Agregar"}
            </Button>
          </form>
        </div>
        <div className="w-1/4">
          <form
            onSubmit={handleFierro}
            className="flex flex-col justify-center items-center gap-3 w-72"
          >
            <span className="uppercase text-center font-bold text-white underline">
              Datos De La Marca
            </span>
            <Input
              className="hidden"
              isDisabled={disable}
              type="text"
              label="DNI"
              defaultValue={FormPersona.dni}
              value={FormPersona.dni}
              name="dni"
            />
            <Input
              isDisabled={formDisable}
              type="number"
              label="Folio"
              value={formValue.folio.toString()}
              onChange={handleInputChange}
              name="folio"
            />
            <Input
              isDisabled={formDisable}
              type="number"
              label="Matricula"
              value={formValue.matricula.toString()}
              onChange={handleInputChange}
              name="matricula"
            />

            <Input
              isDisabled={formDisable}
              type="date"
              label="Fecha"
              value={formValue.fecha}
              onChange={handleInputChange}
              name="fecha"
            />
            <Input
              isDisabled={formDisable}
              type="text"
              label="Descripcion"
              value={formValue.tags}
              onChange={handleInputChange}
              placeholder="alas,escudo"
              name="tags"
            />
            <Input
              isDisabled={formDisable}
              type="text"
              label="Comentario"
              value={formValue.comentario}
              onChange={handleInputChange}
              placeholder="Paso a "
              name="comentario"
            />
            <input
              disabled={formDisable}
              id="fot"
              type="file"
              name="fot"
              accept="image/*"
              className="w-72"
              onChange={handleFileChange}
              nonce="fot"
              title="Selecciona una imagen"
            />
            <Button
              isDisabled={formDisable}
              color="secondary"
              href="/"
              variant="flat"
              className="text-white font-bold"
              type="submit"
              onClick={handleFierro}
            >
              Agregar
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
