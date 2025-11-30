import { mostrarRecetas } from './logicaRecetas.js';
import API_URL from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    mostrarRecetas('.cards',{limit: 8});
    mostrarRecetas('.mejores-cards',{limit: 8});
    mostrarRecetas('.viejas-cards',{limit: 8});
    mostrarImagenes();
});

async function animacionImagen(cantidad) {
    const response = await fetch(`${API_URL}/imagenrecetas?cantidad=${cantidad}`);
    return await response.json();
}

async function mostrarImagenes() {
    const imagenes = await animacionImagen(5);
    const ul = document.getElementById("imagenes");
    ul.innerHTML = "";

    // Crear elementos de imagen
    imagenes.forEach((img, index) => {
        const li = document.createElement("li");
        if (index === 0) li.classList.add('active'); // Primera imagen visible
        
        const tag = document.createElement("img");
        tag.src = `${API_URL}${img.imagen}`;
        li.appendChild(tag);
        ul.appendChild(li);
    });

    iniciarCarrusel(imagenes.length);
}

function iniciarCarrusel(total) {
    let indiceActual = 0;
    const duracionPorImagen = 4000; // 4 segundos por imagen (ajusta aquí)
    
    setInterval(() => {
        const items = document.querySelectorAll('.slider-box li');
        
        items[indiceActual].classList.remove('active');
        
        indiceActual = (indiceActual + 1) % total;
        
        items[indiceActual].classList.add('active');
    }, duracionPorImagen);
}