import Image from "next/image";
import { useMemo, useState } from "react";
import { getCardStyle } from "../lib/getCardStyle";
import { Card } from "../types/Card";

export type InventoryCard = Card & {
  cantidad: number;
};

type InventoryFilter =
  | "todas"
  | "simples"
  | "especiales"
  | "doradas"
  | "legendarias"
  | "combinables"
  | "repetidas";

type Props = {
  groupedCards: Record<string, InventoryCard>;
  pasteCard: (card: InventoryCard) => void;
  onInspectCard: (card: Card) => void;
};

const filters: {
  id: InventoryFilter;
  label: string;
}[] = [
  { id: "todas", label: "Todas" },
  { id: "simples", label: "Simples" },
  { id: "especiales", label: "Especiales" },
  { id: "doradas", label: "Doradas" },
  { id: "legendarias", label: "Legendarias" },
  { id: "combinables", label: "Combinables" },
  { id: "repetidas", label: "Repetidas" }
];

const matchesFilter = (
  card: InventoryCard,
  filter: InventoryFilter
) => {
  switch (filter) {
    case "simples":
      return card.rareza === "Simple";

    case "especiales":
      return card.rareza === "Especial";

    case "doradas":
      return card.rareza === "Dorada";

    case "legendarias":
      return card.rareza === "Legendaria";

    case "combinables":
      return card.rareza === "Combinable";

    case "repetidas":
      return card.cantidad > 1;

    default:
      return true;
  }
};

export default function Inventory({
  groupedCards,
  pasteCard,
  onInspectCard
}: Props) {
  const [activeFilter, setActiveFilter] =
    useState<InventoryFilter>("todas");

  const visibleCards = useMemo(
    () =>
      Object.values(groupedCards).filter((card) =>
        matchesFilter(card, activeFilter)
      ),
    [groupedCards, activeFilter]
  );

  return (
    <section className="inventory-panel">
      <div
        className="inventory-filter-rail"
        aria-label="Filtros de inventario"
      >
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() =>
              setActiveFilter(filter.id)
            }
            className={
              activeFilter === filter.id
                ? "inventory-filter-chip inventory-filter-chip-active"
                : "inventory-filter-chip"
            }
          >
            {filter.label}
          </button>
        ))}
      </div>

      {visibleCards.length === 0 ? (
        <div className="inventory-empty-state">
          No hay figuritas en este filtro.
        </div>
      ) : (
        <div className="inventory-grid">
          {visibleCards.map((card) => {
            const style = getCardStyle(card);
            const rarityClass = card.rareza
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "");

            return (
              <div
                key={card.codigo}
                className={`inventory-card card-flip card-frame card-frame-${rarityClass}`}
                style={style}
              >
                <button
                  className="inventory-card-image-button"
                  onClick={() => onInspectCard(card)}
                  aria-label={`Inspeccionar ${card.nombre}`}
                >
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
                      width={216}
                      height={260}
                      className="inventory-card-image"
                    />
                  </div>
                </button>

                <div className="inventory-card-meta">
                  <span>
                    {card.rareza.toUpperCase()}
                  </span>

                  <span>
                    #{card.codigo}
                  </span>
                </div>

                <h3>{card.nombre}</h3>

                <p>Valor: {card.valor}</p>

                <p>Copias: {card.cantidad}</p>

                <button
                  className="album-button"
                  onClick={() => pasteCard(card)}
                >
                  Pegar en Ã¡lbum
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}