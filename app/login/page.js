"use client";

import { supabase } from "@/lib/supabase";

export default function Home() {

  const testConnection = async () => {
    const { error } = await supabase.auth.getSession();

    alert(
      error
        ? "No se pudo conectar con Supabase"
        : "Supabase conectado"
    );
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Álbum Virtual</h1>

      <button onClick={testConnection}>
        Probar Supabase
      </button>
    </div>
  );
}
