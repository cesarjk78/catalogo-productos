import { useEffect, useState } from "react";
import api from "../services/api";
import ProductoForm from "../components/ProductoForm";
import CargaMasivaExcel from "../components/CargaMasivaExcel";

function Productos({ onVolver, esAdmin }) {
  const [productos, setProductos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [marcas, setMarcas] = useState([]);
  const [colores, setColores] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [filtroMarca, setFiltroMarca] = useState("");
  const [filtroColor, setFiltroColor] = useState("");
  const [filtroTalla, setFiltroTalla] = useState("");
  const [mostrarCargaMasiva, setMostrarCargaMasiva] = useState(false);

  const fetchProductos = async (textoBusqueda = "", marca = "", color = "", talla = "") => {
    try {
      let url = "/productos/?";

      if (textoBusqueda) url += `search=${encodeURIComponent(textoBusqueda)}&`;
      if (marca) url += `marca=${marca}&`;
      if (color) url += `color=${color}&`;
      if (talla) url += `talla=${talla}&`;

      const response = await api.get(url);
      setProductos(response.data);

      const token = localStorage.getItem("access");
      if (token) {
        const meResponse = await api.get("/me/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsuario(meResponse.data);
      } else {
        setUsuario(null);
      }
    } catch (error) {
      console.log("ERROR RESPONSE:", error.response);
      setMensaje("No se pudieron cargar los productos ❌");
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    const fetchFiltros = async () => {
      try {
        const [resMarcas, resColores, resTallas] = await Promise.all([
          api.get("/marcas/"),
          api.get("/colores/"),
          api.get("/tallas/"),
        ]);

        setMarcas(resMarcas.data);
        setColores(resColores.data);
        setTallas(resTallas.data);
      } catch (error) {
        console.error("Error cargando filtros:", error);
      }
    };

    fetchFiltros();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    if (onVolver) onVolver();
  };

  const handleEliminar = async (id) => {
    const confirmar = window.confirm("¿Seguro que deseas eliminar este producto?");
    if (!confirmar) return;

    const token = localStorage.getItem("access");

    try {
      await api.delete(`/productos/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchProductos();
    } catch (error) {
      console.error("Error eliminando producto:", error.response || error);
      setMensaje("No se pudo eliminar el producto ❌");
    }
  };

  const handleEditar = (producto) => {
    setProductoEditando(producto);
    setMostrarFormulario(true);
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    fetchProductos(busqueda, filtroMarca, filtroColor, filtroTalla);
  };

  const esAdministradorReal =
    usuario && usuario.groups && usuario.groups.includes("Administrador");

  return (
    <div className="app-shell">
      <div className="page-container">
        <div className="page-card">
          <div className="page-header">
            <h1 className="page-title">Lista de Productos</h1>
            <p className="page-subtitle">
              Consulta, filtra, exporta y administra los productos del catálogo.
            </p>
          </div>

          {usuario && (
            <div className="session-badge">
              Sesión iniciada como <strong>{usuario.username}</strong>
            </div>
          )}

          <div className="toolbar">
            <button className="btn btn-secondary" onClick={onVolver}>
              Volver
            </button>

            <button
              className="btn btn-primary"
              onClick={() =>
                window.open("http://127.0.0.1:8000/api/productos/exportar_excel/", "_blank")
              }
            >
              Exportar Excel
            </button>

            {esAdministradorReal && (
              <button
                className="btn btn-primary"
                onClick={() => setMostrarCargaMasiva(true)}
              >
                Carga masiva Excel
              </button>
            )}

            {esAdmin && (
              <button className="btn btn-danger" onClick={handleLogout}>
                Cerrar sesión administrador
              </button>
            )}

            {esAdministradorReal && (
              <button
                className="btn btn-success"
                onClick={() => setMostrarFormulario(true)}
              >
                Nuevo producto
              </button>
            )}
          </div>

          {mostrarFormulario && esAdministradorReal && (
            <ProductoForm
              producto={productoEditando}
              onProductoCreado={() => {
                setMostrarFormulario(false);
                setProductoEditando(null);
                fetchProductos();
              }}
              onCancelar={() => {
                setMostrarFormulario(false);
                setProductoEditando(null);
              }}
            />
          )}

          {mostrarCargaMasiva && esAdministradorReal && (
            <CargaMasivaExcel
              onCargaExitosa={() => {
                setMostrarCargaMasiva(false);
                fetchProductos();
              }}
              onCancelar={() => setMostrarCargaMasiva(false)}
            />
          )}

          <div className="filters-card">
            <h2 className="section-title">Búsqueda y filtros</h2>

            <form onSubmit={handleBuscar} className="filters-form">
              <div className="field-group">
                <label>Buscar producto</label>
                <input
                  className="input"
                  type="text"
                  placeholder="Ej. zapatilla, nike, rojo..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>

              <div className="field-group">
                <label>Marca</label>
                <select
                  className="select"
                  value={filtroMarca}
                  onChange={(e) => setFiltroMarca(e.target.value)}
                >
                  <option value="">Todas las marcas</option>
                  {marcas.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field-group">
                <label>Color</label>
                <select
                  className="select"
                  value={filtroColor}
                  onChange={(e) => setFiltroColor(e.target.value)}
                >
                  <option value="">Todos los colores</option>
                  {colores.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field-group">
                <label>Talla</label>
                <select
                  className="select"
                  value={filtroTalla}
                  onChange={(e) => setFiltroTalla(e.target.value)}
                >
                  <option value="">Todas las tallas</option>
                  {tallas.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-actions" style={{ marginTop: 0 }}>
                <button className="btn btn-primary" type="submit">
                  Buscar / Filtrar
                </button>

                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => {
                    setBusqueda("");
                    setFiltroMarca("");
                    setFiltroColor("");
                    setFiltroTalla("");
                    fetchProductos();
                  }}
                >
                  Limpiar
                </button>
              </div>
            </form>
          </div>

          {mensaje && <p className="message">{mensaje}</p>}

          <div className="list-card">
            <h2 className="section-title">Productos registrados</h2>

            {productos.length === 0 ? (
              <div className="empty-state">
                <p>No hay productos registrados.</p>
              </div>
            ) : (
              <div className="products-grid">
                {productos.map((producto) => (
                  <div className="product-item" key={producto.id}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "16px",
                      flex: 1,
                    }}
                  >
                    {producto.imagen && (
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        style={{
                          width: "110px",
                          height: "110px",
                          objectFit: "cover",
                          borderRadius: "12px",
                          border: "1px solid #d1d5db",
                          flexShrink: 0,
                        }}
                      />
                    )}
                
                    <div className="product-info">
                      <h3 className="product-name">{producto.nombre}</h3>
                      <p className="product-meta">
                        <strong>Marca:</strong> {producto.marca_nombre} <br />
                        <strong>Modelo:</strong> {producto.modelo_nombre} <br />
                        <strong>Color:</strong> {producto.color_nombre} <br />
                        <strong>Talla:</strong> {producto.talla_nombre}
                      </p>
                      <span className="product-price">S/ {producto.precio}</span>
                    </div>
                  </div>
                
                  {esAdministradorReal && (
                    <div className="product-actions">
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEditar(producto)}
                      >
                        Editar
                      </button>
                
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() =>
                          window.open(
                            `http://127.0.0.1:8000/api/productos/${producto.id}/pdf/`,
                            "_blank"
                          )
                        }
                      >
                        PDF
                      </button>
                
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleEliminar(producto.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Productos;