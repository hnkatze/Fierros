export type CustomFormData = {
  dni: string;
  folio: number;
  matricula: number;
  fecha: string;
  comentario: string;
  tags: string;
  fot: File | null;
};
export interface DniState {
  dni: string;
}
export type CustomPerson = {
  dni: string;
  nombre: string;
  direccion: string;
};

export type NewPersona = {
  dni: string;
  nombre: string;
  direccion: string;
};
export type Persona = {
  id: string;
  dni: string;
  nombre: string;
  direccion: string;
};
export type NewFierro = {
  dniPersona: string;
  urlImagen: string;
  folio: number;
  matricula: number;
  fecha: string;
  tags: Tags[];
  comentario: string;
};
export type NewFierroArr = {
  dniPersona: string;
  urlImagen: string;
  folio: number;
  matricula: number;
  fecha: string;
  tags: string[];
  comentario: string;
};
export type Tags = {
  tag: string;
};
export type Fierro = {
  id: string;
  dniPersona: string;
  urlImagen: string;
  folio: number;
  matricula: number;
  fecha: string;
  tags: string[];
  comentario: string;
};
export type FierroArr = {
  id: string;
  dniPersona: string;
  urlImagen: string;
  folio: number;
  matricula: number;
  fecha: string;
  tags: string[];
  comentario: string;
};
export type User = {
  userName: string;
  password: string;
};
