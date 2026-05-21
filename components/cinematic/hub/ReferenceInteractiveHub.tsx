"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useCinematicAudio } from "@/context/CinematicAudioContext";

type HoverTarget = "album" | "sobres" | "figuritas" | null;
type ExitMode = null | "album" | "sobres" | "figuritas";

const NAV_DELAY = {
  album: 1050,
  sobres: 820,
  figuritas: 820
} as const;

const previewCards = [
  {
    className: "ah-preview-card-a",
    src: "/cards/historicas/sanmartin.png",
    alt: ""
  },
  {
    className: "ah-preview-card-b",
    src: "/cards/historicas/belgrano.png",
    alt: ""
  }
] as const;

const packStack = [
  "ah-pack-photo-a",
  "ah-pack-photo-b",
  "ah-pack-photo-c",
  "ah-pack-photo-d"
] as const;

type Props = {
  fallbackHandlers?: {
    onOpenFiguritas: () => void;
    onOpenAlbum: () => void;
    onOpenSobres: () => void;
  };
};

export default function ReferenceInteractiveHub({
  fallbackHandlers
}: Props) {
  const router = useRouter();
  const { playCue, setScene } = useCinematicAudio();
  const [hovered, setHovered] =
    useState<HoverTarget>(null);
  const [exitMode, setExitMode] =
    useState<ExitMode>(null);

  const busy = exitMode !== null;

  useEffect(() => {
    setScene("home");
  }, [setScene]);

  const hubClassName = [
    "argentina-historica-hub",
    "argentina-historica-object-hub",
    hovered ? `ah-hover-${hovered}` : "",
    exitMode ? "ah-entering" : "",
    exitMode ? `ah-entering-${exitMode}` : ""
  ]
    .filter(Boolean)
    .join(" ");

  const handlePointerMove = (
    event: React.PointerEvent<HTMLElement>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x =
      ((event.clientX - rect.left) / rect.width) * 100;
    const y =
      ((event.clientY - rect.top) / rect.height) * 100;

    event.currentTarget.style.setProperty(
      "--ah-pointer-x",
      `${x.toFixed(2)}%`
    );
    event.currentTarget.style.setProperty(
      "--ah-pointer-y",
      `${y.toFixed(2)}%`
    );
  };

  const resetPointer = (
    event: React.PointerEvent<HTMLElement>
  ) => {
    setHovered(null);
    event.currentTarget.style.setProperty("--ah-pointer-x", "50%");
    event.currentTarget.style.setProperty("--ah-pointer-y", "44%");
  };

  const navigate = useCallback(
    (mode: Exclude<ExitMode, null>, href: string) => {
      if (busy) {
        return;
      }

      playCue(mode === "album" ? "bookOpen" : "objectSelect");

      setExitMode(mode);

      window.setTimeout(() => {
        if (fallbackHandlers) {
          if (mode === "album") {
            fallbackHandlers.onOpenAlbum();
            return;
          }

          if (mode === "sobres") {
            fallbackHandlers.onOpenSobres();
            return;
          }

          fallbackHandlers.onOpenFiguritas();
          return;
        }

        router.push(href);
      }, NAV_DELAY[mode]);
    },
    [busy, fallbackHandlers, playCue, router]
  );

  return (
    <section
      className={hubClassName}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div className="ah-table-base" aria-hidden="true"></div>
      <div className="ah-table-light" aria-hidden="true"></div>
      <div className="ah-table-vignette" aria-hidden="true"></div>

      <div className="ah-historic-props" aria-hidden="true">
        <span className="ah-prop ah-prop-map">
          <Image
            src="/assets/hub/argentina-historica-home-ai.png"
            alt=""
            fill
            sizes="240px"
            className="ah-prop-image ah-prop-map-image"
          />
        </span>
        <span className="ah-prop ah-prop-quill">
          <Image
            src="/assets/hub/argentina-historica-home-ai.png"
            alt=""
            fill
            sizes="280px"
            className="ah-prop-image ah-prop-quill-image"
          />
        </span>
        <span className="ah-prop ah-prop-compass">
          <Image
            src="/assets/hub/argentina-historica-home-ai.png"
            alt=""
            fill
            sizes="160px"
            className="ah-prop-image ah-prop-compass-image"
          />
        </span>
        <span className="ah-prop ah-prop-books">
          <Image
            src="/assets/hub/argentina-historica-home-ai.png"
            alt=""
            fill
            sizes="260px"
            className="ah-prop-image ah-prop-books-image"
          />
        </span>
      </div>

      <div className="ah-object-stage">
        <button
          type="button"
          className="ah-object ah-collection-object"
          disabled={busy}
          aria-label="Abrir coleccion de figuritas"
          onPointerEnter={() => {
            setHovered("figuritas");
            playCue("hover");
          }}
          onPointerLeave={() => setHovered(null)}
          onClick={() => navigate("figuritas", "/figuritas")}
        >
          <span className="ah-object-reader">Figuritas</span>
          <span className="ah-object-shadow"></span>
          <span className="ah-object-glow"></span>

          <span className="ah-collection-lid" aria-hidden="true">
            <Image
              src="/assets/hub/argentina-historica-home-ai.png"
              alt=""
              fill
              sizes="280px"
              className="ah-collection-lid-image"
            />
          </span>

          <span className="ah-collection-tin">
            <Image
              src="/assets/hub/argentina-historica-home-ai.png"
              alt=""
              fill
              sizes="360px"
              className="ah-collection-tin-image"
            />
            <span className="ah-collection-tin-rim"></span>
            <span className="ah-collection-metal-lip"></span>
          </span>

          <span className="ah-preview-stack">
            {previewCards.map((card) => (
              <span
                className={`ah-preview-card ${card.className}`}
                key={card.className}
              >
                <Image
                  src={card.src}
                  alt={card.alt}
                  fill
                  sizes="150px"
                  className="ah-preview-card-image"
                />
                <span className="ah-preview-card-gloss"></span>
              </span>
            ))}
            <span className="ah-loose-preview-card" aria-hidden="true">
              <Image
                src="/cards/historicas/sanmartin.png"
                alt=""
                fill
                sizes="120px"
                className="ah-loose-preview-card-image"
              />
            </span>
            <span className="ah-rubber-band"></span>
            <span className="ah-rubber-band-highlight"></span>
          </span>
        </button>

        <button
          type="button"
          className="ah-object ah-album-object"
          disabled={busy}
          aria-label="Abrir album Argentina Historica"
          onPointerEnter={() => {
            setHovered("album");
            playCue("hover");
          }}
          onPointerLeave={() => setHovered(null)}
          onClick={() => navigate("album", "/album?intro=1")}
        >
          <span className="ah-object-reader">Album</span>
          <span className="ah-object-shadow"></span>
          <span className="ah-object-glow"></span>
          <span className="ah-album-contact-shadow"></span>
          <span className="ah-album-pages"></span>
          <span className="ah-album-page-fore-edge"></span>
          <span className="ah-album-spine"></span>
          <span className="ah-album-cover">
            <Image
              src="/assets/hub/argentina-historica-cover.png"
              alt=""
              fill
              sizes="(max-width: 720px) 48vw, 420px"
              className="ah-album-cover-image"
              priority
            />
            <span className="ah-album-cover-gloss"></span>
            <span className="ah-album-cover-bevel"></span>
            <span className="ah-album-cover-wear"></span>
            <span className="ah-album-cover-depth"></span>
          </span>
        </button>

        <button
          type="button"
          className="ah-object ah-pack-stack"
          disabled={busy}
          aria-label="Abrir sobres Argentina Historica"
          onPointerEnter={() => {
            setHovered("sobres");
            playCue("hover");
          }}
          onPointerLeave={() => setHovered(null)}
          onClick={() => navigate("sobres", "/sobres")}
        >
          <span className="ah-object-reader">Sobres</span>
          <span className="ah-object-shadow"></span>
          <span className="ah-object-glow"></span>
          {packStack.map((className, index) => (
            <span
              className={`ah-pack-photo ${className}`}
              key={className}
            >
              <Image
                src="/assets/hub/paquete-principal-clean.png"
                alt=""
                fill
                sizes="220px"
                className="ah-pack-photo-image"
                priority={index === 1}
              />
              <span className="ah-pack-brand-patch">
                Argentina Historica
              </span>
              <span className="ah-pack-thickness"></span>
              <span className="ah-pack-foil"></span>
            </span>
          ))}
        </button>
      </div>
    </section>
  );
}

