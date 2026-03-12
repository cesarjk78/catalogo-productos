function Inicio({ onUsuario, onAdmin }) {
    return (
      <div className="app-shell">
        <div className="page-container home-wrapper">
          <div className="page-card home-card">
            <div className="page-header">
              <h1 className="page-title">Catálogo de Productos</h1>
              <p className="page-subtitle">
                Ingresa como usuario para explorar el catálogo o como administrador para gestionarlo.
              </p>
            </div>
  
            <div className="home-actions">
              <button className="btn btn-primary" onClick={onUsuario}>
                Ingresar como usuario
              </button>
              <button className="btn btn-success" onClick={onAdmin}>
                Ingresar como administrador
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default Inicio;