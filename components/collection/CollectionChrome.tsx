"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

import AlbumCover from "@/components/AlbumCover";
import CardViewer from "@/components/CardViewer";
import { TOTAL_ALBUM_CARDS } from "@/data/albumConfig";
import { useAlbumGame } from "@/context/AlbumGameContext";

const MotionLink = motion(Link);

type Props = {
  children: React.ReactNode;
};

export default function CollectionChrome({
  children
}: Props) {
  const pathname = usePathname();
  const isAlbumPage = pathname === "/album";
  const isSobresPage = pathname === "/sobres";
  const isFiguritasPage = pathname === "/figuritas";
  const isImmersivePage =
    isAlbumPage || isSobresPage || isFiguritasPage;

  const {
    selectedCard,
    setSelectedCard,
    getCardStatus,
    pastedCount,
    completionPercentage
  } = useAlbumGame();

  const shellClassName = isAlbumPage
    ? "collection-shell collection-shell-album min-h-screen px-4 pb-16 pt-6 text-white md:px-10 md:pt-10"
    : isSobresPage
      ? "collection-shell collection-shell-sobres min-h-screen px-4 pb-16 pt-6 text-white md:px-10 md:pt-10"
      : isFiguritasPage
        ? "collection-shell collection-shell-figuritas min-h-screen px-4 pb-16 pt-6 text-white md:px-10 md:pt-10"
        : "collection-shell min-h-screen px-4 pb-16 pt-6 text-white md:px-10 md:pt-10";

  return (
    <main
      className={shellClassName}
      style={
        isImmersivePage
          ? undefined
          : {
              background:
                "radial-gradient(circle at top, #2b1f10, #0d0d0d 55%)"
            }
      }
    >
      {!isImmersivePage && <AlbumCover />}

      {selectedCard && (
        <CardViewer
          card={selectedCard}
          status={getCardStatus(selectedCard)}
          onClose={() => setSelectedCard(null)}
        />
      )}

      <MotionLink
        href="/"
        className="group mb-8 inline-flex items-center gap-3 border-0 bg-transparent p-0 outline-none"
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          type: "spring",
          stiffness: 320,
          damping: 28
        }}
        whileHover={{ x: -4 }}
        whileTap={{ scale: 0.98 }}
        aria-label="Volver a la mesa principal"
      >
        <span className="relative flex h-12 w-12 items-center justify-center rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,220,180,0.25)] ring-1 ring-[rgba(212,175,55,0.45)]">
          <span
            className="absolute inset-0 rounded-full opacity-70"
            style={{
              background:
                "radial-gradient(circle at 30% 25%, rgba(255,220,160,0.5), rgba(60,42,28,0.95))"
            }}
          />
          <span className="relative text-lg text-[#1a120c] drop-shadow-sm">
            {"<"}
          </span>
        </span>
        <span className="font-[family-name:var(--font-geist-sans)] text-sm font-semibold tracking-[0.12em] text-[rgba(245,210,122,0.9)] uppercase">
          Mesa
        </span>
      </MotionLink>

      {!isImmersivePage && (
        <section className="collection-status">
          <h1 className="font-[family-name:var(--font-geist-sans)]">
            Argentina Historica
          </h1>
          <p>
            Progreso: {pastedCount}/{TOTAL_ALBUM_CARDS}
            {" - "}
            {completionPercentage}% completado
          </p>
        </section>
      )}

      {children}
    </main>
  );
}

