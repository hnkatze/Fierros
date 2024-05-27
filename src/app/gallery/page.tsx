'use client'
import { getFierrosByKeyword, getFierrosByTags } from "@/config/crude";
import { Tags } from "@/config/type";
import { parseTags } from "@/config/Util";
import { Button, Input } from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";

export default function New() {
  const [tags, setTags] = useState<string>("");
  const [urls, setUrls] = useState<{ url: string; fecha: string }[]>([]);

  const handleFierro = async () => {
    try {
      const tagss: Tags[] = parseTags(tags);
      const fierrosfil = await getFierrosByKeyword(tags);
      console.log(fierrosfil)
      
      if (fierrosfil.length !== 0) {
        const url = fierrosfil.map((fierr) => ({
          url: fierr.urlImagen,
          fecha: fierr.fecha,
        }));
        setUrls(url);
      } else {
        setUrls([]); 
      }
    } catch (error) {
      console.error("Error fetching fierros:", error);
    }
  };

  return (
    <main className="flex flex-col justify-center items-center w-full h-screen">
      <div className="flex flex-row gap-3 items-center">
        <Input
          isRequired
          type="text"
          label="Palabra Clave"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="alas"
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
      <div className="flex flex-wrap items-center w-full h-full">
        {urls.map((image, index) => (
          <Image key={index} alt={image.fecha} width={200} height={200} src={image.url} />
        ))}
      </div>
    </main>
  );
}
