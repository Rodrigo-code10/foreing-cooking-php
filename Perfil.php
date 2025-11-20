<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Perfil de Usuario - Foreign Cooking</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="css/estilo.css">
    <link rel="stylesheet" href="css/estiloPerfil.css">
</head>

<body class="perfil-page">

    <?php include 'includes/header.php'; ?> 

    <section class="perfil">

        <div class="perfil-header">
            <img id="foto-perfil" class="perfil-foto" alt="Carlos Mendez" width="100">
            <h2 id="nombre">Carlos Mendez</h2>
            <p id="descripcion">...</p>
            <div class="perfil-estadisticas">
                <div><strong id="recetas-creadas"></strong><br>Recetas Creadas</div>
                <div><strong id="Seguidores"></strong><br>Seguidores</div>
                <div><strong id="Favoritas"></strong><br>Favoritas</div>
            </div>
        </div>

        <!-- Pestañas -->
        <div class="tabs">
            <button class="tab activa">Mis Recetas</button>
            <button class="tab">Mis Favoritos</button>
            <button class="tab">Configuración</button>
        </div>

    </section>

    <section class="recetas">
        <div id="muestra-recetas" class="cards">

        </div>
    </section>

    <button class="btn_sesion">Cerrar sesión</button>

    <?php include 'includes/footer.php'; ?>

    <script type="module" src="js/logicaPerfil.js"></script>
</body>
</html>