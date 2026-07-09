const express = require("express");
const cors = require("cors");
const axios = require("axios");

const { obtenerRiesgo } = require("./riesgo");
const { obtenerRutas } = require("./rutas");

const { evaluarRutas } = require("./services/evaluador");

const { buscarLugar } = require("./services/geocoder");

const { obtenerDistrito } = require("./services/reverseGeocoder");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

app.get("/buscar", async (req, res) => {
  try {
    const texto = req.query.q;

    const respuesta = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          format: "json",
          q: `${texto}, Lima, Perú`,
          countrycodes: "pe",
          limit: 5,
        },
        headers: {
          "User-Agent": "RutasCiclistas/1.0",
        },
      },
    );

    res.json(respuesta.data);
  } catch (error) {
    if (error.response) {
      console.log("STATUS:", error.response.status);
      console.log("DATA:", error.response.data);
    } else {
      console.log(error.message);
    }

    res.status(500).json({
      error: error.message,
    });
  }
});

app.get("/reversa", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        error: "Faltan coordenadas lat/lon",
      });
    }

    const distrito = await obtenerDistrito(lat, lon);

    if (!distrito) {
      return res.status(404).json({
        error: "No se pudo determinar el distrito",
      });
    }

    res.json({ distrito });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.get("/riesgo/:distrito", (req, res) => {
  const resultado = obtenerRiesgo(req.params.distrito);

  if (!resultado) {
    return res.status(404).json({
      error: "Distrito no encontrado",
    });
  }

  res.json(resultado);
});

app.post("/ruta", async (req, res) => {
  try {
    const { origen, destino } = req.body;

    const origenGeo = await buscarLugar(origen);

    const destinoGeo = await buscarLugar(destino);

    if (!origenGeo || !destinoGeo) {
      return res.status(404).json({
        error: "No encontrado",
      });
    }

    const rutas = await obtenerRutas(
      origenGeo,

      destinoGeo,
    );

    const evaluadas = evaluarRutas(rutas, origen, destino);

    const recomendada = evaluadas.find((r) => r.recomendada);

    const mensaje = `Se recomienda ${recomendada.tipo} porque presenta un nivel de riesgo ${recomendada.nivel} con ${recomendada.distancia} km de recorrido.`;

    res.json({
      origen: origenGeo,

      destino: destinoGeo,

      recomendacion: mensaje,

      rutas: evaluadas,
    });
  } catch (e) {
    console.log(e);

    res.status(500).json({
      error: e.message,
    });
  }
});

app.listen(3000, () => {
  console.log("Server iniciado");
});
