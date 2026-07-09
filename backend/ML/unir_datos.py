import pandas as pd

# =====================
# CICLOVIAS
# =====================
ciclovias = pd.read_csv(
    "dataset/CICLOVIAS EXISTENTES.csv",
    encoding="cp1252",
    sep=None,
    engine="python"
)

ciclovias.columns = ciclovias.columns.str.strip()

ciclovias = ciclovias[["DISTRITO_CICLOVIA", "LONGITUD_KM"]]
ciclovias = ciclovias.groupby("DISTRITO_CICLOVIA").sum().reset_index()
ciclovias.columns = ["distrito", "km_ciclovia"]

# =====================
# INFRACCIONES (CINEMÓMETROS)
# =====================
cinemometros = pd.read_csv(
    "dataset/Infracciones de Cinemometros.csv",
    encoding="cp1252",
    sep=";",
    engine="python"
)

cinemometros.columns = cinemometros.columns.str.strip()

infracciones = cinemometros.groupby("DISTRITO_INFRACCION").size().reset_index(name="infracciones")
infracciones.columns = ["distrito", "infracciones"]

# =====================
# ACCIDENTES (TRAMO)
# =====================
incidencias = pd.read_excel(
    "dataset/15cda035-2991-4bc9-b302-9bc965e26ee5.xlsx"
)

incidencias.columns = incidencias.columns.str.strip()

accidentes = incidencias.groupby("Tramo").size().reset_index(name="accidentes")
accidentes.columns = ["distrito", "accidentes"]

# =====================
# SUTRAN (NUEVO DATASET)
# =====================
sutran = pd.read_csv(
    "dataset/Accidentes de tránsito en carreteras-2020-2021-Sutran (1).csv",
    sep=";",
    encoding="cp1252"
)

sutran.columns = sutran.columns.str.strip()

# crear severidad (MUY IMPORTANTE)
# limpiar columnas
sutran.columns = sutran.columns.str.strip()

# convertir a numérico (CLAVE)
sutran["FALLECIDOS"] = pd.to_numeric(sutran["FALLECIDOS"], errors="coerce").fillna(0)
sutran["HERIDOS"] = pd.to_numeric(sutran["HERIDOS"], errors="coerce").fillna(0)

# crear severidad
sutran["severidad"] = (sutran["FALLECIDOS"] * 3) + (sutran["HERIDOS"] * 1)

# agrupar
sutran = sutran.groupby("DEPARTAMENTO")["severidad"].mean().reset_index()

sutran.columns = ["distrito", "riesgo_sutran"]

# =====================
# UNIÓN FINAL
# =====================
df = ciclovias.merge(infracciones, on="distrito", how="outer")
df = df.merge(accidentes, on="distrito", how="outer")
df = df.merge(sutran, on="distrito", how="outer")

# limpiar nulos
df = df.fillna(0)

# =====================
# RESULTADO
# =====================
print(df.head())
print(df.info())

# guardar dataset final
df.to_csv("dataset_final.csv", index=False)

print("Dataset final creado correctamente 🚀")