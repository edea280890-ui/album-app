import Image from "next/image";
import { getCardStyle } from "../lib/getCardStyle";
import { Card } from "../types/Card";

type CardStatus =
  | "Pegada"
  | "Repetida"
  | "Disponible"
  | "Vista";

type Props = {
  card: Card;
  status: CardStatus;
  onClose: () => void;
};

export default function CardViewer({
  card,
  status,
  onClose
}: Props) {
  const style = getCardStyle(card);

  const rarityClass = card.rareza
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return (
    <div className={`card-viewer-overlay card-viewer-overlay-${rarityClass}`}>
      <button
        className="card-viewer-backdrop"
        aria-label="Cerrar visor"
        onClick={onClose}
      />

      <section
        className={`card-viewer card-viewer-${rarityClass}`}
        aria-label={`Detalle de ${card.nombre}`}
      >
        <span
          className="card-viewer-rarity-atmosphere"
          aria-hidden="true"
        ></span>
        <button
          className="card-viewer-close"
          onClick={onClose}
          aria-label="Cerrar"
        >
          x
        </button>

        <div
          className={`card-viewer-object card-frame card-frame-${rarityClass}`}
          style={style}
        >
          <span
            className="card-viewer-object-glow"
            aria-hidden="true"
          ></span>
          <span
            className="card-viewer-object-sheen"
            aria-hidden="true"
          ></span>

          <div
            className={
              card.rareza === "Dorada" ||
              card.rareza === "Legendaria" ||
              card.rareza === "Hito"
                ? "foil-image"
                : ""
            }
          >
            <Image
              src={card.imagen}
              alt={card.nombre}
              width={320}
              height={430}
              className="card-viewer-image"
            />
          </div>

          <div className="card-viewer-rarity">
            {card.rareza}
          </div>

          <h2>{card.nombre}</h2>

          <p className="card-viewer-code">
            {card.codigo}
          </p>
        </div>

        <aside className="card-viewer-details">
          <span>{status}</span>

          <h3>{card.nombre}</h3>

          <dl className="card-viewer-stats">
            <div>
              <dt>Rareza</dt>
              <dd>{card.rareza}</dd>
            </div>

            <div>
              <dt>Codigo</dt>
              <dd>{card.codigo}</dd>
            </div>

            <div>
              <dt>Valor</dt>
              <dd>{card.valor}</dd>
            </div>

            <div>
              <dt>Pagina</dt>
              <dd>{card.pagina}</dd>
            </div>
          </dl>

          <p>
            {card.pista ??
              "Pieza de la coleccion historica argentina."}
          </p>

          {card.esCombinable && (
            <p>
              Esta figurita forma parte de un hito combinable.
            </p>
          )}
        </aside>
      </section>
    </div>
  );
}
