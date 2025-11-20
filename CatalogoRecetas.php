<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Catálogo de Recetas</title>
    <link rel="stylesheet" href="css/estilo.css">
    <link rel="stylesheet" href="css/estiloCatalogoRecetas.css">
</head>

<body>
    
    <?php include 'includes/header.php'; ?> 

    <section class="Mostrar">
        <form id="formRecetas" class="formRecetas">

            <h2>Explora Nuestro Catálogo</h2>

            <!-- Buscador -->
            <div class="Buscador">
                <input type="text" id="buscar_recetas" name="buscar" placeholder="Buscar recetas" class="Buscador_recetas">
            </div>

            <label>Seleccione una Categoria</label>

            <!-- Botones de categorías -->
            <div class="botones">
                <button type="button" class="botonCategoria" data-categoria="Entrada">Entrada</button>
                <button type="button" class="botonCategoria" data-categoria="Plato Fuerte">Plato Fuerte</button>
                <button type="button" class="botonCategoria" data-categoria="Postre">Postre</button>
            </div>

            <!-- Lista desplegable para seleccionar tipo de filtro -->
            <div class="Etiquetas selector-filtro">
                <label>Seleccione el tipo de filtro</label>
                <select id="tipoFiltro" class="select-filtro">
                    <option value="">Seleccione una opción</option>
                    <option value="etiquetas">Etiquetas</option>
                    <option value="ingredientes">Ingredientes</option>
                </select>
            </div>

            <!-- Etiquetas -->
            <div class="Etiquetas filtro-contenedor" id="contenedor-etiquetas" style="display: none;">
                <label>Etiquetas</label>
                <div id="Categoria">
                    <label><input type="checkbox" name="categoria[]" value="Saludable"> Saludable</label>
                    <label><input type="checkbox" name="categoria[]" value="Nutritivo"> Nutritivo</label>
                    <label><input type="checkbox" name="categoria[]" value="Grasoso"> Grasoso</label>
                    <label><input type="checkbox" name="categoria[]" value="Vegetariano"> Vegetariano</label>
                    <label><input type="checkbox" name="categoria[]" value="Dulce"> Dulce</label>
                    <label><input type="checkbox" name="categoria[]" value="Salado"> Salado</label>
                    <label><input type="checkbox" name="categoria[]" value="Picante"> Picante</label>
                    <label><input type="checkbox" name="categoria[]" value="Vegana"> Vegana</label>
                </div>
            </div>

            <!-- Ingredientes -->
            <div class="Etiquetas ingredientes-seccion filtro-contenedor" id="contenedor-ingredientes" style="display: none;">
                <label>Ingredientes</label>
                <div id="Ingredientes">
                    <label><input type="checkbox" name="ingredientes[]" value="Pollo"> Pollo</label>
                    <label><input type="checkbox" name="ingredientes[]" value="Carne"> Carne</label>
                    <label><input type="checkbox" name="ingredientes[]" value="Pescado"> Pescado</label>
                    <label><input type="checkbox" name="ingredientes[]" value="Verduras"> Verduras</label>
                    <label><input type="checkbox" name="ingredientes[]" value="Pasta"> Pasta</label>
                    <label><input type="checkbox" name="ingredientes[]" value="Arroz"> Arroz</label>
                    <label><input type="checkbox" name="ingredientes[]" value="Huevo"> Huevo</label>
                    <label><input type="checkbox" name="ingredientes[]" value="Queso"> Queso</label>
                    <label><input type="checkbox" name="ingredientes[]" value="Zanahoria"> Zanahoria</label>
                    <label><input type="checkbox" name="ingredientes[]" value="Tomate"> Tomate</label>
                    <label><input type="checkbox" name="ingredientes[]" value="Cebolla"> Cebolla</label>
                    <label><input type="checkbox" name="ingredientes[]" value="Especies"> Especies</label>
                    <label><input type="checkbox" name="ingredientes[]" value="Chile"> Chile</label>
                </div>
            </div>
            
            <!-- Botones de acción -->
            <div class="botonesBuscador">
                <button type="reset" class="Limpiar" onclick="location.reload()">Limpiar</button>
            </div>
        </form>
    </section>

    <div class="otro">
        <div class="cards">
            
        </div>
    </div>

    <?php include 'includes/footer.php'; ?>

    <script>
        const botones = document.querySelectorAll('.botonCategoria');
        const contenedor = document.getElementById('contenedorCategoria');

        const imagenes = {
            "Entrada": "src/Entrada.png",
            "Plato Fuerte": "src/Comida.png",
            "Postre": "src/Postre.png"
        };

        botones.forEach(boton => {
            boton.addEventListener('click', () => {
                const categoria = boton.dataset.categoria;
                contenedor.innerHTML = `
                    <img src="${imagenes[categoria]}" alt="${categoria}">
                    <p>${categoria}</p>
                `;
            });
        });
    </script>
    <script type="module" src="js/logicaCatalogoRecetas.js"></script>
    <script type="module" src="js/logicaHeader.js"></script>
</body>
</html>