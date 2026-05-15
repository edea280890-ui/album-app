import { Card } from "../types/Card";

type CardVisualStyle = {
  background: string;
  border: string;
  color: string;
  boxShadow?: string;
};

export const getCardStyle = (card: Card): CardVisualStyle => {

  switch (card.rareza) {

    case "Simple":
      return {
        background:
          "linear-gradient(135deg, #1c3341, #0d161c)",

        border:
          "1px solid rgba(142, 202, 230, 0.9)",

        color: "white",

        boxShadow:
          "0 10px 24px rgba(0,0,0,0.28)"
      };

    case "Especial":
      return {
        background:
          "linear-gradient(135deg, #0d2f58 0%, #f7fbff 48%, #0d2f58 100%)",

        border:
          "2px solid rgba(216, 244, 255, 0.95)",

        color: "white",

        boxShadow:
          "0 0 18px rgba(58,134,255,0.62), inset 0 0 22px rgba(255,255,255,0.18)"
      };

    case "Combinable":
      return {
        background:
          "linear-gradient(135deg, #24190d, #10130f)",

        border:
          "1px solid rgba(255,255,255,0.18)",

        color: "white",

        boxShadow:
          "0 0 14px rgba(87,204,153,0.52), inset 0 0 22px rgba(87,204,153,0.12)"
      };

    case "Dorada":
      return {
        background:
          "linear-gradient(135deg, #6a4b08, #1f1602 52%, #d7a928)",

        border:
          "2px solid #f5d27a",

        color: "white",

        boxShadow:
          "0 0 22px rgba(255,215,0,0.78), inset 0 0 28px rgba(255,230,130,0.15)"
      };

    case "Legendaria":
      return {
        background:
          "linear-gradient(135deg, #551111, #170405 48%, #9b7318)",

        border:
          "2px solid #f2c766",

        color: "white",

        boxShadow:
          "0 0 28px rgba(242,199,102,0.88), 0 0 54px rgba(170,25,25,0.45)"
      };

    case "Hito":
      return {
        background:
          "linear-gradient(135deg, #5a2e00, #241200)",

        border:
          "2px solid #ffcc66",

        color: "white",

        boxShadow:
          "0 0 22px #ffcc66"
      };

    default:
      return {
        background:
          "#1e1e1e",

        border:
          "1px solid white",

        color:
          "white"
      };
  }
};