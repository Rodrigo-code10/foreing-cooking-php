import API_URL from './config.js';
import { CambiarHeader } from "./logicaHeader.js";
import { mostrarMensaje } from './mensajes.js';
import {cerrarSesionAutomatica} from './logicaBloqueo.js';

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

function renderizarRecetas(recetas, mostrarEliminar = false, mostrarEditar = false) {
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
                ${mostrarEditar ? `<button class="btn-receta editar" data-id="${receta._id}">Editar Receta</button>` : ''}
                <button class="btn-receta" onclick="window.location.href='VerReceta.php?id=${receta._id}'">Ver Receta</button>
                ${mostrarEliminar ? '<button class="btn-receta eliminar">Eliminar</button>' : ''}
            </div>
        `;

        recetasContainer.appendChild(card);

        if (mostrarEliminar) {
            const btnEliminar = card.querySelector(".btn-receta.eliminar");
            btnEliminar.addEventListener("click", () => {eliminarReceta(receta._id);});
        }

        if (mostrarEditar) {
            const btnEditar = card.querySelector(".btn-receta.editar");
            btnEditar.addEventListener("click", () => editarReceta(receta._id));
        }
    });
}

async function editarReceta(id) {
    try {
        const response = await fetch(`${API_URL}/recetas/${id}/Ver`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
        });

        if (response.status === 403) {
            cerrarSesionAutomatica();
            return; 
        }

        const data = await response.json();

        document.getElementById('recetaId').value = data._id;
        document.getElementById('recetaNombre').value = data.nombre || '';
        document.getElementById('recetaDescripcion').value = data.descripcion || '';
        document.getElementById('recetaTiempoPreparación').value = data.tiempoPreparacion || '';
        document.getElementById('recetaPorciones').value = data.porciones || '';
        document.getElementById('recetaDificultad').value = data.dificultad || '';
        const imgVista = document.getElementById('recetaImagenVista');

        if (data.imagen) {
            imgVista.src = `${API_URL}${data.imagen}`;
        } else {
            imgVista.src = `${API_URL}/public/default/admmin.png`;
        }
        
        //Categorias
        const categorias = data.categoria || [];
        const checkboxes = [...document.querySelectorAll('input[name="categoria"]')];
        const inputOtro = document.getElementById('inputOtro');
        const chkOtro = document.getElementById('categoriaOtro');
        
        const predefinidas = checkboxes
          .filter(c => c.id !== 'categoriaOtro')
          .map(c => c.value.toLowerCase().trim());
        
        checkboxes.forEach(c => c.checked = false);
        inputOtro.value = '';
        inputOtro.disabled = true;
        
        // Marcar predefinidas
        categorias.forEach(cat => {
            const match = checkboxes.find(c => c.value.toLowerCase().trim() === cat.toLowerCase().trim());
            if (match) match.checked = true;
        });
        
        // Manejar “Otro”
        const otras = categorias.filter(c => !predefinidas.includes(c.toLowerCase().trim()));
        if (otras.length > 0) {
            chkOtro.checked = true;
            inputOtro.disabled = false;
            inputOtro.value = otras.join(", ");
        }
        
        chkOtro.replaceWith(chkOtro.cloneNode(true)); // eliminar listeners antiguos
        const nuevoChkOtro = document.getElementById('categoriaOtro');
        nuevoChkOtro.addEventListener('change', () => {
            inputOtro.disabled = !nuevoChkOtro.checked;
            if (!nuevoChkOtro.checked) inputOtro.value = "";
        });

        // Ingredientes
        document.getElementById('recetaIngredientes').value =
        Array.isArray(data.ingredientes) 
            ? data.ingredientes.map(i => i.texto || i.nombre).join("\n")
            : data.ingredientes || "";

        // Pasos
        document.getElementById('recetaInstrucciones').value =
            Array.isArray(data.pasos) ? data.pasos.join("\n") : data.pasos || "";

        // Mostrar modal
        const modal = document.getElementById('modalReceta');
        modal.style.display = 'block';
        setTimeout(() => modal.classList.add('show'), 10);
    } catch (error) {
        console.error("Error al ver receta:", error);
        mostrarMensaje("Error al cargar la receta", "#E01616");
    }
}

function crearModal() {
    const modalHTML = `
        <div id="modalReceta" class="modal-overlay">
            <div class="modal-container">
                <div class="modal-header">
                    <div class="modal-header-content">
                        <h2>Detalles de la Receta</h2>
                    </div>
                    <button class="modal-close" aria-label="Cerrar"> ✖️ </button>
                </div>
                
                <form id="formReceta" class="modal-form">
                    <input type="hidden" id="recetaId">

                    <div class="form-grid">
                        <div class="form-field">
                            <label>Nombre de la Receta</label>
                            <input type="text" id="recetaNombre" class="input-modern" required>
                        </div>
                    </div>

                    <div class="form-field">
                        <label>Descripción</label>
                        <textarea id="recetaDescripcion" class="textarea-modern"></textarea>
                    </div>

                    <div class="form-field">
                        <label>Tiempo de Preparación</label>
                        <input type="number" id="recetaTiempoPreparación" class="input-modern" min="1">
                    </div>

                    <div class="form-field">
                        <label>Porciones</label>
                        <input type="number" id="recetaPorciones" class="input-modern" min="1">
                    </div>

                    <div class="form-field">
                        <label>Dificultad</label>
                        <select id="recetaDificultad" class="input-modern">
                            <option value="">Seleccionar...</option>
                            <option value="Fácil">Fácil</option>
                            <option value="Media">Media</option>
                            <option value="Difícil">Difícil</option>
                        </select>
                    </div>

                    <div class="form-field">
                        <label>Categoría</label>
                        <div class="checkbox-container">
                            <label><input type="checkbox" name="categoria" value="Saludable"> Saludable</label>
                            <label><input type="checkbox" name="categoria" value="Nutritivo"> Nutritivo</label>
                            <label><input type="checkbox" name="categoria" value="Grasoso"> Grasoso</label>
                            <label><input type="checkbox" name="categoria" value="Vegetariano"> Vegetariano</label>
                            <label><input type="checkbox" name="categoria" value="Dulce"> Dulce</label>
                            <label><input type="checkbox" name="categoria" value="Salado"> Salado</label>
                            <label><input type="checkbox" name="categoria" value="Picante"> Picante</label>
                            <label><input type="checkbox" name="categoria" value="Vegana"> Vegana</label>
                            <label><input type="checkbox" name="categoria" value="Entrada"> Entrada</label>
                            <label><input type="checkbox" name="categoria" value="Postre"> Postre</label>
                            <label><input type="checkbox" name="categoria" value="Plato Fuerte"> Plato Fuerte</label>
                            <label>
                                <input type="checkbox" id="categoriaOtro" value="">
                                Otro:
                                <input type="text" id="inputOtro" placeholder="Escribe tu categoría" style="margin-left:5px;" disabled>
                            </label>
                        </div>
                    </div>

                    <div class="form-field">
                        <label>Ingredientes</label>
                        <textarea id="recetaIngredientes" class="textarea-modern"></textarea>
                    </div>

                    <div class="form-field">
                        <label>Instrucciones</label>
                        <textarea id="recetaInstrucciones" class="textarea-modern"></textarea>
                    </div>

                    <div class="form-field">
                        <label>Imagen</label>
                        <img id="recetaImagenVista" style="max-width: 300px; border-radius: 10px; display: block; margin-top: 10px;">
                    </div>

                    <div class="modal-footer">
                        <button type="submit" class="btn-primary">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('modalReceta');
    const cerrar = modal.querySelector('.modal-close');
    const form = document.getElementById('formReceta');

    cerrar.addEventListener('click', cerrarModal);

    window.addEventListener('click', (e) => {
        if (e.target === modal) cerrarModal();
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await guardarCambios();
    });

    function cerrarModal() {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
    }
}

async function guardarCambios() {
    const id = document.getElementById('recetaId').value;

    // Recoger todas las categorías seleccionadas
    let categoriasSeleccionadas = [...document.querySelectorAll('input[name="categoria"]:checked')].map(c => c.value);

    // Si "Otro" está marcado, asegurarse de enviar su valor real
    const chkOtro = document.getElementById("categoriaOtro");
    const inputOtro = document.getElementById("inputOtro");

    if (chkOtro.checked) {
        const valorOtro = inputOtro.value.trim();
        if (valorOtro) {
            categoriasSeleccionadas.push(valorOtro); // tomar lo que dice el input
        }
    }

    const lineasIngredientes = document.getElementById('recetaIngredientes').value
    .split("\n")
    .filter(linea => linea.trim() !== "");

    const unidadesComunes = ["taza","tazas","cucharada","cucharadas","gramo","gramos","kg","ml","pieza","piezas"];

    const ingredientes = lineasIngredientes.map(linea => {
        const partes = linea.trim().split(" ");
        let cantidad = null;
        let unidad = null;

        if (!isNaN(partes[0])) {
            cantidad = Number(partes.shift());
        }

        if (partes.length && unidadesComunes.includes(partes[0].toLowerCase())) {
            unidad = partes.shift();
        }

        const nombre = partes.join(" ").trim();
        return {
            nombre,      
            cantidad,    
            unidad,      
            texto: linea.trim()  
        };
    });

    const payload = {
        nombre: document.getElementById('recetaNombre').value,
        descripcion: document.getElementById('recetaDescripcion').value,
        ingredientes: ingredientes,
        pasos: document.getElementById('recetaInstrucciones').value.split("\n").filter(i => i.trim()),
        tiempoPreparacion: document.getElementById('recetaTiempoPreparación').value,
        porciones: document.getElementById('recetaPorciones').value,
        dificultad: document.getElementById('recetaDificultad').value,
        categoria: categoriasSeleccionadas,
        estado:"pendiente"
    };

    try {
        const response = await fetch(`${API_URL}/MisRecetas/${id}/Editar`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (response.status === 403) {
            cerrarSesionAutomatica();
            return; 
        }

        if (!response.ok) throw new Error("Error al actualizar");

        mostrarMensaje("Peticion de cambios enviada", "#4CAF50");

        document.getElementById("modalReceta").classList.remove("show");
        setTimeout(() => {
            document.getElementById("modalReceta").style.display = "none";
        }, 300);

        setTimeout(() => {
            location.reload();
        }, 2000);

    } catch (error) {
        mostrarMensaje("Error al guardar cambios", "#E01616");
    }
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
        renderizarRecetas(recetas, true,true);
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

        if (responseFav.status === 403) {
            cerrarSesionAutomatica();
            return; 
        }

        const recetasFav = await responseFav.json();
        document.getElementById("Favoritas").innerHTML = recetasFav.length || 0;
    } catch (error) {
        console.error("Error al cargar favoritos:", error);
        document.getElementById("Favoritas").innerHTML = 0;
    }
}

// Función para cargar recetas favoritas
async function Favoritos() {
    try {
        const responseFav = await fetch(`${API_URL}/obtenerfavoritos`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (responseFav.status === 403) {
            cerrarSesionAutomatica();
            return; 
        }
        const recetasFav = await responseFav.json();
        renderizarRecetas(recetasFav); 
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
        
        if (response.status === 403) {
            cerrarSesionAutomatica();
            return; 
        }

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
                const response = await fetch(`${API_URL}/editarperfil`, {
                    method: "PUT",
                    body: formData,
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                
                if (response.status === 403) {
                    cerrarSesionAutomatica();
                    return; 
                }

                const data = await res.json();

                if (data.success) {
                    mostrarMensaje("Perfil actualizado correctamente",'#4CAF50');
                    
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
                    mostrarMensaje("Error al actualizar perfil: " + (data.message || ""),' #E01616');
                }
            } catch (err) {
                console.error(err);
                mostrarMensaje("Error en la conexión con el servidor",' #E01616');
            }
        });

    } catch (error) {
        console.error("Error en la carga del perfil", error);
    }
}

// Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    crearModal();
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
        // Si no hay usuario, redirigir inmediatamente
        window.location.href = 'index.php';
        return;
    }

    CambiarHeader(usuario.foto);
    cargarPerfil(usuario);

    // Botón cerrar sesión
    const btnCerrarSesion = document.querySelector(".btn_sesion");
    if(btnCerrarSesion) {
        console.log("Botón encontrado"); // Debug
        btnCerrarSesion.addEventListener("click", cerrarSesion);
    } else {
        console.error("No se encontró el botón de cerrar sesión"); // Debug
    }
    // Pestañas
    const tabs = document.querySelectorAll(".tabs .tab");
    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("activa"));
            tab.classList.add("activa");

            if (index === 0)  cargarPerfil(usuario); // Mis Recetas
            else if (index === 1) Favoritos();       // Mis Favoritos
            else if (index === 2) ConfigPerfil(); //Configuraciones
        });
    });
});