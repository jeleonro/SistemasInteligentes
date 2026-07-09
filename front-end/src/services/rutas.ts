const API_URL = import.meta.env.VITE_API_URL;

export const obtenerRuta = async (origen: string, destino: string) => {
  const respuesta = await fetch(`${API_URL}/ruta`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      origen,
      destino,
    }),
  });

  if (!respuesta.ok) {
    throw new Error(`Error al obtener la ruta (${respuesta.status})`);
  }

  return await respuesta.json();
};

export const obtenerDistritoActual = async (lat: number, lon: number) => {
  const respuesta = await fetch(
    `${API_URL}/reversa?lat=${lat}&lon=${lon}`
  );

  if (!respuesta.ok) {
    throw new Error("No se pudo determinar tu distrito actual");
  }

  const datos = await respuesta.json();
  return datos.distrito as string;
};
