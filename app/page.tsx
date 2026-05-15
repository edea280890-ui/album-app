"use client";

import Image from "next/image";
import { useState } from "react";

import AlbumCover from "../components/AlbumCover";
import AlbumPage from "../components/AlbumPage";
import CardViewer from "../components/CardViewer";
import GameTable from "../components/GameTable";
import Inventory, {
  InventoryCard
} from "../components/Inventory";
import PackOpening from "../components/PackOpening";

import { ALBUM_PAGES, TOTAL_ALBUM_CARDS } from "../data/albumConfig";
import { masterCards } from "../data/cards";
import { openPack } from "../lib/openPack";
import { Card } from "../types/Card";

type ActiveSection =
  | "mesa"
  | "figuritas"
  | "album"
  | "sobres";

type CardStatus =
  | "Pegada"
  | "Repetida"
  | "Disponible"
  | "Vista";

type PageTurnDirection =
  | "previous"
  | "next"
  | "direct";

const loadStoredCards = (key: string): Card[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const stored = window.localStorage.getItem(key);

  return stored
    ? JSON.parse(stored) as Card[]
    : [];
};

export default function Home() {
  const [cards, setCards] = useState<Card[]>(() =>
    loadStoredCards("albumCards")
  );
  const [album, setAlbum] = useState<Card[]>(() =>
    loadStoredCards("album")
  );

  const [activeSection, setActiveSection] =
    useState<ActiveSection>("mesa");
  const [selectedPage, setSelectedPage] =
    useState("1810");
  const [pageTransition, setPageTransition] =
    useState(false);
  const [pageTurnDirection, setPageTurnDirection] =
    useState<PageTurnDirection>("direct");

  const [openingPack, setOpeningPack] =
    useState(false);
  const [showPack, setShowPack] =
    useState(false);
  const [packCards, setPackCards] =
    useState<Card[]>([]);

  const [selectedCard, setSelectedCard] =
    useState<Card | null>(null);

  const selectedPageIndex =
    ALBUM_PAGES.indexOf(selectedPage);
  const previousPage =
    ALBUM_PAGES[
      (selectedPageIndex - 1 + ALBUM_PAGES.length) %
      ALBUM_PAGES.length
    ];
  const nextPage =
    ALBUM_PAGES[
      (selectedPageIndex + 1) %
      ALBUM_PAGES.length
    ];

  const groupedCards: Record<string, InventoryCard> = {};

  cards.forEach((card) => {
    if (!groupedCards[card.codigo]) {
      groupedCards[card.codigo] = {
        ...card,
        cantidad: 1
      };
    } else {
      groupedCards[card.codigo].cantidad++;
    }
  });

  const getPageCards = (page: string) =>
    masterCards.filter(
      (card) =>
        card.pagina === page &&
        card.rareza !== "Hito"
    );

  const getPageCompletedCount = (page: string) => {
    const pageCards = getPageCards(page);

    return pageCards.filter((card) => {
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
  };

  const currentPageCards = getPageCards(selectedPage);
  const currentPageCompleted =
    getPageCompletedCount(selectedPage);

  const pastedCount = album.reduce(
    (total, card) =>
      total +
      (
        card.rareza === "Hito"
          ? card.partesTotales ?? 1
          : 1
      ),
    0
  );

  const completionPercentage = (
    (pastedCount / TOTAL_ALBUM_CARDS) *
    100
  ).toFixed(1);

  const getCardStatus = (card: Card): CardStatus => {
    const isPasted = album.some(
      (albumCard) => albumCard.codigo === card.codigo
    );

    if (isPasted) {
      return "Pegada";
    }

    const copies = cards.filter(
      (inventoryCard) =>
        inventoryCard.codigo === card.codigo
    ).length;

    if (copies > 1) {
      return "Repetida";
    }

    if (copies === 1) {
      return "Disponible";
    }

    return "Vista";
  };

  const changeAlbumPage = (
    page: string,
    direction: PageTurnDirection = "direct"
  ) => {
    if (page === selectedPage) {
      return;
    }

    setPageTurnDirection(direction);
    setPageTransition(true);

    setTimeout(() => {
      setSelectedPage(page);

      setTimeout(() => {
        setPageTransition(false);
      }, 160);
    }, 360);
  };

  const handleOpenPack = async () => {
    setOpeningPack(true);
    setShowPack(true);
    setPackCards([]);

    const newCards = openPack();

    await new Promise((resolve) =>
      setTimeout(resolve, 3600)
    );

    setShowPack(false);
    setPackCards(newCards);

    const updatedCards = [...cards, ...newCards];

    setCards(updatedCards);
    localStorage.setItem(
      "albumCards",
      JSON.stringify(updatedCards)
    );

    setOpeningPack(false);
  };

  const pasteCard = (card: InventoryCard) => {
    const alreadyExists = album.some(
      (albumCard) =>
        albumCard.codigo === card.codigo
    );

    if (alreadyExists) {
      return;
    }

    let updatedAlbum = [...album, card];
    let fusedCard: Card | undefined;

    if (card.esCombinable && card.hitoId) {
      const hito = masterCards.find(
        (masterCard) =>
          masterCard.rareza === "Hito" &&
          masterCard.hitoId === card.hitoId
      );

      const pastedParts = updatedAlbum.filter(
        (albumCard) =>
          albumCard.esCombinable &&
          albumCard.hitoId === card.hitoId
      );

      const uniqueParts = new Set(
        pastedParts.map((albumCard) => albumCard.parte)
      );

      const requiredParts =
        hito?.partesTotales ??
        card.partesTotales ??
        2;

      if (hito && uniqueParts.size >= requiredParts) {
        updatedAlbum = updatedAlbum.filter(
          (albumCard) =>
            !(
              albumCard.esCombinable &&
              albumCard.hitoId === card.hitoId
            )
        );

        updatedAlbum.push(hito);
        fusedCard = hito;
      }
    }

    setAlbum(updatedAlbum);
    localStorage.setItem(
      "album",
      JSON.stringify(updatedAlbum)
    );

    const cardIndex = cards.findIndex(
      (inventoryCard) =>
        inventoryCard.codigo === card.codigo
    );

    if (cardIndex !== -1) {
      const updatedCards = [...cards];

      updatedCards.splice(cardIndex, 1);

      setCards(updatedCards);
      localStorage.setItem(
        "albumCards",
        JSON.stringify(updatedCards)
      );
    }

    if (fusedCard) {
      setSelectedCard(fusedCard);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 40,
        background:
          "radial-gradient(circle at top, #2b1f10, #0d0d0d 55%)",
        color: "white"
      }}
    >
      <AlbumCover />

      {selectedCard && (
        <CardViewer
          card={selectedCard}
          status={getCardStatus(selectedCard)}
          onClose={() =>
            setSelectedCard(null)
          }
        />
      )}

      {activeSection === "mesa" && (
        <GameTable
          onOpenFiguritas={() =>
            setActiveSection("figuritas")
          }
          onOpenAlbum={() =>
            setActiveSection("album")
          }
          onOpenSobres={() =>
            setActiveSection("sobres")
          }
        />
      )}

      {activeSection !== "mesa" && (
        <button
          onClick={() => {
            document.body.classList.add(
              "returning-table"
            );

            setTimeout(() => {
              setActiveSection("mesa");
              document.body.classList.remove(
                "returning-table"
              );
            }, 350);
          }}
          style={{
            marginBottom: 30,
            padding: "10px 18px",
            borderRadius: 999,
            border: "1px solid #d4af37",
            background: "#1b1b1b",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Volver a la mesa
        </button>
      )}

      {activeSection !== "mesa" && (
        <section className="collection-status">
          <h1>Album Virtual</h1>
          <p>
            Progreso: {pastedCount}/{TOTAL_ALBUM_CARDS}
            {" - "}
            {completionPercentage}% completado
          </p>
        </section>
      )}

      {activeSection === "sobres" && (
        <section className="section-transition">
          <h1
            style={{
              marginTop: 50,
              marginBottom: 20,
              fontSize: 40
            }}
          >
            Sobres
          </h1>

          <button
            onClick={handleOpenPack}
            disabled={openingPack}
            style={{
              opacity: openingPack ? 0.5 : 1,
              cursor: openingPack
                ? "not-allowed"
                : "pointer"
            }}
          >
            {openingPack
              ? "Abriendo..."
              : "Abrir Sobre"}
          </button>

          {showPack && (
            <PackOpening
              openingPack={openingPack}
            />
          )}

          {packCards.length > 0 &&
            !showPack && (
              <section className="pack-result pack-result-cinematic">
                <div
                  className="pack-result-light"
                  aria-hidden="true"
                ></div>

                <div className="pack-result-header">
                  <span>Sobre abierto</span>

                  <h2>
                    Figuritas obtenidas
                  </h2>
                </div>

                <div className="pack-result-grid">
                  {packCards.map(
                    (card, index) => {
                      const rarityClass = card.rareza
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "");

                      return (
                        <button
                          key={`${card.codigo}-${index}`}
                          onClick={() =>
                            setSelectedCard(card)
                          }
                          className={`pack-card-reveal pack-card-reveal-${rarityClass} card-frame card-frame-${rarityClass}`}
                          style={{
                            animationDelay: `${index * 0.25}s`
                          }}
                        >
                          <span
                            className="pack-card-stage-glow"
                            aria-hidden="true"
                          ></span>

                          <span
                            className="pack-card-burst"
                            aria-hidden="true"
                          ></span>

                          <span className="pack-card-rarity">
                            {card.rareza}
                          </span>

                          <span className="pack-card-image-shell">
                            <Image
                              src={card.imagen}
                              alt={card.nombre}
                              width={216}
                              height={260}
                              className="pack-card-image"
                            />
                          </span>

                          <h3>{card.nombre}</h3>

                          <p className="pack-card-kind">
                            {card.rareza}
                          </p>

                          <p className="pack-card-code">
                            {card.codigo}
                          </p>
                        </button>
                      );
                    }
                  )}
                </div>
              </section>
            )}
        </section>
      )}

      {activeSection === "figuritas" && (
        <section className="section-transition">
          <h1
            style={{
              marginTop: 50,
              marginBottom: 20,
              fontSize: 40
            }}
          >
            Inventario
          </h1>

          <Inventory
            groupedCards={groupedCards}
            pasteCard={pasteCard}
            onInspectCard={setSelectedCard}
          />
        </section>
      )}

      {activeSection === "album" && (
        <section className="section-transition">
          <h1
            style={{
              marginTop: 60,
              marginBottom: 20,
              fontSize: 40
            }}
          >
            Album
          </h1>

          <div className="album-spread-status">
            <div>
              <span>Decada seleccionada</span>
              <strong>{selectedPage}</strong>
            </div>

            <p>
              {currentPageCompleted}/{currentPageCards.length}
              {" "}
              espacios completados
            </p>
          </div>

          <div className="album-navigation">
            <button
              className="page-turn-button page-turn-button-left"
              onClick={() =>
                changeAlbumPage(previousPage, "previous")
              }
              aria-label="Pagina anterior"
            >
              &lt;
            </button>

            <div className="album-page-tabs">
              {ALBUM_PAGES.map((page) => {
                const pageTotal = getPageCards(page).length;
                const pageCompleted =
                  getPageCompletedCount(page);
                const targetIndex =
                  ALBUM_PAGES.indexOf(page);
                const direction =
                  targetIndex > selectedPageIndex
                    ? "next"
                    : "previous";
                const isComplete =
                  pageTotal > 0 &&
                  pageCompleted === pageTotal;

                const className = [
                  "album-page-tab",
                  selectedPage === page
                    ? "album-page-tab-active"
                    : "",
                  isComplete
                    ? "album-page-tab-complete"
                    : ""
                ].filter(Boolean).join(" ");

                return (
                  <button
                    key={page}
                    onClick={() =>
                      changeAlbumPage(page, direction)
                    }
                    className={className}
                  >
                    <span className="album-page-tab-label">
                      {page}
                    </span>

                    <span className="album-page-tab-count">
                      {pageCompleted}/{pageTotal}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              className="page-turn-button page-turn-button-right"
              onClick={() =>
                changeAlbumPage(nextPage, "next")
              }
              aria-label="Pagina siguiente"
            >
              &gt;
            </button>
          </div>

          <div
            className={
              pageTransition
                ? `album-page-turning album-page-turning-${pageTurnDirection}`
                : "album-page-idle"
            }
          >
            <AlbumPage
              key={selectedPage}
              pagina={selectedPage}
              album={album}
              onViewCard={setSelectedCard}
            />
          </div>
        </section>
      )}
    </main>
  );
}