import API_URL from './config.js';
import { mostrarMensaje } from './mensajes.js';

const token = localStorage.getItem("token");

document.addEventListener('DOMContentLoaded', () => {
    crearModal();
    cargarCartas('recetas');          
    SolicitudesRecetas();   
    inicializarTabs();     
});

async function cargarCartas(modo = "recetas") {
    const ContenedorReceta = document.querySelector('.contenedor-cartas');
    try {
        let response;
        let data;
        let cartas = [];

        if (modo === "recetas") {
            response = await fetch(`${API_URL}/CuentaRecetas`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            data = await response.json();

            cartas = [
                { titulo: "Recetas Totales", valor: data.total},
                { titulo: "Solicitudes de Recetas", valor: data.pendiente},
                { titulo: "Recetas Aprobadas", valor: data.aprobada},
                { titulo: "Recetas Rechazadas", valor: data.rechazada},
            ];
        }

        if (modo === "usuarios") {
            response = await fetch(`${API_URL}/CuentaUsuarios`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            data = await response.json();

            cartas = [
                { titulo: "Usuarios Totales", valor: data.total},
                { titulo: "Activos", valor: data.active},
                { titulo: "Bloqueados", valor: data.desactive},
            ];
        }

        // Render
        ContenedorReceta.innerHTML = "";

        cartas.forEach(c => {
            const div = document.createElement("div");
            div.classList.add("carta");
            div.innerHTML = `
                <h3>${c.valor}</h3>
                <p>${c.titulo}</p>
            `;
            ContenedorReceta.appendChild(div);
        });

    } catch (error) {
        console.error("Error obteniendo datos:", error);
    }
}


async function SolicitudesRecetas() {
    const tablaBody = document.getElementById('tabla-body');
    const tablaHead = document.getElementById('tabla-encabezado');

    tablaBody.innerHTML = `
        <tr><td colspan="4">Cargando...</td></tr>
    `;

    try {
        const response = await fetch(`${API_URL}/pendiente`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        tablaBody.innerHTML = "";
        tablaHead.innerHTML = "";
        const trh = document.createElement("tr");
        trh.innerHTML = `
                <th>Usuario</th>
                <th>Correo</th>
                <th>Receta</th>
                <th>Fecha</th>
                <th>Acciones</th>
            `;
        tablaHead.appendChild(trh);

        data.forEach(receta => {
            const tr = document.createElement("tr");

            // Formatear fecha
            const fecha = receta.fechaCreacion
                ? new Date(receta.fechaCreacion).toLocaleString("es-MX", {
                    dateStyle: "medium",
                    timeStyle: "short"
                })
                : "Sin fecha";

            tr.innerHTML = `
                <td>${receta.autor?.nombre || "Sin nombre"}</td>
                <td>${receta.autor?.email || "Sin correo"}</td>
                <td>${receta.nombre || "N/A"}</td>
                <td>${fecha}</td>
                <td>
                    <button class="btn-ver">Ver y Editar</button>
                    <button class="btn-aprobar">Aprobar</button>
                    <button class="btn-rechazar">Rechazar</button>
                </td>
            `;

            tablaBody.appendChild(tr);

            tr.querySelector(".btn-ver").addEventListener("click", () => Ver(receta._id));
            tr.querySelector(".btn-aprobar").addEventListener("click", () => Aprobar(receta._id));
            tr.querySelector(".btn-rechazar").addEventListener("click", () => Rechazar(receta._id));
        });

    } catch (error) {
        console.error("Error obteniendo Pendientes:", error);
        tablaBody.innerHTML = `
            <tr><td colspan="4">Error al cargar</td></tr>
        `;
    }
}

function inicializarTabs() {
    const tabs = document.querySelectorAll(".tabs .tab");
    const contBuscador = document.getElementById("contenedor-buscador");

    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("activa"));
            tab.classList.add("activa");

            if (index === 0) {
                contBuscador.innerHTML = "";
                document.getElementById("tabla-encabezado").innerHTML = "";
                document.getElementById("tabla-body").innerHTML = "";
                cargarCartas('recetas'); 
                SolicitudesRecetas();
            } else if (index === 1) {
                contBuscador.innerHTML = `
                    <input 
                        type="text" 
                        id="buscar-usuario" 
                        class="input-modern" 
                        placeholder="Buscar usuario por nombre..."
                    >
                `;

                document.getElementById("tabla-encabezado").innerHTML = `
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Acciones</th>
                    </tr>
                `;

                document
                    .getElementById("buscar-usuario")
                    .addEventListener("input", buscarUsuario);
                cargarCartas('usuarios');
                buscarUsuario();
            }
        });
    });
}

async function buscarUsuario() {
    const nombre = document.getElementById("buscar-usuario").value.trim();

    const tbody = document.getElementById("tabla-body");
    tbody.innerHTML = ""; 

    if (!nombre) return; 
    try {
        const response = await fetch(`${API_URL}/BuscarUsuario?nombre=${encodeURIComponent(nombre)}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="3" style="text-align:center;">No se encontraron usuarios</td>
                </tr>
            `;
            return;
        }

        data.forEach(user => {
            const accion = user.estado === "active" 
                ? { texto: "Bloquear", clase: "btn-rechazar" }
                : { texto: "Desbloquear", clase: "btn-aprobar" };

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${user.nombre}</td>
                <td>${user.email}</td>
                <td>
                    <button class="${accion.clase}" data-id="${user._id}">
                        ${accion.texto}
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
            tr.querySelector("button").addEventListener("click", () => {
                cambiarEstadoUsuario(user._id, user.estado);
            });
        });

    } catch (error) {
        console.error("Error buscando usuario:", error);
    }
}

async function cambiarEstadoUsuario(id, estadoActual) {
    const nuevoEstado = estadoActual === "active" ? "desactive" : "active";

    await fetch(`${API_URL}/usuario/${id}/Estado`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ estado: nuevoEstado })
    });
    cargarCartas('usuarios');
    buscarUsuario(); 
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

                        <div class="form-field">
                            <label>Autor</label>
                            <input type="text" id="recetaAutor" class="input-modern input-readonly" readonly>
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

                    <div class="form-field">
                        <label>Fecha de Creación</label>
                        <input type="text" id="recetaFecha" class="input-modern input-readonly" readonly>
                        <img id="previewReceta" style="max-width: 200px; margin-top: 10px; display: none; border-radius: 8px;">
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

async function Ver(id) {
    try {
        const response = await fetch(`${API_URL}/recetas/${id}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();

        document.getElementById('recetaId').value = data._id;
        document.getElementById('recetaNombre').value = data.nombre || '';
        document.getElementById('recetaAutor').value = data.autor?.nombre || 'Sin autor';
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

        // Fecha
        document.getElementById('recetaFecha').value = data.fechaCreacion
            ? new Date(data.fechaCreacion).toLocaleString("es-MX")
            : "Sin fecha";

        // Mostrar modal
        const modal = document.getElementById('modalReceta');
        modal.style.display = 'block';
        setTimeout(() => modal.classList.add('show'), 10);
    } catch (error) {
        console.error("Error al ver receta:", error);
        mostrarMensaje("Error al cargar la receta", "#E01616");
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
        categoria: categoriasSeleccionadas
    };

    try {
        const response = await fetch(`${API_URL}/recetas/${id}/editar`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Error al actualizar");

        const modal = document.getElementById('modalReceta');
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);

        mostrarMensaje("Receta actualizada correctamente", "#4CAF50");
        setTimeout(() => {
            location.reload();
        }, 1000);

    } catch (error) {
        mostrarMensaje("Error al guardar cambios", "#E01616");
    }
}

async function Aprobar(id) {
    try {
        const res = await fetch(`${API_URL}/recetas/${id}/aprobar`, {
            method: "PUT",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await res.json();
        mostrarMensaje(`Receta aprobada: ${data.nombre}`, "#4CAF50");
        setTimeout(() => {
            location.reload();
        }, 2000);

    } catch (error) {
        mostrarMensaje("Error al aprobar", "#E01616");
    }
}

async function Rechazar(id) {
    try {
        const res = await fetch(`${API_URL}/recetas/${id}/rechazar`, {
            method: "PUT",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await res.json();
        mostrarMensaje(`Receta rechazada: ${data.nombre}`, "#4CAF50");
        setTimeout(() => {
            location.reload();
        }, 2000);
    } catch (error) {
        mostrarMensaje("Error al rechazar", "#E01616");
    }
}