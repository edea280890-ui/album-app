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
        }, 160);
      }, 360);
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
