"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import styles from "./hub-scene.module.css";

type Props = {
  onActivate: () => void;
  isOpening: boolean;
  disabled: boolean;
};

const spring = {
  type: "spring" as const,
  stiffness: 380,
  damping: 26
};

export default function HubPhysicalAlbum({
  onActivate,
  isOpening,
  disabled
}: Props) {
  return (
    <motion.button
      type="button"
      className={`${styles.interactive} ${styles.albumAnchor} ${styles.focusRing} group`}
      onClick={onActivate}
      disabled={disabled}
      aria-label="Abrir el album Argentina Historica"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      whileHover={
        disabled
          ? undefined
          : { y: -8, scale: 1.015, transition: spring }
      }
      whileTap={disabled ? undefined : { scale: 0.99 }}
    >
      <span className="sr-only">Ãlbum â€” abrir colecciÃ³n</span>

      <div className={styles.albumShadow} aria-hidden="true" />

      <motion.div
        className={styles.albumBody}
        animate={
          isOpening
            ? { y: -18, rotateY: -6, scale: 1.03 }
            : {}
        }
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.albumSpine} aria-hidden="true">
          <span className={styles.albumSpineBand} />
        </div>

        <div className={styles.albumPages} aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className={styles.albumPageSheet}
              style={{
                transform: `translateX(${i * 1.2}px)`,
                opacity: 0.92 - i * 0.04
              }}
            />
          ))}
        </div>

        <motion.div
          className={styles.albumCoverFront}
          animate={isOpening ? { rotateY: -112 } : { rotateY: 0 }}
          transition={{
            duration: 1.15,
            ease: [0.22, 1, 0.36, 1]
          }}
          style={{
            transformOrigin: "left center",
            transformStyle: "preserve-3d"
          }}
        >
          <div className={styles.albumCoverFace}>
            <Image
              src="/assets/hub/argentina-historica-cover.png"
              alt=""
              fill
              sizes="300px"
              className="object-cover"
              priority
            />
            <span className={styles.albumEmboss} />
            <span className={styles.albumGoldSheen} />
          </div>
          <span className={styles.albumCoverEdge} aria-hidden="true" />
        </motion.div>
      </motion.div>
    </motion.button>
  );
}

