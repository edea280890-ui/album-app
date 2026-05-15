import { Rarity } from "./Rarity";

export type Card = {
  id: string;
  nombre: string;
  rareza: Rarity;
  codigo: string;
  valor: number;
  imagen: string;
  pagina: string;
  pista?: string;

  // Para sistema de hitos/combinables
  esCombinable?: boolean;
  hitoId?: string;
  parte?: number;
  partesTotales?: number;
};
