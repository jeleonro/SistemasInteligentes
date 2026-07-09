
import { IonButton } from "@ionic/react";
import { useHistory, useLocation } from "react-router-dom";

import "./Header.css";

const Header: React.FC = () => {
    const history = useHistory();
    const location = useLocation();

    return (
        <div className="header-nav">

            <IonButton className="botones"
                fill={location.pathname === "/Inicio" ? "solid" : "clear"}
                onClick={() => history.push("/Inicio")}
            >
                Inicio
            </IonButton>

            <IonButton className="botones"
                fill={location.pathname === "/Planificacionruta" ? "solid" : "clear"}
                onClick={() => history.push("/Planificacionruta")}
            >
                Ruta
            </IonButton>

            <IonButton className="botones"
                fill={location.pathname === "/usuario" ? "solid" : "clear"}
                onClick={() => history.push("/usuario")}
            >
                Perfil
            </IonButton>

        </div>
    );
};

export default Header;