"use client";

import Image from "next/image";

import PackOpening from "@/components/PackOpening";
import { useAlbumGame } from "@/context/AlbumGameContext";

const getRarityDelay = (rareza: string, index: number) => {
  const baseDelay = index * 0.42;

  if (rareza === "Legendaria" || rareza === "Hito") {
    return baseDelay + 0.35;
  }

  if (rareza === "Dorada") {
    return baseDelay + 0.2;
  }

  return baseDelay;
};

export default function SobresCollectionView() {
  const {
    openingPack,
    showPack,
    packCards,
    setSelectedCard,
    handleOpenPack
  } = useAlbumGame();

  const hasResults = packCards.length > 0 && !showPack;
  const rewardCard = packCards.find(
    (card) =>
      card.rareza === "Legendaria" || card.rareza === "Hito"
  ) ?? packCards.find((card) => card.rareza === "Dorada");
  const rewardRarityClass = rewardCard
    ? rewardCard.rareza
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
    : null;

  return (
    <section className="sobres-table-section section-transition">
      <div className="sobres-table-bg" aria-hidden="true" />
      <div className="sobres-table-vignette" aria-hidden="true" />
      <div className="sobres-table-light" aria-hidden="true" />
      <div className="sobres-dust" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="sobres-stage">
        <header className="sobres-scene-header">
          <span>Mesa de sobres</span>
          <h1>Sobres historicos</h1>
          <p>
            Elegi un paquete, rompi el borde con cuidado y deja que las
            figuritas aparezcan sobre la mesa.
          </p>
        </header>

        <div
          className={
            openingPack
              ? "sobres-pack-zone sobres-pack-zone-opening"
              : "sobres-pack-zone"
          }
        >
          <div className="sobres-side-stack" aria-hidden="true">
            <span className="sobres-side-pack-wrap side-pack-a">
              <Image
                src="/assets/hub/paquete-principal-clean.png"
                alt=""
                width={684}
                height={904}
                className="sobres-side-pack"
              />
              <span className="sobres-pack-brand-patch">
                Argentina Historica
              </span>
              <span className="sobres-pack-thickness"></span>
            </span>

            <span className="sobres-side-pack-wrap side-pack-b">
              <Image
                src="/assets/hub/paquete-principal-clean.png"
                alt=""
                width={684}
                height={904}
                className="sobres-side-pack"
              />
              <span className="sobres-pack-brand-patch">
                Argentina Historica
              </span>
              <span className="sobres-pack-thickness"></span>
            </span>
          </div>

          <button
            type="button"
            className="sobres-main-pack-button"
            onClick={handleOpenPack}
            disabled={openingPack}
            aria-label="Abrir sobre"
          >
            <span
              className="sobres-pack-contact-shadow"
              aria-hidden="true"
            ></span>
            <Image
              src="/assets/hub/paquete-principal-clean.png"
              alt=""
              width={684}
              height={904}
              className="sobres-main-pack-image"
              priority
            />
            <span className="sobres-pack-foil" aria-hidden="true"></span>
            <span className="sobres-pack-thickness"></span>
            <span className="sobres-pack-pressure" aria-hidden="true"></span>
            <span className="sobres-main-brand-patch">
              <strong>Argentina Historica</strong>
              <small>Sobre premium</small>
            </span>
            <span className="sobres-pack-label">
              {openingPack ? "Rasgando borde" : "Tomar sobre"}
            </span>
          </button>

          <div className="sobres-table-note" aria-hidden="true">
            5 figuritas
          </div>
        </div>

        {showPack && (
          <div className="sobres-opening-wrap">
            <PackOpening openingPack={openingPack} />
          </div>
        )}

        {hasResults && (
          <section className="pack-result pack-result-cinematic sobres-result-table">
            <div className="pack-result-light" aria-hidden="true"></div>

            {rewardCard && (
              <div
                className={`pack-reward-banner pack-reward-banner-${rewardRarityClass}`}
              >
                <span>Recompensa del sobre</span>
                <strong>{rewardCard.rareza}</strong>
                <small>{rewardCard.nombre}</small>
              </div>
            )}

            <div className="pack-result-header sobres-result-header">
              <span>Sobre abierto</span>

              <h2>Figuritas obtenidas</h2>
            </div>

            <div className="pack-result-grid sobres-result-grid">
              {packCards.map((card, index) => {
                const rarityClass = card.rareza
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "");
                const delay = getRarityDelay(card.rareza, index);

                return (
                  <button
                    type="button"
                    key={`${card.codigo}-${index}`}
                    onClick={() => setSelectedCard(card)}
                    className={`pack-card-reveal sobres-card-reveal pack-card-reveal-${rarityClass} card-frame card-frame-${rarityClass}`}
                    style={{
                      animationDelay: `${delay}s`
                    }}
                  >
                    <span
                      className="pack-card-table-shadow"
                      aria-hidden="true"
                    ></span>

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
              })}
            </div>
          </section>
        )}
      </div>
    </section>
  );
}



