import API_URL from './config.js';
import { CambiarHeader } from "./logicaHeader.js";

//Funcion pa cerrar sesion
function cerrarSesion(){
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        window.location.href = 'index.php';
    }
}
function generarEstrellas(calificacion) {
    const estrellasLlenas = Math.round(calificacion);
    return '★'.repeat(estrellasLlenas) + '☆'.repeat(5 - estrellasLlenas);
}

function renderizarRecetas(recetas, mostrarEliminar = false) {
    const recetasContainer = document.getElementById("muestra-recetas");
    recetasContainer.innerHTML = ""; // limpiar contenedor

    if (!recetas || recetas.length === 0) {
        recetasContainer.innerHTML = "<p>No hay recetas para mostrar.</p>";
        return;
    }

    recetas.forEach(receta => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <div class="card-image">
                <img src="${API_URL}${receta.imagen}" alt="${receta.nombre}">
            </div>
            <div class="card-content">
                <div class="card-rating">
                    <span class="estrellas">${generarEstrellas(receta.calificacion)}</span>
                    <span class="rating-number">${receta.calificacion} (${receta.numCalificaciones})</span>
                </div>
                <h3 class="card-title">${receta.nombre}</h3>
                <div class="card-info">
                    <div class="info-item">
                        <span class="info-icon">⏱️</span>
                        <span>${receta.tiempoPreparacion} min</span>
                    </div>
                    <div class="info-item">
                        <span class="info-icon">👥</span>
                        <span>${receta.porciones} porción(es)</span>
                    </div>
                    <div class="info-item">
                        <span class="info-icon">🔥</span>
                        <span>${receta.dificultad}</span>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <button class="btn-receta" onclick="window.location.href='VerReceta.php?id=${receta._id}'">Ver Receta</button>
                ${mostrarEliminar ? '<button class="btn-receta eliminar">Eliminar</button>' : ''}
            </div>
        `;

        recetasContainer.appendChild(card);

        if (mostrarEliminar) {
            const btnEliminar = card.querySelector(".btn-receta.eliminar");
            btnEliminar.addEventListener("click", () => {
                eliminarReceta(receta._id);
            });
        }
    });
}

// Función para cargar perfil y recetas propias
async function cargarPerfil(usuario) {
    document.getElementById("foto-perfil").src = `${API_URL}${usuario.foto}`;
    document.getElementById("nombre").innerHTML = usuario.nombre;
    document.getElementById("descripcion").innerHTML = usuario.status || "...";

    // Cargar recetas propias
    try {
        const response = await fetch(`${API_URL}/muestrarecetas?autor=${usuario.id}`);
        const recetas = await response.json();
        renderizarRecetas(recetas, true);
        document.getElementById("recetas-creadas").innerHTML = recetas.length;
    } catch (error) {
        console.error("Error al cargar recetas del usuario:", error);
        document.getElementById("muestra-recetas").innerHTML = "<p>No se pudieron cargar las recetas.</p>";
    }

    // Cargar favoritos
    try {
        const responseFav = await fetch(`${API_URL}/obtenerfavoritos`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const recetasFav = await responseFav.json();
        document.getElementById("Favoritas").innerHTML = recetasFav.length || 0;
    } catch (error) {
        console.error("Error al cargar favoritos:", error);
        document.getElementById("Favoritas").innerHTML = 0;
    }

    // Cargar seguidores
    try {
        const responseSeg = await fetch(`${API_URL}/obtenerseguidores`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const listseguidores = await responseSeg.json();
        document.getElementById("Seguidores").innerHTML = listseguidores.length || 0;
    } catch (error) {
        console.error("Error al cargar seguidores:", error);
        document.getElementById("Seguidores").innerHTML = 0;
    }
}

// Función para cargar recetas favoritas
async function Favoritos() {
    try {
        const responseFav = await fetch(`${API_URL}/obtenerfavoritos`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const recetasFav = await responseFav.json();
        renderizarRecetas(recetasFav, true); 
    } catch (error) {
        console.error("Error al cargar favoritos:", error);
        document.getElementById("muestra-recetas").innerHTML = "<p>Error al cargar favoritos.</p>";
    }
}

// Función para eliminar receta
async function eliminarReceta(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta receta?')) return;

    try {
        const response = await fetch(`${API_URL}/rmiRecetas/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error("Error al eliminar receta");
        window.location.reload();
    } catch (error) {
        console.error('Error al eliminar receta:', error);
    }
}

async function ConfigPerfil() {
    try {
        const recetasContainer = document.getElementById("muestra-recetas");
        recetasContainer.innerHTML = ""; 

        const usuario = JSON.parse(localStorage.getItem("usuario"));

        recetasContainer.innerHTML = `  
        <div class="formulario-editar-perfil">
            <!-- Encabezado con decoración -->
            <div class="formulario-header">
                <div class="formulario-icono">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                </div>
                <h2 class="formulario-titulo">Editar Perfil</h2>
                <p class="formulario-subtitulo">Actualiza tu información personal</p>
            </div>

            <form id="formPerfil">
                <!-- Campo Nombre -->
                <div class="formulario-campo">
                    <label for="nombre" class="formulario-label">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                        Nombre
                    </label>
                    <input type="text" id="nombre" name="nombre" value="${usuario.nombre}" class="formulario-input">
                </div>

                <!-- Campo Foto -->
                <div class="formulario-campo">
                    <label for="foto" class="formulario-label">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        Foto de perfil
                    </label>
                    <div class="formulario-file-wrapper">
                        <input type="file" id="foto" name="foto" accept="image/jpeg, image/png" class="formulario-file">
                    </div>
                    <p class="formulario-ayuda">Formatos aceptados: JPG, PNG</p>
                </div>

                <!-- Campo Descripción -->
                <div class="formulario-campo">
                    <label for="descripcion" class="formulario-label">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                        Descripción
                    </label>
                    <textarea id="descripcion" name="status" rows="4" class="formulario-textarea" placeholder="Cuéntanos un poco sobre ti...">${usuario.status || ""}</textarea>
                    <div class="formulario-contador">
                        <span>Máximo 500 caracteres</span>
                    </div>
                </div>

                <!-- Botón Submit -->
                <button type="submit" class="formulario-boton">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    Guardar Cambios
                </button>
            </form>
        </div>
        `;

        // Capturar submit y enviar datos
        const form = document.getElementById("formPerfil");
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            formData.append("id", usuario.id);

            try {
                const res = await fetch(`${API_URL}/editarperfil`, {
                    method: "PUT",
                    body: formData,
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                const data = await res.json();

                if (data.success) {
                    alert("Perfil actualizado correctamente");
                    
                    // CORRECCIÓN: Actualizar el usuario en localStorage y recargar la página
                    // para que los cambios se reflejen inmediatamente
                    const usuarioActualizado = {
                        ...usuario,
                        nombre: data.usuario.nombre,
                        foto: data.usuario.foto,
                        status: data.usuario.status
                    };
                    localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
                    
                    // Recargar la página actual en lugar de redirigir
                    window.location.reload();
                } else {
                    alert("Error al actualizar perfil: " + (data.message || ""));
                }
            } catch (err) {
                console.error(err);
                alert("Error en la conexión con el servidor");
            }
        });

    } catch (error) {
        console.error("Error en la carga del perfil", error);
    }
}

// Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) return;

    CambiarHeader(usuario.foto);
    cargarPerfil(usuario);

    // Botón cerrar sesión
    const btnCerrarSesion = document.querySelector(".btn_sesion");
    if(btnCerrarSesion) btnCerrarSesion.addEventListener("click", cerrarSesion);

    // Pestañas
    const tabs = document.querySelectorAll(".tabs .tab");
    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("activa"));
            tab.classList.add("activa");

            if (index === 0) cargarPerfil(usuario); // Mis Recetas
            else if (index === 1) Favoritos();       // Mis Favoritos
            else if (index === 2) ConfigPerfil(); //Configuraciones
        });
    });
});