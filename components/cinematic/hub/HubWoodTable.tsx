import { HUB_TABLE } from "./hub-layout";
import styles from "./hub-scene.module.css";

const SCRATCHES = [
  { left: "18%", top: "42%", width: "20%", height: "2px", rotate: -3 },
  { left: "48%", top: "68%", width: "16%", height: "1px", rotate: 2 },
  { left: "70%", top: "35%", width: "12%", height: "2px", rotate: -6 }
];

export default function HubWoodTable({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={styles.tableFrame}
      style={{ maxWidth: HUB_TABLE.maxWidthPx }}
    >
      <div
        className={`${styles.tableSurface} ${styles.woodGrain}`}
        style={{
          maxHeight: `min(${HUB_TABLE.maxHeightVh}vh, 900px)`,
          transform: `rotateX(${HUB_TABLE.perspectiveRotateX}deg)`
        }}
      >
        {SCRATCHES.map((s, i) => (
          <span
            key={i}
            className={styles.woodScratch}
            style={{
              left: s.left,
              top: s.top,
              width: s.width,
              height: s.height,
              transform: `rotate(${s.rotate}deg)`
            }}
          />
        ))}

        <div className={styles.propParchment} aria-hidden="true" />
        <div className={styles.propBooks} aria-hidden="true" />

        <div
          className={styles.objectsLayer}
          style={{ inset: HUB_TABLE.objectsInset }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
