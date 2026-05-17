/**
 * Composición calibrada sobre “Mesa principal 1.png” (16:10).
 * Porcentajes relativos al área útil de la mesa (objectsLayer con inset).
 */

export const HUB_TABLE = {
  aspectRatio: "16 / 10",
  maxWidthPx: 1240,
  maxHeightVh: 86,
  perspectiveRotateX: 5,
  objectsInset: "5% 6% 6% 5%"
} as const;

/** Abanico superior derecho — 2 sobres */
export const PACKS_TOP = [
  {
    left: "6%",
    top: "6%",
    rotate: -22,
    scale: 0.72,
    z: 1
  },
  {
    left: "32%",
    top: "16%",
    rotate: -7,
    scale: 0.78,
    z: 3
  }
] as const;

/** Sobre aislado inferior derecho */
export const PACK_SOLO = {
  left: "18%",
  top: "62%",
  rotate: 11,
  scale: 0.74,
  z: 2
} as const;

/** Fan inferior izquierdo + carta suelta hacia el álbum */
export const FIGURITAS_FAN = [
  {
    left: "0%",
    bottom: "22%",
    rotate: -17,
    z: 1,
    width: "32%",
    src: "/cards/historicas/belgrano.png",
    name: "Belgrano"
  },
  {
    left: "22%",
    bottom: "32%",
    rotate: -6,
    z: 3,
    width: "30%",
    src: "/cards/historicas/sanmartin.png",
    name: "San Martín"
  },
  {
    left: "42%",
    bottom: "18%",
    rotate: 7,
    z: 2,
    width: "28%",
    src: "/cards/placeholder.svg",
    name: "Artigas"
  },
  {
    left: "58%",
    bottom: "2%",
    rotate: 13,
    z: 4,
    width: "26%",
    src: "/cards/placeholder.svg",
    name: "Túpac Amaru"
  }
] as const;
