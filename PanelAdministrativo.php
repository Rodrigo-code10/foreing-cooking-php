<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/estilo.css">
    <link rel="stylesheet" href="css/estiloPanelAdministrativo.css">
    <title>Panel </title>
</head>
<body>
    <?php include 'includes/header.php'; ?>

    <main class="acerca-nosotros-container">
        <section class="hero-nosotros">
            <h1>Panel Administrativo</h1>
            <p>Gestiona solicitudes, reportes, usuarios y contenido de la plataforma </p>
        </section>

        <section class="contenedor-cartas">


        </section>

        <div class="tabs">
            <button class="tab activa">Solicitudes de Recetas</button>
            <button class="tab">Usuarios</button>
        </div>

        <section class="contacto">
            <div id="contenedor-buscador"></div>
            <div class="tabla-container">
                <table class="tabla">
                    <thead id="tabla-encabezado">
                        
                    </thead>
                    <tbody id="tabla-body">
                    </tbody>
                </table>
            </div>
        </section>
    </main>

    <?php include 'includes/footer.php'; ?>

    <script type="module" src="js/logicaHeader.js"></script>
    <script type="module" src="js/logicaPanelAdmin.js"></script>

</body>
</html>