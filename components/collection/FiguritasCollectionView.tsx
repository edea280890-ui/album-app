"use client";

import Image from "next/image";

import Inventory from "@/components/Inventory";
import { useAlbumGame } from "@/context/AlbumGameContext";

export default function FiguritasCollectionView() {
  const {
    groupedCards,
    pasteCard,
    setSelectedCard
  } = useAlbumGame();

  return (
    <section className="figuritas-table-section section-transition">
      <div className="figuritas-table-bg" aria-hidden="true" />
      <div className="figuritas-table-vignette" aria-hidden="true" />
      <div className="figuritas-table-light" aria-hidden="true" />
      <div className="figuritas-table-grain" aria-hidden="true" />

      <div className="figuritas-table-props" aria-hidden="true">
        <div className="figuritas-prop-sheet figuritas-prop-sheet-left">
          <Image
            src="/assets/hub/argentina-historica-home-ai.png"
            alt=""
            fill
            sizes="360px"
            className="figuritas-prop-image figuritas-prop-image-left"
          />
        </div>
        <div className="figuritas-prop-sheet figuritas-prop-sheet-right">
          <Image
            src="/assets/hub/argentina-historica-home-ai.png"
            alt=""
            fill
            sizes="420px"
            className="figuritas-prop-image figuritas-prop-image-right"
          />
        </div>
        <div className="figuritas-prop-pack">
          <Image
            src="/assets/hub/paquete-principal-clean.png"
            alt=""
            fill
            sizes="180px"
            className="figuritas-prop-pack-image"
          />
        </div>
      </div>

      <div className="figuritas-stage">
        <header className="figuritas-scene-header">
          <span>Coleccion personal</span>
          <h1>Figuritas historicas</h1>
          <p>
            Tu pilon fisico de piezas argentinas: repetidas separadas,
            rarezas ordenadas y cartas listas para inspeccionar o pegar.
          </p>
        </header>

        <Inventory
          groupedCards={groupedCards}
          pasteCard={pasteCard}
          onInspectCard={setSelectedCard}
        />
      </div>
    </section>
  );
}

