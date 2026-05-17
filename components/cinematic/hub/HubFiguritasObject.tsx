"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import obj from "./reference-objects.module.css";

const CARDS = [
  {
    left: "2%",
    bottom: "18%",
    width: "34%",
    rotate: -16,
    z: 1,
    src: "/cards/historicas/belgrano.png"
  },
  {
    left: "26%",
    bottom: "28%",
    width: "32%",
    rotate: -5,
    z: 3,
    src: "/cards/historicas/sanmartin.png"
  },
  {
    left: "48%",
    bottom: "14%",
    width: "30%",
    rotate: 8,
    z: 2,
    src: "/cards/placeholder.svg"
  },
  {
    left: "62%",
    bottom: "0%",
    width: "28%",
    rotate: 14,
    z: 4,
    src: "/cards/placeholder.svg"
  }
] as const;

type Props = {
  disabled: boolean;
  isZooming: boolean;
  onActivate: () => void;
};

const spring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 26
};

export default function HubFiguritasObject({
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
      aria-label="Ver figuritas"
      animate={{ scale: isZooming ? 1.14 : 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="sr-only">Figuritas</span>

      <div className={obj.figInner}>
        {CARDS.map((card, i) => (
          <motion.div
            key={i}
            className={obj.figCard}
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
                    x: i === 0 ? -5 : i === 3 ? 5 : 0,
                    transition: spring
                  }
            }
          >
            <div className={obj.figCardImage}>
              <Image
                src={card.src}
                alt=""
                fill
                sizes="130px"
                className="object-cover"
              />
              <span className={obj.figPaper} aria-hidden="true" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.button>
  );
}
