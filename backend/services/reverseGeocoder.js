const axios = require("axios");

async function obtenerDistrito(lat, lon) {

    try {

        const { data } = await axios.get(
            "https://nominatim.openstreetmap.org/reverse",
            {
                params: {
                    format: "json",
                    lat,
                    lon
                },
                headers: {
                    "User-Agent": "SistemaInteligente"
                }
            }
        );

        const address = data.address || {};

        return (
            address.city_district ||
            address.suburb ||
            address.city ||
            address.county ||
            null
        );

    } catch {

        return null;

    }

}

module.exports = {
    obtenerDistrito
};