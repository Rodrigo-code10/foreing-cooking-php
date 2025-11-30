<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/estilo.css">
    <link rel="stylesheet" href="css/estiloindex.css">
    <title>Recetario</title>
</head>

<body>

    <?php include 'includes/header.php'; ?>

    <section class="section-title">
        <div class="contenido">
            <h1>Descubre, Crea y <br><span class="highlight">Comparte</span> Tus Recetas Favoritas</h1>
            <p>Únete a una comunidad de apasionados por la cocina. Guarda tus recetas, aprende de otros e inspira a la
                comunidad con tus creaciones culinarias.</p>
            <div class="buttons">
                <button class="btn-primary" onclick="window.location.href='CatalogoRecetas.php'">Explorar Recetas</button>
                <button class="btn-secondary" onclick="revisar()">Publicar Receta</button>
            </div>
        </div>

        <div class="slider-box">
            <ul id="imagenes">

            </ul>
        </div>
    </section>

    <section class="ultimas-recetas">
        <div class="contenido">
            <h1><span class="highlight">Últimas</span> Recetas</h1>
            <p>Estas son las últimas recetas compartidas por nuestra comunidad</p>
        </div>

        <div class="cards">
            
        </div>
    </section>

    <section class="mejores-recetas">
        <div class="contenido">
            <h1><span class="highlight">Mejores</span> Recetas</h1>
            <p>Estas son las recetas mejor calificadas compartidas por nuestra comunidad</p>
        </div>

        <div class="mejores-cards">
            
        </div>
    </section>

    <section class="viejas-recetas">
        <div class="contenido">
            <h1><span class="highlight">Viejas</span> Recetas</h1>
            <p>Estas son las más antiguas recetas compartidas por nuestra comunidad</p>
        </div>

        <div class="viejas-cards">
            
        </div>
    </section>

    <?php include 'includes/footer.php'; ?>

    <script type="module" src="js/logicaRecetasRecientes.js"></script>
    <script type="module" src="js/logicaHeader.js"></script>
    <script>
        function revisar(){
            const token = localStorage.getItem("token");
            if (token) {
                window.location.href = "CrearRecetas.php"; 
            } else {
                window.location.href = "IniciarRegistrarse.php?mode=register";
            }
        }
    </script>
</body>
</html>