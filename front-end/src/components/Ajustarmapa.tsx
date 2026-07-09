import { useMap } from "react-leaflet";
import React, { useEffect } from "react";

interface AjustarmapaPROPS{
    ruta: [number, number][];
}

const Ajustarmapa: React.FC<AjustarmapaPROPS> = ({ruta}) => {
    const map = useMap();

    useEffect(() => {
        if (ruta.length > 0){
            map.fitBounds(ruta);
        }
    }, [ruta, map]);
    return null;
};

export default Ajustarmapa;