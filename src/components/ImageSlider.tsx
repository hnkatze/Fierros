import { deleteFierroById, deleteImage } from '@/config/crude';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';

import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

interface data {
  url: string; fecha: string; folio: number; id:string, comentario:string
}
interface ImageSliderProps {
  data:data[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<data[]>(data);
  const {isOpen, onOpen, onClose} = useDisclosure();
  useEffect(() => {
    setImages(data);
  }, [data]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const handleDelete = async (imageUrl: string, id: string) => {
    try {
      await deleteImage(imageUrl);
      await deleteFierroById(id);
      setImages(images.filter(image => image.id !== id));
      Swal.fire({
        icon: 'success',
        title: 'Borrado',
        text: 'Se borró con éxito la imagen.',
      });
    } catch (error) {
      console.error('Error al borrar la imagen:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al borrar la imagen.',
      });
    }
  };

  return (
    <div id="gallery" className="relative w-full" data-carousel="slide">
      <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
        {images.map((image, index) => (
          <div key={image.id} className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`} data-carousel-item={index === currentIndex ? 'active' : ''}>
            <img src={image.url} className="block w-full h-full object-cover" alt={`Folio ${image.folio}`} />
            <div className="absolute bottom-0 flex flex-wrap justify-center gap-2 bg-gray-800 bg-opacity-50 text-white p-4">
              <p>Folio: {image.folio}</p>
              <p>Fecha: {image.fecha}</p>
              <Button className=' w-fit' onPress={() => onOpen()}>Comentario</Button>
              <Button className='w-fit' onClick={() => handleDelete(image.url, image.id)}>Borrar</Button>
            </div>
            <div className='z-0'> <Modal 
        size='xs' 
        isOpen={isOpen} 
        onClose={onClose} 
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Comentario</ModalHeader>
              <ModalBody>
              <p>{image.comentario}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal></div>
          </div>
          
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button type="button" className="absolute top-0 start-0 z-30 flex items-center justify-center h-2/4 px-4 cursor-pointer group focus:outline-none" onClick={handlePrev} data-carousel-prev>
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
              <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
              </svg>
              <span className="sr-only">Previous</span>
            </span>
          </button>
          <button type="button" className="absolute top-0 end-0 z-30 flex items-center justify-center h-2/4 px-4 cursor-pointer group focus:outline-none" onClick={handleNext} data-carousel-next>
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
              <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
              </svg>
              <span className="sr-only">Next</span>
            </span>
          </button>
        </>
      )}

    </div>
    
  );
};

export default ImageSlider;
