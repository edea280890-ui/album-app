export default function AlbumCover() {
  return (
    <section
      style={{
        position: "relative",

        padding: "80px 40px",

        borderRadius: 28,

        overflow: "hidden",

        marginBottom: 50,

        background:
          "linear-gradient(135deg, #3b2400, #120d08)",

        border:
          "2px solid rgba(212,175,55,0.4)",

        boxShadow:
          "0 20px 60px rgba(0,0,0,0.45)"
      }}
    >
      {/* brillo */}
      <div
        style={{
          position: "absolute",
          inset: 0,

          background:
            "radial-gradient(circle at top, rgba(255,215,0,0.18), transparent 60%)",

          pointerEvents: "none"
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center"
        }}
      >
        <h1
          style={{
            fontSize: 64,
            margin: 0,
            marginBottom: 12,

            letterSpacing: 3,

            color: "#f5d27a",

            textShadow:
              "0 0 18px rgba(255,215,0,0.4)"
          }}
        >
          ÁLBUM HISTÓRICO
        </h1>

        <h2
          style={{
            fontSize: 28,
            fontWeight: 400,
            opacity: 0.9,
            marginBottom: 30
          }}
        >
          Historia Argentina
        </h2>

        <p
          style={{
            maxWidth: 700,
            margin: "0 auto",
            lineHeight: 1.7,
            opacity: 0.82,
            fontSize: 18
          }}
        >
          Coleccioná personajes históricos,
          descubrí hitos fundamentales y
          completá el recorrido visual de la
          historia argentina.
        </p>
      </div>
    </section>
  );
}