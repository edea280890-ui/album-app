import Image from "next/image";
import { Card } from "../types/Card";
import { masterCards } from "../data/cards";
import { getCardStyle } from "../lib/getCardStyle";

type Props = {
  pagina: string;
  album: Card[];
  onViewCard?: (card: Card) => void;
};

export default function AlbumPage({
  pagina,
  album,
  onViewCard
}: Props) {
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

  return (
    <div className="album-page-scene">
      <div className="album-book-shadow"></div>

      <div
        className={
          isPageCompleted
            ? "album-physical-page album-page-complete"
            : "album-physical-page"
        }
      >
        <div className="album-page-light"></div>
        <div className="album-paper-noise"></div>
        <div className="album-paper-stains"></div>
        <div className="album-page-wear"></div>
        <div className="album-physical-page-spine"></div>
        <div className="album-physical-page-left"></div>
        <div className="album-physical-page-right"></div>

        <div className="album-page-header">
          <div>
            <span className="album-page-decade-badge">
              Decada
            </span>

            <h2>Decada de {pagina}</h2>
          </div>

          <span className="album-page-counter">
            {completedCount}/{cardsFromPage.length}
          </span>
        </div>

        <div className="album-slots-grid">
          {cardsFromPage.map((card) => {
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

            return (
              <button
                key={card.codigo}
                type="button"
                onClick={() =>
                  pasted && onViewCard?.(visibleCard)
                }
                className={
                  pasted
                    ? `album-slot card-frame card-frame-${rarityClass}`
                    : "album-slot album-slot-empty"
                }
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
                    : "rgba(20, 15, 10, 0.65)"
                }}
              >
                {pasted ? (
                  <>
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
                      ?
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