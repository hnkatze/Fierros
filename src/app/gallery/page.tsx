"use client";
import { getFierrosByKeyword } from "@/config/crude";
import { Fierro } from "@/config/type";
import {
  Button,
  Image,
  Input,
  Link,
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
    <main className='flex flex-col w-full h-screen'>
      <div className=' flex flex-col justify-center items-center w-full h-64 '>
        <div className=' flex  flex-row  gap-3 items-center'>
          <Input
            isDisabled={disable}
            isRequired
            type='text'
            className='h-10 text-center'
            label='Palabra Clave'
            value={tags}
            onChange={(e) => setTags(e.target.value.toLocaleLowerCase())}
            placeholder='alas'
          />
          <Button
            isDisabled={disable}
            color='secondary'
            variant='flat'
            className='text-white font-bold'
            onClick={handleFierro}>
            Buscar
          </Button>
        </div>
        <div className=' flex justify-center items-center gap-3 w-full h-36 '>
          <Input
            isDisabled={ssdisable}
            isRequired
            type='text'
            className='h-10 w-52 text-center'
            label='Filtrar '
            value={filtro}
            onChange={handleFiltroChange}
            placeholder='r'
          />
          <Button
            isDisabled={ssdisable}
            color='danger'
            variant='shadow'
            className='text-white w-5 font-bold'
            onClick={clear}>
            Limpiar
          </Button>
        </div>
      </div>
      <div className='flex flex-wrap gap-5 justify-center items-center w-full mx-auto'>
        {filteredData.map((image, index) => (
          <div
            key={index}
            className='relative rounded-lg flex flex-col justify-center items-center w-2/12'>
            <Tooltip content={image.dniPersona}>
              <Image
                isZoomed={true}
                className='block'
                key={index}
                alt={image.fecha}
                width={200}
                height={200}
                src={image.urlImagen}
                onClick={() => openModal(image.urlImagen)}
              />
            </Tooltip>
          </div>
        ))}
      </div>
      <Modal isOpen={isOpen} onClose={onClose} size='2xl' backdrop='blur'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className='flex flex-col justify-center items-center pt-10 w-full'>
                <Image
                  isZoomed={true}
                  className='block'
                  alt='Zoom Image'
                  width={600}
                  height={600}
                  src={OnlyImage}
                />
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
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
