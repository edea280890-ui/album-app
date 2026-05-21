"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from "react";

import { ALBUM_PAGES, TOTAL_ALBUM_CARDS } from "@/data/albumConfig";
import { masterCards } from "@/data/cards";
import { historicalHitos } from "@/data/hitos";
import { openPack } from "@/lib/openPack";
import type { Card } from "@/types/Card";

import type { InventoryCard } from "@/components/Inventory";

export type CardStatus =
  | "Pegada"
  | "Repetida"
  | "Disponible"
  | "Vista";

export type PageTurnDirection =
  | "previous"
  | "next"
  | "direct";

export type HitoProgressSnapshot = {
  id: string;
  titulo: string;
  pagina: string;
  escena: string;
  resumen: string;
  completedParts: number;
  totalParts: number;
  unlocked: boolean;
  missingParts: string[];
  partNames: string[];
};
export type ProgressionSnapshot = {
  completedPages: string[];
  completedPagesCount: number;
  totalPages: number;
  obtainedUniqueCount: number;
  totalCollectibleCards: number;
  unlockedHitosCount: number;
  totalHitos: number;
  legendaryObtainedCount: number;
  totalLegendarias: number;
  nextIncompletePage: string;
  nextIncompletePageCompleted: number;
  nextIncompletePageTotal: number;
  completionLabel: string;
  hitoProgress: HitoProgressSnapshot[];
  nextHitoTitle: string;
  nextHitoCompleted: number;
  nextHitoTotal: number;
};

const loadStoredCards = (key: string): Card[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const stored = window.localStorage.getItem(key);

  return stored
    ? JSON.parse(stored) as Card[]
    : [];
};

type AlbumGameContextValue = {
  cards: Card[];
  album: Card[];
  selectedPage: string;
  pageTransition: boolean;
  pageTurnDirection: PageTurnDirection;
  openingPack: boolean;
  showPack: boolean;
  packCards: Card[];
  selectedCard: Card | null;
  selectedPageIndex: number;
  previousPage: string;
  nextPage: string;
  currentPageCards: Card[];
  currentPageCompleted: number;
  pastedCount: number;
  completionPercentage: string;
  progression: ProgressionSnapshot;
  groupedCards: Record<string, InventoryCard>;
  setSelectedCard: (card: Card | null) => void;
  getCardStatus: (card: Card) => CardStatus;
  changeAlbumPage: (
    page: string,
    direction?: PageTurnDirection
  ) => void;
  handleOpenPack: () => Promise<void>;
  pasteCard: (card: InventoryCard) => void;
  getPageCards: (page: string) => Card[];
  getPageCompletedCount: (page: string) => number;
};

const AlbumGameContext =
  createContext<AlbumGameContextValue | null>(null);

export function AlbumGameProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [cards, setCards] = useState<Card[]>(() =>
    loadStoredCards("albumCards")
  );
  const [album, setAlbum] = useState<Card[]>(() =>
    loadStoredCards("album")
  );

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

  const groupedCards = useMemo(() => {
    const grouped: Record<string, InventoryCard> = {};

    cards.forEach((card) => {
      if (!grouped[card.codigo]) {
        grouped[card.codigo] = {
          ...card,
          cantidad: 1
        };
      } else {
        grouped[card.codigo].cantidad++;
      }
    });

    return grouped;
  }, [cards]);

  const getPageCards = useCallback((page: string) =>
    masterCards.filter(
      (card) =>
        card.pagina === page &&
        card.rareza !== "Hito"
    ), []);

  const getPageCompletedCount = useCallback(
    (page: string) => {
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
    },
    [album, getPageCards]
  );

  const currentPageCards =
    getPageCards(selectedPage);
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

  const progression = useMemo<ProgressionSnapshot>(() => {
    const completedPages = ALBUM_PAGES.filter((page) => {
      const pageCards = getPageCards(page);

      return (
        pageCards.length > 0 &&
        getPageCompletedCount(page) === pageCards.length
      );
    });

    const nextIncompletePage =
      ALBUM_PAGES.find((page) => {
        const pageCards = getPageCards(page);

        return (
          pageCards.length > 0 &&
          getPageCompletedCount(page) < pageCards.length
        );
      }) ?? ALBUM_PAGES[0];

    const nextIncompletePageCards =
      getPageCards(nextIncompletePage);
    const obtainedCodes = new Set(
      [...cards, ...album].map((card) => card.codigo)
    );
    const hitoCards = masterCards.filter(
      (card) => card.rareza === "Hito"
    );
    const hitoProgress = historicalHitos.map((hito) => {
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
        id: hito.id,
        titulo: hito.titulo,
        pagina: hito.pagina,
        escena: hito.escena,
        resumen: hito.resumen,
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
            .map((partCard) => partCard.nombre),
        partNames: hitoParts.map((partCard) => partCard.nombre)
      };
    });
    const nextHito =
      hitoProgress.find((hito) => !hito.unlocked) ??
      hitoProgress[0];
    const legendaryCards = masterCards.filter(
      (card) => card.rareza === "Legendaria"
    );
    const totalCollectibleCards =
      masterCards.filter(
        (card) => card.rareza !== "Hito"
      ).length + hitoCards.length;
    const legendaryObtainedCount =
      legendaryCards.filter((card) =>
        obtainedCodes.has(card.codigo)
      ).length;
    const unlockedHitosCount =
      hitoProgress.filter((hito) => hito.unlocked).length;
    const completedPagesCount = completedPages.length;

    const completionLabel =
      completedPagesCount === ALBUM_PAGES.length
        ? "Album completo"
        : completedPagesCount > 0
          ? "Decadas recuperadas"
          : "Memoria en construccion";

    return {
      completedPages,
      completedPagesCount,
      totalPages: ALBUM_PAGES.length,
      obtainedUniqueCount: obtainedCodes.size,
      totalCollectibleCards,
      unlockedHitosCount,
      totalHitos: hitoCards.length,
      legendaryObtainedCount,
      totalLegendarias: legendaryCards.length,
      nextIncompletePage,
      nextIncompletePageCompleted:
        getPageCompletedCount(nextIncompletePage),
      nextIncompletePageTotal: nextIncompletePageCards.length,
      completionLabel,
      hitoProgress,
      nextHitoTitle: nextHito?.titulo ?? "Hitos completos",
      nextHitoCompleted: nextHito?.completedParts ?? 0,
      nextHitoTotal: nextHito?.totalParts ?? 0
    };
  }, [album, cards, getPageCards, getPageCompletedCount]);

  const getCardStatus = useCallback(
    (card: Card): CardStatus => {
      const isPasted = album.some(
        (albumCard) =>
          albumCard.codigo === card.codigo
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
    },
    [album, cards]
  );

  const changeAlbumPage = useCallback(
    (
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
        }, 420);
      }, 460);
    },
    [selectedPage]
  );

  const handleOpenPack = useCallback(async () => {
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
  }, [cards]);

  const pasteCard = useCallback(
    (card: InventoryCard) => {
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
    },
    [album, cards]
  );

  const value = useMemo(
    () =>
      ({
        cards,
        album,
        selectedPage,
        pageTransition,
        pageTurnDirection,
        openingPack,
        showPack,
        packCards,
        selectedCard,
        selectedPageIndex,
        previousPage,
        nextPage,
        currentPageCards,
        currentPageCompleted,
        pastedCount,
        completionPercentage,
        progression,
        groupedCards,
        setSelectedCard,
        getCardStatus,
        changeAlbumPage,
        handleOpenPack,
        pasteCard,
        getPageCards,
        getPageCompletedCount
      }) satisfies AlbumGameContextValue,
    [
      album,
      cards,
      changeAlbumPage,
      completionPercentage,
      currentPageCards,
      currentPageCompleted,
      getCardStatus,
      getPageCards,
      getPageCompletedCount,
      groupedCards,
      progression,
      handleOpenPack,
      openingPack,
      packCards,
      pageTransition,
      pageTurnDirection,
      pasteCard,
      pastedCount,
      previousPage,
      nextPage,
      selectedCard,
      selectedPage,
      selectedPageIndex,
      showPack
    ]
  );

  return (
    <AlbumGameContext.Provider value={value}>
      {children}
    </AlbumGameContext.Provider>
  );
}

export function useAlbumGame() {
  const ctx = useContext(AlbumGameContext);

  if (!ctx) {
    throw new Error(
      "useAlbumGame must be used within AlbumGameProvider"
    );
  }

  return ctx;
}


