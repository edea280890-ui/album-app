import ReferenceInteractiveHub from "@/components/cinematic/hub/ReferenceInteractiveHub";

type Props = {
  onOpenFiguritas: () => void;
  onOpenAlbum: () => void;
  onOpenSobres: () => void;
};

export default function GameTable({
  onOpenFiguritas,
  onOpenAlbum,
  onOpenSobres
}: Props) {
  return (
    <ReferenceInteractiveHub
      fallbackHandlers={{
        onOpenFiguritas,
        onOpenAlbum,
        onOpenSobres
      }}
    />
  );
}
