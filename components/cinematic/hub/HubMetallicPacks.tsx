"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { PACK_SOLO, PACKS_TOP } from "./hub-layout";
import styles from "./hub-scene.module.css";

type Props = {
  onActivate: () => void;
  isZooming: boolean;
  disabled: boolean;
};

type PackLayout = {
  left: string;
  top: string;
  rotate: number;
  scale: number;
  z: number;
};

const spring = {
  type: "spring" as const,
  stiffness: 320,
  damping: 30
};

function PackUnit({
  layout,
  index
}: {
  layout: PackLayout;
  index: number;
}) {
  return (
    <motion.div
      className={styles.packUnit}
      style={{
        left: layout.left,
        top: layout.top,
        zIndex: layout.z,
        transform: `rotate(${layout.rotate}deg) scale(${layout.scale})`
      }}
      whileHover={{ y: -4, transition: spring }}
    >
      <div className={styles.packShadow} aria-hidden="true" />
      <div
        className={styles.packBody}
        style={{ transform: "rotateX(10deg) rotateY(-14deg)" }}
      >
        <span className={`${styles.packCrimp} ${styles.packCrimpTop}`} />
        <span className={`${styles.packCrimp} ${styles.packCrimpBottom}`} />
        <span
          className={`${styles.packFaceSide} ${styles.packFaceSideLeft}`}
        />
        <span
          className={`${styles.packFaceSide} ${styles.packFaceSideRight}`}
        />
        <div className={styles.packFaceFront}>
          <Image
            src="/assets/hub/paquete-principal-clean.png"
            alt=""
            fill
            sizes="180px"
            className="object-contain"
            priority={index === 1}
          />
          <span className={styles.packFoilSheen} />
        </div>
      </div>
    </motion.div>
  );
}

export default function HubMetallicPacks({
  onActivate,
  isZooming,
  disabled
}: Props) {
  const allPacks: PackLayout[] = [
    ...PACKS_TOP,
    PACK_SOLO
  ];

  return (
    <motion.button
      type="button"
      className={`${styles.interactive} ${styles.packsAnchor} ${styles.focusRing}`}
      onClick={onActivate}
      disabled={disabled}
      aria-label="Abrir sobres metalizados"
      initial={{ opacity: 0, x: 24 }}
      animate={{
        opacity: 1,
        x: 0,
        scale: isZooming ? 1.18 : 1
      }}
      transition={{
        delay: 0.3,
        duration: isZooming ? 0.85 : 0.95,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={
        disabled ? undefined : { scale: 1.02, transition: spring }
      }
    >
      <span className="sr-only">Sobres — abrir sobres</span>
      {allPacks.map((layout, i) => (
        <PackUnit key={i} layout={layout} index={i} />
      ))}
    </motion.button>
  );
}
