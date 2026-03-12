import axios from "axios";

const api = axios.create({
    baseURL: "https://catalogo-productos-production-566c.up.railway.app/api",
});

export default api;