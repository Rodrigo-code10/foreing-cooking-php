import API_URL from './config.js';
import { mostrarMensaje } from './mensajes.js';

// Función para generar estrellas visuales
function generarEstrellas(calificacion) {
    const estrellasLlenas = Math.round(calificacion);
    return '★'.repeat(estrellasLlenas) + '☆'.repeat(5 - estrellasLlenas);
}

export async function mostrarRecetas(contenedorSelector,filtros = {}) {
    try {
        const queryString = new URLSearchParams(filtros).toString();
        const url = `${API_URL}/muestrarecetas${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url);
        const recetas = await response.json();

        const contenedor = document.querySelector(contenedorSelector);
        contenedor.innerHTML = ''; // Limpiar contenedor antes de cargar

        recetas.forEach(receta => {
            const card = document.createElement('div');
            card.classList.add('card');

            const hoy = new Date();
            const fechaCreacion = new Date(receta.fechaCreacion);

            const esNueva =
                fechaCreacion.getDate() === hoy.getDate() &&
                fechaCreacion.getMonth() === hoy.getMonth() &&
                fechaCreacion.getFullYear() === hoy.getFullYear();

            card.innerHTML = `
                <div class="card-image">
                    <img src="${API_URL}${receta.imagen}" alt="${receta.nombre}">
                    ${esNueva ? '<span class="card-badge">Nuevo</span>' : ''}
                </div>

                <div class="card-content">
                    <div class="card-rating">
                        <span class="estrellas">${generarEstrellas(receta.calificacion)}</span>
                        <span class="rating-number">${receta.calificacion} (${receta.numCalificaciones})</span>
                    </div>
                    <h3 class="card-title">${receta.nombre}</h3>
                    <p class="card-author">por @${receta.autor.nombre || "Desconocido"}</p>

                    <div class="card-info">
                        <div class="info-item">
                            <span class="info-icon">⏱️</span>
                            <span>${receta.tiempoPreparacion} min</span>
                        </div>
                        <div class="info-item">
                            <span class="info-icon">👥</span>
                            <span>${receta.porciones} porciones</span>
                        </div>
                        <div class="info-item">
                            <span class="info-icon">🔥</span>
                            <span>${receta.dificultad}</span>
                        </div>
                    </div>
                </div>

                <div class="card-footer">
                    <button class="btn-receta" onclick="window.location.href='VerReceta.php?id=${receta._id}'">Ver Receta</button>
                    <button class="btn-heart">❤️</button>
                    <span class="like-count">${receta.likes}</span>
                </div>
            `;
            contenedor.appendChild(card);

            const btnLike = card.querySelector('.btn-heart');
            const likeCount = card.querySelector('.like-count');
            btnLike.addEventListener('click', async () => {
                const data = await toggleLike(receta._id);
                if (data && likeCount) {
                    likeCount.textContent = data.likes;
                }
            });
        });

    } catch (error) {
        console.error('Error al mostrar recetas:', error);
    }
}

export async function toggleLike(recetaId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            mostrarMensaje('Debes iniciar sesión para dar like','#C7A414');
            return;
        }

        const response = await fetch(`${API_URL}/recetas/${recetaId}/like`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 403) {
            cerrarSesionAutomatica();
            return; 
        }

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
            mostrarMensaje(data.error || 'Error al dar like','#E01616');
            return;
        }

        return data;

    } catch (error) {
        console.error('Error en toggleLike:', error);
        mostrarMensaje('Ocurrió un error al dar like','#E01616');
    }
}