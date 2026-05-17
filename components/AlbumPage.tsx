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

  return (
    <div
      className={`album-page-scene album-decade-${decadeMood}`}
    >
      <div className="album-book-shadow"></div>
      <div className="album-book-page-stack" aria-hidden="true"></div>

      <div
        className={
          isPageCompleted
            ? "album-physical-page album-page-complete album-page-reward"
            : "album-physical-page"
        }
      >
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

          <span className="album-page-counter">
            {completedCount}/{cardsFromPage.length}
          </span>
        </div>

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
                    <div className="album-slot-placeholder">
                      <span>{index + 1}</span>
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

