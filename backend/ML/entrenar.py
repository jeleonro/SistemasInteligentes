import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_absolute_error
import joblib

# =========================
# DATASET
# =========================
df = pd.read_csv("dataset_final.csv")

# =========================
# TARGET REAL (score continuo)
# =========================
df["riesgo_score"] = (
    df["accidentes"] * 0.6 +
    df["infracciones"] * 0.3 -
    df["km_ciclovia"] * 0.2
)

# =========================
# VARIABLES
# =========================
X = df[["km_ciclovia", "infracciones", "accidentes"]]
y = df["riesgo_score"]

# =========================
# TRAIN / TEST
# =========================
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42
)

# =========================
# MODELO
# =========================
modelo = RandomForestRegressor(
    n_estimators=200,
    random_state=42
)

modelo.fit(X_train, y_train)

# =========================
# EVALUACIÓN REAL
# =========================
y_pred = modelo.predict(X_test)

print("R2 score:", r2_score(y_test, y_pred))
print("MAE:", mean_absolute_error(y_test, y_pred))

# =========================
# GUARDAR MODELO
# =========================
joblib.dump(modelo, "modelo_riesgo.pkl")

print("Modelo guardado correctamente 🚀")