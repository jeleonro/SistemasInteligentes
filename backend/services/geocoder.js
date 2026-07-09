const axios = require("axios");

async function buscarLugar(nombre) {

    const { data } = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
            params: {
                q: `${nombre}, Lima, Perú`,
                format: "json",
                limit: 1
            },
            headers: {
                "User-Agent": "SistemaInteligente"
            }
        }
    );

    if (!data.length) return null;

    return {
        nombre,
        lat: Number(data[0].lat),
        lon: Number(data[0].lon)
    };
}

module.exports = { buscarLugar };