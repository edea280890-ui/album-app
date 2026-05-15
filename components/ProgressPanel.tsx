import { ALBUM_PAGES, TOTAL_ALBUM_CARDS } from "../data/albumConfig";
import { Card } from "../types/Card";

type Props = {
  album: Card[];
  cards: Card[];
  completedPages: string[];
};

export default function ProgressPanel({
  album,
  cards,
  completedPages
}: Props) {
  const legendarias = album.filter(
    (card) => card.rareza === "Legendaria"
  ).length;

  const doradas = album.filter(
    (card) => card.rareza === "Dorada"
  ).length;

  const hitos = album.filter(
    (card) => card.rareza === "Hito"
  ).length;

  const repetidas = cards.length;

  const porcentaje = (
    (album.length / TOTAL_ALBUM_CARDS) *
    100
  ).toFixed(1);

  return (
    <div
      style={{
        marginTop: 30,
        padding: 20,
        border: "2px solid #d4af37",
        borderRadius: 16,
        background: "#161616",
        color: "white"
      }}
    >
      <h2>Panel de Progreso</h2>

      <p>Álbum: {album.length}/{TOTAL_ALBUM_CARDS}</p>

      <p>Completado: {porcentaje}%</p>

      <p>Páginas completas: {completedPages.length}/{ALBUM_PAGES.length}</p>

      <p>Hitos desbloqueados: {hitos}</p>

      <p>Doradas pegadas: {doradas}</p>

      <p>Legendarias pegadas: {legendarias}</p>

      <p>Figuritas en inventario/repetidas: {repetidas}</p>
    </div>
  );
}
