const API_URL = import.meta.env.VITE_API_URL;

export const buscarLugar = async (texto: string) => {
  const respuesta = await fetch(
    `${API_URL}/buscar?q=${encodeURIComponent(texto)}`
  );

  if (!respuesta.ok) {
    throw new Error("Error al buscar el lugar");
  }

  return await respuesta.json();
};
