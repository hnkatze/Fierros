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
import "./custom.css";

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
    <main className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto form-container">
        <h1 className="form-title">Registro de Fierro</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="form-section">
            <h2 className="form-section-title">Contribuyente</h2>
            <RadioGroup
              value={selected}
              onValueChange={handleRadioChange}
              orientation="horizontal"
              classNames={{
                wrapper: "custom-radio-group",
              }}
            >
              <Radio value="1">
                <span className={`custom-radio ${selected === "1" ? "bg-blue-500" : ""}`}>Existente</span>
              </Radio>
              <Radio value="2">
                <span className={`custom-radio ${selected === "2" ? "bg-blue-500" : ""}`}>Nuevo</span>
              </Radio>
            </RadioGroup>
            <form onSubmit={handlePersona} className="space-y-4">
              <Input
                isRequired
                type="text"
                label="DNI"
                value={FormPersona.dni}
                onChange={handleInputChangePersona}
                placeholder="0210"
                name="dni"
                classNames={{
                  input: "custom-input",
                  label: "text-white",
                }}
              />
              <Input
                type="text"
                isDisabled={disable}
                label="Nombre"
                value={FormPersona.nombre}
                onChange={handleInputChangePersona}
                placeholder="Juana de Arcos"
                name="nombre"
                classNames={{
                  input: "custom-input",
                  label: "text-white",
                }}
              />
              <Input
                type="text"
                label="Dirección"
                isDisabled={disable}
                value={FormPersona.direccion}
                onChange={handleInputChangePersona}
                placeholder="El 5"
                name="direccion"
                classNames={{
                  input: "custom-input",
                  label: "text-white",
                }}
              />
              <Button
                type="submit"
                className="custom-button w-full"
              >
                {disable ? "Cargar" : "Agregar"}
              </Button>
            </form>
          </div>
          <div className="form-section">
            <h2 className="form-section-title">Datos De La Marca</h2>
            <form onSubmit={handleFierro} className="space-y-4">
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
                classNames={{
                  input: "custom-input",
                  label: "text-white",
                }}
              />
              <Input
                isDisabled={formDisable}
                type="number"
                label="Matrícula"
                value={formValue.matricula.toString()}
                onChange={handleInputChange}
                name="matricula"
                classNames={{
                  input: "custom-input",
                  label: "text-white",
                }}
              />
              <Input
                isDisabled={formDisable}
                type="date"
                label="Fecha"
                value={formValue.fecha}
                onChange={handleInputChange}
                name="fecha"
                classNames={{
                  input: "custom-input",
                  label: "text-white",
                }}
              />
              <Input
                isDisabled={formDisable}
                type="text"
                label="Descripción"
                value={formValue.tags}
                onChange={handleInputChange}
                placeholder="alas,escudo"
                name="tags"
                classNames={{
                  input: "custom-input",
                  label: "text-white",
                }}
              />
              <Input
                isDisabled={formDisable}
                type="text"
                label="Comentario"
                value={formValue.comentario}
                onChange={handleInputChange}
                placeholder="Paso a "
                name="comentario"
                classNames={{
                  input: "custom-input",
                  label: "text-white",
                }}
              />
              <div className="space-y-2">
                <label htmlFor="fot" className="block text-sm font-medium text-white">
                  Imagen
                </label>
                <input
                  disabled={formDisable}
                  id="fot"
                  type="file"
                  name="fot"
                  accept="image/*"
                  className="custom-file-input"
                  onChange={handleFileChange}
                  title="Selecciona una imagen"
                />
              </div>
              <Button
                isDisabled={formDisable}
                type="submit"
                className="custom-button w-full"
                onClick={handleFierro}
              >
                Agregar
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

