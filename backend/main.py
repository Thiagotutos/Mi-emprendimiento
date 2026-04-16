from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI(title="TechStore - Emprendimiento API")

FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend")

# --- MOCK DATA ---
servicios = [
    {"id": 1, "nombre": "Flasheo de BIOS V2", "descripcion": "Rescate y flasheo de BIOS corruptas", "precio": 15000},
    {"id": 2, "nombre": "Armado de PC Personalizado", "descripcion": "Gestión de cables, pruebas de estrés e instalación de OS", "precio": 25000},
    {"id": 3, "nombre": "Cambio de Módulo Inverter / Pantalla", "descripcion": "Reparación en Notebooks", "precio": 35000},
]

portfolio_pcs = [
    {"id": 1, "nombre": "PC Gamer Entry - Ryzen 5", "descripcion": "Ideal para 1080p competitivo", "precio": 550000},
    {"id": 2, "nombre": "PC Workstation - Intel i7", "descripcion": "Edición y renderizado 3D", "precio": 980000},
]

repuestos = [
    {"id": 1, "nombre": "Memoria RAM DDR4 16GB 3200MHz", "precio": 45000, "stock": 10},
    {"id": 2, "nombre": "SSD 1TB M.2 NVMe Gen4", "precio": 85000, "stock": 5},
    {"id": 3, "nombre": "Pasta Térmica Arctic MX-4", "precio": 12000, "stock": 20},
]

turnos = [
    {"id": "TECH-001", "cliente": "Juan P.", "estado": "En Revisión Técnica", "equipo": "Notebook Lenovo Legion", "detalle": "Falla al dar video"},
    {"id": "TECH-002", "cliente": "Maria G.", "estado": "Listo para Retirar", "equipo": "PC Desktop", "detalle": "Mantenimiento general completado"},
]

# --- RUTAS DE API ---
@app.get("/api/catalogo")
def get_catalogo():
    return {
        "pcs": portfolio_pcs,
        "repuestos": repuestos
    }

@app.get("/api/servicios")
def get_servicios():
    return servicios

@app.get("/api/estado-turno/{turno_id}")
def get_estado_turno(turno_id: str):
    for t in turnos:
        if t["id"].upper() == turno_id.upper():
            return {"status": "success", "data": t}
    return {"status": "error", "message": "No se encontró el turno especificado."}

# --- MONTAJE DEL FRONTEND ---
if os.path.exists(FRONTEND_DIR):
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

@app.get("/")
def serve_home():
    index_path = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"error": "Archivo index.html no encontrado en frontend"}
