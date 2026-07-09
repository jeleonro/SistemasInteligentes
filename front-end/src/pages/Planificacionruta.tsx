import {
  IonContent,
  IonPage,
  IonInput,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonSpinner,
} from "@ionic/react";

import { Geolocation } from "@capacitor/geolocation";
import { useEffect, useState } from "react";
import "./Planificacionruta.css";

import Header from "../components/Header";
import Mapa from "../components/Mapa";

import { obtenerRuta, obtenerDistritoActual } from "../services/rutas";
import { buscarLugar } from "../services/codificar_ruta";

const Planificacionruta: React.FC = () => {
  const [ubicacionActual, setubicacionActual] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  // Nombre del distrito/origen resuelto automáticamente desde el GPS
  const [origen, setorigen] = useState("");
  const [cargandoOrigen, setCargandoOrigen] = useState(false);

  const [destino, setdestino] = useState("");

  const [rutareal, setrutareal] = useState<[number, number][]>([]);

  const [distancia, setdistancia] = useState(0);
  const [duracion, setduracion] = useState(0);

  const [riesgo, setRiesgo] = useState("");
  const [nivel, setNivel] = useState("");
  const [recomendacion, setRecomendacion] = useState("");

  const [sugerenciasDestino, setsugerenciasDestino] = useState<any[]>([]);
  const [destinoSeleccionado, setDestinoSeleccionado] = useState<any>(null);
  const [mostrarDestino, setMostrarDestino] = useState(false);

  const [timeoutBusqueda, setTimeoutBusqueda] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const [navegando, setNavegando] = useState(false);
  const [cargandoRuta, setCargandoRuta] = useState(false);
  const [error, setError] = useState("");

  const probarRuta = async () => {
    setError("");

    if (!ubicacionActual || !origen) {
      setError("Esperando a que se obtenga tu ubicación actual.");
      return;
    }

    if (!destinoSeleccionado) {
      setError("Elige un destino de la lista de sugerencias.");
      return;
    }

    setCargandoRuta(true);

    try {
      const datosruta = await obtenerRuta(origen, destino);

      const ruta = datosruta.rutas?.find((r: any) => r.recomendada);

      if (!ruta) {
        setError("No se encontró una ruta recomendada entre esos puntos.");
        return;
      }

      const coordenadas = ruta.geometry.coordinates.map((coord: number[]) => [
        coord[1],
        coord[0],
      ]);

      setrutareal(coordenadas);
      setdistancia(ruta.distancia);
      setduracion(ruta.tiempo);
      setRiesgo(ruta.riesgo);
      setNivel(ruta.nivel);
      setRecomendacion(datosruta.recomendacion);
    } catch (e) {
      console.error(e);
      setError("No se pudo calcular la ruta. Intenta nuevamente.");
    } finally {
      setCargandoRuta(false);
    }
  };

  const buscarSugerenciasDestino = async (texto: string) => {
    if (texto.length < 5) {
      setsugerenciasDestino([]);
      return;
    }

    try {
      const datos = await buscarLugar(texto);
      setsugerenciasDestino(datos);
    } catch (e) {
      console.error(e);
    }
  };

  const obtenerUbicacionActual = async () => {
    try {
      setCargandoOrigen(true);

      const posicion = await Geolocation.getCurrentPosition();
      const lat = posicion.coords.latitude;
      const lon = posicion.coords.longitude;

      setubicacionActual({ lat, lon });

      // Resolvemos el distrito a partir del GPS para poder usarlo como
      // texto de origen (el backend geocodifica por texto en /ruta).
      const distrito = await obtenerDistritoActual(lat, lon);
      setorigen(distrito);
    } catch (e) {
      console.log(e);
      setError(
        "No se pudo obtener tu ubicación. Activa el GPS e intenta de nuevo."
      );
    } finally {
      setCargandoOrigen(false);
    }
  };

  useEffect(() => {
    obtenerUbicacionActual();
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <Header />

        <div className="ruta-container">
          <h2>👋Hola, Selecciona una ruta para comenzar</h2>

          {!navegando && (
            <div className="contenedor-busqueda">
              <IonCard>
                <IonCardContent class="ion-text-left">
                  {cargandoOrigen ? (
                    <>
                      <IonSpinner name="dots" /> Obteniendo tu ubicación...
                    </>
                  ) : (
                    <>📍 Origen: {origen || "No disponible"}</>
                  )}
                </IonCardContent>
              </IonCard>

              <IonCard>
                <IonCardContent class="ion-text-left">
                  <IonInput
                    className="input-ruta"
                    value={destino}
                    onIonFocus={() => {
                      setMostrarDestino(true);
                    }}
                    onIonInput={async (e) => {
                      const valor = e.detail.value ?? "";
                      setdestino(valor);
                      if (
                        destinoSeleccionado &&
                        valor !== destinoSeleccionado.display_name
                      ) {
                        setDestinoSeleccionado(null);
                      }

                      if (timeoutBusqueda) {
                        clearTimeout(timeoutBusqueda);
                      }

                      const nuevoTimeout = setTimeout(async () => {
                        await buscarSugerenciasDestino(valor);
                      }, 500);

                      setTimeoutBusqueda(nuevoTimeout);
                    }}
                    onIonBlur={() => {
                      setTimeout(() => {
                        setsugerenciasDestino([]);
                      }, 200);
                    }}
                    placeholder="🔎¿A donde quieres ir?"
                  />
                </IonCardContent>
              </IonCard>

              {mostrarDestino && sugerenciasDestino.length > 0 && (
                <div className="lista-sugerencias">
                  {sugerenciasDestino.map((lugar, index) => (
                    <div
                      key={index}
                      className="sugerencia"
                      onMouseDown={() => {
                        setdestino(lugar.display_name);
                        setDestinoSeleccionado(lugar);
                        setsugerenciasDestino([]);
                        setMostrarDestino(false);
                      }}
                    >
                      • {lugar.display_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {error && !navegando && (
            <p className="mensaje-error">{error}</p>
          )}

          {!navegando && (
            <IonButton
              className="boton-ruta"
              expand="block"
              onClick={probarRuta}
              disabled={cargandoRuta || cargandoOrigen}
            >
              {cargandoRuta ? <IonSpinner name="dots" /> : "Buscar ruta"}
            </IonButton>
          )}

          <div
            className={navegando ? "mapa-falso mapa-navegacion" : "mapa-falso"}
          >
            <Mapa key={rutareal.length} ruta={rutareal} navegando={navegando} />
          </div>

          {navegando && (
            <div className="panel-navegacion">
              <h3>🚴 Navegación activa</h3>
              <p>↔ Distancia: {distancia} km</p>
              <p>⏱️ Tiempo estimado: {duracion} min</p>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Nivel de riesgo</IonCardTitle>
                </IonCardHeader>

                <IonCardContent>
                  <p>
                    <b>{nivel}</b>
                  </p>
                  <p>Puntaje: {riesgo}</p>
                  <p>{recomendacion}</p>
                </IonCardContent>
              </IonCard>
              <IonButton
                expand="block"
                color="danger"
                onClick={() => {
                  setNavegando(false);
                  setrutareal([]);
                  setdistancia(0);
                  setduracion(0);
                }}
              >
                Finalizar recorrido
              </IonButton>
            </div>
          )}

          {distancia > 0 && !navegando && (
            <IonButton
              expand="block"
              color="light"
              onClick={() => setNavegando(true)}
            >
              Iniciar recorrido
            </IonButton>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Planificacionruta;
