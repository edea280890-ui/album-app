"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { Card } from "../types/Card";
import { masterCards } from "../data/cards";
import { historicalHitos } from "../data/hitos";
import { getCardStyle } from "../lib/getCardStyle";

type Props = {
  pagina: string;
  album: Card[];
  onViewCard?: (card: Card) => void;
};

const getDecadeMood = (pagina: string) => {
  const decade = Number(pagina);

  if (decade <= 1810) {
    return "independencia";
  }

  if (decade <= 1830) {
    return "frontera";
  }

  if (decade <= 1850) {
    return "confederacion";
  }

  if (decade <= 1870) {
    return "republica";
  }

  return "memoria";
};

const decadeNarratives: Record<
  string,
  {
    title: string;
    description: string;
    note: string;
  }
> = {
  "1800": {
    title: "Ecos del Virreinato",
    description:
      "El album abre con una epoca de tensiones, rutas comerciales y primeros signos de transformacion politica.",
    note: "Cada espacio conserva una pista hasta que la figurita ocupa su lugar."
  },
  "1810": {
    title: "La hora de Mayo",
    description:
      "La pagina respira cabildo, imprenta y decisiones urgentes: el inicio visible de una nueva vida politica.",
    note: "Las piezas doradas y legendarias iluminan los nombres que empujaron la revolucion."
  },
  "1820": {
    title: "Provincias en disputa",
    description:
      "Caudillos, pactos y territorios definen una decada de movimiento, frontera y lealtades cambiantes.",
    note: "Los huecos impresos funcionan como memoria parcial antes del hallazgo."
  },
  "1830": {
    title: "Frontera y poder",
    description:
      "El album se vuelve mas oscuro y terroso: alianzas, campanas y proyectos de orden atraviesan la pagina.",
    note: "Los hitos combinables marcan escenas mayores que se completan por partes."
  },
  "1840": {
    title: "Conflictos y exilios",
    description:
      "La historia se escribe entre debates, viajes, bloqueos y voces que imaginan otro pais posible.",
    note: "Las figuritas pegadas quedan como documentos adheridos al papel."
  },
  "1850": {
    title: "Organizacion nacional",
    description:
      "La pagina toma tono institucional: acuerdos, constitucion y nuevas formas de pensar la republica.",
    note: "Completar la decada enciende una calidez de logro sobre el pliego."
  },
  "1860": {
    title: "Union y tensiones",
    description:
      "El album muestra una Argentina que intenta reunirse sin perder sus fuerzas regionales ni sus disputas.",
    note: "La luz lateral revela relieves, cintas y sombras de cada figurita."
  },
  "1870": {
    title: "Estado en expansion",
    description:
      "Ferrocarriles, guerras, prensa y nuevas instituciones cambian el ritmo del territorio.",
    note: "Las rarezas altas tienen presencia propia, como piezas de vitrina historica."
  },
  "1880": {
    title: "Capital y modernizacion",
    description:
      "La decada ordena poder, ciudad y memoria publica mientras el pais acelera su transformacion.",
    note: "Los espacios vacios conservan el codigo como si fueran marcas de imprenta."
  },
  "1890": {
    title: "Crisis y reforma",
    description:
      "La pagina mezcla lujo gastado y agite politico: nuevas voces cuestionan el modo de gobernar.",
    note: "El progreso de pagina funciona como una lectura fisica del album."
  },
  "1900": {
    title: "Umbral del siglo",
    description:
      "El cierre mira hacia un pais que ya cambio de escala, con memoria acumulada y nuevos conflictos abiertos.",
    note: "Completarla prepara el album para su conclusion narrativa."
  }
};

const getDecadeNarrative = (pagina: string) =>
  decadeNarratives[pagina] ?? {
    title: "Memoria en construccion",
    description:
      "Esta decada conserva espacios, pistas y piezas que esperan entrar en la coleccion.",
    note: "Cada figurita suma contexto historico al recorrido."
  };

export default function AlbumPage({
  pagina,
  album,
  onViewCard
}: Props) {
  const [recentlyPastedCode, setRecentlyPastedCode] =
    useState<string | null>(null);
  const previousAlbumCodes = useRef<Set<string> | null>(
    null
  );

  const albumCodes = useMemo(
    () => new Set(album.map((card) => card.codigo)),
    [album]
  );

  useEffect(() => {
    const previousCodes = previousAlbumCodes.current;

    if (previousCodes) {
      const newCode = Array.from(albumCodes).find(
        (code) => !previousCodes.has(code)
      );

      if (newCode) {
        setRecentlyPastedCode(newCode);

        const timeout = window.setTimeout(() => {
          setRecentlyPastedCode(null);
        }, 1350);

        previousAlbumCodes.current = albumCodes;

        return () => window.clearTimeout(timeout);
      }
    }

    previousAlbumCodes.current = albumCodes;

    return undefined;
  }, [albumCodes]);

  const cardsFromPage = masterCards.filter(
    (card) =>
      card.pagina === pagina &&
      card.rareza !== "Hito"
  );

  const completedCount = cardsFromPage.filter((card) => {
    const fusedHito = card.hitoId
      ? album.some(
          (albumCard) =>
            albumCard.rareza === "Hito" &&
            albumCard.hitoId === card.hitoId
        )
      : false;

    return album.some(
      (albumCard) =>
        albumCard.codigo === card.codigo
    ) || fusedHito;
  }).length;

  const isPageCompleted =
    cardsFromPage.length > 0 &&
    completedCount === cardsFromPage.length;
  const decadeMood = getDecadeMood(pagina);
  const decadeNarrative = getDecadeNarrative(pagina);
  const pageProgress =
    cardsFromPage.length > 0
      ? `${(completedCount / cardsFromPage.length) * 100}%`
      : "0%";
  const pageHitos = useMemo(
    () =>
      historicalHitos
        .filter((hito) => hito.pagina === pagina)
        .map((hito) => {
          const hitoParts = masterCards
            .filter(
              (card) =>
                card.esCombinable &&
                card.hitoId === hito.id
            )
            .sort(
              (firstCard, secondCard) =>
                (firstCard.parte ?? 0) -
                (secondCard.parte ?? 0)
            );
          const unlocked = album.some(
            (albumCard) =>
              albumCard.rareza === "Hito" &&
              albumCard.hitoId === hito.id
          );
          const pastedParts = new Set(
            album
              .filter(
                (albumCard) =>
                  albumCard.esCombinable &&
                  albumCard.hitoId === hito.id
              )
              .map((albumCard) => albumCard.parte ?? 0)
          );
          const totalParts =
            hitoParts.length || hito.partesEsperadas;
          const completedParts = unlocked
            ? totalParts
            : pastedParts.size;

          return {
            ...hito,
            completedParts,
            totalParts,
            unlocked,
            missingParts: unlocked
              ? []
              : hitoParts
                .filter(
                  (partCard) =>
                    !pastedParts.has(partCard.parte ?? 0)
                )
                .map((partCard) => partCard.nombre)
          };
        }),
    [album, pagina]
  );

  return (
    <div
      className={`album-page-scene album-decade-${decadeMood}`}
      style={
        {
          "--page-progress": pageProgress
        } as CSSProperties
      }
    >
      <div className="album-book-shadow"></div>
      <div className="album-open-book-base" aria-hidden="true"></div>
      <div className="album-book-page-stack" aria-hidden="true"></div>

      <div
        className={
          isPageCompleted
            ? "album-physical-page album-page-complete album-page-reward"
            : "album-physical-page"
        }
      >
        <div className="album-page-curl album-page-curl-left" aria-hidden="true"></div>
        <div className="album-page-curl album-page-curl-right" aria-hidden="true"></div>
        <div className="album-page-edge-layer album-page-edge-top" aria-hidden="true"></div>
        <div className="album-page-edge-layer album-page-edge-bottom" aria-hidden="true"></div>
        <div className="album-page-light"></div>
        <div className="album-paper-noise"></div>
        <div className="album-paper-stains"></div>
        <div className="album-page-wear"></div>
        <div className="album-decade-atmosphere"></div>
        <div className="album-complete-bloom" aria-hidden="true"></div>
        <div className="album-inner-ornament ornament-top"></div>
        <div className="album-inner-ornament ornament-bottom"></div>
        <div className="album-inner-corner corner-top-left"></div>
        <div className="album-inner-corner corner-top-right"></div>
        <div className="album-inner-corner corner-bottom-left"></div>
        <div className="album-inner-corner corner-bottom-right"></div>
        <div className="album-physical-page-spine"></div>
        <div className="album-page-gutter-shadow" aria-hidden="true"></div>
        <div className="album-physical-page-left"></div>
        <div className="album-physical-page-right"></div>

        <div className="album-page-header">
          <div>
            <span className="album-page-decade-badge">
              Decada
            </span>

            <h2>Decada de {pagina}</h2>

            <p className="album-page-subtitle">
              Argentina Historica
            </p>
          </div>

          <div className="album-page-progress-block">
            <span className="album-page-counter">
              {completedCount}/{cardsFromPage.length}
            </span>
            <span
              className="album-page-progress-track"
              aria-label={`Progreso de pagina ${completedCount} de ${cardsFromPage.length}`}
            >
              <span className="album-page-progress-fill"></span>
            </span>
          </div>
        </div>

        <aside className="album-decade-note">
          <div>
            <span>Contexto de decada</span>
            <h3>{decadeNarrative.title}</h3>
          </div>
          <p>{decadeNarrative.description}</p>
          <small>{decadeNarrative.note}</small>
        </aside>

        {pageHitos.length > 0 && (
          <section className="album-hito-ledger">
            <div className="album-hito-ledger-title">
              <span>Hitos en reconstruccion</span>
              <strong>Escenas historicas</strong>
            </div>

            <div className="album-hito-ledger-list">
              {pageHitos.map((hito) => (
                <article
                  key={hito.id}
                  className={
                    hito.unlocked
                      ? "album-hito-card album-hito-card-unlocked"
                      : "album-hito-card"
                  }
                  style={
                    {
                      "--hito-progress":
                        hito.totalParts > 0
                          ? `${(hito.completedParts / hito.totalParts) * 100}%`
                          : "0%"
                    } as CSSProperties
                  }
                >
                  <div>
                    <span>{hito.escena}</span>
                    <h3>{hito.titulo}</h3>
                    <p>{hito.resumen}</p>
                  </div>

                  <div className="album-hito-progress">
                    <strong>
                      {hito.completedParts}/{hito.totalParts}
                    </strong>
                    <span>
                      <i></i>
                    </span>
                  </div>

                  <small>
                    {hito.unlocked
                      ? hito.recompensa
                      : hito.missingParts.length > 0
                        ? `Falta: ${hito.missingParts.join(" / ")}`
                        : "Busca las piezas combinables del hito"}
                  </small>
                </article>
              ))}
            </div>
          </section>
        )}

        <div className="album-slots-grid">
          {cardsFromPage.map((card, index) => {
            const fusedHito = card.hitoId
              ? album.find(
                  (albumCard) =>
                    albumCard.rareza === "Hito" &&
                    albumCard.hitoId === card.hitoId
                )
              : undefined;

            const visibleCard = fusedHito ?? card;
            const pasted =
              album.some(
                (albumCard) =>
                  albumCard.codigo === card.codigo
              ) || Boolean(fusedHito);

            const cardStyle =
              getCardStyle(visibleCard);
            const rarityClass = visibleCard.rareza
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "");
            const isHitoSlot =
              Boolean(fusedHito) ||
              visibleCard.rareza === "Hito" ||
              Boolean(card.hitoId);
            const isJustPasted =
              pasted &&
              visibleCard.codigo === recentlyPastedCode;

            const slotClass = pasted
              ? [
                  "album-slot",
                  "album-slot-pasted",
                  `album-slot-${rarityClass}`,
                  isJustPasted ? "album-slot-just-pasted" : "",
                  isHitoSlot ? "album-slot-hito" : "",
                  `card-frame card-frame-${rarityClass}`
                ].filter(Boolean).join(" ")
              : [
                  "album-slot",
                  "album-slot-empty",
                  isHitoSlot ? "album-slot-empty-hito" : ""
                ].filter(Boolean).join(" ");

            return (
              <button
                key={card.codigo}
                type="button"
                onClick={() =>
                  pasted && onViewCard?.(visibleCard)
                }
                className={slotClass}
                style={{
                  border: pasted
                    ? cardStyle.border
                    : "2px dashed #6f6252",

                  boxShadow: pasted
                    ? cardStyle.boxShadow
                    : "none",

                  color: pasted
                    ? cardStyle.color
                    : "#8f826f",

                  background: pasted
                    ? cardStyle.background
                    : "rgba(20, 15, 10, 0.65)",

                  "--slot-index": index
                } as CSSProperties}
              >
                {pasted ? (
                  <>
                    <span
                      className="album-slot-contact"
                      aria-hidden="true"
                    ></span>
                    <span
                      className="album-slot-laminate"
                      aria-hidden="true"
                    ></span>
                    <span
                      className="album-slot-rarity-stamp"
                      aria-hidden="true"
                    >
                      {visibleCard.rareza}
                    </span>
                    {isHitoSlot && (
                      <span
                        className="album-slot-hito-seal"
                        aria-hidden="true"
                      >
                        Hito
                      </span>
                    )}
                    <span
                      className="album-slot-paper-depth"
                      aria-hidden="true"
                    ></span>
                    <span
                      className="album-slot-settle-glow"
                      aria-hidden="true"
                    ></span>
                    <span
                      className="album-slot-settle-dust"
                      aria-hidden="true"
                    ></span>
                    <span
                      className="album-slot-adhesive album-slot-adhesive-top"
                      aria-hidden="true"
                    ></span>
                    <span
                      className="album-slot-adhesive album-slot-adhesive-bottom"
                      aria-hidden="true"
                    ></span>

                    <Image
                      src={visibleCard.imagen}
                      alt={visibleCard.nombre}
                      width={180}
                      height={130}
                      className="album-slot-image"
                    />

                    <strong>
                      {visibleCard.nombre}
                    </strong>

                    <p>{visibleCard.codigo}</p>
                  </>
                ) : (
                  <>
                    <span
                      className="album-slot-empty-adhesive album-slot-empty-adhesive-a"
                      aria-hidden="true"
                    ></span>
                    <span
                      className="album-slot-empty-adhesive album-slot-empty-adhesive-b"
                      aria-hidden="true"
                    ></span>
                    <div className="album-slot-placeholder">
                      <span>{index + 1}</span>
                      <i aria-hidden="true"></i>
                    </div>

                    <strong>
                      Faltante
                    </strong>

                    <p>{card.codigo}</p>

                    {card.pista && (
                      <p className="album-slot-hint">
                        {card.pista}
                      </p>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}




