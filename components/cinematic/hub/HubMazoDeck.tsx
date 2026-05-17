"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import styles from "./hub-scene.module.css";

type Props = {
  onActivate: () => void;
  disabled: boolean;
};

const spring = {
  type: "spring" as const,
  stiffness: 380,
  damping: 26
};

export default function HubMazoDeck({
  onActivate,
  disabled
}: Props) {
  return (
    <motion.button
      type="button"
      className={`${styles.interactive} ${styles.mazoAnchor} ${styles.focusRing}`}
      onClick={onActivate}
      disabled={disabled}
      aria-label="Ver mazo de figuritas"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.28, duration: 0.85 }}
      whileHover={
        disabled
          ? undefined
          : { y: -8, scale: 1.04, transition: spring }
      }
    >
      <span className="sr-only">Mazo — inventario</span>

      <div className={styles.mazoStack}>
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            className={styles.mazoCardLayer}
            style={{
              transform: `translateY(${i * 2.5}px) rotate(${i * 0.25 - 0.8}deg)`,
              zIndex: i
            }}
          />
        ))}

        <div className={styles.mazoTopCard}>
          <Image
            src="/cards/historicas/sanmartin.png"
            alt=""
            fill
            sizes="160px"
            className="object-cover"
          />
        </div>

        <span className={styles.mazoBand} aria-hidden="true" />
      </div>
    </motion.button>
  );
}
