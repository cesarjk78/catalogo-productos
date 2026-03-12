import { useEffect, useState } from "react";
import api from "../services/api";

function ProductoForm({ onProductoCreado, onCancelar, producto }) {
  const [nombre, setNombre] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [color, setColor] = useState("");
  const [talla, setTalla] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState(null);

  const [marcaBusqueda, setMarcaBusqueda] = useState("");
  const [mostrarSugerenciasMarca, setMostrarSugerenciasMarca] = useState(false);

  const [modeloBusqueda, setModeloBusqueda] = useState("");
  const [mostrarSugerenciasModelo, setMostrarSugerenciasModelo] = useState(false);

  const [colorBusqueda, setColorBusqueda] = useState("");
  const [mostrarSugerenciasColor, setMostrarSugerenciasColor] = useState(false);

  const [tallaBusqueda, setTallaBusqueda] = useState("");
  const [mostrarSugerenciasTalla, setMostrarSugerenciasTalla] = useState(false);
  
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [colores, setColores] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [mensaje, setMensaje] = useState("");
  
  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre);
      setMarca(producto.marca);
      setModelo(producto.modelo);
      setColor(producto.color);
      setTalla(producto.talla);
      setPrecio(producto.precio);
      setMarcaBusqueda(producto.marca_nombre || "");
      setModeloBusqueda(producto.modelo_nombre || "");
      setColorBusqueda(producto.color_nombre || "");
    setTallaBusqueda(producto.talla_nombre || "");
    }
  }, [producto]);

  useEffect(() => {
    const fetchCatalogos = async () => {
      try {
        const [resMarcas, resModelos, resColores, resTallas] = await Promise.all([
          api.get("/marcas/"),
          api.get("/modelos/"),
          api.get("/colores/"),
          api.get("/tallas/"),
        ]);

        setMarcas(resMarcas.data);
        setModelos(resModelos.data);
        setColores(resColores.data);
        setTallas(resTallas.data);
      } catch (error) {
        console.error("Error cargando catálogos:", error);
      }
    };

    fetchCatalogos();
  }, []);

    const marcasFiltradas = marcas.filter((item) =>
        item.nombre.toLowerCase().includes(marcaBusqueda.toLowerCase())
    );

    const modelosFiltrados = modelos.filter((item) =>
        item.nombre.toLowerCase().includes(modeloBusqueda.toLowerCase())
    );
    
    const coloresFiltrados = colores.filter((item) =>
        item.nombre.toLowerCase().includes(colorBusqueda.toLowerCase())
    );
    
    const tallasFiltradas = tallas.filter((item) =>
        item.nombre.toLowerCase().includes(tallaBusqueda.toLowerCase())
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("access");
  
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("marca", marca);
    formData.append("modelo", modelo);
    formData.append("color", color);
    formData.append("talla", talla);
    formData.append("precio", precio);
  
    if (imagen) {
      formData.append("imagen", imagen);
    }
  
    try {
      if (producto) {
        await api.put(`/productos/${producto.id}/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await api.post("/productos/", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }
  
      if (onProductoCreado) onProductoCreado();
  
    } catch (error) {
      console.error(error);
      setMensaje("Error guardando producto ❌");
    }
  };

  const handleCrearMarca = async () => {
    const token = localStorage.getItem("access");
  
    if (!marcaBusqueda.trim()) return;
  
    try {
      const response = await api.post(
        "/marcas/",
        { nombre: marcaBusqueda },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const nuevaMarca = response.data;
  
      setMarcas((prev) => [...prev, nuevaMarca]);
      setMarca(nuevaMarca.id);
      setMarcaBusqueda(nuevaMarca.nombre);
      setMostrarSugerenciasMarca(false);
    } catch (error) {
      console.error("Error creando marca:", error.response || error);
      setMensaje("No se pudo crear la marca ❌");
    }
  };

  const handleCrearModelo = async () => {
    const token = localStorage.getItem("access");
  
    if (!modeloBusqueda.trim()) return;
  
    try {
      const response = await api.post(
        "/modelos/",
        { nombre: modeloBusqueda },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const nuevoModelo = response.data;
  
      setModelos((prev) => [...prev, nuevoModelo]);
      setModelo(nuevoModelo.id);
      setModeloBusqueda(nuevoModelo.nombre);
      setMostrarSugerenciasModelo(false);
    } catch (error) {
      console.error("Error creando modelo:", error.response || error);
      setMensaje("No se pudo crear el modelo ❌");
    }
  };
  
  const handleCrearColor = async () => {
    const token = localStorage.getItem("access");
  
    if (!colorBusqueda.trim()) return;
  
    try {
      const response = await api.post(
        "/colores/",
        { nombre: colorBusqueda },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const nuevoColor = response.data;
  
      setColores((prev) => [...prev, nuevoColor]);
      setColor(nuevoColor.id);
      setColorBusqueda(nuevoColor.nombre);
      setMostrarSugerenciasColor(false);
    } catch (error) {
      console.error("Error creando color:", error.response || error);
      setMensaje("No se pudo crear el color ❌");
    }
  };
  
  const handleCrearTalla = async () => {
    const token = localStorage.getItem("access");
  
    if (!tallaBusqueda.trim()) return;
  
    try {
      const response = await api.post(
        "/tallas/",
        { nombre: tallaBusqueda },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const nuevaTalla = response.data;
  
      setTallas((prev) => [...prev, nuevaTalla]);
      setTalla(nuevaTalla.id);
      setTallaBusqueda(nuevaTalla.nombre);
      setMostrarSugerenciasTalla(false);
    } catch (error) {
      console.error("Error creando talla:", error.response || error);
      setMensaje("No se pudo crear la talla ❌");
    }
  };

  return (
    <div className="form-card">
      <h2 className="form-title">
        {producto ? "Editar producto" : "Nuevo producto"}
      </h2>
  
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field-group">
            <label>Nombre</label>
            <input
              className="input"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
  
          <div className="field-group">
            <label>Marca</label>
            <input
              className="input"
              type="text"
              value={
                marca
                  ? marcas.find((m) => String(m.id) === String(marca))?.nombre || marcaBusqueda
                  : marcaBusqueda
              }
              onChange={(e) => {
                setMarcaBusqueda(e.target.value);
                setMarca("");
                setMostrarSugerenciasMarca(true);
              }}
              placeholder="Escribe o crea una marca"
            />
  
            {mostrarSugerenciasMarca && marcaBusqueda && (
              <div className="suggestions-box">
                {marcasFiltradas.length > 0 ? (
                  marcasFiltradas.map((item) => (
                    <div
                      key={item.id}
                      className="suggestion-item"
                      onClick={() => {
                        setMarca(item.id);
                        setMarcaBusqueda(item.nombre);
                        setMostrarSugerenciasMarca(false);
                      }}
                    >
                      {item.nombre}
                    </div>
                  ))
                ) : (
                  <div className="suggestion-item">No se encontró la marca.</div>
                )}
  
                <button className="btn btn-secondary btn-sm" type="button" onClick={handleCrearMarca}>
                  Crear marca "{marcaBusqueda}"
                </button>
              </div>
            )}
          </div>
  
          <div className="field-group">
            <label>Modelo</label>
            <input
              className="input"
              type="text"
              value={
                modelo
                  ? modelos.find((m) => String(m.id) === String(modelo))?.nombre || modeloBusqueda
                  : modeloBusqueda
              }
              onChange={(e) => {
                setModeloBusqueda(e.target.value);
                setModelo("");
                setMostrarSugerenciasModelo(true);
              }}
              placeholder="Escribe o crea un modelo"
            />
  
            {mostrarSugerenciasModelo && modeloBusqueda && (
              <div className="suggestions-box">
                {modelosFiltrados.length > 0 ? (
                  modelosFiltrados.map((item) => (
                    <div
                      key={item.id}
                      className="suggestion-item"
                      onClick={() => {
                        setModelo(item.id);
                        setModeloBusqueda(item.nombre);
                        setMostrarSugerenciasModelo(false);
                      }}
                    >
                      {item.nombre}
                    </div>
                  ))
                ) : (
                  <div className="suggestion-item">No se encontró el modelo.</div>
                )}
  
                <button className="btn btn-secondary btn-sm" type="button" onClick={handleCrearModelo}>
                  Crear modelo "{modeloBusqueda}"
                </button>
              </div>
            )}
          </div>
  
          <div className="field-group">
            <label>Color</label>
            <input
              className="input"
              type="text"
              value={
                color
                  ? colores.find((c) => String(c.id) === String(color))?.nombre || colorBusqueda
                  : colorBusqueda
              }
              onChange={(e) => {
                setColorBusqueda(e.target.value);
                setColor("");
                setMostrarSugerenciasColor(true);
              }}
              placeholder="Escribe o crea un color"
            />
  
            {mostrarSugerenciasColor && colorBusqueda && (
              <div className="suggestions-box">
                {coloresFiltrados.length > 0 ? (
                  coloresFiltrados.map((item) => (
                    <div
                      key={item.id}
                      className="suggestion-item"
                      onClick={() => {
                        setColor(item.id);
                        setColorBusqueda(item.nombre);
                        setMostrarSugerenciasColor(false);
                      }}
                    >
                      {item.nombre}
                    </div>
                  ))
                ) : (
                  <div className="suggestion-item">No se encontró el color.</div>
                )}
  
                <button className="btn btn-secondary btn-sm" type="button" onClick={handleCrearColor}>
                  Crear color "{colorBusqueda}"
                </button>
              </div>
            )}
          </div>
  
          <div className="field-group">
            <label>Talla</label>
            <input
              className="input"
              type="text"
              value={
                talla
                  ? tallas.find((t) => String(t.id) === String(talla))?.nombre || tallaBusqueda
                  : tallaBusqueda
              }
              onChange={(e) => {
                setTallaBusqueda(e.target.value);
                setTalla("");
                setMostrarSugerenciasTalla(true);
              }}
              placeholder="Escribe o crea una talla"
            />
  
            {mostrarSugerenciasTalla && tallaBusqueda && (
              <div className="suggestions-box">
                {tallasFiltradas.length > 0 ? (
                  tallasFiltradas.map((item) => (
                    <div
                      key={item.id}
                      className="suggestion-item"
                      onClick={() => {
                        setTalla(item.id);
                        setTallaBusqueda(item.nombre);
                        setMostrarSugerenciasTalla(false);
                      }}
                    >
                      {item.nombre}
                    </div>
                  ))
                ) : (
                  <div className="suggestion-item">No se encontró la talla.</div>
                )}
  
                <button className="btn btn-secondary btn-sm" type="button" onClick={handleCrearTalla}>
                  Crear talla "{tallaBusqueda}"
                </button>
              </div>
            )}
          </div>
  
          <div className="field-group">
            <label>Precio</label>
            <input
              className="input"
              type="number"
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
            />
          </div>
  
          <div className="field-group">
            <label>Imagen</label>

            {producto?.imagen && (
                <div style={{ marginBottom: "12px" }}>
                <p style={{ marginBottom: "8px", fontWeight: "600" }}>Imagen actual</p>
                <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    border: "1px solid #d1d5db",
                    }}
                />
                </div>
            )}

            <input
                className="file-input"
                type="file"
                onChange={(e) => setImagen(e.target.files[0])}
            />
            </div>
        </div>
  
        <div className="form-actions">
          <button className="btn btn-success" type="submit">
            Guardar producto
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

export default ProductoForm;