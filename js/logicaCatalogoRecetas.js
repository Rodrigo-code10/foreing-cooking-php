import { mostrarRecetas } from './logicaRecetas.js';

document.addEventListener('DOMContentLoaded', () => {
    const buscador = document.getElementById('buscar_recetas');
    const botonesCategoria = document.querySelectorAll('.botonCategoria');
    const selectFiltro = document.getElementById('tipoFiltro');

    const contenedorEtiquetas = document.getElementById('contenedor-etiquetas');
    const contenedorIngredientes = document.getElementById('contenedor-ingredientes');

    function procesarCheckboxes() {
        let tipo = selectFiltro.value;

        if (tipo === "etiquetas") {
            const checks = document.querySelectorAll('input[name="categoria[]"]:checked');
            const valores = [...checks].map(c => c.value);

            if (valores.length > 0) {
                mostrarRecetas({ categoria: valores.join(',') });
            }

        } else if (tipo === "ingredientes") {
            const checks = document.querySelectorAll('input[name="ingredientes[]"]:checked');
            const valores = [...checks].map(c => c.value);

            if (valores.length > 0) {
                mostrarRecetas({ ingredientes: valores.join(',') });
            }
        }
    }

    document.addEventListener('change', e => {
        if (e.target.matches('input[name="categoria[]"]') ||
            e.target.matches('input[name="ingredientes[]"]')) {
            procesarCheckboxes();
        }
    });

    selectFiltro.addEventListener('change', function() {
        contenedorEtiquetas.style.display = 'none';
        contenedorIngredientes.style.display = 'none';

        if (this.value === 'etiquetas') {
            contenedorEtiquetas.style.display='block';
        } else if (this.value === 'ingredientes') {
            contenedorIngredientes.style.display='block';
        }
    });

    botonesCategoria.forEach(btn => {
        btn.addEventListener('click', () => {
            const categoria = btn.dataset.categoria;
            mostrarRecetas({ categoria });
        });
    });

    buscador.addEventListener('input', (e) => {
        const texto = e.target.value.trim();

        if (texto === "") {
            document.querySelector('.cards').innerHTML = "";
            return;
        }

        mostrarRecetas({ nombre: texto});
    });

});
