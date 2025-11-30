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

           <div class="filtros-container">
                <div class="Etiquetas" id="contenedor-etiquetas">
                    <label>🥗 Tipo de Platillo</label>
                    <div id="Categoria">
                        <label><input type="checkbox" name="categoria" value="Saludable">Saludable</label>
                        <label><input type="checkbox" name="categoria" value="Nutritivo">Nutritivo</label>
                        <label><input type="checkbox" name="categoria" value="Grasoso">Grasoso</label>
                        <label><input type="checkbox" name="categoria" value="Vegetariano">Vegetariano</label>
                        <label><input type="checkbox" name="categoria" value="Dulce">Dulce</label>
                        <label><input type="checkbox" name="categoria" value="Salado">Salado</label>
                        <label><input type="checkbox" name="categoria" value="Picante">Picante</label>
                        <label><input type="checkbox" name="categoria" value="Vegana">Vegana</label>
                        <label><input type="checkbox" name="categoria" value="Entrada">Entrada</label>
                        <label><input type="checkbox" name="categoria" value="Plato Fuerte">Plato Fuerte</label>
                        <label><input type="checkbox" name="categoria" value="Postre">Postre</label>
                    </div>
                </div>

                <div class="Etiquetas ingredientes-seccion" id="contenedor-ingredientes">
                    <label>🥬 Ingredientes</label>
                    <div id="Ingredientes">
                        <label><input type="checkbox" name="ingredientes" value="Pollo">Pollo</label>
                        <label><input type="checkbox" name="ingredientes" value="Carne">Carne</label>
                        <label><input type="checkbox" name="ingredientes" value="Pescado">Pescado</label>
                        <label><input type="checkbox" name="ingredientes" value="Verduras">Verduras</label>
                        <label><input type="checkbox" name="ingredientes" value="Pasta">Pasta</label>
                        <label><input type="checkbox" name="ingredientes" value="Arroz">Arroz</label>
                        <label><input type="checkbox" name="ingredientes" value="Huevos">Huevos</label>
                        <label><input type="checkbox" name="ingredientes" value="Queso">Queso</label>
                        <label><input type="checkbox" name="ingredientes" value="Zanahoria">Zanahoria</label>
                        <label><input type="checkbox" name="ingredientes" value="Tomate">Tomate</label>
                        <label><input type="checkbox" name="ingredientes" value="Cebolla">Cebolla</label>
                        <label><input type="checkbox" name="ingredientes" value="Especies">Especies</label>
                        <label><input type="checkbox" name="ingredientes" value="Chile">Chile</label>
                    </div>
                </div>
            </div>
            
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

    <script type="module" src="js/logicaCatalogoRecetas.js"></script>
    <script type="module" src="js/logicaHeader.js"></script>
</body>
</html>