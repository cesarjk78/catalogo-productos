import { useState } from "react";
import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import Productos from "./pages/Productos";

function App() {
  const [vista, setVista] = useState("inicio");
  const [modo, setModo] = useState(null);

  const irAInicio = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setVista("inicio");
    setModo(null);
  };

  const irALogin = () => {
    setVista("login");
    setModo("admin");
  };
  
  const irAProductosComoUsuario = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setVista("productos");
    setModo("usuario");
  };

  const irAProductosComoAdmin = () => {
    setVista("productos");
    setModo("admin");
  };

  if (vista === "inicio") {
    return <Inicio onUsuario={irAProductosComoUsuario} onAdmin={irALogin} />;
  }

  if (vista === "login") {
    return <Login onLoginExitoso={irAProductosComoAdmin} onVolver={irAInicio} />;
  }

  if (vista === "productos") {
    return <Productos onVolver={irAInicio} esAdmin={modo === "admin"} />;
  }

  return <Inicio onUsuario={irAProductosComoUsuario} onAdmin={irALogin} />;
}

export default App;