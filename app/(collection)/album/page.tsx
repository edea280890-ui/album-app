import { Suspense } from "react";

import AlbumCollectionView from "@/components/collection/AlbumCollectionView";

export default function AlbumPage() {
  return (
    <Suspense fallback={null}>
      <AlbumCollectionView />
    </Suspense>
  );
}
