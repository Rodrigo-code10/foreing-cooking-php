<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ver Receta - Foreing Cooking</title>
    <link rel="stylesheet" href="css/estilo.css">
    <link rel="stylesheet" href="css/estiloVerReceta.css">
</head>

<body>
    
    <?php include 'includes/header.php'; ?>

    <section class="ver-receta-container">
        <h1 class="ver-receta-titulo">Ve la <span class="highlight">Receta</span></h1>

        <div class="receta-detalle">
            <!-- Columna izquierda: Galería de imágenes -->
            <div class="receta-galeria">
                <div class="imagen-principal">
                    <img id="imagenPrincipal" src="" alt="Imagen de la receta">
                </div>
                <div class="imagenes-miniaturas">
                    <!-- Las miniaturas se cargarán dinámicamente -->
                </div>
            </div>

            <!-- Columna derecha: Información de la receta -->
            <div class="receta-info">
                <div class="receta-header">
                    <h2 id="nombreReceta">Cargando...</h2>
                    <div class="receta-calificacion">
                        <span class="estrellas">★★★★★</span>
                        <span id="calificacionTexto" class="calificacion-numero">0 / 5.0</span>
                    </div>
                </div>

                <div class="receta-autor">
                <img id="autorAvatar" src="http://localhost:3000/default/SinFoto.png" alt="Avatar del autor">
                    <span id="autorNombre">Cargando...</span>
                </div>

                <div class="receta-estadisticas">
                    <div class="stat-item stat-like">
                        <button id="btnLike" class="btn-like-grande">❤️</button>
                        <span id="likesCount">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icono">⏱️</span>
                        <span id="tiempoPrep">0 min</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icono">👥</span>
                        <span id="porciones">0 porciones</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icono">🔥</span>
                        <span id="dificultad">Media</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sección de Descripción e Ingredientes -->
        <div class="receta-contenido">
            <div class="descripcion-seccion">
                <h3>Descripción</h3>
                <div id="descripcionTexto">
                    <p>Cargando descripción...</p>
                </div>
            </div>

            <div class="ingredientes-seccion">
                <h3>Ingredientes</h3>
                <ul id="listaIngredientes">
                    <li>Cargando ingredientes...</li>
                </ul>
            </div>
        </div>

        <!-- Sección de Preparación -->
        <div class="preparacion-seccion">
            <h3>Preparación</h3>
            <ol id="pasospreparacion">
                <li>Cargando pasos...</li>
            </ol>
        </div>
    </section>

    <?php include 'includes/footer.php'; ?>

    <script type="module" src="js/verReceta.js"></script>
    <script type="module" src="js/logicaHeader.js"></script>
</body>

</html>