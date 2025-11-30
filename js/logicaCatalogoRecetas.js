import { mostrarRecetas } from './logicaRecetas.js';
import API_URL from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const buscador = document.getElementById('buscar_recetas');

    function procesarCheckboxes() {

        const checksCat = [...document.querySelectorAll('input[name="categoria"]:checked')]
            .map(c => c.value);

        const checksIng = [...document.querySelectorAll('input[name="ingredientes"]:checked')]
            .map(c => c.value);

        const filtros = {orden: 'top', limit: 10 };

        if (checksCat.length > 0) filtros.categoria = checksCat;
        if (checksIng.length > 0) filtros.ingredientes = checksIng;

        if (checksCat.length === 0 && checksIng.length === 0) {
            document.querySelector('.cards').innerHTML = "";
            return;
        }
        mostrarRecetas('.cards',filtros);
        setTimeout(enfocarRecetas, 200);
    }

    document.addEventListener('change', e => {
        if (e.target.matches('input[name="categoria"]') ||
            e.target.matches('input[name="ingredientes"]')) {

            procesarCheckboxes();
        }
    });

    buscador.addEventListener('input', (e) => {
        const texto = e.target.value.trim();

        if (texto === "") {
            document.querySelector('.cards').innerHTML = "";
            return;
        }

        buscarRecetaTodas(texto);
    });
});

async function buscarRecetaTodas(texto) {
    let resultados = await fetch(`${API_URL}/muestrarecetas?nombre=${texto}&orden=top&limit=10`)
        .then(r => r.json())
        .catch(() => []);
    if (resultados.length > 0) {
        mostrarRecetas('.cards',{ nombre: texto });
        // Esperar un poco para que se rendericen las tarjetas
        setTimeout(enfocarRecetas, 100);
        return;
    }

    resultados = await fetch(`${API_URL}/muestrarecetas?ingredientes=${texto}&orden=top&limit=10`)
        .then(r => r.json())
        .catch(() => []);
    if (resultados.length > 0) {
        mostrarRecetas('.cards',{ ingredientes: texto });
        setTimeout(enfocarRecetas, 100);
        return;
    }

    resultados = await fetch(`${API_URL}/muestrarecetas?categoria=${texto}&orden=top&limit=10`)
        .then(r => r.json())
        .catch(() => []);

    mostrarRecetas('.cards',{ categoria: texto });
    setTimeout(enfocarRecetas, 100);
}

function enfocarRecetas() {
    const cards = document.querySelector('.cards');
    if (!cards) return;

    cards.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}