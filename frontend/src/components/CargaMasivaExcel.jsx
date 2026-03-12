import { useState } from "react";
import api from "../services/api";

function CargaMasivaExcel({ onCargaExitosa, onCancelar }) {
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!archivo) {
      setMensaje("Selecciona un archivo Excel ❌");
      return;
    }

    const token = localStorage.getItem("access");
    const formData = new FormData();
    formData.append("archivo", archivo);

    try {
      const response = await api.post("/productos/cargar_excel/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMensaje(response.data || "Carga masiva completada ✅");

      if (onCargaExitosa) onCargaExitosa();
    } catch (error) {
      console.error("Error en carga masiva:", error.response || error);
      setMensaje("No se pudo cargar el Excel ❌");
    }
  };

  return (
    <div className="upload-card">
      <h2 className="section-title">Carga masiva desde Excel</h2>

      <form onSubmit={handleSubmit}>
        <div className="field-group">
          <label>Archivo Excel</label>
          <input
            className="file-input"
            type="file"
            accept=".xlsx"
            onChange={(e) => setArchivo(e.target.files[0])}
          />
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" type="submit">
            Subir Excel
          </button>

          <button className="btn btn-secondary" type="button" onClick={onCancelar}>
            Cancelar
          </button>
        </div>
      </form>

      {mensaje && <p className="message">{mensaje}</p>}
    </div>
  );
}

export default CargaMasivaExcel;