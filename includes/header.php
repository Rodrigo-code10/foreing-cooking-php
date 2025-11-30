<header>
    <nav>
        <a href="index.php"><img id="logo" src="src/Logo.png" width="100" height="100" alt="Logo"></a>
        
        <div class="menu-toggle" id="menu-toggle">
            <span></span>
            <span></span>
            <span></span>
        </div>
        
        <a href="CatalogoRecetas.php">Catálogo de recetas</a>
        <a href="AcercaNosotros.php">Acerca de nosotros</a>
        <a id="CreaReceta" href="IniciarRegistrarse.php?mode=register">Publicar Receta</a>
        <a id="PanelAdmin" href="PanelAdministrativo.php" style="display:none">Panel Administrativo</a>
        <a id="btn-login" href="IniciarRegistrarse.php"><button class="btn-secondary">Iniciar Sesión</button></a>
        <a id="btn-register" href="IniciarRegistrarse.php?mode=register"><button class="btn-primary">Registrarse</button></a>
        <div id="perfil-container" style="display:none;">
            <a href="Perfil.php"><img id="perfil-foto" src="" width="50" height="50" style="border-radius:50%;" alt="Perfil"></a>
        </div>
    </nav>
</header>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.querySelector('nav');
    
    if(menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
        });
        
        // Cerrar menú al hacer click en un enlace
        const links = nav.querySelectorAll('a:not(:first-child)');
        links.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }
});
</script>