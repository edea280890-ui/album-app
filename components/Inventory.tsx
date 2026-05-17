import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
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

type InventoryCluster = {
  id: string;
  label: string;
  detail: string;
  tone: string;
  cards: InventoryCard[];
};

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

const filterLabels: Record<InventoryFilter, string> = {
  todas: "Toda la coleccion",
  simples: "Figuritas simples",
  especiales: "Especiales",
  doradas: "Doradas",
  legendarias: "Legendarias",
  combinables: "Combinables",
  repetidas: "Repetidas"
};

const rarityClusters: Omit<InventoryCluster, "cards">[] = [
  {
    id: "simples",
    label: "Simples",
    detail: "Base del album",
    tone: "simple"
  },
  {
    id: "especiales",
    label: "Especiales",
    detail: "Piezas con tratamiento premium",
    tone: "especial"
  },
  {
    id: "combinables",
    label: "Combinables",
    detail: "Mitades listas para fusionarse",
    tone: "combinable"
  },
  {
    id: "doradas",
    label: "Doradas",
    detail: "Foil historico de alta rareza",
    tone: "dorada"
  },
  {
    id: "legendarias",
    label: "Legendarias",
    detail: "La vitrina mayor de la coleccion",
    tone: "legendaria"
  }
];

const clusterCards = (
  cards: InventoryCard[],
  activeFilter: InventoryFilter
): InventoryCluster[] => {
  if (activeFilter === "repetidas") {
    return [
      {
        id: "repetidas",
        label: "Repetidas",
        detail: "Copias disponibles para futuro intercambio",
        tone: "repetida",
        cards
      }
    ];
  }

  if (activeFilter !== "todas") {
    return [
      {
        id: activeFilter,
        label: filterLabels[activeFilter],
        detail: "Seleccion actual del pilon",
        tone: activeFilter.replace(/s$/, ""),
        cards
      }
    ];
  }

  const repeatedCards = cards.filter(
    (card) => card.cantidad > 1
  );
  const singleCards = cards.filter(
    (card) => card.cantidad <= 1
  );

  return [
    {
      id: "repetidas",
      label: "Repetidas",
      detail: "Copias separadas con bandita",
      tone: "repetida",
      cards: repeatedCards
    },
    ...rarityClusters.map((cluster) => ({
      ...cluster,
      cards: singleCards.filter((card) => {
        if (cluster.id === "simples") {
          return card.rareza === "Simple";
        }

        if (cluster.id === "especiales") {
          return card.rareza === "Especial";
        }

        if (cluster.id === "combinables") {
          return card.rareza === "Combinable";
        }

        if (cluster.id === "doradas") {
          return card.rareza === "Dorada";
        }

        return card.rareza === "Legendaria";
      })
    }))
  ].filter((cluster) => cluster.cards.length > 0);
};

export default function Inventory({
  groupedCards,
  pasteCard,
  onInspectCard
}: Props) {
  const [activeFilter, setActiveFilter] =
    useState<InventoryFilter>("todas");
  const [settlingCardCode, setSettlingCardCode] =
    useState<string | null>(null);
  const pasteTimeout = useRef<number | null>(null);
  const settleTimeout = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (pasteTimeout.current) {
        window.clearTimeout(pasteTimeout.current);
      }

      if (settleTimeout.current) {
        window.clearTimeout(settleTimeout.current);
      }
    };
  }, []);

  const handlePasteCard = (card: InventoryCard) => {
    setSettlingCardCode(card.codigo);

    if (pasteTimeout.current) {
      window.clearTimeout(pasteTimeout.current);
    }

    if (settleTimeout.current) {
      window.clearTimeout(settleTimeout.current);
    }

    pasteTimeout.current = window.setTimeout(() => {
      pasteCard(card);
    }, 190);

    settleTimeout.current = window.setTimeout(() => {
      setSettlingCardCode(null);
    }, 880);
  };

  const cards = useMemo(
    () => Object.values(groupedCards),
    [groupedCards]
  );

  const visibleCards = useMemo(
    () =>
      cards.filter((card) =>
        matchesFilter(card, activeFilter)
      ),
    [cards, activeFilter]
  );

  const clusters = useMemo(
    () => clusterCards(visibleCards, activeFilter),
    [visibleCards, activeFilter]
  );

  const totalCopies = visibleCards.reduce(
    (total, card) => total + card.cantidad,
    0
  );

  const getFilterCount = (filter: InventoryFilter) =>
    cards.filter((card) =>
      matchesFilter(card, filter)
    ).length;

  return (
    <section className="inventory-panel inventory-physical-panel">
      <div
        className="inventory-table-glow"
        aria-hidden="true"
      ></div>

      <header className="inventory-physical-header">
        <div>
          <span>Pilon de coleccion</span>
          <h2>{filterLabels[activeFilter]}</h2>
        </div>

        <dl className="inventory-physical-stats">
          <div>
            <dt>Modelos</dt>
            <dd>{visibleCards.length}</dd>
          </div>
          <div>
            <dt>Copias</dt>
            <dd>{totalCopies}</dd>
          </div>
        </dl>
      </header>

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
            <span>{filter.label}</span>
            <strong>{getFilterCount(filter.id)}</strong>
          </button>
        ))}
      </div>

      {visibleCards.length === 0 ? (
        <div className="inventory-empty-state inventory-physical-empty">
          No hay figuritas en este pilon todavia.
        </div>
      ) : (
        <div className="inventory-collection-scene">
          {clusters.map((cluster) => (
            <section
              key={cluster.id}
              className={`inventory-rarity-cluster inventory-rarity-cluster-${cluster.tone}`}
            >
              <header className="inventory-cluster-header">
                <div>
                  <span>{cluster.detail}</span>
                  <h3>{cluster.label}</h3>
                </div>
                <strong>{cluster.cards.length}</strong>
              </header>

              <div className="inventory-card-stack">
                {cluster.cards.map((card, index) => {
                  const style = getCardStyle(card);
                  const rarityClass = card.rareza
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "");
                  const cardStyle = {
                    ...style,
                    "--card-index": index
                  } as CSSProperties;

                  const isSettling =
                    card.codigo === settlingCardCode;

                  return (
                    <div
                      key={card.codigo}
                      className={`inventory-card inventory-physical-card card-flip card-frame card-frame-${rarityClass} ${
                        isSettling
                          ? "inventory-card-settling"
                          : ""
                      } ${
                        card.cantidad > 1
                          ? "inventory-card-repeated"
                          : ""
                      }`}
                      style={cardStyle}
                    >
                      <span
                        className="physical-card-paper-edge"
                        aria-hidden="true"
                      ></span>
                      <span
                        className="inventory-card-touch-glow"
                        aria-hidden="true"
                      ></span>
                      <span
                        className="inventory-card-settle-dust"
                        aria-hidden="true"
                      ></span>

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

                      <div className="inventory-card-stats">
                        <span>Valor {card.valor}</span>
                        <span>Copias {card.cantidad}</span>
                      </div>

                      {card.cantidad > 1 && (
                        <span className="inventory-copy-band">
                          x{card.cantidad}
                        </span>
                      )}

                      <button
                        className="album-button inventory-paste-button"
                        onClick={() => handlePasteCard(card)}
                      >
                        Pegar en album
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}

