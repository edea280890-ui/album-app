"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import obj from "./reference-objects.module.css";

const PACKS = [
  { right: "38%", top: "2%", rotate: -18, scale: 0.92, z: 1 },
  { right: "8%", top: "12%", rotate: -4, scale: 1, z: 3 },
  { right: "10%", bottom: "6%", rotate: 12, scale: 0.94, z: 2 }
] as const;

type Props = {
  disabled: boolean;
  isZooming: boolean;
  onActivate: () => void;
};

const spring = {
  type: "spring" as const,
  stiffness: 320,
  damping: 28
};

export default function HubPacksObject({
  disabled,
  isZooming,
  onActivate
}: Props) {
  return (
    <motion.button
      type="button"
      className={obj.spriteRoot}
      onClick={onActivate}
      disabled={disabled}
      aria-label="Abrir sobres metalizados"
      animate={{ scale: isZooming ? 1.12 : 1 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      whileHover={
        disabled ? undefined : { scale: 1.02, transition: spring }
      }
    >
      <span className="sr-only">Sobres</span>

      <div className={obj.packsInner}>
        {PACKS.map((pack, i) => (
          <motion.div
            key={i}
            className={obj.packItem}
            style={{
              right: pack.right,
              top: "top" in pack ? pack.top : undefined,
              bottom: "bottom" in pack ? pack.bottom : undefined,
              zIndex: pack.z,
              transform: `rotate(${pack.rotate}deg) scale(${pack.scale})`
            }}
            whileHover={
              disabled ? undefined : { y: -5, transition: spring }
            }
          >
            <div className={obj.packItemImage}>
              <Image
                src="/assets/hub/paquete-principal-clean.png"
                alt=""
                fill
                sizes="220px"
                className="object-contain"
                priority={i === 1}
              />
              <span className={obj.packSheen} aria-hidden="true" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.button>
  );
}
