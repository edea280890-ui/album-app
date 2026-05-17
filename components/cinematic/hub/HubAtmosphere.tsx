"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring
} from "framer-motion";

type Props = {
  children: React.ReactNode;
  onPointerTrack: (x: number, y: number) => void;
  onPointerReset: () => void;
};

export default function HubAtmosphere({
  children,
  onPointerTrack,
  onPointerReset
}: Props) {
  const pointerX = useMotionValue(32);
  const pointerY = useMotionValue(28);
  const lightX = useSpring(pointerX, {
    stiffness: 70,
    damping: 26
  });
  const lightY = useSpring(pointerY, {
    stiffness: 70,
    damping: 26
  });

  const spotlight = useMotionTemplate`radial-gradient(48vw 40vw at ${lightX}% ${lightY}%, rgba(255, 198, 130, 0.42) 0%, rgba(255, 160, 90, 0.1) 38%, transparent 68%)`;

  const handlePointerMove = (
    event: React.PointerEvent<HTMLElement>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x =
      ((event.clientX - rect.left) / rect.width) * 100;
    const y =
      ((event.clientY - rect.top) / rect.height) * 100;
    pointerX.set(x);
    pointerY.set(y);
    onPointerTrack(x, y);
  };

  return (
    <section
      className="relative isolate min-h-screen w-full overflow-hidden bg-[#050302] text-white"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        pointerX.set(32);
        pointerY.set(28);
        onPointerReset();
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }}
      />

      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[#1a0e08] via-[#0e0806] to-[#030201]" />

      <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_90%_60%_at_28%_18%,rgba(120,60,30,0.35),transparent_55%)]" />

      <motion.div
        className="pointer-events-none absolute inset-0 z-[3]"
        style={{ background: spotlight }}
      />

      <motion.div
        className="pointer-events-none absolute inset-0 z-[4] bg-[radial-gradient(ellipse_at_center,transparent_28%,rgba(0,0,0,0.72)_100%)]"
      />

      <div
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          maskImage:
            "radial-gradient(ellipse 82% 72% at 50% 48%, transparent 22%, black 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 82% 72% at 50% 48%, transparent 22%, black 100%)"
        }}
      />

      <motion.div
        className="relative z-10 mx-auto flex min-h-screen max-w-[1520px] flex-col items-center justify-center px-3 py-6 sm:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </section>
  );
}
