const API_URL = window.location.hostname === "localhost"
  ? "http://localhost:3000"
  : "foreing-cooking-api-production.up.railway.app";
export default API_URL;
