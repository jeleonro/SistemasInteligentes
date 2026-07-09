import {
    IonContent,
    IonPage,
    IonToggle,
    IonItem,
    IonLabel,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonButton
} from "@ionic/react";

import { useState } from "react";

import Header from "../components/Header";

import { useHistory } from "react-router-dom"; 


import "./Usuario.css";

// Dentro de tu componente:

const Usuario: React.FC = () => {

    const history = useHistory();

    const [alertas, setAlertas] = useState(true);
    const [horarioNocturno, setHorarioNocturno] = useState(false);
    const [rutaSegura, setRutaSegura] = useState(true);

    return (
        <IonPage>
            <IonContent fullscreen>
                <Header />

                <div className="perfil-container">

                    <h2>Perfil del Ciclista</h2>

                    <IonCard>
                        <IonCardHeader>
                            <IonCardTitle>
                                Jesús León
                            </IonCardTitle>
                        </IonCardHeader>

                        <IonCardContent>
                            jesus@email.com
                        </IonCardContent>
                    </IonCard>

                    <IonCard>

                        <IonItem>
                            <IonLabel>
                                Alertas de delito
                            </IonLabel>

                            <IonToggle
                                checked={alertas}
                                onIonChange={(e) =>
                                    setAlertas(e.detail.checked)
                                }
                            />
                        </IonItem>

                        <IonItem>
                            <IonLabel>
                                Horarios nocturnos
                            </IonLabel>

                            <IonToggle
                                checked={horarioNocturno}
                                onIonChange={(e) =>
                                    setHorarioNocturno(
                                        e.detail.checked
                                    )
                                }
                            />
                        </IonItem>

                        <IonItem>
                            <IonLabel>
                                Priorizar rutas seguras
                            </IonLabel>

                            <IonToggle
                                checked={rutaSegura}
                                onIonChange={(e) =>
                                    setRutaSegura(
                                        e.detail.checked
                                    )
                                }
                            />
                        </IonItem>

                    </IonCard>

                    <IonCard>
                        <IonCardHeader>
                            <IonCardTitle>
                                Historial de rutas
                            </IonCardTitle>
                        </IonCardHeader>

                        <IonCardContent>

                            Casa → Universidad
                            <br />
                            Seguridad: 95%

                            <hr />

                            Universidad → Trabajo
                            <br />
                            Seguridad: 89%

                        </IonCardContent>
                    </IonCard>

                    <IonButton className="boton" expand="block" onClick={() => history.push("/Planificacionruta")}>
                        Cerrar Sesion
                    </IonButton>

                </div>



            </IonContent>
        </IonPage>
    );
};

export default Usuario;