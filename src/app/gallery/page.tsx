"use client";
import { getFierrosByKeyword } from "@/config/crude";
import { Fierro } from "@/config/type";
import {
  Button,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";

export default function New() {
  const [tags, setTags] = useState<string>("");
  const [filtro, setFiltro] = useState<string>("");
  const [disable, setDisable] = useState<boolean>(false);
  const [ssdisable, setSSDisable] = useState<boolean>(true);
  const [filteredData, setFilteredData] = useState<Fierro[]>([]);
  const [urls, setUrls] = useState<Fierro[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [OnlyImage, setOnlyImage] = useState<string>("");

  const handleFierro = async () => {
    try {
      const fierrosfil = await getFierrosByKeyword(tags);
      if (fierrosfil.length !== 0) {
        setUrls(fierrosfil);
        setSSDisable(false);
        setDisable(true);
        setFilteredData(fierrosfil);
      } else {
        setUrls([]);
      }
    } catch (error) {
      console.error("Error fetching fierros:", error);
    }
  };

  const clear = () => {
    setTags("");
    setFiltro("");
    setDisable(false);
    setSSDisable(true);
    setFilteredData([]);
  };

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtroValue = e.target.value;
    setFiltro(filtroValue);
    filterData(filtroValue);
  };

  const filterData = (filtroValue: string) => {
    if (!filtroValue.trim()) {
      setFilteredData(urls);
    } else {
      const filtered = urls.filter((item) =>
        item.tags.some((tag) =>
          tag.toLowerCase().includes(filtroValue.toLowerCase())
        )
      );
      setFilteredData(filtered);
    }
  };

  const openModal = (url: string) => {
    setOnlyImage(url);
    onOpen();
  };

  return (
    <main className="flex flex-col w-full min-h-screen bg-gray-100 p-8">
      <div className="flex flex-col justify-center items-center w-full max-w-4xl mx-auto mb-12 space-y-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Búsqueda de Fierros</h1>
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
          <Input
            isDisabled={disable}
            isRequired
            type="text"
            className="h-12 text-center bg-white shadow-md rounded-lg"
            classNames={{
              input: "text-lg",
              inputWrapper: "h-12",
            }}
            label="Palabra Clave"
            labelPlacement="outside"
            value={tags}
            onChange={(e) => setTags(e.target.value.toLowerCase())}
            placeholder="alas"
          />
          <Button
            isDisabled={disable}
            color="secondary"
            variant="shadow"
            className="h-12 px-8 text-white font-bold text-lg"
            onClick={handleFierro}
          >
            Buscar
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
          <Input
            isDisabled={ssdisable}
            isRequired
            type="text"
            className="h-12 text-center bg-white shadow-md rounded-lg"
            classNames={{
              input: "text-lg",
              inputWrapper: "h-12",
            }}
            label="Filtrar"
            labelPlacement="outside"
            value={filtro}
            onChange={handleFiltroChange}
            placeholder="r"
          />
          <Button
            isDisabled={ssdisable}
            color="danger"
            variant="shadow"
            className="h-12 px-8 text-white font-bold text-lg"
            onClick={clear}
          >
            Limpiar
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full max-w-7xl mx-auto">
        {filteredData.map((image, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 bg-white"
          >
            <Tooltip content={`DNI: ${image.dniPersona}`} placement="top">
              <Image
                isZoomed
                className="object-cover w-full h-48"
                alt={image.fecha}
                src={image.urlImagen}
                onClick={() => openModal(image.urlImagen)}
              />
            </Tooltip>
            <div className="p-4">
              <p className="text-sm font-semibold text-gray-700 truncate">
                Fecha: {image.fecha}
              </p>
              <p className="text-xs text-gray-500 mt-1 truncate">
                Tags: {image.tags.join(", ")}
              </p>
            </div>
          </div>
        ))}
      </div>
      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
       className="w-max h-max  mx-auto"
        scrollBehavior="inside"
        backdrop="transparent"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="flex flex-col items-center justify-center p-0">
                <Image
                  isZoomed
                  className="max-w-full max-h-[100vh] object-contain"
                  alt="Zoom Image"
                  src={OnlyImage}
                />
              </ModalBody>
              <ModalFooter className="flex h-14 justify-center items-center w-full">
                <Button 
                  color="danger" 
                  variant="light" 
                  onPress={onClose}
                  className="font-bold w-full"
                >
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  );
}

