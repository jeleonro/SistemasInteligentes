import "./Mapa.css";

import L from "leaflet";

import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { Geolocation } from "@capacitor/geolocation";

import { Polyline, useMap } from "react-leaflet";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

import React, { useEffect, useRef, useState } from "react";

import Ajustarmapa from "./Ajustarmapa";

const ZOOM_INICIAL = 15;
const ZOOM_NAVEGACION = 18;
const ZOOM_MAX = 19;

interface MapaProps {
  ruta?: [number, number][];
  navegando?: boolean;
}

const Mapa: React.FC<MapaProps> = ({ ruta, navegando }) => {
  const iconoOrigen = L.icon({
    iconUrl: "/assets/ciclista_icono 512x512.png",
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });

  const iconoDestino = L.icon({
    iconUrl: "/assets/iconodestino 512x512.png",
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });

  // Icono para la posición GPS en vivo (mismo estilo de ciclista, con sombra)
  const iconoPosicionActual = L.icon({
    iconUrl: "/assets/ciclista_icono 512x512.png",
    shadowUrl: markerShadow,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    shadowSize: [36, 36],
    shadowAnchor: [12, 18]
  });

  const [posicion, setposicion] = useState<[number, number] | null>(null);
  const watchIdRef = useRef<string | null>(null);

  const obtenerubicacion = async () => {
    try {
      const coordenadas = await Geolocation.getCurrentPosition();

      setposicion([
        coordenadas.coords.latitude,
        coordenadas.coords.longitude
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const iniciarseguimiento = async () => {
    try {
      const watchId = await Geolocation.watchPosition(
        {
          enableHighAccuracy: true
        },
        (posicion) => {
          if (!posicion) return;

          setposicion([
            posicion.coords.latitude,
            posicion.coords.longitude
          ]);
        }
      );

      watchIdRef.current = watchId;
    } catch (error) {
      console.log(error);
    }
  };

  // Solo re-centra la cámara sobre el usuario durante la navegación activa.
  // Fuera de navegación, Ajustarmapa es quien controla la vista (fitBounds
  // sobre toda la ruta), así que no debemos pelear con ella en cada
  // actualización de GPS.
  const SeguirMapa = ({ posicion }: { posicion: [number, number] }) => {
    const map = useMap();

    useEffect(() => {
      if (navegando) {
        map.setView(posicion, ZOOM_NAVEGACION, { animate: true });
      }
    }, [posicion, map]);

    return null;
  };

  useEffect(() => {
    obtenerubicacion();
    iniciarseguimiento();

    return () => {
      if (watchIdRef.current) {
        Geolocation.clearWatch({ id: watchIdRef.current });
      }
    };
  }, []);

  if (!posicion) {
    return <p>Obteniendo posicion...</p>;
  }

  return (
    <MapContainer center={posicion} zoom={ZOOM_INICIAL} className="mapa">
      <SeguirMapa posicion={posicion} />

      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={ZOOM_MAX}
      />

      <Marker position={posicion} icon={iconoPosicionActual}>
        <Popup>Tu ubicación</Popup>
      </Marker>

      {ruta && ruta.length > 0 && (
        <>
          {!navegando && <Ajustarmapa ruta={ruta} />}

          <Marker position={ruta[0]} icon={iconoOrigen}>
            <Popup>Origen</Popup>
          </Marker>

          <Marker position={ruta[ruta.length - 1]} icon={iconoDestino}>
            <Popup>Destino</Popup>
          </Marker>

          <Polyline
            positions={ruta}
            pathOptions={{ color: "orange", weight: 4 }}
          />
        </>
      )}
    </MapContainer>
  );
};

export default Mapa;
