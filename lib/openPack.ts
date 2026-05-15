import {
  CARDS_PER_PACK
} from "../data/albumConfig";
import { masterCards } from "../data/cards";
import { Card } from "../types/Card";

const pickRarity = (): Card["rareza"] => {
  const random = Math.random() * 100;

  if (random <= 2) {
    return "Legendaria";
  }

  if (random <= 9) {
    return "Dorada";
  }

  if (random <= 24) {
    return "Especial";
  }

  if (random <= 38) {
    return "Combinable";
  }

  return "Simple";
};

const pickCardByRarity = (
  rarity: Card["rareza"]
): Card => {
  const pool = masterCards.filter(
    (card) =>
      card.rareza === rarity &&
      card.rareza !== "Hito"
  );

  const fallbackPool = masterCards.filter(
    (card) =>
      card.rareza === "Simple"
  );

  const source =
    pool.length > 0
      ? pool
      : fallbackPool.length > 0
        ? fallbackPool
        : masterCards;

  return source[
    Math.floor(Math.random() * source.length)
  ];
};

export function openPack(): Card[] {
  const newCards: Card[] = [];

  for (let i = 0; i < CARDS_PER_PACK; i++) {
    newCards.push(
      pickCardByRarity(pickRarity())
    );
  }

  return newCards;
}