import {
    IonPage,
    IonContent,
    IonInput,
    IonButton
} from "@ionic/react";

import Header from "../components/Header";

import "./Inicio.css";
import { useHistory } from "react-router-dom";
import { useState } from "react";


const Inicio: React.FC = () => {
    const history = useHistory();

    const [riesgo, setriesgo] = useState("Alto");
    const [seguridad, setseguridad] = useState(18);

    return (
        <IonPage>
            <IonContent fullscreen >
                <Header/>

                <div className="dashboard-container">

                    <h2>¡Hola, USUARIO!</h2>

                    <IonInput className="buscador" placeholder="🔎¿A donde quieres ir?" onClick={() => history.push("/Planificacionruta")}>
                        
                    </IonInput>

                    <div className="card">
                        <h3>Análisis de Ruta en Tiempo Real</h3>

                        <h1 className="risk-title">
                            Riesgo: {riesgo}
                        </h1>

                        <p className="security">
                            {seguridad}% de Seguridad
                        </p>
                    </div>

                    <div className="card">
                        <h3>Variables Críticas</h3>

                        <p>🕒 Hora del día: 10 PM</p>
                        <p>📅 Día: Martes</p>
                        <p>☀️ Estación: Verano</p>
                    </div>

                    <IonButton expand="block" onClick={() => history.push("/Planificacionruta")}>
                        Planificar Ruta Segura
                    </IonButton>

                </div>

            </IonContent>
        </IonPage>
    );
};

export default Inicio;