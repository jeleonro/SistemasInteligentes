const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const datos = [];

fs.createReadStream(
    path.join(__dirname, "ML", "dataset", "dataset_final.csv")
)
.pipe(csv())
.on("data", (fila) => {

    datos.push({
        distrito: fila.distrito.trim().toUpperCase(),
        riesgo: Number(fila.riesgo_sutran)
    });

})
.on("end", () => {
    console.log("Dataset cargado:", datos.length);
});

function obtenerRiesgoPorNombre(nombre) {

    if (!nombre) return null;

    const distrito = datos.find(d =>
        d.distrito.toUpperCase().includes(nombre.toUpperCase())
    );

    return distrito || null;
}

module.exports = {
    obtenerRiesgo,
    obtenerRiesgoPorNombre
};

function obtenerRiesgo(distrito){

    const resultado = datos.find(
        d => d.distrito === distrito.trim().toUpperCase()
    );

    if(!resultado){
        return null;
    }

    let nivel = "Bajo";

    if(resultado.riesgo >= 5){

        nivel = "Alto";

    }else if(resultado.riesgo >=2){

        nivel = "Medio";

    }

    return{

        distrito: resultado.distrito,
        riesgo: resultado.riesgo,
        nivel

    };

}

module.exports = {
    obtenerRiesgo
};