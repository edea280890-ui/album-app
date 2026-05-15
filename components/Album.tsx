import { Card } from "../types/Card";

type Props = {
  album: Card[];
};

export default function Album({
  album
}: Props) {

  return (

    <div>

      <h2>Álbum</h2>

      {album.map((card, index) => (

        <div
          key={index}
          style={{
            border: "1px solid green",
            padding: 20,
            marginBottom: 10,
            width: 250
          }}
        >

          <h3>{card.nombre}</h3>

          <p>{card.rareza}</p>

          <p>{card.codigo}</p>

        </div>

      ))}

    </div>

  );

}
