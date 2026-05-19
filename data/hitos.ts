export type HistoricalHito = {
  id: string;
  titulo: string;
  pagina: string;
  escena: string;
  resumen: string;
  contexto: string;
  frase: string;
  curiosidad: string;
  recompensa: string;
  tono: string;
  partesEsperadas: number;
};

export const historicalHitos: HistoricalHito[] = [
  {
    id: "invasiones-inglesas",
    titulo: "Invasiones Inglesas",
    pagina: "1800",
    escena: "Reconquista y defensa popular",
    resumen:
      "La ciudad descubre que puede organizar su propia defensa y empieza a imaginar otra forma de autoridad.",
    contexto:
      "Entre 1806 y 1807, Buenos Aires vivio una movilizacion militar y civil que dejo una memoria politica nueva.",
    frase:
      "Antes de Mayo, la ciudad ya habia probado su pulso colectivo.",
    curiosidad:
      "Las milicias urbanas nacidas en ese clima tendrian peso decisivo en los anos siguientes.",
    recompensa:
      "Desbloquea una escena de defensa urbana con luz azul y dorada.",
    tono: "defensa",
    partesEsperadas: 2
  },
  {
    id: "revolucion-mayo",
    titulo: "Revolucion de Mayo",
    pagina: "1810",
    escena: "Cabildo, plaza y decision politica",
    resumen:
      "El poder virreinal queda en discusion y la plaza se convierte en parte viva de la historia.",
    contexto:
      "Mayo de 1810 abrio una etapa de gobiernos patrios, debates urgentes y nuevas lealtades.",
    frase:
      "La historia no ocurre solo adentro del Cabildo: tambien respira en la plaza.",
    curiosidad:
      "El Cabildo Abierto reunio voces de elite, pero la presion popular marco el ritmo de los dias.",
    recompensa:
      "Une el interior del Cabildo con el pueblo reunido en la plaza.",
    tono: "mayo",
    partesEsperadas: 2
  },
  {
    id: "pacto-federal",
    titulo: "Pacto Federal",
    pagina: "1830",
    escena: "Provincias, alianzas y poder federal",
    resumen:
      "Las provincias buscan sostener un orden comun sin abandonar sus propias fuerzas politicas.",
    contexto:
      "El Pacto Federal de 1831 fue una pieza central en la organizacion de alianzas entre provincias.",
    frase:
      "La unidad todavia no es una forma quieta: se negocia, se firma y se defiende.",
    curiosidad:
      "Su influencia llego mas alla de su firma y acompano debates posteriores sobre organizacion nacional.",
    recompensa:
      "Desbloquea una escena de documentos, sellos y banderas provinciales.",
    tono: "federal",
    partesEsperadas: 2
  },
  {
    id: "constitucion-1853",
    titulo: "Constitucion de 1853",
    pagina: "1850",
    escena: "Acuerdo, ley y organizacion nacional",
    resumen:
      "El pais empieza a escribirse como proyecto institucional, con pactos, tensiones y futuro.",
    contexto:
      "La Constitucion de 1853 dio forma juridica a una organizacion nacional largamente discutida.",
    frase:
      "La memoria tambien puede tomar forma de pagina escrita.",
    curiosidad:
      "Su texto tomo influencias de debates locales y modelos constitucionales de la epoca.",
    recompensa:
      "Desbloquea una escena de pergamino, pluma y firma institucional.",
    tono: "constitucion",
    partesEsperadas: 2
  },
  {
    id: "organizacion-nacional",
    titulo: "Organizacion Nacional",
    pagina: "1860",
    escena: "Union, presidencias y Estado en marcha",
    resumen:
      "La Argentina intenta consolidar instituciones, territorio y una memoria comun.",
    contexto:
      "La decada de 1860 condensa disputas por la union nacional, presidencias fundacionales y proyectos de Estado.",
    frase:
      "Completar esta escena es ver al pais intentando reconocerse como uno.",
    curiosidad:
      "La organizacion nacional fue un proceso politico, militar, cultural y educativo al mismo tiempo.",
    recompensa:
      "Desbloquea una escena de presidencias, mapas y simbolos institucionales.",
    tono: "republica",
    partesEsperadas: 2
  }
];

export const getHitoById = (
  hitoId?: string
) =>
  historicalHitos.find(
    (hito) => hito.id === hitoId
  );