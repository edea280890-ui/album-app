"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import obj from "./reference-objects.module.css";

type Props = {
  disabled: boolean;
  isOpening: boolean;
  onActivate: () => void;
};

const spring = {
  type: "spring" as const,
  stiffness: 340,
  damping: 28
};

export default function HubAlbumObject({
  disabled,
  isOpening,
  onActivate
}: Props) {
  return (
    <motion.button
      type="button"
      className={`${obj.spriteRoot} ${obj.albumSprite}`}
      onClick={onActivate}
      disabled={disabled}
      aria-label="Abrir el album Argentina Historica"
      whileHover={
        disabled
          ? undefined
          : { y: -6, scale: 1.012, transition: spring }
      }
      whileTap={disabled ? undefined : { scale: 0.995 }}
    >
      <span className="sr-only">Ãlbum</span>

      <motion.div
        className={obj.albumInner}
        animate={
          isOpening
            ? { y: -12, scale: 1.02 }
            : {}
        }
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={obj.albumSpine} aria-hidden="true" />
        <div className={obj.albumPages} aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className={obj.albumPage}
              style={{ transform: `translateX(${i}px)` }}
            />
          ))}
        </div>

        <motion.div
          className={obj.albumCover}
          animate={isOpening ? { rotateY: -108 } : { rotateY: 0 }}
          transition={{
            duration: 1.1,
            ease: [0.22, 1, 0.36, 1]
          }}
          style={{ transformOrigin: "left center" }}
        >
          <div className={obj.albumCoverImage}>
            <Image
              src="/assets/hub/argentina-historica-cover.png"
              alt=""
              fill
              sizes="(max-width: 900px) 60vw, 520px"
              className="object-cover"
              priority
            />
          </div>
          <span className={obj.albumSheen} aria-hidden="true" />
        </motion.div>
      </motion.div>
    </motion.button>
  );
}

