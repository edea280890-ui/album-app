import Image from "next/image";
import { useEffect } from "react";

type Props = {
  onFinish: () => void;
};

export default function AlbumOpeningCinematic({
  onFinish
}: Props) {
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      onFinish();
    }, 5600);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [onFinish]);

  return (
    <section
      className="album-cinematic-entry"
      aria-label="Apertura cinematografica del album"
    >
      <div className="album-cinematic-vignette"></div>
      <div className="album-cinematic-light"></div>
      <div className="album-cinematic-relics" aria-hidden="true">
        <span className="album-cinematic-relic album-cinematic-relic-map"></span>
        <span className="album-cinematic-relic album-cinematic-relic-ribbon"></span>
        <span className="album-cinematic-relic album-cinematic-relic-seal"></span>
      </div>

      <div className="album-cinematic-dust">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="album-cinematic-camera">
        <div className="album-cinematic-table"></div>
        <div className="album-cinematic-shadow"></div>

        <div className="album-cinematic-book">
          <div className="cinematic-book-back"></div>
          <div className="cinematic-page-stack"></div>

          <div className="cinematic-left-pages">
            <div className="cinematic-page page-one"></div>
            <div className="cinematic-page page-two"></div>
            <div className="cinematic-page page-three"></div>
          </div>

          <div className="cinematic-right-page">
            <div className="cinematic-page-header">
              <span>1800 - 1900</span>
              <strong>Historia viva</strong>
            </div>

            <div className="cinematic-sticker-grid">
              <div className="cinematic-sticker legendary">
                <Image
                  src="/cards/historicas/sanmartin.png"
                  alt=""
                  width={140}
                  height={180}
                />
              </div>

              <div className="cinematic-sticker golden">
                <Image
                  src="/cards/historicas/belgrano.png"
                  alt=""
                  width={140}
                  height={180}
                />
              </div>

              <div className="cinematic-sticker ghost">
                <span>GÃ¼emes</span>
              </div>

              <div className="cinematic-sticker ghost">
                <span>Azurduy</span>
              </div>
            </div>
          </div>

          <div className="cinematic-cover">
            <Image
              src="/assets/hub/argentina-historica-cover.png"
              alt="Portada Argentina Historica"
              width={1086}
              height={1412}
              className="cinematic-cover-image"
              priority
            />

            <div className="cinematic-cover-emboss"></div>
            <div className="cinematic-cover-sheen"></div>
          </div>

          <div className="cinematic-page-ridge"></div>
          <div className="cinematic-turning-page"></div>
        </div>
      </div>

      <div className="album-cinematic-caption">
        <span>Argentina Historica</span>
        <strong>El album se abre</strong>
      </div>

      <button
        className="album-cinematic-skip"
        type="button"
        onClick={onFinish}
      >
        Entrar
      </button>
    </section>
  );
}


