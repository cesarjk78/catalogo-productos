import { useState } from "react";
import api from "../services/api";

function Login({ onLoginExitoso, onVolver }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/token/", {
        username,
        password,
      });

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      setMensaje("Login exitoso ✅");

      if (onLoginExitoso) {
        onLoginExitoso();
      }
    } catch (error) {
      setMensaje("Credenciales incorrectas ❌");
      console.error(error);
    }
  };

  return (
    <div className="app-shell">
      <div className="page-container auth-wrapper">
        <div className="page-card auth-card">
          <div className="page-header">
            <h1 className="page-title">Login Administrador</h1>
            <p className="page-subtitle">
              Ingresa tus credenciales para administrar productos, exportar datos y hacer carga masiva.
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="field-group">
              <label>Usuario</label>
              <input
                className="input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="field-group" style={{ marginTop: "16px" }}>
              <label>Contraseña</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="auth-actions">
              <button className="btn btn-success" type="submit">
                Iniciar sesión
              </button>
              <button className="btn btn-secondary" type="button" onClick={onVolver}>
                Volver
              </button>
            </div>
          </form>

          {mensaje && <p className="message">{mensaje}</p>}
        </div>
      </div>
    </div>
  );
}

export default Login;