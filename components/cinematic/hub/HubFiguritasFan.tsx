"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { FIGURITAS_FAN } from "./hub-layout";
import styles from "./hub-scene.module.css";

type Props = {
  onActivate: () => void;
  isZooming: boolean;
  disabled: boolean;
};

const spring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 26
};

export default function HubFiguritasFan({
  onActivate,
  isZooming,
  disabled
}: Props) {
  return (
    <motion.button
      type="button"
      className={`${styles.interactive} ${styles.figuritasAnchor} ${styles.focusRing}`}
      onClick={onActivate}
      disabled={disabled}
      aria-label="Ver figuritas del inventario"
      initial={{ opacity: 0, y: 16 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isZooming ? 1.15 : 1
      }}
      transition={{
        delay: 0.4,
        duration: isZooming ? 0.8 : 0.95,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      <span className="sr-only">Figuritas — inventario</span>

      {FIGURITAS_FAN.map((card, i) => (
        <motion.div
          key={card.name}
          className={styles.figCard}
          style={{
            left: card.left,
            bottom: card.bottom,
            width: card.width,
            zIndex: card.z,
            rotate: `${card.rotate}deg`
          }}
          whileHover={
            disabled
              ? undefined
              : {
                  y: -10,
                  x: i === 0 ? -6 : i === 3 ? 6 : 0,
                  rotate: card.rotate * 0.55,
                  transition: spring
                }
          }
        >
          <div className={styles.figCardFace}>
            <Image
              src={card.src}
              alt=""
              fill
              sizes="140px"
              className="object-cover"
            />
            <span className={styles.figCardPaper} />
          </div>
          <span className={styles.figCardEdge} aria-hidden="true" />
        </motion.div>
      ))}
    </motion.button>
  );
}
