import {mostrarMensajeBloqueo } from './mensajes.js';
export function cerrarSesionAutomatica() {
    // Limpiar token
    localStorage.removeItem("token");
    localStorage.removeItem('usuario');

    mostrarMensajeBloqueo("Tu sesión ha expirado o tu cuenta está desactivada", "#E01616");

    setTimeout(() => {
        window.location.href = "index.php";
    }, 1500);
}
