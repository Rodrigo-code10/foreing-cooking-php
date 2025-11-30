<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/css/estilo.css">
    <link rel="stylesheet" href="/css/estiloCreaReceta.css">
    <title>Agregar Receta</title>
</head>

<body class="crear-receta-page">
    <?php include 'includes/header.php'; ?> 

    <section class="section-titleCR">
        <div class="contenido">
            <h1>Agregar Nueva <span class="highlight">Receta</span></h1>
        </div>
    </section>

    <section class="Formulario_contenedor">
        <div class="Formulario_Receta">
            <h2>Nueva Receta</h2>
            <h3>Comparte tu creación culinaria con la comunidad</h3>

            <form id="formCrearReceta" enctype="multipart/form-data">

                <label for="nombre_receta">Nombre de la Receta *</label>
                <input type="text" name="nombre_receta" id="nombre_receta" placeholder="Ej: Quesadillas con quesillo"
                    required>

                <label for="descripcion">Descripción *</label>
                <textarea name="descripcion" id="descripcion" placeholder="Cuéntanos sobre tu receta..." rows="4"
                    required></textarea>

                <label for="tiempo_preparacion">Tiempo de Preparación (minutos) *</label>
                <input type="number" name="tiempo_preparacion" id="tiempo_preparacion" placeholder="30" min="1"
                    required>

                <label for="porciones">Número de Porciones *</label>
                <input type="number" name="porciones" id="porciones" placeholder="4" min="1" required>

                <label for="dificultad">Dificultad *</label>
                <select name="dificultad" id="dificultad" required>
                    <option value="">Seleccionar...</option>
                    <option value="Fácil">Fácil</option>
                    <option value="Media">Media</option>
                    <option value="Difícil">Difícil</option>
                </select>

                <label>Tipo de platillo *</label>
                <div id="Categoria">
                    <label>
                        <input type="checkbox" name="categoria[]" value="Saludable">
                        Saludable
                    </label>
                    <label>
                        <input type="checkbox" name="categoria[]" value="Nutritivo">
                        Nutritivo
                    </label>
                    <label>
                        <input type="checkbox" name="categoria[]" value="Grasoso">
                        Grasoso
                    </label>
                    <label>
                        <input type="checkbox" name="categoria[]" value="Vegetariano">
                        Vegetariano
                    </label>
                    <label>
                        <input type="checkbox" name="categoria[]" value="Dulce">
                        Dulce
                    </label>
                    <label>
                        <input type="checkbox" name="categoria[]" value="Salado">
                        Salado
                    </label>
                    <label>
                        <input type="checkbox" name="categoria[]" value="Picante">
                        Picante
                    </label>
                    <label>
                        <input type="checkbox" name="categoria[]" value="Vegana">
                        Vegana
                    </label>
                    <label>
                        <input type="checkbox" class="Tipo_platillo" name="categoria[]" value="Entrada">
                        Entrada
                    </label>
                    <label>
                        <input type="checkbox" class="Tipo_platillo" name="categoria[]" value="Postre">
                        Postre
                    </label>
                    <label>
                        <input type="checkbox" class="Tipo_platillo" name="categoria[]" value="Plato Fuerte">
                        Plato Fuerte
                    </label>

                    <label>
                        <input type="checkbox" id="categoriaOtro" name="categoria[]" value="">
                        Otro:
                        <input type="text" id="inputOtro" placeholder="Escribe tu categoría" style="margin-left:5px;" disabled>
                    </label>
                </div>

                <label for="ingredientes">Ingredientes *</label>
                <textarea name="ingredientes" id="ingredientes" placeholder="Cada ingrediente en una línea" rows="6"
                    required></textarea>

                <label for="pasos">Pasos de preparación *</label>
                <textarea name="pasos" id="pasos" placeholder="Cada paso en una línea" rows="8" required></textarea>

                <div class="formulario-campo">
                    <label for="imagen_receta" class="formulario-label">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        Sube la imagen de tu Receta *
                    </label>
                    <div class="formulario-file-wrapper">
                        <input type="file" name="imagen_receta" id="imagen_receta" accept="image/jpeg, image/png" required>
                    </div>
                    <p class="formulario-ayuda">Formatos aceptados: JPG, PNG (máx. 5MB)</p>
                </div>

                <div class="botones">
                    <button type="submit" class="enviar">Enviar Receta</button>
                    <button type="button" class="cancelar" onclick="window.location.href='index.php'">Cancelar</button>
                </div>
            </form>
        </div>
    </section>

    <?php include 'includes/footer.php'; ?>

    <script type="module" src="js/logicaCreaReceta.js"></script>
    <script type="module" src="js/logicaHeader.js"></script>  
</body>
</html>