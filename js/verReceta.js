import API_URL from './config.js';

let recetaIdActual = null;
let miCalificacionActual = 0;

// Obtener el ID de la receta desde la URL
const urlParams = new URLSearchParams(window.location.search);
const recetaId = urlParams.get('id');

if (recetaId) {
    recetaIdActual = recetaId;
    cargarReceta(recetaId);
} else {
    alert('No se especificó una receta');
    window.location.href = 'index.php';
}

async function cargarReceta(id) {
    try {
        const response = await fetch(`${API_URL}/recetas/${id}`);
        
        if (!response.ok) {
            throw new Error('Receta no encontrada');
        }

        const receta = await response.json();
        mostrarReceta(receta);
    } catch (error) {
        console.error('Error al cargar la receta:', error);
        alert('Error al cargar la receta: ' + error.message);
        window.location.href = 'CatalogoRecetas.php';
    }
}

async function cargarMiCalificacion(id) {
    try {
        const token = localStorage.getItem('token');
        if (!token) return; // Si no está logueado, no cargar calificación

        const response = await fetch(`${API_URL}/recetas/${id}/mi-calificacion`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            miCalificacionActual = data.puntuacion || 0;
            actualizarEstrellasClickeables(miCalificacionActual);
        }
    } catch (error) {
        console.error('Error al cargar mi calificación:', error);
    }
}

function mostrarReceta(receta) {
    // Actualizar título
    document.getElementById('nombreReceta').textContent = receta.nombre;

    // Actualizar calificación
    const calificacion = receta.calificacion || 0;
    const numCalificaciones = receta.numCalificaciones || 0;
    document.getElementById('calificacionTexto').textContent = `${calificacion} / 5.0`;

    const estrellas = document.querySelector('.estrellas');
    actualizarEstrellasVisuales(estrellas, calificacion);

    // Crear estrellas clickeables
    crearEstrellasClickeables();
    // Actualizar imagen principal
    const imagenPrincipal = document.getElementById('imagenPrincipal');
    imagenPrincipal.src = `${API_URL}${receta.imagen}`;
    imagenPrincipal.alt = receta.nombre;

    // Crear miniaturas
    const miniaturas = document.querySelector('.imagenes-miniaturas');
    miniaturas.innerHTML = '';
    
    const miniatura = document.createElement('img');
    miniatura.src = `${API_URL}${receta.imagen}`;
    miniatura.alt = receta.nombre;
    miniatura.classList.add('miniatura', 'active');
    miniatura.onclick = () => cambiarImagenPrincipal(`${API_URL}${receta.imagen}`, miniatura);
    miniaturas.appendChild(miniatura);

    // Actualizar avatar y nombre del autor
    const autorAvatar = document.getElementById('autorAvatar');
    const autorNombre = document.getElementById('autorNombre');
    
    if (receta.autor) {
        // Si el autor tiene foto propia y NO es el placeholder
        if (receta.autor.foto && receta.autor.foto !== '/default/SinFoto.png') {
            autorAvatar.src = `${API_URL}${receta.autor.foto}`;
        }
        
        autorAvatar.alt = receta.autor.nombre || 'Usuario';
        autorNombre.textContent = `por @${receta.autor.nombre || 'Desconocido'}`;
    } else {
        // Si no hay autor, mantener el placeholder del PHP
        autorAvatar.src = `${API_URL}/default/SinFoto.png`;
        autorNombre.textContent = 'por @Desconocido';
    }

    // Actualizar estadísticas
    document.getElementById('likesCount').textContent = receta.likes || 0;
    document.getElementById('tiempoPrep').textContent = `${receta.tiempoPreparacion} min`;
    document.getElementById('porciones').textContent = `${receta.porciones} porciones`;
    document.getElementById('dificultad').textContent = receta.dificultad || 'Media';

    // Actualizar descripción
    const descripcionDiv = document.getElementById('descripcionTexto');
    if (receta.descripcion) {
        const parrafos = receta.descripcion.split('\n').filter(p => p.trim() !== '');
        descripcionDiv.innerHTML = parrafos.map(p => `<p>${p}</p>`).join('');
    } else {
        descripcionDiv.innerHTML = '<p>No hay descripción disponible.</p>';
    }

    // Actualizar ingredientes
    const listaIngredientes = document.getElementById('listaIngredientes');
    listaIngredientes.innerHTML = '';
    
    if (receta.ingredientes && receta.ingredientes.length > 0) {
        receta.ingredientes.forEach(ingrediente => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="ingrediente-icono"></span>
                <span>${ingrediente}</span>
            `;
            listaIngredientes.appendChild(li);
        });
    } else {
        listaIngredientes.innerHTML = '<li>No hay ingredientes disponibles.</li>';
    }

    // Actualizar pasos de preparación
    const pasosList = document.getElementById('pasospreparacion');
    pasosList.innerHTML = '';
    
    if (receta.pasos && receta.pasos.length > 0) {
        receta.pasos.forEach(paso => {
            const li = document.createElement('li');
            li.textContent = paso;
            pasosList.appendChild(li);
        });
    } else {
        pasosList.innerHTML = '<li>No hay pasos disponibles.</li>';
    }

    // Configurar botón de like
    const btnLike = document.getElementById('btnLike');
    btnLike.onclick = darLike;
}

function actualizarEstrellasVisuales(contenedor, calificacion) {
    const estrellasLlenas = Math.round(calificacion);
    contenedor.textContent = '★'.repeat(estrellasLlenas) + '☆'.repeat(5 - estrellasLlenas);
}

function crearEstrellasClickeables() {
    const contenedor = document.querySelector('.receta-calificacion');
    
    // Buscar si ya existe el contenedor de calificación del usuario
    let calificacionUsuario = contenedor.querySelector('.calificacion-usuario');
    
    if (!calificacionUsuario) {
        calificacionUsuario = document.createElement('div');
        calificacionUsuario.className = 'calificacion-usuario';
        calificacionUsuario.innerHTML = `
            <div class="estrellas-clickeables">
                ${[1, 2, 3, 4, 5].map(num => 
                    `<span class="estrella-clickeable" data-valor="${num}">☆</span>`
                ).join('')}
            </div>
            <p style="font-size: 0.85rem; margin: 5px 0 0 0; color: #666;">Tu calificación</p>
        `;
        contenedor.appendChild(calificacionUsuario);
    }

    // Agregar eventos a las estrellas
    const estrellasClickeables = calificacionUsuario.querySelectorAll('.estrella-clickeable');
    
    estrellasClickeables.forEach(estrella => {
        // Hover
        estrella.addEventListener('mouseenter', (e) => {
            const valor = parseInt(e.target.dataset.valor);
            actualizarEstrellasClickeables(valor);
        });

        // Click
        estrella.addEventListener('click', async (e) => {
            const valor = parseInt(e.target.dataset.valor);
            await enviarCalificacion(valor);
        });
    });

    // Restaurar calificación al salir del hover
    calificacionUsuario.addEventListener('mouseleave', () => {
        actualizarEstrellasClickeables(miCalificacionActual);
    });
}

function actualizarEstrellasClickeables(valor) {
    const estrellas = document.querySelectorAll('.estrella-clickeable');
    estrellas.forEach((estrella, index) => {
        if (index < valor) {
            estrella.textContent = '★';
            estrella.style.color = '#FFC107';
        } else {
            estrella.textContent = '☆';
            estrella.style.color = '##FFC107';
        }
    });
}

async function enviarCalificacion(puntuacion) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Debes iniciar sesión para calificar');
            window.location.href = 'IniciarRegistrarse.php?mode=login';
            return;
        }

        const response = await fetch(`${API_URL}/recetas/${recetaIdActual}/calificar`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ puntuacion })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || 'Error al calificar');
            return;
        }

        // Actualizar calificación actual del usuario
        miCalificacionActual = puntuacion;
        actualizarEstrellasClickeables(puntuacion);

        // Actualizar calificación general mostrada
        document.getElementById('calificacionTexto').textContent = 
            `${data.calificacion} / 5.0 (${data.numCalificaciones} ${data.numCalificaciones === 1 ? 'voto' : 'votos'})`;
        
        const estrellas = document.querySelector('.estrellas');
        actualizarEstrellasVisuales(estrellas, data.calificacion);

        // Mensaje de éxito
        mostrarMensajeExito('¡Calificación guardada!');

    } catch (error) {
        console.error('Error al calificar:', error);
        alert('Error al enviar calificación');
    }
}

function mostrarMensajeExito(mensaje) {
    const div = document.createElement('div');
    div.textContent = mensaje;
    div.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: fadeIn 0.3s, fadeOut 0.3s 2.5s;
    `;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

function cambiarImagenPrincipal(src, miniaturaElement) {
    document.getElementById('imagenPrincipal').src = src;
    
    // Remover clase active de todas las miniaturas
    document.querySelectorAll('.miniatura').forEach(img => {
        img.classList.remove('active');
    });
    
    // Agregar clase active a la miniatura clickeada
    if (miniaturaElement) {
        miniaturaElement.classList.add('active');
    }
}

async function darLike() {
    if (!recetaIdActual) return;

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Debes iniciar sesión para dar like');
            window.location.href = 'IniciarRegistrarse.php?mode=login';
            return;
        }

        const response = await fetch(`${API_URL}/recetas/${recetaIdActual}/like`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            console.error('Respuesta no JSON:', text);
            throw new Error('Respuesta del servidor no es JSON');
        }

        if (!response.ok) {
            console.error('Error del servidor:', data);
            alert(data.error || 'Error al dar like');
            return;
        }

        // Actualizar el contador de likes
        document.getElementById('likesCount').textContent = data.likes;

    } catch (error) {
        console.error('Error al dar like:', error);
        alert('Ocurrió un error al dar like');
    }
}