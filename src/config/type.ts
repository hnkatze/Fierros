import { TargetAndTransition } from "framer-motion";

export type NewPersona = {
    dni: string;
    nombre: string;
    direccion: string;
  };

  export type Persona = {
    id:string;
    dni: string;
    nombre: string;
    direccion: string;
  };
  
  export type Tags = {
    tag: string;
  };
  
  export type NewFierro= {
    dniPersona:string;
    urlImagen:string;
    folio: number;
    matricula: number;
    fecha: string;
    tags: Tags[];
  };

  export type Fierro = {
    id:string;
    dniPersona:string;
    urlImagen:string;
    folio: number;
    matricula: number;
    fecha: string;
    tags: Tags[];
  };
  
  export type User ={
    userName: string;
    password:string;
  }