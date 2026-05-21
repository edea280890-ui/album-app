"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import AlbumOpeningCinematic from "@/components/AlbumOpeningCinematic";
import AlbumPage from "@/components/AlbumPage";
import { ALBUM_PAGES } from "@/data/albumConfig";
import { useAlbumGame } from "@/context/AlbumGameContext";
import { useCinematicAudio } from "@/context/CinematicAudioContext";

export default function AlbumCollectionView() {
  const searchParams = useSearchParams();
  const { playCue, setScene } = useCinematicAudio();
  const router = useRouter();
  const [introDismissed, setIntroDismissed] =
    useState(false);
  const showIntro =
    !introDismissed &&
    searchParams.get("intro") === "1";

  useEffect(() => {
    setScene("album");
  }, [setScene]);

  const finishIntro = () => {
    setIntroDismissed(true);
    router.replace("/album");
  };

  const {
    album,
    selectedPage,
    pageTransition,
    pageTurnDirection,
    selectedPageIndex,
    previousPage,
    nextPage,
    currentPageCards,
    currentPageCompleted,
    pastedCount,
    completionPercentage,
    progression,
    setSelectedCard,
    changeAlbumPage,
    getPageCards,
    getPageCompletedCount
  } = useAlbumGame();

  const pageTotal = currentPageCards.length;
  const isCurrentPageComplete =
    pageTotal > 0 &&
    currentPageCompleted === pageTotal;

  return (
    <section className="section-transition album-section-cinematic album-table-section">
      {showIntro && (
        <AlbumOpeningCinematic onFinish={finishIntro} />
      )}

      <div className="album-table-bg" aria-hidden="true" />
      <div className="album-table-vignette" aria-hidden="true" />
      <div className="album-table-light" aria-hidden="true" />
      <div className="album-table-props" aria-hidden="true">
        <span className="album-table-prop album-table-prop-map"></span>
        <span className="album-table-prop album-table-prop-thread"></span>
        <span className="album-table-prop album-table-prop-wax"></span>
      </div>
      <div className="album-table-dust" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="album-stage">
        <header className="album-hero-header">
          <span>Album fisico</span>
          <h1>Argentina Historica</h1>
          <p>
            Un album historico abierto sobre la mesa: cada decada conserva
            sus huecos, sus figuritas pegadas y el pulso de la coleccion.
          </p>
        </header>

        <div
          className={
            isCurrentPageComplete
              ? "album-spread-status album-spread-status-complete"
              : "album-spread-status"
          }
        >
          <div>
            <span>Decada seleccionada</span>
            <strong>{selectedPage}</strong>
          </div>

          <p>
            {currentPageCompleted}/{pageTotal}
            {" "}
            espacios completados
          </p>

          <div className="album-total-progress">
            <span>Album total</span>
            <strong>
              {pastedCount} piezas - {completionPercentage}%
            </strong>
          </div>
        </div>

        <section className="album-progression-relic" aria-label="Progreso de Argentina Historica">
          <div className="album-progression-medallion">
            <span>{completionPercentage}%</span>
            <strong>{progression.completionLabel}</strong>
          </div>

          <div className="album-progression-cards">
            <article className="album-progression-card">
              <span>Decadas completas</span>
              <strong>
                {progression.completedPagesCount}/{progression.totalPages}
              </strong>
              <small>
                {progression.completedPages.length > 0
                  ? progression.completedPages.join(" - ")
                  : "Ninguna cerrada todavia"}
              </small>
            </article>

            <article className="album-progression-card album-progression-card-discovery">
              <span>Piezas descubiertas</span>
              <strong>
                {progression.obtainedUniqueCount}/{progression.totalCollectibleCards}
              </strong>
              <small>Modelos vistos entre pilon y album</small>
            </article>

            <article className="album-progression-card album-progression-card-hito">
              <span>Hitos historicos</span>
              <strong>
                {progression.unlockedHitosCount}/{progression.totalHitos}
              </strong>
              <small>{progression.nextHitoTitle}: {progression.nextHitoCompleted}/{progression.nextHitoTotal}</small>
            </article>

            <article className="album-progression-card album-progression-card-legendaria">
              <span>Legendarias</span>
              <strong>
                {progression.legendaryObtainedCount}/{progression.totalLegendarias}
              </strong>
              <small>Presencias mayores de la coleccion</small>
            </article>

            <article className="album-progression-card">
              <span>Proximo objetivo</span>
              <strong>{progression.nextIncompletePage}</strong>
              <small>
                {progression.nextIncompletePageCompleted}/{progression.nextIncompletePageTotal}
                {" "}
                espacios recuperados
              </small>
            </article>
          </div>
        </section>

        <div className="album-navigation album-physical-navigation">
          <button
            type="button"
            className="page-turn-button page-turn-button-left"
            onClick={() => {
              playCue("pageTurn");
              changeAlbumPage(previousPage, "previous");
            }}
            aria-label="Pagina anterior"
          >
            &lt;
          </button>

          <div className="album-page-tabs">
            {ALBUM_PAGES.map((page) => {
              const pageTotalForTab =
                getPageCards(page).length;
              const pageCompleted =
                getPageCompletedCount(page);
              const targetIndex =
                ALBUM_PAGES.indexOf(page);
              const direction =
                targetIndex > selectedPageIndex
                  ? "next"
                  : "previous";
              const isComplete =
                pageTotalForTab > 0 &&
                pageCompleted === pageTotalForTab;

              const tabClass = [
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
                  type="button"
                  onClick={() => {
                    playCue("pageTurn");
                    changeAlbumPage(page, direction);
                  }}
                  className={tabClass}
                >
                  <span className="album-page-tab-label">
                    {page}
                  </span>

                  <span className="album-page-tab-count">
                    {pageCompleted}/{pageTotalForTab}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="page-turn-button page-turn-button-right"
            onClick={() => {
              playCue("pageTurn");
              changeAlbumPage(nextPage, "next");
            }}
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
          {pageTransition && (
            <span
              className="album-live-turn-sheet"
              aria-hidden="true"
            ></span>
          )}
          <AlbumPage
            key={selectedPage}
            pagina={selectedPage}
            album={album}
            onViewCard={setSelectedCard}
          />
        </div>
      </div>
    </section>
  );
}




