import Image from "next/image";
import { useEffect } from "react";
import { useCinematicAudio } from "@/context/CinematicAudioContext";

type Props = {
  openingPack: boolean;
};

export default function PackOpening({
  openingPack
}: Props) {
  const { playCue } = useCinematicAudio();

  useEffect(() => {
    if (openingPack) {
      playCue("packTear");
    }
  }, [openingPack, playCue]);

  return (
    <div className="pack-opening-scene">
      <div className="pack-table-shadow"></div>
      <div className="pack-stage-glow"></div>

      <div
        className={
          openingPack
            ? "real-pack real-pack-opening"
            : "real-pack"
        }
      >
        <div className="pack-tactile-aura" aria-hidden="true"></div>
        <div className="pack-reward-sparks" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="pack-light"></div>
        <div className="pack-inner-glow-core" aria-hidden="true"></div>
        <div className="pack-dust pack-dust-a"></div>
        <div className="pack-dust pack-dust-b"></div>
        <div className="pack-dust pack-dust-c"></div>

        <div className="emerging-card emerging-card-a">
          <div className="emerging-card-face"></div>
        </div>
        <div className="emerging-card emerging-card-b">
          <div className="emerging-card-face"></div>
        </div>
        <div className="emerging-card emerging-card-c">
          <div className="emerging-card-face"></div>
        </div>
        <div className="emerging-card emerging-card-d">
          <div className="emerging-card-face"></div>
        </div>
        <div className="emerging-card emerging-card-e">
          <div className="emerging-card-face"></div>
        </div>

        <div className="real-pack-back"></div>
        <div className="pack-printed-skin" aria-hidden="true">
          <Image
            src="/assets/hub/paquete-principal-clean.png"
            alt=""
            fill
            sizes="340px"
            className="pack-printed-skin-image"
            priority
          />
        </div>
        <div className="pack-foil-grain"></div>
        <div className="pack-metal-sheen"></div>
        <div className="pack-side-rail pack-side-rail-left"></div>
        <div className="pack-side-rail pack-side-rail-right"></div>
        <div className="pack-crimp pack-crimp-top"></div>
        <div className="pack-crimp pack-crimp-bottom"></div>

        <div className="pack-open-mouth">
          <div className="pack-inner-foil"></div>
        </div>

        <div className="pack-front-brand pack-front-brand-base">
          <div className="pack-brand-ingot" aria-hidden="true">
            ARGENTINA HISTORICA
          </div>

          <div className="pack-logo-plate">
            <Image
              src="/brand/pack-shield-clean.png"
              alt="Escudo argentino"
              width={280}
              height={320}
              className="pack-shield"
              priority
            />
          </div>

          <div className="pack-front-copy">
            <strong>ARGENTINA HISTORICA</strong>
            <span>Figuritas historicas</span>
          </div>
        </div>

        <div className="pack-tear-layer">
          <div className="pack-tear-print-skin" aria-hidden="true">
            <Image
              src="/assets/hub/paquete-principal-clean.png"
              alt=""
              fill
              sizes="340px"
              className="pack-tear-print-skin-image"
              priority
            />
          </div>
          <div className="pack-side-stripe pack-side-stripe-left"></div>
          <div className="pack-side-stripe pack-side-stripe-right"></div>

          <div className="pack-tear-layer-brand">
            <Image
              src="/brand/pack-shield-clean.png"
              alt="Escudo argentino"
              width={230}
              height={270}
              className="pack-tear-shield"
              priority
            />
          </div>
        </div>

        <div className="pack-tear-grip"></div>
        <div className="pack-rip-strip">
          <span className="pack-rip-strip-fiber"></span>
        </div>
        <div className="pack-paper-fiber pack-paper-fiber-a"></div>
        <div className="pack-paper-fiber pack-paper-fiber-b"></div>
        <div className="pack-paper-fiber pack-paper-fiber-c"></div>

        <div className="real-pack-flap">
          <div className="pack-flap-paper"></div>
        </div>

        <div className="real-pack-tear-line"></div>
        <div className="pack-torn-edge"></div>
        <div className="pack-torn-corner pack-torn-corner-left"></div>
        <div className="pack-torn-corner pack-torn-corner-right"></div>
      </div>
    </div>
  );
}


