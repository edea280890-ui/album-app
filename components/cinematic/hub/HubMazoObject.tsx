"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import obj from "./reference-objects.module.css";

type Props = {
  disabled: boolean;
  onActivate: () => void;
};

const spring = {
  type: "spring" as const,
  stiffness: 340,
  damping: 26
};

export default function HubMazoObject({
  disabled,
  onActivate
}: Props) {
  return (
    <motion.button
      type="button"
      className={obj.spriteRoot}
      onClick={onActivate}
      disabled={disabled}
      aria-label="Ver mazo de figuritas"
      whileHover={
        disabled
          ? undefined
          : { y: -6, scale: 1.03, transition: spring }
      }
    >
      <span className="sr-only">Mazo</span>

      <div className={obj.mazoInner}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={obj.mazoLayer}
            style={{
              transform: `translateY(${i * 2.2}px) rotate(${i * 0.2 - 0.6}deg)`,
              zIndex: i
            }}
          />
        ))}

        <div className={obj.mazoFace}>
          <Image
            src="/cards/historicas/sanmartin.png"
            alt=""
            fill
            sizes="140px"
            className="object-cover"
          />
        </div>

        <span className={obj.mazoBand} aria-hidden="true" />
      </div>
    </motion.button>
  );
}
