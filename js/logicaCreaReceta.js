import API_URL from './config.js';
import { mostrarMensaje } from './mensajes.js';
import {cerrarSesionAutomatica} from './logicaBloqueo.js';

const chkOtro = document.getElementById("categoriaOtro");
const inputOtro = document.getElementById("inputOtro");

chkOtro.addEventListener("change", () => {
    inputOtro.disabled = !chkOtro.checked;
    if (!chkOtro.checked) {
        inputOtro.value = "";
        chkOtro.value = "";
    } else {
        // Cuando se habilita, actualizar el valor del checkbox al escribir
        inputOtro.focus();
    }
});

inputOtro.addEventListener("input", () => {
    chkOtro.value = inputOtro.value; // sincroniza el valor del checkbox
});

// Crear nueva receta
async function nuevaReceta() {
    try {
        const token = obtenerToken();
        if (!token) {
            throw new Error('Debes iniciar sesión para crear una receta');
        }

        const form = document.getElementById("formCrearReceta");
        const formData = new FormData(form);

        const response = await fetch(`${API_URL}/newreceta`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (response.status === 403) {
            cerrarSesionAutomatica();
            return; 
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error al crear receta');
        }

        mostrarMensaje("Solicitud de receta enviada exitosamente!",'#4CAF50');
        setTimeout(() => {
            window.location.href = "index.php";
        }, 2000); 

    } catch (error) {
        mostrarMensaje(`Ocurrio un error: ${error}`,'#E01616');
        console.error('Error:', error);
        throw error;
    }
}

function obtenerToken() {
    return localStorage.getItem('token');
}

let enviando = false;

document.getElementById("formCrearReceta").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (enviando) return; 
    enviando = true;

    try {
        await nuevaReceta();
    } finally {
        enviando = false;
    }
});


