const axios = require("axios");

async function obtenerRutas(origen,destino){

    const url=
`https://router.project-osrm.org/route/v1/driving/${origen.lon},${origen.lat};${destino.lon},${destino.lat}?alternatives=true&overview=full&steps=false&geometries=geojson`;

    const {data}=await axios.get(url);

    return data.routes;

}

module.exports={

    obtenerRutas

};