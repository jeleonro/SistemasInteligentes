const { obtenerRiesgoPorNombre } = require("../riesgo");

function nivel(valor){

    if(valor < 2)
        return "Bajo";

    if(valor < 5)
        return "Medio";

    return "Alto";
}

function evaluarRutas(rutas, origen, destino){

    const riesgoOrigen = obtenerRiesgoPorNombre(origen);
    const riesgoDestino = obtenerRiesgoPorNombre(destino);

    const riesgoBase = (
        ((riesgoOrigen?.riesgo || 3) +
        (riesgoDestino?.riesgo || 3)) / 2
    );

    const resultado = rutas.map((ruta,index)=>{

        const distancia = ruta.distance / 1000;

        const tiempo = ruta.duration / 60;

        // Penalizamos un poco las rutas largas
        const riesgo = riesgoBase + (distancia * 0.10);

        return{

            id:index+1,

            geometry:ruta.geometry,

            distancia:Number(distancia.toFixed(2)),

            tiempo:Math.round(tiempo),

            riesgo:Number(riesgo.toFixed(2)),

            nivel:nivel(riesgo)

        };

    });

    resultado.sort((a,b)=>a.riesgo-b.riesgo);

    resultado.forEach((r,i)=>{

        if(i===0){

            r.tipo="Ruta segura";
            r.recomendada=true;

        }else if(i===1){

            r.tipo="Ruta corta";

        }else{

            r.tipo="Ruta alternativa";

        }

    });

    return resultado;

}

module.exports={

    evaluarRutas

};