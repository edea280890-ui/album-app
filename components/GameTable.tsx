import { useState } from "react";

type Props = {
  onOpenFiguritas: () => void;
  onOpenAlbum: () => void;
  onOpenSobres: () => void;
};

export default function GameTable({
  onOpenFiguritas,
  onOpenAlbum,
  onOpenSobres
}: Props) {
  const [spreadingCards, setSpreadingCards] =
    useState(false);
    const [openingAlbum, setOpeningAlbum] =
  useState(false);
  const [openingPacks, setOpeningPacks] =
  useState(false);

  return (
    <section className="game-table">
      <div className="table-title">
        <h1>Álbum Histórico Argentino</h1>
        <p>Tu colección te espera sobre la mesa</p>
      </div>

      <div className="table-objects">
        <button
          className={
  spreadingCards
    ? "table-object sticker-pile spreading"
    : "table-object sticker-pile"
}
          onClick={() => {

  setSpreadingCards(true);

  setTimeout(() => {
    onOpenFiguritas();
  }, 900);

}}
        >
          <div className="sticker-card card-a"></div>
          <div className="sticker-card card-b"></div>
          <div className="sticker-card card-c"></div>
          <span>Figuritas</span>
        </button>

        <button
          className={
  openingAlbum
    ? "table-object closed-album opening"
    : "table-object closed-album"
}
          onClick={() => {

  setOpeningAlbum(true);

  setTimeout(() => {
    onOpenAlbum();
  }, 900);

}}
        >
          <div className="album-cover-object">
            <strong>ÁLBUM</strong>
            <small>Historia Argentina</small>
          </div>
          <span>Entrar al álbum</span>
        </button>

        <button
          className={
  openingPacks
    ? "table-object pack-stack opening"
    : "table-object pack-stack"
}
          onClick={() => {

  setOpeningPacks(true);

  setTimeout(() => {
    onOpenSobres();
  }, 900);

}}
        >
          <div className="pack pack-a"></div>
          <div className="pack pack-b"></div>
          <div className="pack pack-c"></div>
          <span>Sobres</span>
          
        </button>
      </div>
    </section>
  );
}